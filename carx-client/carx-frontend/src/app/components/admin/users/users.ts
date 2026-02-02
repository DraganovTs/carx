import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  filteredUsers: any[] = [];
  isLoading = true;
  error = '';
  searchQuery = '';
  currentPage = 0;
  pageSize = 10;
  sortField = 'createdAt';
  sortDirection = 'desc';
  viewMode: 'table' | 'grid' = 'table';
  currentUserEmail: string | null = null;
  editingUser: any | null = null;
  isSaving = false;

  editForm = {
    firstName: '',
    lastName: '',
    phone: ''
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUserEmail = this.authService.getEmail();
    this.loadUsers();
  }

  loadUsers(): void {
  this.isLoading = true;
  

  const token = this.authService.getToken();

  this.http.get<any>('http://localhost:8080/api/admin/users', {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: (data) => {
      this.users = data.content;
      this.filterAndSortUsers();
      this.isLoading = false;
      this.cdr.detectChanges();
      
    },
    error: (err) => {
      console.error('ERROR', err);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  filterAndSortUsers(): void {
    // Filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query)
      );
    } else {
      this.filteredUsers = [...this.users];
    }

    // Sort
    this.filteredUsers.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];
      
      if (this.sortField === 'createdAt') {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return this.sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // Paginate
    this.filteredUsers = this.filteredUsers.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );
  }

  searchUsers(): void {
    this.currentPage = 0;
    this.filterAndSortUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.filterAndSortUsers();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterAndSortUsers();
  }

  setViewMode(mode: 'table' | 'grid'): void {
    this.viewMode = mode;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUserInitials(firstName: string, lastName: string): string {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  getRoleClass(role: string): string {
    return role.toUpperCase();
  }

  getRoleCount(role: string): number {
    return this.users.filter(user => user.role === role).length;
  }

  updateUserRole(userId: string, newRole: string): void {
    if (!confirm(`Change user role to ${newRole}?`)) {
      // Revert the select value
      this.filterAndSortUsers();
      return;
    }

    const token = this.authService.getToken();
    
    this.http.put(`http://localhost:8080/api/admin/users/${userId}/role`, 
      { role: newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        alert('User role updated successfully');
        // Optionally reload users
        // this.loadUsers();
      },
      error: (err) => {
        alert('Failed to update user role');
        console.error('Error updating role:', err);
        this.filterAndSortUsers(); // Revert on error
      }
    });
  }

  deleteUser(userId: string, userEmail: string): void {
    if (userEmail === this.currentUserEmail) {
      alert('You cannot delete your own account!');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    const token = this.authService.getToken();
    
    this.http.delete(`http://localhost:8080/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== userId);
        this.filterAndSortUsers();
        alert('User deleted successfully');
      },
      error: (err) => {
        alert('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    });
  }

  exportUsers(): void {
    const dataStr = JSON.stringify(this.users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `carx-users-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Pagination methods
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.users.length / this.pageSize);
    const maxPagesToShow = 5;
    const pages = [];
    
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.filterAndSortUsers();
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.filterAndSortUsers();
    }
  }

  nextPage(): void {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.filterAndSortUsers();
    }
  }

  isLastPage(): boolean {
    return this.currentPage >= Math.ceil(this.users.length / this.pageSize) - 1;
  }

trackByEmail(index: number, user: any): string {
  if (!user) return `empty-${index}`;
  
  if (user.id) return user.id;
  
  if (user.email) return user.email;
  
  return `user-${index}`;
}

openEditUser(user: any): void {
  this.editingUser = user;
  this.editForm = {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone
  };
}

saveUser(): void {
  this.isSaving = true;
  const token = this.authService.getToken();

  this.http.put(
    `http://localhost:8080/api/admin/users/${this.editingUser.id}`,
    this.editForm,
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe({
    next: (updatedUser: any) => {
      Object.assign(this.editingUser, updatedUser);
      this.isSaving = false;
      this.closeEdit();
      alert('User updated successfully!');
    },
    error: (err) => {
      this.isSaving = false;
      alert(err.error?.message || 'Failed to update user');
      console.error(err);
    }
  });
}
   closeEdit(): void {
    this.editingUser = null;
    this.editForm = {
      firstName: '',
      lastName: '',
      phone: ''
    };
    this.isSaving = false;
  }
}