import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { CategoriaService } from '../../services/categoria.service'; 
import { AuthService } from '../../services/auth.service';
import { CategoriaDto, ProductoCreateDto, ProductoUpdateDto } from '../../models/menu.model';

@Component({
  selector: 'app-producto-nuevo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto.nuevo.component.html',
  styleUrl: './producto.nuevo.component.scss'
})
export class ProductoNuevoComponent implements OnInit {

  productoForm: FormGroup;
  isEditMode: boolean = false;
  productoId: number = 0;
  categorias: CategoriaDto[] = [];
  cargando: boolean = false;
  restauranteId: number = 0;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoriaId: ['', Validators.required],
      imagenUrl: [''],
      estaDestacado: [false],
      tieneHappyHour: [false],
      tieneDescuento: [false],
      porcentajeDescuento: [0]
    });
  }

  ngOnInit(): void {
    const idStr = this.authService.getRestauranteId();
    if (idStr) this.restauranteId = +idStr;

    this.cargarCategorias();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productoId = +id;
        this.cargarProductoParaEditar(this.productoId);
      }
    });
  }

  cargarCategorias() {
    this.categoriaService.getMisCategorias(this.restauranteId).subscribe(data => {
      this.categorias = data;
    });
  }

  cargarProductoParaEditar(id: number) {
    this.menuService.getProductoById(this.restauranteId, id).subscribe(prod => {
      this.productoForm.patchValue({
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio: prod.precio,
        categoriaId: prod.categoriaId,
        imagenUrl: prod.imagenUrl,
        estaDestacado: prod.estaDestacado,
        tieneHappyHour: prod.tieneHappyHour,
        tieneDescuento: prod.tieneDescuento,
        porcentajeDescuento: prod.porcentajeDescuento
      });
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) return;
    this.cargando = true;

    if (this.isEditMode) {
      const dto: ProductoUpdateDto = this.productoForm.value;
      this.menuService.updateProducto(this.restauranteId, this.productoId, dto).subscribe({
        next: () => {
          alert('Producto actualizado!');
          this.router.navigate(['/admin/manage-productos']);
        },
        error: () => {
          alert('Error al actualizar');
          this.cargando = false;
        }
      });
    } else {
      const dto: ProductoCreateDto = this.productoForm.value;
      this.menuService.createProducto(this.restauranteId, dto).subscribe({
        next: () => {
          alert('Producto creado exitosamente!');
          this.router.navigate(['/admin/manage-productos']);
        },
        error: () => {
          alert('Error al crear producto');
          this.cargando = false;
        }
      });
    }
  }
}