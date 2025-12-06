import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Asegúrate de que esta ruta a tu modelo sea correcta
import { CategoriaDto } from '../models/menu.model'; 

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:5071/api/categorias';

  // Inyecta HttpClient
  constructor(private http: HttpClient) { }

  /**
   * Llama a GET /api/categorias
   * (Requiere token, pero el Interceptor se lo pone)
   */
  getMisCategorias(): Observable<CategoriaDto[]> {
    return this.http.get<CategoriaDto[]>(this.apiUrl);
  }

  /**
   * Llama a POST /api/categorias
   */
  createCategoria(nombre: string): Observable<CategoriaDto> {
    // El DTO del backend es { "nombre": "..." }
    return this.http.post<CategoriaDto>(this.apiUrl, { nombre });
  }

  /**
   * Llama a DELETE /api/categorias/{id}
   */
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Llama a PUT /api/categorias/{id}
   */
  updateCategoria(id: number, nombre: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { nombre });
  }
}