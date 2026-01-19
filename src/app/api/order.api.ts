import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from './delivery.models';

@Injectable({ providedIn: 'root' })
export class OrderApi {
    private readonly baseUrl = 'http://localhost:8080/api/orders';

    constructor(private http: HttpClient) { }

    findAll(): Observable<Order[]> {
        return this.http.get<Order[]>(this.baseUrl);
    }

    findById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.baseUrl}/${id}`);
    }

    create(request: OrderRequest): Observable<Order> {
        return this.http.post<Order>(this.baseUrl, request);
    }

    update(id: number, request: OrderRequest): Observable<Order> {
        return this.http.put<Order>(`${this.baseUrl}/${id}`, request);
    }

    cancel(id: number): Observable<Order> {
        return this.http.put<Order>(`${this.baseUrl}/cancel/${id}`, {});
    }
}
