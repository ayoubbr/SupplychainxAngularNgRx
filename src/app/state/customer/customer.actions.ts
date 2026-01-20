import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {CustomerResponse, CustomerRequest} from '../../api/delivery.models';

export const CustomerActions = createActionGroup({
  source: 'Customer API',
  events: {
    // LOAD ALL
    'Load All': emptyProps(),
    'Load All Success': props<{ customers: CustomerResponse[] }>(),
    'Load All Failure': props<{ error: string }>(),
    // CREATE
    'Add Customer': props<{ customer: CustomerRequest }>(),
    'Add Customer Success': props<{ customer: CustomerResponse }>(),
    'Add Customer Failure': props<{ error: string }>(),
    // UPDATE
    'Update Customer': props<{ id: number, customer: CustomerRequest }>(),
    'Update Customer Success': props<{ customer: CustomerResponse }>(),
    // DELETE
    'Delete Customer': props<{ id: number }>(),
    'Delete Customer Success': props<{ id: number }>(),
  }
});
