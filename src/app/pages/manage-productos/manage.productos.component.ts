import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CategoriaDto, ProductoDto } from '../../models/menu.model';

@Component({
  selector: 'app-manage-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage.productos.component.html',
  styleUrl: './manage.productos.component.scss'
})
export class ManageProductosComponent implements OnInit {

  categorias: CategoriaDto[] = []; 
  productos: ProductoDto[] = []; 
  productoForm: FormGroup;
  isEditing: boolean = false;
  currentProductId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      imagenUrl: [''],
      categoriaId: ['', Validators.required],
      estaDestacado: [false],
      tieneDescuento: [false],
      porcentajeDescuento: [0, [Validators.min(0), Validators.max(100)]],
      tieneHappyHour: [false]
    });
  }

  // --- NUEVO: Getter para calcular el precio en vivo en el formulario ---
  get precioFinalCalculado(): number {
    const precio = this.productoForm.get('precio')?.value || 0;
    const tieneDesc = this.productoForm.get('tieneDescuento')?.value;
    const porcentaje = this.productoForm.get('porcentajeDescuento')?.value || 0;

    if (tieneDesc && porcentaje > 0) {
      return precio - (precio * (porcentaje / 100));
    }
    return precio;
  }

  ngOnInit(): void {
    this.loadCategorias();
    this.loadProductos(); 
  }

  loadCategorias(): void {
    this.categoriaService.getMisCategorias().subscribe(data => this.categorias = data);
  }

  loadProductos(): void {
     this.productoService.getMisProductos().subscribe(data => this.productos = data);
  }

  onEdit(prod: ProductoDto): void {
    this.isEditing = true;
    this.currentProductId = prod.id;

    // --- CORRECCIÓN CLAVE: Cargar el precio original si tiene descuento ---
    // Si 'precioOriginal' existe, ese es el precio real de base. 
    // Si no, usamos 'precio' (que es el precio final).
    const precioReal = prod.precioOriginal ? prod.precioOriginal : prod.precio;

    this.productoForm.patchValue({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: precioReal, // Usamos el precio base
      imagenUrl: prod.imagenUrl,
      categoriaId: prod.categoriaId,
      estaDestacado: prod.estaDestacado,
      tieneDescuento: prod.tieneDescuento,
      porcentajeDescuento: prod.porcentajeDescuento,
      tieneHappyHour: prod.tieneHappyHour
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.productoForm.reset({ 
      precio: 0, 
      estaDestacado: false, 
      tieneDescuento: false, 
      porcentajeDescuento: 0, 
      tieneHappyHour: false 
    });
  }

  onSubmit(): void {
    if (this.productoForm.invalid) return;

    if (this.isEditing && this.currentProductId) {
      this.productoService.updateProducto(this.currentProductId, this.productoForm.value)
        .subscribe(() => {
          alert('Producto actualizado con éxito');
          this.cancelEdit();
          this.loadProductos();
        });
    } else {
      this.productoService.createProducto(this.productoForm.value)
        .subscribe(() => {
          alert('Producto creado con éxito');
          this.cancelEdit();
          this.loadProductos();
        });
    }
  }

  onDelete(id: number): void {
    if (confirm('¿Borrar producto?')) {
      this.productoService.deleteProducto(id).subscribe(() => this.loadProductos());
    }
  }

  toggleHappyHour(prod: ProductoDto): void {
    const nuevoEstado = !prod.tieneHappyHour;
    this.productoService.setHappyHour(prod.id, nuevoEstado).subscribe(() => this.loadProductos());
  }

  toggleDescuento(prod: ProductoDto): void {
    if (!prod.tieneDescuento) {
      const input = prompt('Porcentaje:', '10');
      if (input) this.productoService.setDescuento(prod.id, true, +input).subscribe(() => this.loadProductos());
    } else {
      if (confirm('¿Quitar descuento?')) this.productoService.setDescuento(prod.id, false, 0).subscribe(() => this.loadProductos());
    }
  }
}