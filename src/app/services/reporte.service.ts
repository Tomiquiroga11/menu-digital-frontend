import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteVisitas } from '../models/restaurante.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  
  private apiUrl = 'http://localhost:5071/api/reportes';
  
  constructor(private http: HttpClient) { }

  getReporte(): Observable<ReporteVisitas> {
    return this.http.get<ReporteVisitas>(`${this.apiUrl}/visitas`);
  }
}