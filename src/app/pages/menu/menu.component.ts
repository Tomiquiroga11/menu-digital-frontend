import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import { MenuCompletoDto, ProductoDto } from '../../models/menu.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { CarritoFloatComponent } from '../../components/carrito-float/carrito.float.component';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, RouterLink, CarritoFloatComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  
  menu: MenuCompletoDto | undefined;
  cargando: boolean = true;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private restauranteService: RestauranteService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const id = +idParam;
      this.restauranteService.getMenuPorId(id).subscribe({
        next: (data) => {
          this.menu = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar menú', err);
          this.cargando = false;
        }
      });
    }
  }

  hasSearchResults(): boolean {
    if (!this.menu) return false;
    if (!this.searchTerm) return true; 

    const term = this.searchTerm.toLowerCase();

    return this.menu.categorias.some(categoria => 
      categoria.productos.some(prod => 
        prod.nombre.toLowerCase().includes(term) || 
        prod.descripcion.toLowerCase().includes(term)
      )
    );
  }

  agregarAlCarrito(producto: ProductoDto): void {
    this.carritoService.addToCart(producto);
  }
}