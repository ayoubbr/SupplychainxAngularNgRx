import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {MaterialApi, RawMaterialRequest, RawMaterialResponse} from '../../../api/material.api';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {

  constructor(private materialApi: MaterialApi) {
  }

  public getAllRawMetrials(): Observable<RawMaterialResponse[]> {
    return this.materialApi.findAll().pipe(
      catchError(error => throwError(() => error))
    );
  }

  createRawMaterial(payload: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.materialApi.create(payload).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateRawMaterial(id: number, payload: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.materialApi.update(id, payload).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteRawMaterial(id: number): Observable<void> {
    return this.materialApi.delete(id);
  }
}
