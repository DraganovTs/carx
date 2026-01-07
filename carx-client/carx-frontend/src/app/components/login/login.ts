import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AuthResponse, LoginRequest, UserService } from '../../services/user';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false; 

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter email and password';
      this.isLoading = false;
      return;
    }

    this.userService.login(this.credentials).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        this.authService.login(response.token, response.email);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401 || error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        console.error('Login error:', error);
      }
    });
  }
}