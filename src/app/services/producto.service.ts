import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductoDto } from '../models/menu.model';

@Injectable({
  providedIn: 'root' 
})
export class ProductoService {
  private apiUrl = 'http://localhost:5071/api/productos';

  constructor(private http: HttpClient) { }

  createProducto(producto: any): Observable<ProductoDto> {
    return this.http.post<ProductoDto>(this.apiUrl, producto);
  }

updateProducto(id: number, producto: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, producto);
}
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setDescuento(id: number, tieneDescuento: boolean, porcentaje: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/descuento`, { 
      tieneDescuento, 
      porcentajeDescuento: porcentaje 
    });
  }

  setHappyHour(id: number, tieneHappyHour: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/happyhour`, { tieneHappyHour });
  }

getMisProductos(): Observable<ProductoDto[]> {
  return this.http.get<ProductoDto[]>(this.apiUrl);
}
}