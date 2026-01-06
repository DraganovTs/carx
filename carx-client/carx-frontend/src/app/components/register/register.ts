import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  user = {
    email: '',
    username: '',
    password: ''
  };
  
  constructor(private userService: UserService) {}
  
  onSubmit() {
    this.userService.register(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }
}