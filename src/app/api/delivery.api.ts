import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, DeliveryRequest } from './delivery.models';

@Injectable({ providedIn: 'root' })
export class DeliveryApi {
    private readonly baseUrl = 'http://localhost:8080/api/deliveries';

    constructor(private http: HttpClient) { }

    create(request: DeliveryRequest): Observable<Delivery> {
        return this.http.post<Delivery>(this.baseUrl, request);
    }

    // Assuming GET endpoint might exist or will be added, as CRUD was requested
    findAll(): Observable<Delivery[]> {
        return this.http.get<Delivery[]>(this.baseUrl);
    }
}
