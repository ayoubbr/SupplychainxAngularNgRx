import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderApi } from '../../../api/order.api';
import { CustomerApi } from '../../../api/customer.api';
import { ProductionApi, ProductResponse } from '../../../api/production.api';
import { Order, OrderRequest, Customer } from '../../../api/delivery.models';
import { ToastService } from '../../../shared/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-orders',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
    showForm = false;
    isEditMode = false;

    orders = signal<Order[]>([]);
    customers = signal<Customer[]>([]);
    products = signal<ProductResponse[]>([]);

    selectedOrder = signal<Order | null>(null);
    error = signal<string | null>(null);

    orderForm;

    constructor(
        private orderService: OrderApi,
        private customerService: CustomerApi,
        private productionService: ProductionApi,
        private toastService: ToastService,
        private fb: FormBuilder
    ) {
        this.orderForm = this.fb.nonNullable.group({
            customerId: [0, [Validators.required, Validators.min(1)]],
            productId: [0, [Validators.required, Validators.min(1)]],
            quantity: [1, [Validators.required, Validators.min(1)]],
            status: ['EN_PREPARATION']
        });
    }

    ngOnInit(): void {
        this.loadOrders();
        this.loadCustomers();
        this.loadProducts();
    }

    loadOrders() {
        this.orderService.findAll().subscribe({
            next: data => this.orders.set(data),
            error: () => this.toastService.error('Failed to load orders')
        });
    }

    loadCustomers() {
        this.customerService.findAll().subscribe({
            next: data => this.customers.set(data),
            error: () => this.toastService.error('Failed to load customers')
        });
    }

    loadProducts() {
        this.productionService.findAllProducts().subscribe({
            next: data => this.products.set(data),
            error: () => this.toastService.error('Failed to load products')
        });
    }

    createOrder() {
        this.isEditMode = false;
        this.selectedOrder.set(null);
        this.orderForm.reset({
            customerId: 0,
            productId: 0,
            quantity: 1,
            status: 'EN_PREPARATION'
        });
        // Disable status in create mode as it defaults to EN_PREPARATION
        this.orderForm.controls.status.disable();
        this.showForm = true;
    }

    editOrder(order: Order) {
        this.isEditMode = true;
        this.selectedOrder.set(order);
        this.showForm = true;

        this.orderForm.controls.status.enable();

        this.orderForm.patchValue({
            customerId: order.customer.id,
            productId: order.product.id,
            quantity: order.quantity,
            status: order.status
        });
    }

    submitOrder() {
        if (this.orderForm.invalid) return;

        const formValue = this.orderForm.getRawValue();

        const payload: OrderRequest = {
            customerId: Number(formValue.customerId),
            productId: Number(formValue.productId),
            quantity: Number(formValue.quantity),
            status: formValue.status || 'EN_PREPARATION'
        };

        if (this.isEditMode && this.selectedOrder()) {
            this.orderService
                .update(this.selectedOrder()!.id, payload)
                .subscribe({
                    next: () => {
                        this.closeForm();
                        this.loadOrders();
                        this.toastService.success('Order updated successfully');
                    },
                    error: (err) => this.toastService.error('Failed to update order: ' + (err.error?.message || ''))
                });
            return;
        }

        this.orderService.create(payload).subscribe({
            next: () => {
                this.closeForm();
                this.loadOrders();
                // Refresh products to update stock if needed, though backend handles it
                this.loadProducts();
                this.toastService.success('Order created successfully');
            },
            error: (err) => this.toastService.error('Failed to create order: ' + (err.error?.message || ''))
        });
    }

    cancelOrder(id: number) {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        this.orderService.cancel(id).subscribe({
            next: () => {
                this.loadOrders();
                this.toastService.success('Order cancelled successfully');
            },
            error: (err) => this.toastService.error('Failed to cancel order: ' + (err.error?.message || ''))
        });
    }

    closeForm() {
        this.showForm = false;
        this.orderForm.reset();
    }
}
