import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { Account, UpdateAccountRequest } from "../models/account";

@Injectable({ providedIn: 'root'})
export class AccountApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/account`;

    get(): Observable<Account> {
        return this.http.get<Account>(this.baseUrl);
    }

    update(request: UpdateAccountRequest): Observable<Account> {
        return this.http.put<Account>(this.baseUrl, request);
    }

    delete(): Observable<void> {
        return this.http.delete<void>(this.baseUrl);
    }
}