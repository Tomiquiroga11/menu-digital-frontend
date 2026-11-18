import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { Category } from "../models/category";
import { Restaurant, RestaurantMenu } from "../models/restaurant";

@Injectable({ providedIn: 'root' })
export class RestaurantApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/restaurants`;

    getAll(): Observable<Restaurant[]> {
        return this.http.get<Restaurant[]>(this.baseUrl);
    }

    getMenu(id: number): Observable<RestaurantMenu> {
        return this.http.get<RestaurantMenu>(`${this.baseUrl}/${id}/menu`);
    }

    getCategories(id: number): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.baseUrl}/${id}/categories`);
    }
}