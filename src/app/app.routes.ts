import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loginRedirectGuard } from './guards/loginRedirect.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginRedirectGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'chat/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/chat/chat.page').then((m) => m.ChatPage),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
