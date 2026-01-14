import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateCarListingRequest, CarImageResponse, CarListingService } from '../../services/car-listing';
import { UserService } from '../../services/user';
import { finalize, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-post-car',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './post-car.html',
  styleUrls: ['./post-car.css']
})
export class PostCar implements OnInit, OnDestroy {
  carForm: FormGroup;
  isLoading = false;
  isUploading = false;
  errorMessage = '';
  successMessage = '';
  createdListingId: string | null = null;
  selectedFile: File | null = null;
  imagePosition = 0;
  uploadedImages: CarImageResponse[] = [];
  
  // Store blob URLs to revoke later
  private blobUrls: string[] = [];
    selectedFilePreviewUrl: string | null = null;

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
    private cdr: ChangeDetectorRef
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
  this.createdListingId = null; 

  const request: CreateCarListingRequest = { 
    ...this.carForm.value,
    sellerId: this.userUuid || ''
  };

  setTimeout(() => {
    this.carListingService.createCarListing(request).pipe(
      catchError(error => {
        console.error('Error creating listing:', error);
        this.errorMessage = error.error?.message || 'Failed to create car listing. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
      if (response && response.id) {
        this.createdListingId = response.id;
        this.successMessage = `Car listing created successfully! Listing ID: ${response.id}`;
        
        this.uploadedImages = [];
        
        this.cleanupBlobUrls();
        
        console.log('Listing created with ID:', response.id);
        
       
      } else {
        this.errorMessage = 'Failed to create listing: No ID returned from server.';
      }
      this.cdr.markForCheck();
    });
  });
}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!this.isImageFile(file)) {
      this.errorMessage = 'Only image files are allowed.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Image must be smaller than 5MB.';
      return;
    }

    if (this.selectedFilePreviewUrl) {
      URL.revokeObjectURL(this.selectedFilePreviewUrl);
    }

    this.selectedFile = file;
    this.selectedFilePreviewUrl = URL.createObjectURL(file);
    this.errorMessage = '';
    
    setTimeout(() => {
      this.cdr.markForCheck();
    });
  }

  uploadImage(): void {
    if (!this.createdListingId) {
      this.errorMessage = 'Please create a listing first or listing ID is missing.';
      return;
    }
    
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image file.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.carListingService.uploadImage(
        this.createdListingId!, 
        this.selectedFile!,
        this.imagePosition
      ).pipe(
        catchError(error => {
          console.error('Upload error details:', {
            status: error.status,
            url: error.url,
            message: error.message
          });
          
          if (error.status === 404) {
            this.errorMessage = `API endpoint not found. The endpoint '${error.url}' doesn't exist.`;
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Make sure the backend is running.';
          } else {
            this.errorMessage = `Failed to upload image: ${error.status} ${error.statusText}`;
          }
          
          this.isUploading = false;
          this.cdr.markForCheck();
          return of(null);
        }),
        finalize(() => {
          this.isUploading = false;
          this.clearSelectedFile(); 
        })
      ).subscribe(response => {
        if (response) {
          this.uploadedImages.push(response);
          this.successMessage = 'Image uploaded successfully!';
          console.log('Image uploaded:', response);
        }
        this.cdr.markForCheck();
      });
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

  getImagePreview(file: File): string {
    const blobUrl = URL.createObjectURL(file);
    this.blobUrls.push(blobUrl); // Track for cleanup
    return blobUrl;
  }

  getDisplayImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/uploads/')) {
      const baseUrl = 'http://localhost:8081';
      return `${baseUrl}${imageUrl}`;
    }
    
    return imageUrl;
  }

  private cleanupBlobUrls(): void {
    this.blobUrls.forEach(url => URL.revokeObjectURL(url));
    this.blobUrls = [];
  }

  ngOnDestroy(): void {
    if (this.selectedFilePreviewUrl) {
      URL.revokeObjectURL(this.selectedFilePreviewUrl);
    }
    this.cleanupBlobUrls();
  }


  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    
    if (img.classList.contains('fallback-image')) {
      img.style.display = 'none';
      return;
    }
    
    if (img.src.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(img.src);
      } catch (e) {
        console.warn('Failed to revoke blob URL:', e);
      }
    }
    
    img.src = 'https://placehold.co/400x300/cccccc/666666?text=No+Image+Available';
    img.classList.add('fallback-image');
    img.alt = 'Image not available';
    
    img.onerror = null;
  }


getUserInitials(): string {
  if (!this.userEmail) return 'U';
  
  const username = this.userEmail.split('@')[0];
  
  const parts = username.split('.');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  
  return username.charAt(0).toUpperCase();
}


clearSelectedFile(): void {
    if (this.selectedFilePreviewUrl) {
      URL.revokeObjectURL(this.selectedFilePreviewUrl);
      this.selectedFilePreviewUrl = null;
    }
    
    this.selectedFile = null;
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

 isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

 getSelectedFileName(): string {
    return this.selectedFile ? this.selectedFile.name : '';
  }

  getSelectedFileSize(): string {
    return this.selectedFile ? this.getFileSize(this.selectedFile.size) : '0 Bytes';
  }

    getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

 
}
  
