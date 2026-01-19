import {Injectable} from '@angular/core';
import {SupplierResponse, SupplierApi, SupplierRequest} from '../../../api/supplier.api';
import {catchError, Observable, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private supplierApi: SupplierApi) {
  }

  getAllSuppliers(): Observable<SupplierResponse[]> {
    return this.supplierApi.findAll().pipe(
      catchError(error => throwError(() => error))
    );
  }

  createSupplier(payload: SupplierRequest): Observable<SupplierResponse> {
    return this.supplierApi.create(payload).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateSupplier(id: number, payload: SupplierRequest): Observable<SupplierResponse> {
    return this.supplierApi.update(id, payload).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteSupplier(id: number): Observable<void> {
    return this.supplierApi.delete(id).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
