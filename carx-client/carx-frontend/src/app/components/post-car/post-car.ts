import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateCarListingRequest, CarImageResponse, CarListingService } from '../../services/car-listing';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-post-car',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './post-car.html',
  styleUrls: ['./post-car.css']
})
export class PostCar implements OnInit {
  carForm: FormGroup;
  isLoading = false;
  isUploading = false;
  errorMessage = '';
  successMessage = '';
  createdListingId: string | null = null;
  imageUrl = '';
  imagePosition = 0;
  uploadedImages: CarImageResponse[] = [];

  // User info
  isLoggedIn = false;
  userEmail = '';
  userEmailUsername = '';
  userUuid: string | null = null;

  // Form constraints
  minYear = 1900;
  maxYear = new Date().getFullYear() + 1;

  constructor(
    private fb: FormBuilder,
    private carListingService: CarListingService,
    private userService: UserService,
    public router: Router
  ) {
    this.carForm = this.fb.group({
      sellerId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      year: [new Date().getFullYear(), [
        Validators.required, 
        Validators.min(this.minYear),
        Validators.max(this.maxYear)
      ]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      fuelType: ['', Validators.required],
      gearbox: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userUuid = localStorage.getItem('userId');

    if (this.userEmail) {
      this.userEmailUsername = this.userEmail.split('@')[0];
    }
    
    // Auto-populate sellerId if user is logged in
    if (this.isLoggedIn && this.userEmail) {
      this.carForm.patchValue({
        sellerId: this.userEmail.split('@')[0] // Use part of email as seller ID
      });
    }

    console.log('User info:', {
      isLoggedIn: this.isLoggedIn,
      email: this.userEmail,
      emailUsername: this.userEmailUsername,
      uuid: this.userUuid
    });
  }

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.markFormGroupTouched(this.carForm);
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValues = this.carForm.value;

    const request: CreateCarListingRequest = { ...formValues,
      sellerId: this.userUuid || '' };

    this.carListingService.createCarListing(request).subscribe({
      next: (response) => {
        this.createdListingId = response.id;
        this.successMessage = `Car listing created successfully! Listing ID: ${response.id}`;
        this.isLoading = false;
        
        // Reset uploaded images for new listing
        this.uploadedImages = [];
        this.imageUrl = '';
      },
      error: (error) => {
        console.error('Error creating listing:', error);
        this.errorMessage = error.error?.message || 'Failed to create car listing. Please try again.';
        this.isLoading = false;
      }
    });
  }

  uploadImage(): void {
    if (!this.createdListingId || !this.imageUrl) {
      this.errorMessage = 'Please enter an image URL.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';

    this.carListingService.uploadImage(
      this.createdListingId, 
      this.imageUrl, 
      this.imagePosition
    ).subscribe({
      next: (response) => {
        this.uploadedImages.push(response);
        this.imageUrl = '';
        this.isUploading = false;
        this.successMessage = 'Image uploaded successfully!';
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.errorMessage = error.error?.message || 'Failed to upload image.';
        this.isUploading = false;
      }
    });
  }

  removeImage(imageId: string): void {
    this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.carForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.userService.logout();
    this.isLoggedIn = false;
    this.userEmail = '';
    this.router.navigate(['/dashboard']);
  }

  getUserInitials(): string {
    if (!this.userEmail) return 'U';
    const email = this.userEmail.split('@')[0];
    return email.charAt(0).toUpperCase();
  }
}