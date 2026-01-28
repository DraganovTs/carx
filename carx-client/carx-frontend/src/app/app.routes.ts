import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // PUBLIC DASHBOARD
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
  },

  // ADMIN ROUTES (admin only)
  { 
    path: 'admin/users', 
    loadComponent: () => import('./components/admin/users/users').then(m => m.Users),
    canActivate: [authGuard, adminGuard] // Both auth and admin guards
  },
  { 
    path: 'admin/pending-cars', 
    loadComponent: () => import('./components/admin/pending-cars/pending-cars').then(m => m.PendingCars),
    canActivate: [authGuard, adminGuard]
  },

  // USER ROUTES (authenticated users)
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

  // Default route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];