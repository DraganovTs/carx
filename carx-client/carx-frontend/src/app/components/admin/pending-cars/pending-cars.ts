import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';

interface PendingCar {
  id: string;
  listingId: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  brand: string;
  model: string;
  userEmail: string;
  mainImageUrl?: string;
  submittedAt: string;
  description: string;
}

interface ApprovalRequest{
  comment: string;
}

interface RejectionRequest{
  reason: string;
}

@Component({
  selector: 'app-pending-cars',
  imports: [CommonModule , FormsModule],
  templateUrl: './pending-cars.html',
  styleUrl: './pending-cars.css',
})
export class PendingCars implements OnInit {
  pendingCars: any[] = [];
  isLoading = true;
  error = '';
  selectedCar: PendingCar | null = null;
  showApprovalModal = false;
  showRejectionModal = false;
  approvalComment = '';
  rejectionReason = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPendingCars();
  }

  loadPendingCars(): void {
    this.isLoading = true;
    const token = this.authService.getToken();
    
    this.http.get<any[]>('http://localhost:8082/api/admin/moderations/cars/pending', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.pendingCars = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load pending cars';
        this.isLoading = false;
        console.error('Error loading pending cars:', err);
        this.cdr.detectChanges();
      }
    });
  }

  formatPrice(price: number): string {
    return '€' + price.toLocaleString('de-DE');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  showCarDetails(car: PendingCar): void {
    this.selectedCar = car;
  }

  openApproveModal(car: PendingCar): void {
    this.selectedCar = car;
    this.approvalComment = '';
    this.showApprovalModal = true;
  }

  openRejectModal(car: PendingCar): void {
    this.selectedCar = car;
    this.rejectionReason = '';
    this.showRejectionModal = true;
  }

  approveCar(): void {
    if (!this.selectedCar) return;

    const token = this.authService.getToken();
    const adminId = "test-admin-id";  // Hardcoded admin ID for testing
    
    const request: ApprovalRequest = {
      comment: this.approvalComment
    };
    
    this.http.put(
      `http://localhost:8082/api/admin/moderations/cars/${this.selectedCar.id}/approve?adminId=${adminId}`, 
      request,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.pendingCars = this.pendingCars.filter(car => car.id !== this.selectedCar!.id);
        this.showApprovalModal = false;
        this.selectedCar = null;
      },
      error: (err) => {
        alert('Failed to approve car');
        console.error('Error approving car:', err);
      }
    });
  }

  rejectCar(): void {
    if (!this.selectedCar) return;

    const token = this.authService.getToken();
    const adminId = "test-admin-id"; // Hardcoded admin ID for testing
    
    const request: RejectionRequest = {
      reason: this.rejectionReason
    };
    
    this.http.put(
      `http://localhost:8082/api/admin/moderations/cars/${this.selectedCar.id}/reject?adminId=${adminId}`, 
      request,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        this.pendingCars = this.pendingCars.filter(car => car.id !== this.selectedCar!.id);
        this.showRejectionModal = false;
        this.selectedCar = null;
      },
      error: (err) => {
        alert('Failed to reject car');
        console.error('Error rejecting car:', err);
      }
    });
  }

  closeModals(): void {
    this.showApprovalModal = false;
    this.showRejectionModal = false;
    this.selectedCar = null;
  }

  viewCarDetails(carId: string): void {
    console.log('View car details:', carId);
    alert('View car details - implement modal or redirect');
  }
}