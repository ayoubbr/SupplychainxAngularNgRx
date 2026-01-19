import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ProductionOrderService} from '../../services/production-order.service';
import {ProductService} from '../../services/product.service';
import {ToastService} from '../../../../shared/services/toast.service';
import {
  ProductionOrderRequest,
  ProductionOrderResponse,
  ProductionOrderStatus
} from '../../../../api/production-order.api';
import {ProductResponse} from '../../../../api/production.api';

@Component({
  selector: 'app-production-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './production-orders.component.html',
  styleUrl: './production-orders.component.css'
})
export class ProductionOrdersComponent implements OnInit {

  showForm = false;
  isEditMode = false;

  orders = signal<ProductionOrderResponse[]>([]);
  products = signal<ProductResponse[]>([]);

  // Loading & Error handled via signals (and toast for user feedback)
  loading = signal(false);

  // Form
  orderForm;

  selectedOrder = signal<ProductionOrderResponse | null>(null);

  constructor(
    private orderService: ProductionOrderService,
    private productService: ProductService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      productId: this.fb.control<number | null>(null, [Validators.required]),
      quantity: this.fb.nonNullable.control(1, [Validators.required, Validators.min(1)]),
      startDate: this.fb.nonNullable.control('', [Validators.required]),
      endDate: this.fb.nonNullable.control('', [Validators.required]),
      status: this.fb.nonNullable.control(ProductionOrderStatus.EN_ATTENTE)
    });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Failed to load production orders');
        this.loading.set(false);
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products.set(data),
      error: () => this.toastService.error('Failed to load products')
    });
  }

  createOrder() {
    this.isEditMode = false;
    this.selectedOrder.set(null);
    this.orderForm.reset({
      productId: null,
      quantity: 1,
      startDate: '',
      endDate: '',
      status: ProductionOrderStatus.EN_ATTENTE
    });
    this.showForm = true;
  }

  editOrder(order: ProductionOrderResponse) {
    this.isEditMode = true;
    this.selectedOrder.set(order);
    this.showForm = true;

    this.orderForm.patchValue({
      productId: order.productId,
      quantity: order.quantity,
      startDate: order.startDate,
      endDate: order.endDate,
      status: order.status as ProductionOrderStatus
    });
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      this.toastService.error('Please fill all required fields correctly');
      return;
    }

    const formVal = this.orderForm.getRawValue();

    const payload: ProductionOrderRequest = {
      productId: Number(formVal.productId),
      quantity: formVal.quantity,
      startDate: formVal.startDate,
      endDate: formVal.endDate,
      status: formVal.status
    };


    if (this.isEditMode && this.selectedOrder()) {
      const id = this.selectedOrder()!.id;
      console.log(id);
      this.orderService.update(id, payload).subscribe({
        next: () => {
          this.closeForm();
          this.loadOrders();
          this.toastService.success('Production Order updated successfully');
        },
        error: (err) => {
          this.toastService.error(err.error.message || 'Failed to update order');
          console.log(err.error);
        }
      });
    } else {
      this.orderService.create(payload).subscribe({
        next: () => {
          this.closeForm();
          this.loadOrders();
          this.toastService.success('Production Order created successfully');
        },
        error: (err) => {
          this.toastService.error(err.error.message || 'Failed to create order');
        }
      });
    }
  }

  deleteOrder(id: number) {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    this.orderService.delete(id).subscribe({
      next: () => {
        this.orders.update(orders => orders.filter(o => o.id !== id));
        this.toastService.success('Order deleted successfully');
      },
      error: (err) => {
        // Backend might throw error if status is EN_PRODUCTION or TERMINE
        this.toastService.error(err.error.message || 'Failed to delete order');
      }
    });
  }

  cancelOrder(id: number) {
    if (!confirm('Are you sure you want to cancel this order? It will be marked as BLOCKED.')) {
      return;
    }

    this.orderService.cancel(id).subscribe({
      next: () => {
        this.loadOrders();
        this.toastService.success('Order canceled successfully');
      },
      error: (err) => {
        this.toastService.error(err.error.message || 'Failed to cancel order');
      }
    });
  }

  closeForm() {
    this.showForm = false;
    this.orderForm.reset();
  }

  get availableStatuses() {
    return Object.values(ProductionOrderStatus);
  }
}
