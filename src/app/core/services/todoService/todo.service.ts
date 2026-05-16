import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Todo} from '../../interface/todo';
import {HttpClient} from '@angular/common/http';
import {API_URL_TODO, API_URL_TODO_EDIT} from '../../environments/environments-dev';
import {ErrorMessageService} from '../error-message/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: WritableSignal<Todo[]> = signal<Todo[]>([]);
  private httpClient = inject(HttpClient)
  private errorHandler = inject(ErrorMessageService)

  setTodos(todos: Todo[]) {
    this.todos.set(todos);
  }

  getTodos() {
    if (this.todos().length === 0) {
      this.httpClient.get<Todo[]>(API_URL_TODO).subscribe({
        next: res => {
          this.setTodos(res)
          return res
        },
        error: err => this.errorHandler.showHttpError(err, 'Failed to fetch todos')
      })
    }
    return this.todos.asReadonly()
  }

  addTodo(todo: Todo) {
    this.todos.update(currentTodos => [...currentTodos, todo]);
    this.httpClient.post(API_URL_TODO, todo).subscribe({
      next: msg => {
        this.errorHandler.show('Todo added successfully', 'Close')
      },
      error: err => this.errorHandler.showHttpError(err, 'Filed to add Todo')
    })
  }

  clearCompleted() {
    const completedTodos = this.todos().filter(t => t.status === 'completed');
    if (completedTodos.length === 0) return;
    this.todos.update(currentTodos => currentTodos.filter(t => t.status !== 'completed'));

    completedTodos.forEach(todo => {
      this.httpClient.delete(API_URL_TODO + '/' + todo.id).subscribe({
        error: err => {
          this.errorHandler.showHttpError(err, `Failed to remove: ${todo.title}`);
        }
      });
    });
    this.errorHandler.show('Cleared all completed Todos', 'Close');
  }

  removeTodo(todoId: number) {
    this.todos.update(currentTodos => currentTodos.filter(t => t.id !== todoId));
    this.httpClient.delete(API_URL_TODO + '/' + todoId).subscribe({
      next: msg => {
        this.errorHandler.show('Todo removed successfully', 'Close')
      },
      error: err => this.errorHandler.showHttpError(err, 'Filed to remove Todo')
    })
  }

  updateTodo(todoId: number, changes: Partial<Todo>) {
    this.todos.update(currentTodos =>
      currentTodos.map(todo => todo.id === todoId ? {...todo, ...changes} : todo)
    );

    this.httpClient.patch(API_URL_TODO_EDIT + '/' + todoId, changes).subscribe({
      next: () => {
        this.errorHandler.show('Todo updated successfully', 'Close')
      },
      error: err => this.errorHandler.showHttpError(err, 'Failed to update Todo')
    })
  }

  changeStatus(todoId: number, status: string) {
    this.todos.update(currentTodos => currentTodos.map(t => t.id === todoId ? {...t, status} : t));
    this.httpClient.patch(API_URL_TODO + '/' + todoId, {status}).subscribe({
      error: err => this.errorHandler.showHttpError(err, 'Failed to update status')
    })
  }

  checkStatus(todoId: number) {
    return this.todos().find(t => t.id === todoId)?.status
  }
}
