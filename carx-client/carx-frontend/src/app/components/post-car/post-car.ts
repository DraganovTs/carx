import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateCarListingRequest, CarImageResponse, CarListingService } from '../../services/car-listing';
import { UserService } from '../../services/user';
import { finalize, catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

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
  isUploadingAll = false;
  errorMessage = '';
  successMessage = '';
  createdListingId: string | null = null;
  selectedFiles: File[] = []; 
  imagePosition = 0;
  uploadedImages: CarImageResponse[] = [];
  
  private blobUrls: string[] = [];
  selectedFilePreviewUrls: { file: File, url: string }[] = []; 

 
  isLoggedIn = false;
  userEmail = '';
  userEmailUsername = '';
  userUuid: string | null = null;

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
    
    if (this.isLoggedIn && this.userEmail) {
      this.carForm.patchValue({
        sellerId: this.userEmail.split('@')[0]
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
          this.clearSelectedFiles(); 
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

    const files = Array.from(input.files);
    
    // Validate each file
    for (const file of files) {
      if (!this.isImageFile(file)) {
        this.errorMessage = 'Only image files are allowed.';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = `Image "${file.name}" must be smaller than 5MB.`;
        return;
      }
    }

    this.clearSelectedFiles();

    files.forEach(file => {
      const url = URL.createObjectURL(file);
      this.selectedFiles.push(file);
      this.selectedFilePreviewUrls.push({ file, url });
    });

    this.errorMessage = '';
    
    setTimeout(() => {
      this.cdr.markForCheck();
    });
  }

  uploadImage(): void {
    if (!this.createdListingId) {
      this.errorMessage = 'Please create a listing first.';
      return;
    }
    
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Please select at least one image file.';
      return;
    }

    if (this.selectedFiles.length > 1) {
      if (confirm(`You have selected ${this.selectedFiles.length} images. Do you want to upload all at once?`)) {
        this.uploadAllImages();
        return;
      }
    }

    this.uploadSingleImage(this.selectedFiles[0]);
  }

  uploadSingleImage(file: File): void {
    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.carListingService.uploadImage(
        this.createdListingId!, 
        file,
        this.imagePosition
      ).pipe(
        catchError(error => {
          console.error('Upload error details:', error);
          
          if (error.status === 404) {
            this.errorMessage = 'API endpoint not found. Please try again.';
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
        
          const index = this.selectedFiles.indexOf(file);
          if (index > -1) {
            this.selectedFiles.splice(index, 1);
            this.selectedFilePreviewUrls.splice(index, 1);
          }
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

 
  uploadAllImages(): void {
    if (!this.createdListingId) {
      this.errorMessage = 'Please create a listing first.';
      return;
    }
    
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'No images selected.';
      return;
    }

    this.isUploadingAll = true;
    this.errorMessage = '';
    this.successMessage = 'Uploading images...';

    const uploadObservables = this.selectedFiles.map((file, index) => {
      return this.carListingService.uploadImage(
        this.createdListingId!, 
        file,
        this.imagePosition + index 
      ).pipe(
        catchError(error => {
          console.error(`Failed to upload ${file.name}:`, error);
          return of(null);
        })
      );
    });

    setTimeout(() => {
      forkJoin(uploadObservables).subscribe(responses => {
        const successfulUploads = responses.filter(r => r !== null);
        
        successfulUploads.forEach(response => {
          if (response) {
            this.uploadedImages.push(response);
          }
        });

        this.isUploadingAll = false;
        
        if (successfulUploads.length > 0) {
          this.successMessage = `Successfully uploaded ${successfulUploads.length} image(s)!`;
          this.clearSelectedFiles(); 
        } else {
          this.errorMessage = 'Failed to upload all images. Please try again.';
        }
        
        this.cdr.markForCheck();
      });
    });
  }

  finishAndReturn(): void {
    if (this.uploadedImages.length === 0) {
      if (confirm('You haven\'t uploaded any images. Your listing will be less attractive without photos. Continue anyway?')) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.successMessage = 'Listing completed! Redirecting to dashboard...';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
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
    this.clearSelectedFiles();
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

  clearSelectedFiles(): void {
    // Revoke all blob URLs
    this.selectedFilePreviewUrls.forEach(item => {
      URL.revokeObjectURL(item.url);
    });
    
    this.selectedFiles = [];
    this.selectedFilePreviewUrls = [];
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  clearSelectedFile(index: number): void {
    if (index >= 0 && index < this.selectedFilePreviewUrls.length) {
      URL.revokeObjectURL(this.selectedFilePreviewUrls[index].url);
      this.selectedFiles.splice(index, 1);
      this.selectedFilePreviewUrls.splice(index, 1);
      this.cdr.markForCheck();
    }
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
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

  getTotalFileSize(): string {
    const totalBytes = this.selectedFiles.reduce((sum, file) => sum + file.size, 0);
    return this.getFileSize(totalBytes);
  }

  getSelectedFilesCount(): number {
    return this.selectedFiles.length;
  }
}