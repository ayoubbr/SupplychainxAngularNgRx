import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerRequest } from './delivery.models';

@Injectable({ providedIn: 'root' })
export class CustomerApi {
    private readonly baseUrl = 'http://localhost:8080/api/customers';

    constructor(private http: HttpClient) { }

    findAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.baseUrl);
    }

    findById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.baseUrl}/${id}`);
    }

    findByName(name: string): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.baseUrl}/name/${name}`);
    }

    create(request: CustomerRequest): Observable<Customer> {
        return this.http.post<Customer>(this.baseUrl, request);
    }

    update(id: number, request: CustomerRequest): Observable<Customer> {
        return this.http.put<Customer>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
