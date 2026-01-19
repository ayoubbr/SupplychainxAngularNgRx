import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerApi } from '../../../api/customer.api';
import { Customer, CustomerRequest } from '../../../api/delivery.models';
import { ToastService } from '../../../shared/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-customers',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
    showForm = false;
    isEditMode = false;

    customers = signal<Customer[]>([]);
    selectedCustomer = signal<Customer | null>(null);
    error = signal<string | null>(null);

    customerForm;

    constructor(
        private customerService: CustomerApi,
        private toastService: ToastService,
        private fb: FormBuilder
    ) {
        this.customerForm = this.fb.nonNullable.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers() {
        this.customerService.findAll().subscribe({
            next: data => this.customers.set(data),
            error: () => this.toastService.error('Failed to load customers')
        });
    }

    createCustomer() {
        this.isEditMode = false;
        this.selectedCustomer.set(null);
        this.customerForm.reset({
            name: '',
            address: '',
            city: ''
        });
        this.showForm = true;
    }

    editCustomer(customer: Customer) {
        this.isEditMode = true;
        this.selectedCustomer.set(customer);
        this.showForm = true;

        this.customerForm.patchValue({
            name: customer.name,
            address: customer.address,
            city: customer.city
        });
    }

    submitCustomer() {
        if (this.customerForm.invalid) return;

        const payload: CustomerRequest = this.customerForm.getRawValue();

        if (this.isEditMode && this.selectedCustomer()) {
            this.customerService
                .update(this.selectedCustomer()!.id, payload)
                .subscribe({
                    next: () => {
                        this.closeForm();
                        this.loadCustomers();
                        this.toastService.success('Customer updated successfully');
                    },
                    error: () => this.toastService.error('Failed to update customer')
                });
            return;
        }

        this.customerService.create(payload).subscribe({
            next: () => {
                this.closeForm();
                this.loadCustomers();
                this.toastService.success('Customer created successfully');
            },
            error: () => this.toastService.error('Failed to create customer')
        });
    }

    deleteCustomer(id: number) {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        this.customerService.delete(id).subscribe({
            next: () => {
                this.customers.update(list => list.filter(c => c.id !== id));
                this.toastService.success('Customer deleted successfully');
            },
            error: (err) => {
                console.error(err);
                this.toastService.error('Failed to delete customer' + (err.error?.message ? ': ' + err.error.message : ''));
            }
        });
    }

    closeForm() {
        this.showForm = false;
        this.customerForm.reset();
    }
}
