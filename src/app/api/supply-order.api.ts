import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SupplyOrder} from './supply-order.model';
import {RawMaterial} from '../features/procurement/components/supply-orders/supply-orders.component';

export interface SupplierWithMaterials {
  id: number;
  name: string;
  contact: string;
  rating: number;
  leadTime: number;
  rawMaterials: RawMaterial[];
}

@Injectable({providedIn: 'root'})
export class SupplyOrderApi {

  private readonly baseUrl = 'http://localhost:8080/api/supply-orders';

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<SupplyOrder[]> {
    return this.http.get<SupplyOrder[]>(this.baseUrl);
  }

  create(payload: any): Observable<SupplyOrder> {
    return this.http.post<SupplyOrder>(this.baseUrl, payload);
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${this.baseUrl}/${id}`);
  }

  markAsReceived(id: number): Observable<SupplyOrder> {
    return this.http.put<SupplyOrder>(`${this.baseUrl}/${id}`, {});
  }

  getSuppliersWithMaterials(): Observable<SupplierWithMaterials[]> {
    return this.http.get<SupplierWithMaterials[]>('http://localhost:8080/api/suppliers/with-materials');
  }
}
