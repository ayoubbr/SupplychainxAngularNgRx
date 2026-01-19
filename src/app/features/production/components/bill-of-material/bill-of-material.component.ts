import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BillOfMaterialService } from '../../services/bill-of-material.service';
import { BillOfMaterialResponse, BillOfMaterialRequest, ProductResponse } from '../../../../api/production.api';
import { ProductService } from '../../services/product.service';
import { RawMaterialService } from '../../../procurement/services/raw-material.service';
import { RawMaterialResponse } from '../../../../api/material.api';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-bill-of-material',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [BillOfMaterialService, ProductService, RawMaterialService],
  templateUrl: './bill-of-material.component.html',
  styleUrl: './bill-of-material.component.css'
})
export class BillOfMaterialComponent implements OnInit {

  showForm = false;
  isEditMode = false;
  selectedBOM = signal<BillOfMaterialResponse | null>(null);

  billOfMaterials = signal<BillOfMaterialResponse[]>([]);
  products = signal<ProductResponse[]>([]);
  rawMaterials = signal<RawMaterialResponse[]>([]);

  loading = signal(false);
  error = signal<string | null>(null);

  bomForm;

  constructor(private bomService: BillOfMaterialService,
    private productService: ProductService,
    private rawMaterialService: RawMaterialService,
    private toastService: ToastService,
    private fb: FormBuilder) {
    this.bomForm = this.fb.group({
      productId: this.fb.nonNullable.control(0),
      rawMaterialId: this.fb.nonNullable.control(0),
      quantity: this.fb.nonNullable.control(0),
    });
  }

  ngOnInit(): void {
    this.loadBOMs();
    this.loadProducts();
    this.loadRawMaterials();
  }

  loadBOMs() {
    this.loading.set(true);
    this.error.set(null);

    this.bomService.getAllBOMs().subscribe({
      next: boms => {
        this.billOfMaterials.set(boms);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Unable to load bill of materials');
        this.loading.set(false);
      }
    }
    )
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data),
      error: () => this.toastService.error('Failed to load products')
    });
  }

  loadRawMaterials() {
    this.rawMaterialService.getAllRawMetrials().subscribe({
      next: (data) => this.rawMaterials.set(data),
      error: () => this.toastService.error('Failed to load raw materials')
    });
  }

  createBOM() {
    this.isEditMode = false;
    this.selectedBOM.set(null);
    this.bomForm.reset({
      productId: 0,
      rawMaterialId: 0,
      quantity: 0,
    });
    this.showForm = true;
  }

  editBOM(bom: BillOfMaterialResponse) {
    this.isEditMode = true;
    this.selectedBOM.set(bom);
    this.showForm = true;

    // We need to map back the correct IDs from the response names if response doesn't have IDs
    // Assuming backend response might lack IDs based on the DTO provided by user
    // Ideally user provided DTO 'BillOfMaterialResponse' has 'billOfMaterialId', 'productName', etc.
    // It doesn't have productID or rawMaterialID directly. This is a potential issue if names are not unique.
    // But let's assume we can try to find them or just use what we have.
    // Actually, for editing, we need the IDs to set the Select boxes.
    // We will try to find the ID by name matching for now if the API doesn't return it.

    // NOTE: The user DTO BillOfMaterialResponse does NOT have productId or rawMaterialId.
    // I will try to find them from the loaded lists.

    const product = this.products().find(p => p.name === bom.productName);
    const material = this.rawMaterials().find(r => r.name === bom.rawMaterialName);

    this.bomForm.patchValue({
      productId: product ? product.id : 0,
      rawMaterialId: material ? material.id : 0,
      quantity: bom.quantityPerProduct,
    });
  }

  deleteBOM(bomId: number) {
    const confirmed = confirm('Are you sure you want to delete this BOM entry?');
    if (!confirmed) return;

    this.bomService.deleteBOM(bomId).subscribe({
      next: () => {
        this.billOfMaterials.update(boms =>
          boms.filter(b => b.billOfMaterialId !== bomId));
        this.toastService.success('BOM deleted successfully');
      },
      error: () => {
        this.toastService.error('Impossible de supprimer le BOM');
      }
    });
  }

  closeForm() {
    this.showForm = false;
    this.bomForm.reset();
  }

  submitBOM() {
    if (this.bomForm.invalid) {
      return;
    }

    const payload: BillOfMaterialRequest = {
      productId: Number(this.bomForm.controls.productId.value),
      rawMaterialId: Number(this.bomForm.controls.rawMaterialId.value),
      quantityPerProduct: this.bomForm.controls.quantity.value,
    };

    // UPDATE
    if (this.isEditMode && this.selectedBOM()) {
      const id = this.selectedBOM()!.billOfMaterialId!;


      console.log(payload);
      this.bomService.updateBOM(id, payload).subscribe({
        next: () => {
          this.closeForm();
          this.loadBOMs();
          this.toastService.success('BOM updated successfully');
        },
        error: (err) => {
          this.toastService.error(err.error.message || 'Failed to update BOM');
          console.log(err.error);
        }
      });

      return;
    }

    // CREATE
    this.bomService.createBOM(payload).subscribe({
      next: () => {
        this.closeForm();
        this.loadBOMs();
        this.toastService.success('BOM created successfully');
      },
      error: (err) => {
        this.toastService.error(err.error.message || 'Failed to create BOM');
        console.log(err.error);
      }
    });
  }
}
