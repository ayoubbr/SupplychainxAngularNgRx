import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CustomerApi} from '../../api/customer.api';
import {CustomerActions} from './customer.actions';
import {catchError, map, of, switchMap} from 'rxjs';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private customerApi = inject(CustomerApi);

  loadCustomers$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.loadAll),
    switchMap(() => this.customerApi.findAll().pipe(
      map(customers => CustomerActions.loadAllSuccess({customers})),
      catchError((error) => of(CustomerActions.loadAllFailure({error: error.message})),)
    ))
  ));

  addCustomer$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.addCustomer),
    switchMap(({customer}) => this.customerApi.create(customer).pipe(
      map(newCust => CustomerActions.addCustomerSuccess({customer: newCust})),
      catchError((error) => of(CustomerActions.addCustomerFailure({error: error.message})))
    ))
  ));

  deleteCustomer$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.deleteCustomer),
    switchMap(({id}) => this.customerApi.delete(id).pipe(
      map(() => CustomerActions.deleteCustomerSuccess({id})),
    ))
  ))
}
