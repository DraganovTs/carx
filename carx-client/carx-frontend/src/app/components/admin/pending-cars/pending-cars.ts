import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-pending-cars',
  imports: [CommonModule],
  templateUrl: './pending-cars.html',
  styleUrl: './pending-cars.css',
})
export class PendingCars implements OnInit {
  pendingCars: any[] = [];
  isLoading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPendingCars();
  }

  loadPendingCars(): void {
    this.isLoading = true;
    const token = this.authService.getToken();
    
    this.http.get<any[]>('http://localhost:8080/api/admin/cars/pending', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.pendingCars = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load pending cars';
        this.isLoading = false;
        console.error('Error loading pending cars:', err);
      }
    });
  }

  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  approveCar(carId: string): void {
    const token = this.authService.getToken();
    
    this.http.put(`http://localhost:8080/api/admin/cars/${carId}/approve`, 
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.pendingCars = this.pendingCars.filter(car => car.id !== carId);
        alert('Car approved successfully');
      },
      error: (err) => {
        alert('Failed to approve car');
        console.error('Error approving car:', err);
      }
    });
  }

  rejectCar(carId: string): void {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    const token = this.authService.getToken();
    
    this.http.put(`http://localhost:8080/api/admin/cars/${carId}/reject`, 
      { reason },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.pendingCars = this.pendingCars.filter(car => car.id !== carId);
        alert('Car rejected successfully');
      },
      error: (err) => {
        alert('Failed to reject car');
        console.error('Error rejecting car:', err);
      }
    });
  }

  viewCarDetails(carId: string): void {
    console.log('View car details:', carId);
    alert('View car details - implement modal or redirect');
  }
}