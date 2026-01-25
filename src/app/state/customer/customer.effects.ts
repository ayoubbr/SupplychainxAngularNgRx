import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomerApi } from '../../api/customer.api';
import { CustomerActions } from './customer.actions';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { Router } from '@angular/router';
import { selectPagination } from './customer.selectors';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private customerApi = inject(CustomerApi);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // --- LOAD ALL ---
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      mergeMap(({ page, size, sort, search }) =>
        this.customerApi.search(page, size, sort, search).pipe(
          map(response => CustomerActions.loadCustomersSuccess({ response })),
          catchError(error => {
            this.toastService.error('Erreur lors du chargement des clients');
            return of(CustomerActions.loadCustomersFailure({ error: error.message }));
          })
        )
      )
    )
  );

  // --- LOAD ONE ---
  loadCustomerById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomerById),
      mergeMap(({ id }) =>
        this.customerApi.findById(id).pipe(
          map(customer => CustomerActions.loadCustomerByIdSuccess({ customer })),
          catchError(error => {
            this.toastService.error('Impossible de charger le client');
            this.router.navigate(['/delivery/customers']);
            return of(CustomerActions.loadCustomerByIdFailure({ error: error.message }));
          })
        )
      )
    )
  );

  // --- CREATE ---
  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      mergeMap(({ customer }) =>
        this.customerApi.create(customer).pipe(
          map(newCustomer => CustomerActions.createCustomerSuccess({ customer: newCustomer })),
          catchError(error => {
            this.toastService.error(error.error?.message || 'Erreur lors de la création du client');
            return of(CustomerActions.createCustomerFailure({ error: error.message }));
          })
        )
      )
    )
  );

  createCustomerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomerSuccess),
      tap(() => {
        this.toastService.success('Client créé avec succès');
        this.router.navigate(['/delivery/customers']);
      })
    ),
    { dispatch: false }
  );

  // --- UPDATE ---
  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      mergeMap(({ id, customer }) =>
        this.customerApi.update(id, customer).pipe(
          map(updatedCustomer => CustomerActions.updateCustomerSuccess({ customer: updatedCustomer })),
          catchError(error => {
            this.toastService.error(error.error?.message || 'Erreur lors de la modification du client');
            return of(CustomerActions.updateCustomerFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateCustomerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomerSuccess),
      tap(({ customer }) => {
        this.toastService.success('Client modifié avec succès');
        this.router.navigate(['/delivery/customers', customer.id]);
      })
    ),
    { dispatch: false }
  );

  // --- DELETE ---
  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      mergeMap(({ id }) =>
        this.customerApi.delete(id).pipe(
          map(() => CustomerActions.deleteCustomerSuccess({ id })),
          catchError(error => {
            if (error.status === 409) {
              this.toastService.error('Impossible de supprimer: Commandes actives présentes');
            } else {
              this.toastService.error('Erreur lors de la suppression');
            }
            return of(CustomerActions.deleteCustomerFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteCustomerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomerSuccess),
      withLatestFrom(this.store.select(selectPagination)),
      tap(() => {
        this.toastService.success('Client supprimé avec succès');
      }),
      map(([action, pagination]) => CustomerActions.loadCustomers({
        page: pagination.page,
        size: pagination.size,
        sort: pagination.sort,
        search: pagination.search
      }))
    )
  );
}
