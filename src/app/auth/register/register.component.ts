import {Component, inject, signal} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  FormControl, FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {HttpClient} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {API_URL_REGISTER} from '../../core/environments/environments-dev';
import {RegisterUserInterface} from '../../core/interface/register-user-interface';
import {ErrorMessageService} from '../../core/services/error-message/error-message.service';

export class RegisterErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const isControlInvalid = !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    const isFormMismatch = !!(form && form.hasError('passwordsMismatch') && control && control.touched);

    return isControlInvalid || isFormMismatch;
  }
}

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCard, MatCardTitle, MatCardContent, MatFormField,
    ReactiveFormsModule, MatInput, MatButton, MatIcon,
    MatLabel, MatError, MatIconButton, MatSuffix, RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private errorHandler = inject(ErrorMessageService)

  protected registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_\-+=\[\]{}|;:',.<>\/])[A-Za-z\d@$!%*?&()_\-+=\[\]{}|;:',.<>\/]+$/)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  errorMatcher = new RegisterErrorStateMatcher();
  hidePassword = signal(true);

  protected togglePassword($event: MouseEvent) {
    this.hidePassword.update(prev => !prev);
    $event.stopPropagation();
    $event.preventDefault();
  }

  protected onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.getRawValue();

      this.http.post<RegisterUserInterface>(API_URL_REGISTER, { email, password }).subscribe({
        next: (res) => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.errorHandler.showHttpError(err, 'Registration failed')
        }
      });
    }
  }
}
