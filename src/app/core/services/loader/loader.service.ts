import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private requests = signal(0)

  loading = this.requests.asReadonly()

  show() {
    this.requests.update(v => v + 1)
    document.body.classList.add('no-scroll');
  }

  hide() {
    this.requests.update(v => Math.max(0, v - 1))
      document.body.classList.remove('no-scroll');
  }
}
