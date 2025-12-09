import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { ReporteService } from '../../services/reporte.service'; 
import { RestauranteService } from '../../services/restaurante.service'; 
import { ProductoDto, ProductoDescuentoDto, ProductoHappyHourDto } from '../../models/menu.model';
import { ReporteVisitas } from '../../models/restaurante.model';

@Component({
  selector: 'app-manage-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './manage.productos.component.html',
  styleUrl: './manage.productos.component.scss'
})
export class ManageProductosComponent implements OnInit {

  productos: ProductoDto[] = [];
  cargando: boolean = true;
  idRestaurante: number = 0;

  mostrarConfigHH: boolean = false;
  hhInicio: number = 17; 
  hhFin: number = 23;
  
  datosRestauranteFull: ReporteVisitas | null = null; 

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private reporteService: ReporteService,
    private restauranteService: RestauranteService
  ) { }

  ngOnInit(): void {
    const idStr = this.authService.getRestauranteId();
    if (idStr) {
      this.idRestaurante = +idStr;
      this.cargarProductos();
      this.cargarConfiguracionRestaurante(); 
    }
  }

  cargarProductos() {
    this.cargando = true;
    this.menuService.getMisProductos(this.idRestaurante).subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.cargando = false;
      }
    });
  }

  cargarConfiguracionRestaurante() {
    this.reporteService.getReporte().subscribe({
        next: (data) => {
            this.datosRestauranteFull = data;
            if (data.happyHourInicio !== undefined) this.hhInicio = data.happyHourInicio;
            if (data.happyHourFin !== undefined) this.hhFin = data.happyHourFin;
        },
        error: (err) => console.error('Error cargando config', err)
    });
  }

  guardarHappyHour() {
    const inicio = Number(this.hhInicio);
    const fin = Number(this.hhFin);

    if (isNaN(inicio) || isNaN(fin)) {
        alert("Por favor ingresa números válidos.");
        return;
    }

    if (inicio < 0 || inicio > 23 || fin < 0 || fin > 23) {
        alert("Por favor ingresa horas válidas entre 0 y 23.");
        return;
    }

    this.menuService.updateHappyHourHorario(this.idRestaurante, inicio, fin)
      .subscribe({
        next: () => {
            alert('¡Horario Happy Hour actualizado con éxito! 🍹');
            this.mostrarConfigHH = false;
            this.cargarConfiguracionRestaurante();
            this.cargarProductos(); 
        },
        error: (err) => {
            console.error('Error detallado:', err);
            alert('Error al guardar el horario. Verifica que el servidor esté funcionando.');
        }
    });
  }
  
  onDelete(id: number) {
    if(confirm('¿Seguro que deseas eliminar este producto?')) {
      this.menuService.deleteProducto(this.idRestaurante, id).subscribe(() => this.cargarProductos());
    }
  }

  toggleDescuento(producto: ProductoDto, event: any) {
    const isChecked = event.target.checked;
    producto.tieneDescuento = isChecked;
    
    if (isChecked && (!producto.porcentajeDescuento || producto.porcentajeDescuento === 0)) {
        producto.porcentajeDescuento = 10; 
    }

    const dto: ProductoDescuentoDto = {
      tieneDescuento: isChecked,
      porcentajeDescuento: producto.porcentajeDescuento
    };
    this.menuService.setDescuento(this.idRestaurante, producto.id, dto).subscribe();
  }

  updatePorcentaje(producto: ProductoDto, valorInput: string) {
    let val = Number(valorInput);
    
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    
    producto.porcentajeDescuento = val;
    
    if (val > 0) producto.tieneDescuento = true;
    else if (val === 0) producto.tieneDescuento = false;

    const dto: ProductoDescuentoDto = {
       tieneDescuento: producto.tieneDescuento,
       porcentajeDescuento: val
    };
    this.menuService.setDescuento(this.idRestaurante, producto.id, dto).subscribe();
  }

  toggleHappyHour(producto: ProductoDto, event: any) {
    const checked = event.target.checked;
    const dto: ProductoHappyHourDto = { tieneHappyHour: checked };
    this.menuService.setHappyHour(this.idRestaurante, producto.id, dto).subscribe();
  }
}