import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCars } from './pending-cars';

describe('PendingCars', () => {
  let component: PendingCars;
  let fixture: ComponentFixture<PendingCars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingCars]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingCars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
