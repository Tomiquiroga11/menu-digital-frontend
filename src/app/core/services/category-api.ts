import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category, CategoryRequest } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/categories`;

    create(request: CategoryRequest): Observable<Category> {
        return this.http.post<Category>(this.baseUrl, request);
    }

    update(id: number, request: CategoryRequest): Observable<Category> {
        return this.http.put<Category>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}