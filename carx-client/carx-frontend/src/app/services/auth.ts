import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private role = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  
  isLoggedIn$ = this.loggedIn.asObservable();
  role$ = this.role.asObservable();

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // UPDATED: Add role parameter
  login(token: string, email: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('role', role); 
    this.loggedIn.next(true);
    this.role.next(role); 
    this.router.navigate(['/dashboard']);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role'); 
    this.loggedIn.next(false);
    this.role.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Helper method to get user data
  getUser(): { email: string | null, role: string | null } | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    
    return {
      email: this.getEmail(),
      role: this.getRole()
    };
  }
}