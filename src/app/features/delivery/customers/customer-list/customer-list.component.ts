import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomerActions } from '../../../../state/customer/customer.actions';
import {
  selectAllCustomers,
  selectError,
  selectLoadingList,
  selectPagination
} from '../../../../state/customer/customer.selectors';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomerResponse } from '../../../../api/delivery.models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faSort, faSortUp, faSortDown, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  private store = inject(Store);

  faSearch = faSearch;
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;

  customers = this.store.selectSignal(selectAllCustomers);
  loading = this.store.selectSignal(selectLoadingList);
  error = this.store.selectSignal(selectError);
  pagination = this.store.selectSignal(selectPagination);

  searchControl = new FormControl('');
  sizeControl = new FormControl(10);

  customerToDelete: CustomerResponse | null = null;
  currentSort = signal('name,asc');

  ngOnInit() {
    this.store.dispatch(CustomerActions.loadCustomers({
      page: 0,
      size: 10,
      sort: 'name,asc',
      search: ''
    }));

    // Search
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.store.dispatch(CustomerActions.loadCustomers({
        page: 0,
        size: this.sizeControl.value || 10,
        sort: this.currentSort(),
        search: value || ''
      }));
    });

    // Size change
    this.sizeControl.valueChanges.subscribe(value => {
      this.store.dispatch(CustomerActions.loadCustomers({
        page: 0,
        size: value || 10,
        sort: this.currentSort(),
        search: this.searchControl.value || ''
      }));
    });
  }

  onPageChange(page: number) {
    this.store.dispatch(CustomerActions.loadCustomers({
      page: page,
      size: this.sizeControl.value || 10,
      sort: this.currentSort(),
      search: this.searchControl.value || ''
    }));
  }

  onSort(field: string) {
    const current = this.currentSort();
    const [currentField, currentDir] = current.split(',');

    let newSort = `${field},asc`;
    if (currentField === field) {
      newSort = `${field},${currentDir === 'asc' ? 'desc' : 'asc'}`;
    }

    this.currentSort.set(newSort);
    this.store.dispatch(CustomerActions.loadCustomers({
      page: 0,
      size: this.sizeControl.value || 10,
      sort: newSort,
      search: this.searchControl.value || ''
    }));
  }

  confirmDelete(customer: CustomerResponse) {
    this.customerToDelete = customer;
  }

  cancelDelete() {
    this.customerToDelete = null;
  }

  deleteCustomer() {
    if (this.customerToDelete) {
      this.store.dispatch(CustomerActions.deleteCustomer({ id: this.customerToDelete.id }));
      this.customerToDelete = null;

    }
  }

  getSortIcon(field: string) {
    const [currentField, currentDir] = this.currentSort().split(',');
    if (currentField !== field) return this.faSort;
    return currentDir === 'asc' ? this.faSortUp : this.faSortDown;
  }
}
