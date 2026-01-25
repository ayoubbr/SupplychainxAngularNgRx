import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CustomerResponse, CustomerRequest, PageResponse } from '../../api/delivery.models';

export const CustomerActions = createActionGroup({
  source: 'Customer API',
  events: {
    // --- LOAD ALL (Search/Pagination) ---
    'Load Customers': props<{ page: number; size: number; sort: string; search: string }>(),
    'Load Customers Success': props<{ response: PageResponse<CustomerResponse> }>(),
    'Load Customers Failure': props<{ error: any }>(),

    // --- LOAD ONE (Detail) ---
    'Load Customer By Id': props<{ id: number }>(),
    'Load Customer By Id Success': props<{ customer: CustomerResponse }>(),
    'Load Customer By Id Failure': props<{ error: any }>(),

    // --- CREATE ---
    'Create Customer': props<{ customer: CustomerRequest }>(),
    'Create Customer Success': props<{ customer: CustomerResponse }>(),
    'Create Customer Failure': props<{ error: any }>(),

    // --- UPDATE ---
    'Update Customer': props<{ id: number; customer: CustomerRequest }>(),
    'Update Customer Success': props<{ customer: CustomerResponse }>(),
    'Update Customer Failure': props<{ error: any }>(),

    // --- DELETE ---
    'Delete Customer': props<{ id: number }>(),
    'Delete Customer Success': props<{ id: number }>(),
    'Delete Customer Failure': props<{ error: any }>(),

    // --- SELECTION ---
    'Select Customer': props<{ id: number }>(),
    'Clear Selected Customer': emptyProps(),

    // --- UTILS ---
    'Set Search Params': props<{ page?: number; size?: number; sort?: string; search?: string }>(),
    'Clear Error': emptyProps()
  }
});
