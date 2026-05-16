import {inject, NgModule, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {TodoService} from '../core/services/todoService/todo.service';
import {Todo} from '../core/interface/todo';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
