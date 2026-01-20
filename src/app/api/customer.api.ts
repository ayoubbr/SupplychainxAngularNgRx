import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerResponse, CustomerRequest } from './delivery.models';

@Injectable({ providedIn: 'root' })
export class CustomerApi {
    private readonly baseUrl = 'http://localhost:8080/api/customers';

    constructor(private http: HttpClient) { }

    findAll(): Observable<CustomerResponse[]> {
        return this.http.get<CustomerResponse[]>(this.baseUrl);
    }

    findById(id: number): Observable<CustomerResponse> {
        return this.http.get<CustomerResponse>(`${this.baseUrl}/${id}`);
    }

    findByName(name: string): Observable<CustomerResponse[]> {
        return this.http.get<CustomerResponse[]>(`${this.baseUrl}/name/${name}`);
    }

    create(request: CustomerRequest): Observable<CustomerResponse> {
        return this.http.post<CustomerResponse>(this.baseUrl, request);
    }

    update(id: number, request: CustomerRequest): Observable<CustomerResponse> {
        return this.http.put<CustomerResponse>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
