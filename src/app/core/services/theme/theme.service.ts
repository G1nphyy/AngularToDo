import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  activeTheme = 'system'

  changeTheme(theme: string) {
    if (theme === 'system') {
      this.activeTheme = theme
      document.documentElement.style.colorScheme = 'light dark'
      localStorage.setItem('theme', 'system')
    }else {
      document.documentElement.style.colorScheme = theme
      this.activeTheme = theme
      localStorage.setItem('theme', theme)
    }
  }
  constructor() {
    const theme = localStorage.getItem('theme')
    if (theme) {
      this.changeTheme(theme)
    }else{
      this.changeTheme('system')
    }
  }
}
