import { Injectable } from '@angular/core'; // <-- ¡ESENCIAL!
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Asegúrate de que la ruta a tu modelo sea correcta
import { ProductoDto } from '../models/menu.model';

@Injectable({
  providedIn: 'root' // <-- ESTO HACE QUE FUNCIONE LA INYECCIÓN
})
export class ProductoService {
  // Asegúrate de que el puerto (5071) sea el de tu backend
  private apiUrl = 'http://localhost:5071/api/productos';

  constructor(private http: HttpClient) { }

  // POST /api/productos
  createProducto(producto: any): Observable<ProductoDto> {
    return this.http.post<ProductoDto>(this.apiUrl, producto);
  }

  // PUT /api/productos/{id}
updateProducto(id: number, producto: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, producto);
}
  // DELETE /api/productos/{id}
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // PATCH /api/productos/{id}/descuento
  setDescuento(id: number, tieneDescuento: boolean, porcentaje: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/descuento`, { 
      tieneDescuento, 
      porcentajeDescuento: porcentaje 
    });
  }

  // PATCH /api/productos/{id}/happyhour
  setHappyHour(id: number, tieneHappyHour: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/happyhour`, { tieneHappyHour });
  }

  // GET /api/productos
getMisProductos(): Observable<ProductoDto[]> {
  return this.http.get<ProductoDto[]>(this.apiUrl);
}
}