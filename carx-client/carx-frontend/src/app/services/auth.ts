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

  login(token: string, email: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }

   getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}