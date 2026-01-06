import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.userService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.authService.login(response.token);
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}