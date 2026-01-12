import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CarView {
  id: string;
  title: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  location: string;
  mainImageUrl: string;
  status?: 'AVAILABLE' | 'SOLD' | 'PENDING';
}

export interface CarPage {
  content: CarView[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = '/api/marketplace/cars'; 

  constructor(private http: HttpClient) {}

  getCarViews(page: number, size: number): Observable<CarPage> {
    return this.http.get<CarPage>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}
