import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryApi } from '../../../api/delivery.api';
import { OrderApi } from '../../../api/order.api';
import { Delivery, DeliveryRequest, Order } from '../../../api/delivery.models';
import { ToastService } from '../../../shared/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-deliveries',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './deliveries.component.html',
    styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent implements OnInit {
    showForm = false;

    deliveries = signal<Delivery[]>([]);
    availableOrders = signal<Order[]>([]);

    // Delivery creation only, no update in requirements/controller snippet
    isEditMode = false;

    deliveryForm;

    constructor(
        private deliveryService: DeliveryApi,
        private orderService: OrderApi,
        private toastService: ToastService,
        private fb: FormBuilder
    ) {
        this.deliveryForm = this.fb.nonNullable.group({
            orderId: [0, [Validators.required, Validators.min(1)]],
            distanceKm: [0, [Validators.required, Validators.min(0.1)]],
            costPerKm: [0, [Validators.required, Validators.min(0)]],
            vehicle: ['', Validators.required],
            driver: ['', Validators.required],
            deliveryDate: ['', Validators.required] // "YYYY-MM-DD"
        });
    }

    ngOnInit(): void {
        this.loadDeliveries();
    }

    loadDeliveries() {
        this.deliveryService.findAll().subscribe({
            next: data => this.deliveries.set(data),
            error: () => this.toastService.error('Failed to load deliveries')
        });
    }

    loadAvailableOrders() {
        this.orderService.findAll().subscribe({
            next: orders => {
                // backend logic says: if status == ANNULEE, throw. if already delivered check delivery != null.
                // Since we don't have delivery info in Order response, we rely on status.
                // Also creation sets status to LIVREE. So we exclude LIVREE and ANNULEE.
                // Assuming EN_PREPARATION is the target.
                const filtered = orders.filter(o => o.status !== 'ANNULEE' && o.status !== 'LIVREE');
                this.availableOrders.set(filtered);
            },
            error: () => this.toastService.error('Failed to load orders')
        });
    }

    createDelivery() {
        this.loadAvailableOrders();
        this.deliveryForm.reset({
            orderId: 0,
            distanceKm: 0,
            costPerKm: 0,
            vehicle: '',
            driver: '',
            deliveryDate: new Date().toISOString().split('T')[0] // Default to today
        });
        this.showForm = true;
    }

    submitDelivery() {
        if (this.deliveryForm.invalid) return;

        const formValue = this.deliveryForm.getRawValue();

        const payload: DeliveryRequest = {
            orderId: Number(formValue.orderId),
            distanceKm: Number(formValue.distanceKm),
            costPerKm: Number(formValue.costPerKm),
            vehicle: formValue.vehicle,
            driver: formValue.driver,
            deliveryDate: formValue.deliveryDate
        };

        this.deliveryService.create(payload).subscribe({
            next: () => {
                this.closeForm();
                this.loadDeliveries();
                this.toastService.success('Delivery created successfully');
            },
            error: (err) => this.toastService.error('Failed to create delivery: ' + (err.error?.message || ''))
        });
    }

    closeForm() {
        this.showForm = false;
        this.deliveryForm.reset();
    }
}
