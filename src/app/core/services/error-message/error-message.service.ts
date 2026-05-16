import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  private snackBar = inject(MatSnackBar);

  show(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  showHttpError(err: unknown, fallbackMessage: string = 'Something went wrong') {
    if (err instanceof HttpErrorResponse) {
      const message =
        err.error?.message ||
        err.error?.error ||
        err.message ||
        fallbackMessage;

      this.show(message);
      return;
    }

    this.show(fallbackMessage);
  }
}
