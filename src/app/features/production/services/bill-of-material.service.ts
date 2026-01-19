import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProductionApi, BillOfMaterialRequest, BillOfMaterialResponse } from '../../../api/production.api';

@Injectable({
    providedIn: 'root'
})
export class BillOfMaterialService {

    constructor(private productionApi: ProductionApi) {
    }

    public getAllBOMs(): Observable<BillOfMaterialResponse[]> {
        return this.productionApi.findAllBOMs().pipe(
            catchError(error => throwError(() => error))
        );
    }

    createBOM(payload: BillOfMaterialRequest): Observable<BillOfMaterialResponse> {
        return this.productionApi.createBOM(payload).pipe(
            catchError(error => throwError(() => error))
        );
    }

    updateBOM(id: number, payload: BillOfMaterialRequest): Observable<BillOfMaterialResponse> {
        return this.productionApi.updateBOM(id, payload).pipe(
            catchError(error => throwError(() => error))
        );
    }

    deleteBOM(id: number): Observable<void> {
        return this.productionApi.deleteBOM(id);
    }
}
