import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'SELLER' | 'BUYER' | 'ADMIN';
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'SELLER' | 'BUYER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  email: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.debugCurrentUser();
  }

   register(user: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('userEmail', response.email);
          }
        })
      );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

   getCurrentUser(): Observable<User> {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    throw new Error('No user ID found');
  }
  
  return this.http.get<User>(`${this.apiUrl}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

debugCurrentUser(): void {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  console.log('UserID from localStorage:', localStorage.getItem('userId'));
  console.log('Email from localStorage:', localStorage.getItem('userEmail'));
  
  // Test the endpoint
  this.http.get(`${this.apiUrl}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    observe: 'response'
  }).subscribe({
    next: (response) => {
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response body:', response.body);
    },
    error: (err) => {
      console.error('Error:', err);
      console.error('Status:', err.status);
      console.error('Message:', err.message);
    }
  });
}
  
}