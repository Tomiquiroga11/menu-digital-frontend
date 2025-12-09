import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaNueva } from './categoria.nueva.component';

describe('CategoriaNueva', () => {
  let component: CategoriaNueva;
  let fixture: ComponentFixture<CategoriaNueva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaNueva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaNueva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
