import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  userEmail: string | null = null;
  activeRoute: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getEmail() ?? '';
    
    // Track route changes for active state
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      if (url.includes('/admin/users')) {
        this.activeRoute = 'users';
      } else if (url.includes('/admin/pending-cars')) {
        this.activeRoute = 'pending-cars';
      } else if (url.includes('/dashboard')) {
        this.activeRoute = 'dashboard';
      } else {
        this.activeRoute = '';
      }
    });
  }

  goHome() { 
    this.router.navigate(['/dashboard']); 
  }

  goAdminUsers() { 
    this.router.navigate(['/admin/users']); 
  }
  
  goPendingCars() { 
    this.router.navigate(['/admin/pending-cars']); 
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}