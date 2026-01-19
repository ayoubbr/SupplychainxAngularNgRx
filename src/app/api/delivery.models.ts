export interface Customer {
    id: number;
    name: string;
    address: string;
    city: string;
}

export interface CustomerRequest {
    name: string;
    address: string;
    city: string;
}

export interface ProductResponse {
    id: number;
    name: string;
    cost: number;
    productionTime: number;
    stock: number;
}

export interface Order {
    id: number;
    quantity: number;
    productTotalPrice: number;
    status: 'EN_PREPARATION' | 'EN_ROUTE' | 'LIVREE' | 'ANNULEE';
    customer: Customer;
    product: ProductResponse;
}

export interface OrderRequest {
    customerId: number;
    productId: number;
    quantity: number;
    status?: string;
}

export interface Delivery {
    id: number;
    orderId: number;
    totalCost: number;
    deliveryDate: string;
    status: 'PLANIFIEE' | 'EN_COURS' | 'LIVREE';
    vehicle: string;
    driver: string;
}

export interface DeliveryRequest {
    orderId: number;
    distanceKm: number;
    costPerKm: number;
    vehicle: string;
    driver: string;
    deliveryDate: string;
}
