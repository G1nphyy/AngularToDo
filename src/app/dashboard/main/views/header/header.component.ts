import {Component, inject} from '@angular/core';
import {AuthServiceService} from '../../../../auth/services/auth-service.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ErrorMessageService} from '../../../../core/services/error-message/error-message.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {ThemeService} from '../../../../core/services/theme/theme.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatAnchor,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthServiceService);
  router = inject(Router);
  errorHandler = inject(ErrorMessageService)
  themeService = inject(ThemeService)

  protected logout() {
    this.authService.removeUser().subscribe({
      next: ([res, message]) => {
        this.errorHandler.show(message);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorHandler.showHttpError(err, 'Logout failed');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  protected setTheme(color: "system" | "dark" | "light") {
    this.themeService.changeTheme(color)
  }
}
