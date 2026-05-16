import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LoaderComponent} from './core/components/loader/loader.component';
import {ThemeService} from './core/services/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  _themeService = inject(ThemeService)

  constructor() {
    setTimeout(()=>{
      console.log(
        '%cSTOP!',
        `color: #dc2626; font-size: 50px; font-weight: bold; font-family: sans-serif;`
      );

      console.log(
        '%cTa funkcja jest przeznaczona wyłącznie dla deweloperów.',
        'color: inherit; font-size: 18px; font-weight: 500; font-family: sans-serif;'
      );

      console.log(
        '%cJeśli ktoś kazał Ci tutaj cokolwiek wkleić, istnieje duże ryzyko, że próbuje wykraść Twoje dane lub przejąć konto!',
        'color: inherit; opacity: 0.7; font-size: 14px; font-family: sans-serif; line-height: 1.5;'
      );
    }, 3000)

  }

}
