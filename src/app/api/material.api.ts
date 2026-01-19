import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface RawMaterialResponse {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  unit: string;
  supplierIds: number[];
}

export interface RawMaterialRequest {
  name: string;
  stock: number;
  minStock: number;
  unit: string;
  supplierIds: number[];
}

interface RawMaterial {
  id: number;
  name: string;
  suppliers: Supplier[];
}

interface Supplier {
  id: number;
  name: string;
  contact: string;
  rating: number;
  leadTime: number;
}


@Injectable({providedIn: 'root'})
export class MaterialApi {

  private readonly baseUrl = 'http://localhost:8080/api/raw-materials';

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<RawMaterialResponse[]> {
    return this.http.get<RawMaterialResponse[]>(this.baseUrl);
  }

  getAllMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(this.baseUrl);
  }

  create(payload: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.http.post<RawMaterialResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.http.put<RawMaterialResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
