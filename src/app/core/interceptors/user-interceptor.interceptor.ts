import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthStorageService} from '../services/auth-storage/auth-storage.service';
import {catchError, switchMap, throwError} from 'rxjs';
import {AuthServiceService} from '../../auth/services/auth-service.service';

export const userInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let authStorage = inject(AuthStorageService)
  let authService = inject(AuthServiceService)

  let accessToken = authStorage.getToken();

  let reqClone = req;
  if (accessToken) {
    reqClone = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
  }
  return next(reqClone).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/refresh')) {
        return authService.refreshToken()?.pipe(
          switchMap((newTokens) => {
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newTokens.accessToken}`)
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            authService.clearSession();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
