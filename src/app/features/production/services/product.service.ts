import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProductionApi, ProductRequest, ProductResponse } from '../../../api/production.api';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private productionApi: ProductionApi) {
    }

    public getAllProducts(): Observable<ProductResponse[]> {
        return this.productionApi.findAllProducts().pipe(
            catchError(error => throwError(() => error))
        );
    }

    createProduct(payload: ProductRequest): Observable<ProductResponse> {
        return this.productionApi.createProduct(payload).pipe(
            catchError(error => throwError(() => error))
        );
    }

    updateProduct(id: number, payload: ProductRequest): Observable<ProductResponse> {
        return this.productionApi.updateProduct(id, payload).pipe(
            catchError(error => throwError(() => error))
        );
    }

    deleteProduct(id: number): Observable<void> {
        return this.productionApi.deleteProduct(id);
    }
}
