import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgFor} from '@angular/common';
import {Store} from '@ngrx/store';
import {customerFeature} from '../../../../state/customer/customer.reducer';
import {CustomerActions} from '../../../../state/customer/customer.actions';

@Component({
  selector: 'app-customer-list',
  imports: [],
  standalone: true,
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  private store = inject(Store);

  customers = this.store.selectSignal(customerFeature.selectCustomers);
  loading = this.store.selectSignal(customerFeature.selectLoading);


  ngOnInit(): void {
    this.store.dispatch(CustomerActions.loadAll());
  }

  onDelete(id: number) {
    this.store.dispatch(CustomerActions.deleteCustomer({id}));
  }

}
