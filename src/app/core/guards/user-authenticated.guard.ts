import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthServiceService} from '../../auth/services/auth-service.service';
import {catchError, map, of} from 'rxjs';
import {ErrorMessageService} from '../services/error-message/error-message.service';

export const userAuthenticatedGuard: CanActivateFn = (route, state) => {
  let authUser = inject(AuthServiceService)
  const router = inject(Router);
  const errorHandler = inject(ErrorMessageService)
  if (!authUser.isAuthenticated()) {
    return router.createUrlTree(['/auth']);
  }
  return authUser.me().pipe(
    map(() => true),
    catchError((err) => {
      authUser.removeUser();
      errorHandler.showHttpError(err,  'Error')
      return of(router.createUrlTree(['/auth']));
    })
  );

};
