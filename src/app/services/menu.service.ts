import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ProductoDto, 
  ProductoCreateDto, 
  ProductoUpdateDto, 
  ProductoDescuentoDto, 
  ProductoHappyHourDto 
} from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'http://localhost:5071/api/menu';

  constructor(private http: HttpClient) { }

  getMisProductos(restauranteId: number): Observable<ProductoDto[]> {
    return this.http.get<ProductoDto[]>(`${this.apiUrl}/${restauranteId}/mis-productos`);
  }

  getProductoById(restauranteId: number, productoId: number): Observable<ProductoDto> {
    return this.http.get<ProductoDto>(`${this.apiUrl}/${restauranteId}/productos/${productoId}`);
  }

  createProducto(restauranteId: number, dto: ProductoCreateDto): Observable<ProductoDto> {
    return this.http.post<ProductoDto>(`${this.apiUrl}/${restauranteId}/productos`, dto);
  }

  updateProducto(restauranteId: number, productoId: number, dto: ProductoUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${restauranteId}/productos/${productoId}`, dto);
  }

  deleteProducto(restauranteId: number, productoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${restauranteId}/productos/${productoId}`);
  }

  setDescuento(restauranteId: number, productoId: number, dto: ProductoDescuentoDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${restauranteId}/productos/${productoId}/descuento`, dto);
  }

  setHappyHour(restauranteId: number, productoId: number, dto: ProductoHappyHourDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${restauranteId}/productos/${productoId}/happy-hour`, dto);
  }

updateHappyHourHorario(restauranteId: number, inicio: number, fin: number): Observable<any> {
  const body = { inicio, fin };
  return this.http.patch(`${this.apiUrl}/${restauranteId}/happy-hour-settings`, body);
}
}