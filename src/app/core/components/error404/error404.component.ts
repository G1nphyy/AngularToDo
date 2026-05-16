import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-error404',
  imports: [
    MatAnchor,
    MatIcon,
    RouterLink,
    MatButton
  ],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.scss'
})
export class Error404Component {
  private router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
