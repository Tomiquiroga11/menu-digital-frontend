import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteVisitas } from '../models/restaurante.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  // URL de tu API (verifica el puerto)
  private apiUrl = 'http://localhost:5071/api/reportes';
  private cuentaUrl = 'http://localhost:5071/api/cuenta';
  constructor(private http: HttpClient) { }

  /**
   * Obtiene el reporte de visitas del restaurante logueado.
   * GET /api/reportes/visitas
   */
  getVisitas(): Observable<ReporteVisitas> {
    return this.http.get<ReporteVisitas>(`${this.apiUrl}/visitas`);
  }

  updateCuenta(datos: any): Observable<any> {
    return this.http.put(this.cuentaUrl, datos);
  }

  // DELETE /api/cuenta (Borrar cuenta)
  deleteCuenta(): Observable<any> {
    return this.http.delete(this.cuentaUrl);
  }
}