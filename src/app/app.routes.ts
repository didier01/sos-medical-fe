import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/public/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/public/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/private/private.routes').then(m => m.privateRoutes)
  }
];
