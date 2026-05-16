import {inject, Injectable, WritableSignal} from '@angular/core';
import {LoginUserInterface} from '../../core/interface/login-user-interface';
import {HttpClient} from '@angular/common/http';
import {
  API_URL_LOGIN,
  API_URL_LOGOUT,
  API_URL_REFRESH_TOKEN,
  API_URL_USER
} from '../../core/environments/environments-dev';
import {AuthStorageService} from '../../core/services/auth-storage/auth-storage.service';
import {catchError, map, of, tap} from 'rxjs';
import {TodoService} from '../../core/services/todoService/todo.service';
import {Todo} from '../../core/interface/todo';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private http = inject(HttpClient);
  private authStorage = inject(AuthStorageService);
  private todoService = inject(TodoService);

  private curUser: LoginUserInterface | null = null;


  setUser(user: LoginUserInterface) {
    this.curUser = user
    this.setTokens(user.accessToken, user.refreshToken)
    this.authStorage.setEmail(user.user.email)
    if (user.todos) {
      this.todoService.setTodos(user.todos);
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.authStorage.setToken(accessToken)
    this.authStorage.setRefreshToken(refreshToken)
  }

  clearSession() {
    this.curUser = null;
    this.authStorage.removeToken();
    this.authStorage.removeRefreshToken();
    this.authStorage.removeEmail();
  }

  getUser(){
    return this.curUser
  }
  removeUser() {
    return this.logout().pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }
  isAuthenticated() {
    return !!this.authStorage.getToken();
  }
  login(credentials: { email: string; password: string }) {
    return this.http.post<LoginUserInterface>(API_URL_LOGIN, credentials);
  }
  logout(){
    return this.http.get(API_URL_LOGOUT).pipe(
      map(msg => [msg, 'You have been logged out']),
      catchError(err => of([err, 'Logout failed']))
    );
  }

  me() {
    return this.http.get<LoginUserInterface>(API_URL_USER).pipe(
      tap((user) => {
        this.setUser(user);
      })
    );
  }
  refreshToken() {
    return this.http.post<RefreshTokenResponse>(API_URL_REFRESH_TOKEN, {
      refreshToken: this.authStorage.getRefreshToken() || ''
    }).pipe(
      tap((tokens) => {
        this.setTokens(tokens.accessToken, tokens.refreshToken)
        if (this.curUser) {
          this.curUser = {
            ...this.curUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          };
        }
      })
    );
  }
}
