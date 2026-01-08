import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarView, CarService } from '../../services/car.service';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  cars: CarView[] = [];
  page = 1;
  pageSize = 6;
  totalPages = 1;

  searchText = '';
  selectedBrand = '';
  selectedLocation = '';

  isLoggedIn = false;
  brands = ['BMW', 'Mercedes', 'Toyota', 'Honda', 'Ford'];
  locations = ['Tbilisi', 'Batumi', 'Kutaisi'];

  constructor(
    private carService: CarService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    this.loadCars();
  }

  loadCars() {
    this.carService.getCarViews(this.page - 1, this.pageSize).subscribe(res => {
      this.cars = res.content;
      this.totalPages = res.totalPages;
    });
  }

  applyFilter() {
    this.page = 1;
    this.loadCars();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadCars();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadCars();
    }
  }

  setPage(p: number) {
    this.page = p;
    this.loadCars();
  }

  totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPost() {
    if (this.isLoggedIn) {
      this.router.navigate(['/post-car']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
