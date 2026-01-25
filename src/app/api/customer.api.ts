import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerResponse, CustomerRequest, PageResponse } from './delivery.models';

@Injectable({ providedIn: 'root' })
export class CustomerApi {
    private readonly baseUrl = 'http://localhost:8080/api/customers';

    constructor(private http: HttpClient) { }

    search(page: number, size: number, sort: string, search: string): Observable<PageResponse<CustomerResponse>> {
        // Backend expects sort='name' and direction='asc/desc'
        // Input 'sort' is likely 'name,asc' or 'name,desc'
        const [sortField, sortDirection] = sort.split(',');

        let params: any = {
            page: page.toString(),
            size: size.toString(),
            sort: sortField || 'name',
            direction: sortDirection || 'asc'
        };

        if (search) {
            params.search = search;
        }

        return this.http.get<PageResponse<CustomerResponse>>(this.baseUrl, { params });
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
