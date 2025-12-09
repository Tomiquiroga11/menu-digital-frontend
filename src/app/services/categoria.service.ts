import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaDto } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://localhost:5071/api/menu'; 

  constructor(private http: HttpClient) { }

  getMisCategorias(restauranteId: number): Observable<CategoriaDto[]> {
    return this.http.get<CategoriaDto[]>(`${this.apiUrl}/${restauranteId}/categorias`);
  }

  getCategoriaById(id: number): Observable<CategoriaDto> {
    return this.http.get<CategoriaDto>(`${this.apiUrl}/categorias/${id}`);
  }

  createCategoria(restauranteId: number, dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${restauranteId}/categorias`, dto);
  }

  updateCategoria(restauranteId: number, categoriaId: number, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${restauranteId}/categorias/${categoriaId}`, dto);
  }

  deleteCategoria(restauranteId: number, categoriaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${restauranteId}/categorias/${categoriaId}`);
  }
}