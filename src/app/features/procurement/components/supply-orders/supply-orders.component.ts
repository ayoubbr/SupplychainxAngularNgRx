import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplyOrderApi } from '../../../../api/supply-order.api';
import { SupplyOrder } from '../../../../api/supply-order.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialApi } from '../../../../api/material.api';
import { SupplierService } from '../../services/supplier.service';
import { ToastService } from '../../../../shared/services/toast.service';

export interface SupplierWithMaterials {
  id: number;
  name: string;
  contact: string;
  rating: number;
  leadTime: number;
  rawMaterials: RawMaterial[];
}

export interface RawMaterial {
  id: number;
  name: string;
  category?: string;
}

@Component({
  selector: 'app-supply-orders',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './supply-orders.component.html',
  styleUrl: './supply-orders.component.css',
})
export class SupplyOrdersComponent implements OnInit {

  orders: SupplyOrder[] = [];
  showForm = false;

  formStep: 'supplier-selection' | 'material-selection' | 'quantity-entry' = 'supplier-selection';


  form!: FormGroup;

  // Available suppliers with their raw materials
  availableSuppliers: SupplierWithMaterials[] = [];

  // Selected supplier
  selectedSupplier: SupplierWithMaterials | null = null;

  // Selected raw material IDs for the chosen supplier
  selectedRawMaterialIds: Set<number> = new Set();

  errorMessage: string | null = null;

  constructor(
    private api: SupplyOrderApi,
    private materialApi: MaterialApi,
    private supplierService: SupplierService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadSuppliersWithMaterials();

    this.form = this.fb.group({
      supplierId: [null, Validators.required],
      orderDate: [null, Validators.required],
      status: ['EN_ATTENTE'],
      rawMaterials: this.fb.array([])
    });
  }

  loadOrders() {
    this.api.findAll().subscribe(res => this.orders = res);
  }

  loadSuppliersWithMaterials() {
    this.api.getSuppliersWithMaterials().subscribe(res => {
      this.availableSuppliers = res;
    });
  }

  get rawMaterials(): FormArray {
    return this.form.get('rawMaterials') as FormArray;
  }

  // Select a supplier and move to material selection
  selectSupplier(supplier: SupplierWithMaterials) {
    this.selectedSupplier = supplier;
    this.form.patchValue({ supplierId: supplier.id });
    this.selectedRawMaterialIds.clear();
    this.formStep = 'material-selection';
  }

  // Toggle raw material selection
  toggleRawMaterialSelection(id: number) {
    if (this.selectedRawMaterialIds.has(id)) {
      this.selectedRawMaterialIds.delete(id);
    } else {
      this.selectedRawMaterialIds.add(id);
    }
  }


  isRawMaterialSelected(id: number): boolean {
    return this.selectedRawMaterialIds.has(id);
  }

  // Go back to supplier selection
  backToSupplierSelection() {
    this.selectedSupplier = null;
    this.selectedRawMaterialIds.clear();
    this.formStep = 'supplier-selection';
  }

  // Move to quantity entry step
  proceedToQuantityEntry() {
    if (this.selectedRawMaterialIds.size === 0) {
      alert('Veuillez sélectionner au moins une matière première');
      return;
    }

    // Clear existing form array
    this.rawMaterials.clear();

    // Create form group for each selected raw material
    this.selectedRawMaterialIds.forEach(id => {
      const rawMaterial = this.selectedSupplier?.rawMaterials.find(rm => rm.id === id);
      if (rawMaterial) {
        this.rawMaterials.push(
          this.fb.group({
            rawMaterialId: [id, Validators.required],
            rawMaterialName: [rawMaterial.name],
            quantity: [1, [Validators.required, Validators.min(1)]]
          })
        );
      }
    });

    this.formStep = 'quantity-entry';
  }

  // Go back to material selection
  backToMaterialSelection() {
    this.formStep = 'material-selection';
  }

  submit() {
    if (this.form.invalid) {
      this.toastService.error('Veuillez remplir tous les champs requis');
      return;
    }

    // Transform data to match backend SupplyOrderRequest
    const payload = {
      orderDate: this.form.value.orderDate,
      supplierId: this.form.value.supplierId,
      status: this.form.value.status,
      rawMaterials: this.form.value.rawMaterials.map((rm: any) => ({
        rawMaterialId: rm.rawMaterialId,
        quantity: rm.quantity
      }))
    };

    console.log(payload);

    this.api.create(payload).subscribe({
      next: () => {
        this.showForm = false;
        this.resetForm();
        this.loadOrders();
        this.toastService.success('Supply Order created successfully');
      },
      error: (err) => {
        this.toastService.error(err.error.message || 'Failed to create supply order');
        this.showForm = false;
        console.error(err);
      }
    });
  }

  resetForm() {
    this.form.reset({ status: 'EN_ATTENTE' });
    this.rawMaterials.clear();
    this.selectedRawMaterialIds.clear();
    this.selectedSupplier = null;
    this.formStep = 'supplier-selection';
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
  }

  delete(id: number) {
    this.errorMessage = null;
    const confirmed = confirm("Are you sure you want to delete this order?");

    if (!confirmed) {
      return;
    }

    this.api.delete(id).subscribe(
      {
        next: (data) => {
          if (data == 0) {
            this.toastService.error('Cannot delete a Supply Order with Status RECUE');
            return;
          }

          this.loadOrders();
          this.toastService.success('Supply Order deleted successfully');
        },
        error: () => {
          this.toastService.error('Server error while deleting supply order');
        }
      }
    );
  }

  receive(id: number) {
    const confirmConst = confirm('Are you sure You want to set this order as recue?');
    if (!confirmConst) {
      return;
    }
    this.api.markAsReceived(id).subscribe({
      next: () => {
        this.loadOrders();
        this.toastService.success('Order marked as received');
      },
      error: () => this.toastService.error('Failed to mark order as received')
    });
  }
}
