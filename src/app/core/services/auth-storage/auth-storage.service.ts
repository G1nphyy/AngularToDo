import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  getToken() {
    return localStorage.getItem('token')
  }
  setToken(token: string) {
    localStorage.setItem('token', token)
  }
  removeToken() {
    localStorage.removeItem('token')
  }
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }
  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token)
  }
  removeRefreshToken() {
    localStorage.removeItem('refreshToken')
  }
  getEmail() {
    return localStorage.getItem('email')
  }
  setEmail(email: string) {
    localStorage.setItem('email', email)
  }
  removeEmail() {
    localStorage.removeItem('email')
  }

}
