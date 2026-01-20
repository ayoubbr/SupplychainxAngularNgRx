import {CustomerResponse} from '../../api/delivery.models';
import {createFeature, createReducer, on} from '@ngrx/store';
import {CustomerActions} from './customer.actions';

interface CustomerState {
  customers: CustomerResponse[],
  loading: boolean,
  error: string | null,
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
}

export const customerFeature = createFeature({
  name: 'customer',
  reducer: createReducer(
    initialState,
    // handle loading
    on(CustomerActions.loadAll, (state) => (
      {
        ...state,
        loading: true
      })),
    on(CustomerActions.loadAllSuccess, (state, {customers}) => ({
      ...state,
      customers,
      loading: false
    })),
    // handle Add
    on(CustomerActions.addCustomerSuccess, (state, {customer}) => ({
      ...state,
      customers: [...state.customers, customer]
    })),
    // handle Update
    on(CustomerActions.updateCustomerSuccess, (state, {customer}) => ({
      ...state,
      customers: state.customers.map(c => c.id === customer.id ? customer : c)
    })),
    // handle Delete
    on(CustomerActions.deleteCustomerSuccess, (state, {id}) => ({
      ...state,
      customers: state.customers.filter(c => c.id !== id)
    }))
  )
});


