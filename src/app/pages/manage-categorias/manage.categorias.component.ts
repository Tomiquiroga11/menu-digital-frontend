import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { CategoriaDto } from '../../models/menu.model';

@Component({
  selector: 'app-manage-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manage.categorias.component.html',
  styleUrl: './manage.categorias.component.scss'
})
export class ManageCategoriasComponent implements OnInit {

  categorias: CategoriaDto[] = [];
  cargando: boolean = true;
  idRestaurante: number = 0;

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const idStr = this.authService.getRestauranteId();
    
    if (idStr) {
      this.idRestaurante = +idStr;
      this.cargarCategorias();
    } else {
      console.error('No se pudo obtener el ID del restaurante');
      this.cargando = false;
    }
  }

  cargarCategorias() {
    this.cargando = true;
    this.categoriaService.getMisCategorias(this.idRestaurante).subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.cargando = false;
      }
    });
  }
  
  onDelete(id: number) {
    if(confirm('¿Eliminar categoría? Se borrarán sus productos.')) {
      this.categoriaService.deleteCategoria(this.idRestaurante, id).subscribe({
        next: () => {
          this.cargarCategorias(); 
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('No se pudo eliminar la categoría.');
        }
      });
    }
  }
}