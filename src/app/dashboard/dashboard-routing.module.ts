import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./main/main.component").then(m => m.MainComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import("./main/pages/home/home.component").then(m => m.HomeComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import("./main/pages/tasks/tasks.component").then(m => m.TasksComponent)
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
