import {Routes} from '@angular/router';
import {userAuthenticatedGuard} from './core/guards/user-authenticated.guard';
import {guestGuardGuard} from './core/guards/guest-guard.guard';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: 'auth'
  },
  {
    path: "auth",
    canActivate: [
      guestGuardGuard
    ],
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: "dashboard",
    canActivate: [
      userAuthenticatedGuard
    ],
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
  },
  {
    path: "**",
    loadComponent: () => import("./core/components/error404/error404.component").then(m => m.Error404Component)
  },
];
