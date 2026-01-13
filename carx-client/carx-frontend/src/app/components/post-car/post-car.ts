import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selectedFile: File | null = null;
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
    public router: Router,
    private crd: ChangeDetectorRef
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
      this.crd.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.crd.detectChanges();

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
       

        this.crd.detectChanges();
      },
      error: (error) => {
        console.error('Error creating listing:', error);
        this.errorMessage = error.error?.message || 'Failed to create car listing. Please try again.';
        this.isLoading = false;
        this.crd.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  // Basic validation
  if (!file.type.startsWith('image/')) {
    this.errorMessage = 'Only image files are allowed.';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    this.errorMessage = 'Image must be smaller than 5MB.';
    return;
  }

  this.selectedFile = file;
  this.errorMessage = '';
}

  uploadImage(): void {
  if (!this.createdListingId || !this.selectedFile) {
    this.errorMessage = 'Please select an image file.';
    return;
  }

  this.isUploading = true;
  this.errorMessage = '';
  this.crd.detectChanges();

  this.carListingService.uploadImage(
    this.createdListingId,
    this.selectedFile,
    this.imagePosition
  ).subscribe({
    next: (response) => {
      this.uploadedImages.push(response);
      this.selectedFile = null;
      this.isUploading = false;
      this.successMessage = 'Image uploaded successfully!';
    },
    error: (error) => {
      console.error('Upload error:', error);
      this.errorMessage = 'Failed to upload image.';
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

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    this.crd.detectChanges();
  }

    handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-car.jpg'; // Fallback image
  }

   getDisplayImageUrl(imageUrl: string): string {
    // If it's a data URL or absolute URL, use it directly
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Otherwise, assume it's a relative path
    return imageUrl;
  }
}