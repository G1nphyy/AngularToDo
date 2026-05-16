import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatDivider} from '@angular/material/divider';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {DatePipe} from '@angular/common';
import {TodoService} from '../../../../core/services/todoService/todo.service';
import {Todo} from '../../../../core/interface/todo';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {EditFormComponent} from './edit-form/edit-form.component';

type TaskFilter = 'all' | 'active' | 'completed' | 'pending';

@Component({
  selector: 'app-tasks',
  imports: [
    FormsModule,
    MatCard,
    MatCardContent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatChipSet,
    MatChip,
    MatDivider,
    MatTooltip,
    MatButtonToggleGroup,
    MatButtonToggle,
    DatePipe,
    MatPaginator,
    MatGridList,
    MatGridTile,
    EditFormComponent
  ],

  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  protected newTaskTitle = signal('');
  protected activeFilter = signal<TaskFilter>('all');
  protected editingTaskId = signal<number | null>(null);

  todoService = inject(TodoService)

  protected tasks = this.todoService.getTodos();

  protected pageSize = signal(10);
  protected pageIndex = signal(0);

  protected totalTasks = computed(() => this.tasks().length);
  protected completedTasks = computed(() => this.tasks().filter(task => task.status == "completed").length);
  protected activeTasks = computed(() => this.tasks().filter(task => task.status == "active").length);
  protected pendingTasks = computed(() => this.tasks().filter(task => task.status == "pending").length);

  protected filteredTasks = computed(() => {
    const filter = this.activeFilter();
    const allTasks = this.tasks();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    let result = allTasks;
    if (filter !== 'all') {
      result = allTasks.filter(task => task.status === filter);
    }
    return result.slice(startIndex, endIndex);
  });

  protected filteredTotal = computed(() => {
    const filter = this.activeFilter();
    const allTasks = this.tasks();
    if (filter === 'all') return allTasks.length;
    return allTasks.filter(task => task.status === filter).length;
  });

  protected addTask() {
    const title = this.newTaskTitle().trim();

    if (!title) {
      return;
    }

    const task: Todo = {
      id: Date.now(),
      title,
      status: "active",
      date: Date.now().toString()
    };
    this.todoService.addTodo(task)
    this.newTaskTitle.set('');
  }

  protected toggleTask(taskId: number) {
    const status = this.todoService.checkStatus(taskId)
    if (status) {
      const nextStatus = status === 'active' ? 'pending' :
        status === 'pending' ? 'completed' : 'active';
      this.todoService.changeStatus(taskId, nextStatus);
    }
  }

  protected deleteTask(taskId: number) {
    this.todoService.removeTodo(taskId)
  }

  protected clearCompleted() {
    this.todoService.clearCompleted()
  }
  protected setFilter(filter: TaskFilter) {
    this.activeFilter.set(filter);
    this.pageIndex.set(0);
  }
  protected updateNewTaskTitle(value: string) {
    this.newTaskTitle.set(value);
  }
  protected handlePageEvent(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }


  protected editTask(taskId: number) {
    this.editingTaskId.update(current => current === taskId ? null : taskId);
  }

  protected saveTaskEdit(edit: { id: number; title: string; date: number }) {
    this.todoService.updateTodo(edit.id, {title: edit.title, date: String(edit.date)});
    this.editingTaskId.set(null);
  }

  protected cancelTaskEdit() {
    this.editingTaskId.set(null);
  }
}
