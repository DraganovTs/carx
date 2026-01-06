import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthResponse, RegisterRequest, UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  user: RegisterRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'BUYER'
  };

  roles = ['BUYER', 'SELLER', 'ADMIN'];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Remove phone if empty
    if (!this.user.phone) {
      delete this.user.phone;
    }

    this.userService.register(this.user).subscribe({
      next: (response: AuthResponse) => {
        this.isLoading = false;
        this.successMessage = response.message;
        
        // Redirect to login after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}