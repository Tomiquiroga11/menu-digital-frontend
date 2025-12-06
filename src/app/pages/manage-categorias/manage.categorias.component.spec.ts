import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategorias } from './manage.categorias.component';

describe('ManageCategorias', () => {
  let component: ManageCategorias;
  let fixture: ComponentFixture<ManageCategorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCategorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCategorias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
