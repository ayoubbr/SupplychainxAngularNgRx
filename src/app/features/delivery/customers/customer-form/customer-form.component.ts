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
  templateUrl: './customer-form.component.html' ,
  styleUrl: './customer-form.component.css'
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
