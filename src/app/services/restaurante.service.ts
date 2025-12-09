import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RestauranteSimple } from '../models/restaurante.model';
import { MenuCompletoDto } from '../models/menu.model'; 

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {

  private apiUrl = 'http://localhost:5071/api/restaurantes';

  constructor(private http: HttpClient) { }

  getRestaurantes(): Observable<RestauranteSimple[]> {
    return this.http.get<RestauranteSimple[]>(this.apiUrl);
  }

  getMenuPorId(id: number): Observable<MenuCompletoDto> {
    return this.http.get<MenuCompletoDto>(`${this.apiUrl}/${id}/menu`);
  }

 
  updateRestaurante(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  deleteRestaurante(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}