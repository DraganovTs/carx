import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // PUBLIC DASHBOARD (lazy loaded, no auth guard)
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
  },

  // Protected routes stay guarded
  { 
    path: 'profile', 
    loadComponent: () => import('./components/user-profile/user-profile').then(m => m.UserProfile),
    canActivate: [authGuard]
  },
  { 
    path: 'post-car', 
    loadComponent: () => import('./components/post-car/post-car').then(m => m.PostCar),
    canActivate: [authGuard]
  },
  

  // Default route → dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];