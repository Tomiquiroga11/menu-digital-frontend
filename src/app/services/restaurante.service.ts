import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Asegúrate de que tus modelos estén en estas rutas
import { RestauranteSimple } from '../models/restaurante.model';
import { MenuCompletoDto } from '../models/menu.model'; 

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {

  // Asegúrate de que este puerto (5071) coincida con tu backend
  private apiUrl = 'http://localhost:5071/api/restaurantes';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista pública de todos los restaurantes.
   */
  getRestaurantes(): Observable<RestauranteSimple[]> {
    return this.http.get<RestauranteSimple[]>(this.apiUrl);
  }

  /**
   * Obtiene el menú público de un restaurante específico.
   */
  getMenuPorId(id: number): Observable<MenuCompletoDto> {
    return this.http.get<MenuCompletoDto>(`${this.apiUrl}/${id}/menu`);
  }
}