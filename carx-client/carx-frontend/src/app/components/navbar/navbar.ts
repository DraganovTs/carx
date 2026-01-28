import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // This navbar only shows for admins, so no need to check isAdmin
    this.userEmail = this.authService.getEmail() ?? '';
  }

  goHome() { 
    this.router.navigate(['/dashboard']); 
  }

  // Admin-only navigation
  goAdminUsers() { 
    this.router.navigate(['/admin/users']); 
  }
  
  goPendingCars() { 
    this.router.navigate(['/admin/pending-cars']); 
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}