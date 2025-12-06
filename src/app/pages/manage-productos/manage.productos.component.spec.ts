import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductosComponent } from './manage.productos.component';

describe('ManageProductosComponent', () => {
  let component: ManageProductosComponent;
  let fixture: ComponentFixture<ManageProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
