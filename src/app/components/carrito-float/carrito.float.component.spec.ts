import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoFloat } from './carrito.float.component';

describe('CarritoFloat', () => {
  let component: CarritoFloat;
  let fixture: ComponentFixture<CarritoFloat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoFloat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoFloat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
