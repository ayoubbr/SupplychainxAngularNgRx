import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerState>('customer');

export const selectAllCustomers = createSelector(
    selectCustomerState,
    (state) => state.customers
);

export const selectTotalElements = createSelector(
    selectCustomerState,
    (state) => state.totalElements
);

export const selectPagination = createSelector(
    selectCustomerState,
    (state) => ({
        page: state.page,
        size: state.size,
        sort: state.sort,
        search: state.search,
        totalPages: state.totalPages,
        totalElements: state.totalElements
    })
);

export const selectSelectedCustomer = createSelector(
    selectCustomerState,
    (state) => state.selectedCustomer
);

export const selectLoadingList = createSelector(
    selectCustomerState,
    (state) => state.loadingList
);

export const selectLoadingDetail = createSelector(
    selectCustomerState,
    (state) => state.loadingDetail
);

export const selectLoadingOperation = createSelector(
    selectCustomerState,
    (state) => state.loadingCreate || state.loadingUpdate || state.loadingDelete
);

export const selectError = createSelector(
    selectCustomerState,
    (state) => state.error
);

export const selectLastOperation = createSelector(
    selectCustomerState,
    (state) => state.lastOperation
);
