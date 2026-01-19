import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductResponse, ProductRequest } from '../../../../api/production.api';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    providers: [ProductService],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

    showForm = false;
    isEditMode = false;

    selectedProduct = signal<ProductResponse | null>(null);

    products = signal<ProductResponse[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    productForm;

    constructor(private productService: ProductService,
        private toastService: ToastService,
        private fb: FormBuilder) {
        this.productForm = this.fb.group({
            name: this.fb.nonNullable.control(''),
            cost: this.fb.nonNullable.control(0),
            productionTime: this.fb.nonNullable.control(0),
            stock: this.fb.nonNullable.control(0),
        });
    }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.loading.set(true);
        this.error.set(null);

        this.productService.getAllProducts().subscribe({
            next: products => {
                this.products.set(products);
                this.loading.set(false);
            },
            error: () => {
                this.toastService.error('Unable to load products');
                this.loading.set(false);
            }
        }
        )
    }

    createProduct() {
        this.isEditMode = false;
        this.selectedProduct.set(null);
        this.productForm.reset({
            name: '',
            cost: 0,
            productionTime: 0,
            stock: 0,
        });
        this.showForm = true;
    }

    editProduct(product: ProductResponse) {
        this.isEditMode = true;
        this.selectedProduct.set(product);
        this.showForm = true;

        this.productForm.patchValue({
            name: product.name,
            cost: product.cost,
            productionTime: product.productionTime,
            stock: product.stock,
        });
    }

    deleteProduct(productId: number) {
        const confirmed = confirm('Are you sure you want to delete this product?');

        if (!confirmed) return;

        this.productService.deleteProduct(productId).subscribe({
            next: () => {
                this.products.update(products =>
                    products.filter(p => p.id !== productId));
                this.toastService.success('Produit supprimé avec succès');
            },
            error: () => {
                this.toastService.error('Impossible de supprimer le produit');
            }
        });
    }

    closeForm() {
        this.showForm = false;
        this.productForm.reset({
            name: '',
            cost: 0,
            productionTime: 0,
            stock: 0,
        });
    }

    submitProduct() {
        if (this.productForm.invalid) {
            return;
        }

        const payload: ProductRequest = {
            name: this.productForm.controls.name.value,
            cost: this.productForm.controls.cost.value,
            productionTime: this.productForm.controls.productionTime.value,
            stock: this.productForm.controls.stock.value,
        };

        // UPDATE
        if (this.isEditMode && this.selectedProduct()) {
            const id = this.selectedProduct()!.id!;

            this.productService.updateProduct(id, payload).subscribe({
                next: () => {
                    this.closeForm();
                    this.loadProducts(); // refresh list
                    this.toastService.success('Produit mis à jour avec succès');
                },
                error: () => {
                    this.toastService.error('Failed to update product');
                }
            });

            return;
        }

        // CREATE
        this.productService.createProduct(payload).subscribe({
            next: () => {
                this.closeForm();
                this.loadProducts(); // refresh list
                this.toastService.success('Produit créé avec succès');
            },
            error: () => {
                this.toastService.error('Failed to create product');
            }
        });
    }
}

