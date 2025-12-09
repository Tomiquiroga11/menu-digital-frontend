import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categoria-nueva', 
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './categoria.nueva.component.html',
  styleUrl: './categoria.nueva.component.scss' 
})
export class CategoriaNuevaComponent implements OnInit {

  categoriaForm: FormGroup;
  isEditMode: boolean = false;
  categoriaId: number = 0;
  cargando: boolean = false;
  restauranteId: number = 0;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idStr = this.authService.getRestauranteId();
    if (idStr) this.restauranteId = +idStr;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.categoriaId = +id;
        this.cargarCategoria();
      }
    });
  }

  cargarCategoria() {
    this.categoriaService.getCategoriaById(this.categoriaId).subscribe(cat => {
      this.categoriaForm.patchValue({ nombre: cat.nombre });
    });
  }

  onSubmit() {
    if (this.categoriaForm.invalid) return;
    this.cargando = true;
    const dto = { nombre: this.categoriaForm.value.nombre };

    if (this.isEditMode) {
      this.categoriaService.updateCategoria(this.restauranteId, this.categoriaId, dto).subscribe({
        next: () => {
          alert('Categoría actualizada');
          this.router.navigate(['/admin/manage-categorias']);
        },
        error: () => { 
          alert('Error al actualizar'); 
          this.cargando = false; 
        }
      });
    } else {
      this.categoriaService.createCategoria(this.restauranteId, dto).subscribe({
        next: () => {
          alert('Categoría creada exitosamente');
          this.router.navigate(['/admin/manage-categorias']);
        },
        error: () => { 
          alert('Error al crear. Verifica que no tengas otra con el mismo nombre.'); 
          this.cargando = false; 
        }
      });
    }
  }
}