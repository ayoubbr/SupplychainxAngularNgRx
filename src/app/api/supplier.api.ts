import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface SupplierResponse {
  id: number;
  name: string;
  contact: string;
  rating: number;
  leadTime: number;
}

export interface SupplierRequest {
  name: string;
  contact: string;
  rating: number;
  leadTime: number;
}

@Injectable({providedIn: 'root'})
export class SupplierApi {

  private readonly baseUrl = 'http://localhost:8080/api/suppliers';

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<SupplierResponse[]> {
    return this.http.get<SupplierResponse[]>(this.baseUrl);
  }

  create(payload: SupplierRequest): Observable<SupplierResponse> {
    return this.http.post<SupplierResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: SupplierRequest): Observable<SupplierResponse> {
    return this.http.put<SupplierResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
