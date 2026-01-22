import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
 isLoggedIn = false;
  isAdmin = false;
  userEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();

    this.isLoggedIn = !!user;
    this.userEmail = user?.email;
    this.isAdmin = user?.role === 'ADMIN';
  }

  goHome() { this.router.navigate(['/dashboard']); }
  goListings() { this.router.navigate(['/dashboard']); }
  goPost() { this.router.navigate(['/post-car']); }

  goAdminUsers() { this.router.navigate(['/admin/users']); }
  goPendingCars() { this.router.navigate(['/admin/pending-cars']); }

  goLogin() { this.router.navigate(['/login']); }
  goRegister() { this.router.navigate(['/register']); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}