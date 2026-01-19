import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProductionOrderApi, ProductionOrderRequest, ProductionOrderResponse } from '../../../api/production-order.api';

@Injectable({
    providedIn: 'root'
})
export class ProductionOrderService {

    constructor(private api: ProductionOrderApi) {
    }

    public getAll(): Observable<ProductionOrderResponse[]> {
        return this.api.getAll().pipe(
            catchError(error => throwError(() => error))
        );
    }

    public getById(id: number): Observable<ProductionOrderResponse> {
        return this.api.getById(id).pipe(
            catchError(error => throwError(() => error))
        );
    }

    create(payload: ProductionOrderRequest): Observable<ProductionOrderResponse> {
        return this.api.create(payload).pipe(
            catchError(error => throwError(() => error))
        );
    }

    update(id: number, payload: ProductionOrderRequest): Observable<ProductionOrderResponse> {
        return this.api.update(id, payload).pipe(
            catchError(error => throwError(() => error))
        );
    }

    delete(id: number): Observable<void> {
        return this.api.delete(id);
    }

    cancel(id: number): Observable<void> {
        return this.api.cancel(id).pipe(
            catchError(error => throwError(() => error))
        );
    }
}
