import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaDto } from '../../models/menu.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage.categorias.component.html',
  styleUrl: './manage.categorias.component.scss'
})
export class ManageCategoriasComponent implements OnInit {

  categorias: CategoriaDto[] = [];
  categoriaForm: FormGroup;
  
  // Variables para edición
  isEditing: boolean = false;
  currentCategoryId: number | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getMisCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  // Cargar datos para editar
  onEdit(cat: CategoriaDto): void {
    this.isEditing = true;
    this.currentCategoryId = cat.id;
    this.categoriaForm.patchValue({ nombre: cat.nombre });
    
    // Scroll arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cancelar edición
  cancelEdit(): void {
    this.isEditing = false;
    this.currentCategoryId = null;
    this.categoriaForm.reset();
  }

  onSubmit(): void {
    if (this.categoriaForm.invalid) return;

    const nombre = this.categoriaForm.value.nombre;

    if (this.isEditing && this.currentCategoryId) {
      // EDITAR
      this.categoriaService.updateCategoria(this.currentCategoryId, nombre).subscribe(() => {
        alert('Categoría actualizada');
        this.cancelEdit();
        this.loadCategorias();
      });
    } else {
      // CREAR
      this.categoriaService.createCategoria(nombre).subscribe(() => {
        alert('Categoría creada');
        this.cancelEdit(); // Usamos esto para limpiar
        this.loadCategorias();
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe(() => {
        this.loadCategorias(); 
      });
    }
  }
}