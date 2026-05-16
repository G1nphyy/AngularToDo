import {Component, computed, effect, input, OnDestroy, OnInit, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Todo} from '../../../../../core/interface/todo';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-edit-form',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.scss'
})
export class EditFormComponent implements OnInit, OnDestroy {

  ngOnInit() {
    document.body.classList.add('no-scroll');
  }

  ngOnDestroy() {
    document.body.classList.remove('no-scroll');
  }

  taskToEdit = input.required<Todo>();

  protected save = output<{ id: number; title: string, date: number }>();
  protected cancel = output<void>();

  protected draftTitle = signal('');
  protected draftDate = signal<number | null>(null);

  protected dateForDatepicker = computed(() => {
    const timestamp = this.draftDate();
    return timestamp ? new Date(timestamp) : null;
  });
  protected timeForInput = computed(() => {
    const timestamp = this.draftDate();
    if (!timestamp) return '00:00';
    const dateObj = new Date(timestamp);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  constructor() {
    effect(() => {
      this.draftTitle.set(this.taskToEdit().title);
      const initialDate = this.taskToEdit().date ? Number(this.taskToEdit().date) : Date.now();
      this.draftDate.set(initialDate);
    });
  }

  protected updateDraftTitle(value: string) {
    this.draftTitle.set(value);
  }

  protected updateDraftDate(newDate: Date | null) {
    if (!newDate) return;

    const currentFullDate = this.draftDate() ? new Date(this.draftDate()!) : new Date();

    currentFullDate.setFullYear(newDate.getFullYear());
    currentFullDate.setMonth(newDate.getMonth());
    currentFullDate.setDate(newDate.getDate());

    this.draftDate.set(currentFullDate.getTime());
  }

  protected updateDraftTime(timeString: string) {
    if (!timeString) return;

    const currentFullDate = this.draftDate() ? new Date(this.draftDate()!) : new Date();
    const [hours, minutes] = timeString.split(':').map(Number);

    currentFullDate.setHours(hours);
    currentFullDate.setMinutes(minutes);
    currentFullDate.setSeconds(0);
    currentFullDate.setMilliseconds(0);

    this.draftDate.set(currentFullDate.getTime());
  }

  protected submitEdit() {
    const title = this.draftTitle().trim();
    if (!title) return;

    const finalDate = this.draftDate() || Date.now();

    this.save.emit({
      id: this.taskToEdit().id,
      title,
      date: finalDate
    });
  }

  protected cancelEdit() {
    this.draftTitle.set(this.taskToEdit().title);
    this.cancel.emit();
  }

  protected overlayCancelEdit($event: MouseEvent) {
    if ($event.target instanceof HTMLElement) {
      const target = $event.target;
      if (!target.closest('.edit-form')) {
        this.cancelEdit();
      }
    }
  }
}
