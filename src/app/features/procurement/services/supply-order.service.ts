// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { SupplyOrderApi } from '../../../api/supply-order.api';
// import { SupplyOrderRequest, SupplyOrderResponse } from '../../../api/supply-order.api';
//
// @Injectable({ providedIn: 'root' })
// export class SupplyOrderService {
//
//   constructor(private api: SupplyOrderApi) {}
//
//   getAll(): Observable<SupplyOrderResponse[]> {
//     return this.api.findAll();
//   }
//
//   create(order: SupplyOrderRequest): Observable<SupplyOrderResponse> {
//     return this.api.create(order);
//   }
//
//   receive(id: number, order: SupplyOrderRequest): Observable<SupplyOrderResponse> {
//     return this.api.receive(id, order);
//   }
//
//   delete(id: number): Observable<number> {
//     return this.api.delete(id);
//   }
// }
