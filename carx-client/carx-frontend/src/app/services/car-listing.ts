import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface CreateCarListingRequest {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  gearbox: string;
  category: string;
  brand: string;
  model: string;
  location: string;
}

export interface CarListingResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  brand: string;
  model: string;
  fuelType: string;
  gearbox: string;
  category: string;
  location: string;
  status: string;
  createdAt: string;
}

export interface CarImageResponse {
  id: string;
  imageUrl: string;
  position: number;
  listingId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarListingService {
  private apiUrl = 'http://localhost:8081/api/car-listing';

  constructor(private http: HttpClient) {}

  createCarListing(request: CreateCarListingRequest): Observable<CarListingResponse> {
    return this.http.post<CarListingResponse>(this.apiUrl, request);
  }

  uploadImage(listingId: string, file: File, position: number) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('position', position.toString());

  return this.http.post<CarImageResponse>(
    `/api/listings/${listingId}/images`,
    formData
  );
}
}