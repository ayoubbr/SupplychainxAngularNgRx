import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomerActions } from '../../../../state/customer/customer.actions';
import {
    selectLoadingOperation,
    selectSelectedCustomer
} from '../../../../state/customer/customer.selectors';
import { CustomerRequest } from '../../../../api/delivery.models';

@Component({
    selector: 'app-customer-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="container fade-in">
        <div class="header">
            <h2>{{ isEditMode() ? 'Modifier Client' : 'Nouveau Client' }}</h2>
            <a routerLink="/delivery/customers" class="btn btn-secondary">Retour</a>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-card glass-panel">
            <div class="form-group">
                <label for="name">Nom</label>
                <input id="name" type="text" formControlName="name" class="form-control" placeholder="Nom de l'entreprise">
                <div *ngIf="form.get('name')?.touched && form.get('name')?.invalid" class="error-msg">
                    Le nom est requis (3-100 caractères).
                </div>
            </div>

            <div class="form-group">
                <label for="address">Adresse</label>
                <input id="address" type="text" formControlName="address" class="form-control" placeholder="Adresse complète">
                <div *ngIf="form.get('address')?.touched && form.get('address')?.invalid" class="error-msg">
                    L'adresse est requise (10-255 caractères).
                </div>
            </div>

            <div class="form-group">
                <label for="city">Ville</label>
                <input id="city" type="text" formControlName="city" class="form-control" placeholder="Ville">
                <div *ngIf="form.get('city')?.touched && form.get('city')?.invalid" class="error-msg">
                    La ville est requise.
                </div>
            </div>

            <div class="actions">
                <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading()">
                    <span *ngIf="loading()" class="spinner"></span>
                    {{ isEditMode() ? 'Mettre à jour' : 'Créer' }}
                </button>
            </div>
        </form>
    </div>
  `,
    styles: [`
    .container { padding: 2rem; max-width: 800px; margin: 0 auto; color: white; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .glass-panel {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 2rem;
    }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; color: #a0a0a0; }
    .form-control {
        width: 100%;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: white;
        transition: border-color 0.3s;
    }
    .form-control:focus { outline: none; border-color: #3b82f6; }
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; border: none; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-secondary { background: rgba(255, 255, 255, 0.1); color: white; }
    .error-msg { color: #fe2222; font-size: 0.875rem; margin-top: 0.25rem; }
    .spinner {
        width: 16px; height: 16px;
        border: 2px solid #ffffff; border-top-color: transparent;
        border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class CustomerFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private route = inject(ActivatedRoute);

    form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });

    loading = this.store.selectSignal(selectLoadingOperation);
    isEditMode = signal(false);
    customerId: number | null = null;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode.set(true);
                this.customerId = +params['id'];
                this.store.dispatch(CustomerActions.loadCustomerById({ id: this.customerId }));

                // Subscribe using manual subscription for now to keep it simple, 
                // alternatively signal effect could be used.
                this.store.select(selectSelectedCustomer).subscribe(customer => {
                    if (customer && customer.id === this.customerId) {
                        this.form.patchValue({
                            name: customer.name,
                            address: customer.address,
                            city: customer.city
                        });
                    }
                });
            }
        });
    }

    onSubmit() {
        if (this.form.invalid) return;

        const request: CustomerRequest = {
            name: this.form.value.name!,
            address: this.form.value.address!,
            city: this.form.value.city!
        };

        if (this.isEditMode() && this.customerId) {
            this.store.dispatch(CustomerActions.updateCustomer({
                id: this.customerId,
                customer: request
            }));
        } else {
            this.store.dispatch(CustomerActions.createCustomer({ customer: request }));
        }
    }
}
