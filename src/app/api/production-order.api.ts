import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductionOrderResponse {
    id: number;
    status: string;
    quantity: number;
    startDate: string; // LocalDate as string
    endDate: string;   // LocalDate as string
    productionEstimatedTime: number;

    productId: number;
    productName: string;
    productCost: number;

    billOfMaterials: BillOfMaterialResponse[];
}

export interface BillOfMaterialResponse {
    rawMaterialId: number;
    rawMaterialName: string;
    quantityPerUnit: number;
    totalQuantityNeeded: number;
    currentStock: number;
}

export interface ProductionOrderRequest {
    productId: number;
    quantity: number;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    status?: string;
}

export enum ProductionOrderStatus {
    EN_ATTENTE = 'EN_ATTENTE',
    EN_PRODUCTION = 'EN_PRODUCTION',
    TERMINE = 'TERMINE',
    BLOQUE = 'BLOQUE'
}

@Injectable({ providedIn: 'root' })
export class ProductionOrderApi {

    private readonly baseUrl = 'http://localhost:8080/api/production-orders';

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<ProductionOrderResponse[]> {
        return this.http.get<ProductionOrderResponse[]>(this.baseUrl);
    }

    getById(id: number): Observable<ProductionOrderResponse> {
        return this.http.get<ProductionOrderResponse>(`${this.baseUrl}/${id}`);
    }

    create(payload: ProductionOrderRequest): Observable<ProductionOrderResponse> {
        return this.http.post<ProductionOrderResponse>(this.baseUrl, payload);
    }

    update(id: number, payload: ProductionOrderRequest): Observable<ProductionOrderResponse> {
        return this.http.put<ProductionOrderResponse>(`${this.baseUrl}/${id}`, payload);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    cancel(id: number): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/cancel/${id}`, {});
    }
}
