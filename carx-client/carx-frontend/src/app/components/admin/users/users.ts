import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule , FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: any[] = [];
  isLoading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    const token = this.authService.getToken();
    
    this.http.get<any[]>('http://localhost:8080/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.isLoading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const token = this.authService.getToken();
      
      this.http.delete(`http://localhost:8080/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
          alert('User deleted successfully');
        },
        error: (err) => {
          alert('Failed to delete user');
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  updateUserRole(userId: string, newRole: string): void {
    const token = this.authService.getToken();
    
    this.http.put(`http://localhost:8080/api/admin/users/${userId}/role`, 
      { role: newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.role = newRole;
        alert('User role updated successfully');
      },
      error: (err) => {
        alert('Failed to update user role');
        console.error('Error updating role:', err);
      }
    });
  }
}
