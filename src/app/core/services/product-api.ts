import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product, ProductRequest } from '../models/product';


@Injectable({ providedIn: 'root'})
export class ProductApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/products`;

    create(request: ProductRequest): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, request);
    }

    update(id: number, request: ProductRequest): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/${id}`, request);
    }

    updateDiscount(id: number, discountPercentage: number): Observable<Product> {
        return this.http.patch<Product>(`${this.baseUrl}/${id}/discount`, { discountPercentage });
    }

    updateHappyHour(id: number, isHappyHour: boolean): Observable<Product> {
        return this.http.patch<Product>(`${this.baseUrl}/${id}/happy-hour`, { isHappyHour });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}