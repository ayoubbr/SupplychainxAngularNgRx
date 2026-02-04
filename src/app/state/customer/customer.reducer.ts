import { createFeature, createReducer, on } from '@ngrx/store';
import { CustomerActions } from './customer.actions';
import { initialCustomerState } from './customer.state';

export const customerReducer = createReducer(
  initialCustomerState,

  // --- SEARCH PARAMS ---
  on(CustomerActions.setSearchParams, (state, { page, size, sort, search }) => ({
    ...state,
    page: page ?? state.page,
    size: size ?? state.size,
    sort: sort ?? state.sort,
    search: search ?? state.search
  })),

  // --- LOAD ALL ---
  on(CustomerActions.loadCustomers, (state, { page, size, sort, search }) => ({
    ...state,
    loadingList: true,
    error: null,
    page: page,
    size: size,
    sort: sort,
    search: search
  })),
  on(CustomerActions.loadCustomersSuccess, (state, { response }) => ({
    ...state,
    loadingList: false,
    customers: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    page: response.page // Sync page from server
  })),
  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loadingList: false,
    error: error
  })),

  // --- LOAD ONE ---
  on(CustomerActions.loadCustomerById, (state) => ({
    ...state,
    loadingDetail: true,
    error: null
  })),
  on(CustomerActions.loadCustomerByIdSuccess, (state, { customer }) => ({
    ...state,
    loadingDetail: false,
    selectedCustomer: customer
  })),
  on(CustomerActions.loadCustomerByIdFailure, (state, { error }) => ({
    ...state,
    loadingDetail: false,
    error: error
  })),

  // --- CREATE ---
  on(CustomerActions.createCustomer, (state) => ({
    ...state,
    loadingCreate: true,
    error: null,
    lastOperation: null
  })),
  on(CustomerActions.createCustomerSuccess, (state) => ({
    ...state,
    loadingCreate: false,
    lastOperation: 'CREATE' as const
  })),
  on(CustomerActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    loadingCreate: false,
    error: error
  })),

  // --- UPDATE ---
  on(CustomerActions.updateCustomer, (state) => ({
    ...state,
    loadingUpdate: true,
    error: null,
    lastOperation: null
  })),
  on(CustomerActions.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    loadingUpdate: false,
    lastOperation: 'UPDATE' as const,
    selectedCustomer: customer // Update the selected one if we are viewing it
  })),
  on(CustomerActions.updateCustomerFailure, (state, { error }) => ({
    ...state,
    loadingUpdate: false,
    error: error
  })),

  // --- DELETE ---
  on(CustomerActions.deleteCustomer, (state) => ({
    ...state,
    loadingDelete: true,
    error: null,
    lastOperation: null
  })),
  on(CustomerActions.deleteCustomerSuccess, (state) => ({
    ...state,
    loadingDelete: false,
    lastOperation: 'DELETE' as const
  })),
  on(CustomerActions.deleteCustomerFailure, (state, { error }) => ({
    ...state,
    loadingDelete: false,
    error: error
  })),

  // --- SELECTION ---
  on(CustomerActions.selectCustomer, (state, { id }) => ({
    ...state,
    selectedCustomer: state.customers.find(c => c.id === id) || null
  })),
  on(CustomerActions.clearSelectedCustomer, (state) => ({
    ...state,
    selectedCustomer: null
  })),

  // --- UTILS ---
  on(CustomerActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);

export const customerFeature = createFeature({
  name: 'customer',
  reducer: customerReducer
});
