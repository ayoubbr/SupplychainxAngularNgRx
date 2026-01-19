import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { SupplierRequest, SupplierResponse } from '../../../../api/supplier.api';
import { ToastService } from '../../../../shared/services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {
  showForm = false;
  isEditMode = false;

  suppliers = signal<SupplierResponse[]>([]);
  selectedSupplier = signal<SupplierResponse | null>(null);
  error = signal<string | null>(null);

  supplierForm;

  constructor(
    private supplierService: SupplierService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.supplierForm = this.fb.nonNullable.group({
      name: [''],
      contact: [''],
      rating: [5],
      leadTime: [0]
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: data => this.suppliers.set(data),
      error: () => this.toastService.error('Failed to load suppliers')
    });
  }

  createSupplier() {
    this.isEditMode = false;
    this.selectedSupplier.set(null);
    this.supplierForm.reset({
      name: '',
      contact: '',
      rating: 5,
      leadTime: 0
    });
    this.showForm = true;
  }

  editSupplier(supplier: SupplierResponse) {
    this.isEditMode = true;
    this.selectedSupplier.set(supplier);
    this.showForm = true;

    this.supplierForm.patchValue({
      name: supplier.name,
      contact: supplier.contact,
      rating: supplier.rating,
      leadTime: supplier.leadTime
    });
  }

  submitSupplier() {
    if (this.supplierForm.invalid) return;

    const payload: SupplierRequest = this.supplierForm.getRawValue();

    if (this.isEditMode && this.selectedSupplier()) {
      this.supplierService
        .updateSupplier(this.selectedSupplier()!.id, payload)
        .subscribe({
          next: () => {
            this.closeForm();
            this.loadSuppliers();
            this.toastService.success('Supplier updated successfully');
          },
          error: () => this.toastService.error('Failed to update supplier')
        });
      return;
    }

    this.supplierService.createSupplier(payload).subscribe({
      next: () => {
        this.closeForm();
        this.loadSuppliers();
        this.toastService.success('Supplier created successfully');
      },
      error: () => this.toastService.error('Failed to create supplier')
    });
  }

  deleteSupplier(id: number) {
    if (!confirm('Supprimer ce fournisseur ?')) return;

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers.update(list => list.filter(s => s.id !== id));
        this.toastService.success('Supplier deleted successfully');
      },
      error: () => this.toastService.error('Impossible de supprimer le fournisseur')
    });
  }

  closeForm() {
    this.showForm = false;
    this.supplierForm.reset();
  }
}
