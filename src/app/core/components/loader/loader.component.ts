import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LoaderService} from '../../services/loader/loader.service';

@Component({
  selector: 'app-loader',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  loader = inject(LoaderService)
}
