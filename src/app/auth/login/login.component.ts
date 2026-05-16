import {Component, inject, signal} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {
  FormBuilder,
  FormControl, FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {HttpClient} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {API_URL_LOGIN} from '../../core/environments/environments-dev';
import {AuthStorageService} from '../../core/services/auth-storage/auth-storage.service';
import {AuthServiceService} from '../services/auth-service.service';
import {LoginUserInterface} from '../../core/interface/login-user-interface';
import {ErrorMessageService} from '../../core/services/error-message/error-message.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  imports: [
    MatCard, MatCardTitle, MatCardContent, MatFormField,
    ReactiveFormsModule, MatInput, MatButton, MatIcon,
    MatLabel, MatError, MatIconButton, MatSuffix, RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb: FormBuilder = inject(FormBuilder)
  http: HttpClient = inject(HttpClient)
  router: Router = inject(Router)
  authStorage = inject(AuthStorageService)
  authService = inject(AuthServiceService)
  errorHandler = inject(ErrorMessageService)

  protected loginForm: FormGroup = this.fb.nonNullable.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    }
  );

  emailMatcher = new MyErrorStateMatcher();
  passwordMatcher = new MyErrorStateMatcher();

  hidePassword = signal(true);

  protected togglePassword($event: MouseEvent) {
    this.hidePassword.update(prev => !prev);
    $event.stopPropagation();
    $event.preventDefault();
  }

  protected onSubmit() {
    if (this.loginForm.valid) {
      this.http.post<LoginUserInterface>(API_URL_LOGIN, this.loginForm.getRawValue()).subscribe({
          next: (res) => {
            this.authService.setUser(res)
            // console.log(this.authService.getUser())
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.errorHandler.showHttpError(err, 'Login failed')
          }
        }
      )
    }
  }
}
