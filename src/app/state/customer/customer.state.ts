import { CustomerResponse } from '../../api/delivery.models';

export interface CustomerState {
    customers: CustomerResponse[];
    selectedCustomer: CustomerResponse | null;
    totalElements: number;
    totalPages: number;

    // Search/Pagination Params
    page: number;
    size: number;
    sort: string;
    search: string;

    // Loading States
    loadingList: boolean;
    loadingDetail: boolean;
    loadingCreate: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    // Error/Status
    error: any | null;
    lastOperation: 'CREATE' | 'UPDATE' | 'DELETE' | null;
}

export const initialCustomerState: CustomerState = {
    customers: [],
    selectedCustomer: null,
    totalElements: 0,
    totalPages: 0,

    page: 0,
    size: 10,
    sort: 'name,asc',
    search: '',

    loadingList: false,
    loadingDetail: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,

    error: null,
    lastOperation: null
};
