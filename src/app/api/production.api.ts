import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BillOfMaterialResponse {
    billOfMaterialId: number;
    productName: string;
    productStock: number;
    rawMaterialName: string;
    rawMaterialStock: number;
    quantityPerProduct: number;
}

export interface BillOfMaterialRequest {
    productId: number;
    rawMaterialId: number;
    quantityPerProduct: number;
}

export interface ProductResponse {
    id: number;
    name: string;
    cost: number;
    productionTime: number;
    stock: number;
    billOfMaterials: BillOfMaterialResponseDTO[];
}

export interface ProductRequest {
    name: string;
    cost: number;
    productionTime: number;
    stock: number;
}

export interface BillOfMaterialResponseDTO {
    id: number;
    rawMaterialId: number;
    rawMaterialName: string;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ProductionApi {

    private readonly baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) {
    }

    // --- PRODUCTS ---

    findAllProducts(): Observable<ProductResponse[]> {
        return this.http.get<ProductResponse[]>(`${this.baseUrl}/products`);
    }

    createProduct(payload: ProductRequest): Observable<ProductResponse> {
        return this.http.post<ProductResponse>(`${this.baseUrl}/products`, payload);
    }

    updateProduct(id: number, payload: ProductRequest): Observable<ProductResponse> {
        return this.http.put<ProductResponse>(`${this.baseUrl}/products/${id}`, payload);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
    }

    // --- BILL OF MATERIALS ---

    findAllBOMs(): Observable<BillOfMaterialResponse[]> {
        return this.http.get<BillOfMaterialResponse[]>(`${this.baseUrl}/bill-of-materials`);
    }

    createBOM(payload: BillOfMaterialRequest): Observable<BillOfMaterialResponse> {
        return this.http.post<BillOfMaterialResponse>(`${this.baseUrl}/bill-of-materials`, payload);
    }

    updateBOM(id: number, payload: BillOfMaterialRequest): Observable<BillOfMaterialResponse> {
        return this.http.put<BillOfMaterialResponse>(`${this.baseUrl}/bill-of-materials/${id}`, payload);
    }

    deleteBOM(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/bill-of-materials/${id}`);
    }
}
