import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }


  isLoggedIn(): boolean {
    return this.hasToken();
  }

  login(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}