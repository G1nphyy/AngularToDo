import {Component, computed, inject, Signal} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatDivider} from '@angular/material/divider';
import {TodoService} from '../../../../core/services/todoService/todo.service';
import {Todo} from '../../../../core/interface/todo';
import {DashboardModule} from '../../../dashboard.module';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    MatIcon,
    MatProgressBar,
    MatChipSet,
    MatChip,
    MatDivider,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  todoService = inject(TodoService)
  tasks = this.todoService.getTodos();


  private taskCounts = computed(() => {
    const tasks = this.tasks();
    return tasks.reduce((acc, task) => {
      if (task.status === 'active') acc.active++;
      else if (task.status === 'completed') acc.completed++;
      else if (task.status === 'pending') acc.pending++;
      return acc;
    }, {active: 0, completed: 0, pending: 0});
  });



  protected stats = computed(() => {
    const counts = this.taskCounts();
    return [
      {label: 'Active', value: counts.active, icon: 'today', color: 'var(--color-primary)'},
      {label: 'Completed', value: counts.completed, icon: 'task_alt', color: '#4caf50'},
      {label: 'Pending', value: counts.pending, icon: 'pending_actions', color: '#ff9800'}
    ];
  });

  protected totalTasks = computed(() => this.tasks().length);
  protected activeTasks = computed(() => this.taskCounts().active);
  protected completedTasks = computed(() => this.taskCounts().completed);
  protected pendingTasks = computed(() => this.taskCounts().pending);


  protected tasksFromToday = computed(() => {
    const todayStr = new Date().toDateString();
    return this.tasks().filter(task =>
      new Date(Number(task.date)).toDateString() === todayStr
    );
  });

  protected todayTasksCount = computed(() => this.tasksFromToday().length);

  protected todayTasksCompletedCount = computed(() =>
    this.tasksFromToday().filter(t => t.status === 'completed').length
  );

  protected todayProgress = computed(() => {
    const total = this.todayTasksCount();
    if (total === 0) return 0;
    return Math.round((this.todayTasksCompletedCount() / total) * 100);
  });


  protected features = [
    {
      icon: 'playlist_add_check',
      title: 'Organize tasks',
      description: 'Keep your daily todos in one clean and simple place.'
    },
    {
      icon: 'insights',
      title: 'Track progress',
      description: 'See what is done, what is pending, and what needs your attention.'
    },
    {
      icon: 'center_focus_strong',
      title: 'Stay focused',
      description: 'Plan your work and reduce chaos with a clear task overview.'
    }
  ];
  previewTasks = computed(() => this.tasksFromToday().slice(0, 3));

}
