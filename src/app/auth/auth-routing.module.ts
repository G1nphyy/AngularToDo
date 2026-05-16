import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "login",
    pathMatch: "full",
    loadComponent: () => import("./login/login.component").then(m => m.LoginComponent)
  },
  {
    path: "register",
    pathMatch: "full",
    loadComponent: () => import("./register/register.component").then(m => m.RegisterComponent)
  },
  {
    path: "**",
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
