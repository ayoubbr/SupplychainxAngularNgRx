import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {CustomerActions} from '../../../../state/customer/customer.actions';
import {
  selectLoadingDetail,
  selectSelectedCustomer
} from '../../../../state/customer/customer.selectors';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container fade-in">
      <div class="header">
        <h2>Détails du Client</h2>
        <div class="header-actions">
          <a routerLink="/delivery/customers" class="btn btn-secondary">Retour</a>
          <a *ngIf="customer()" [routerLink]="['/delivery/customers', customer()?.id, 'edit']" class="btn btn-primary">Modifier</a>
        </div>
      </div>

      <div *ngIf="loading()" class="loading">
        <div class="spinner"></div>
        Chargement...
      </div>

      <div *ngIf="customer(); else noData" class="detail-card glass-panel">
        <div class="detail-row">
          <span class="label">ID:</span>
          <span class="value">{{ customer()?.id }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Nom:</span>
          <span class="value">{{ customer()?.name }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Adresse:</span>
          <span class="value">{{ customer()?.address }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Ville:</span>
          <span class="value">{{ customer()?.city }}</span>
        </div>

        <!-- Additional content from Brief: Orders stats -->
        <div class="stats-section">
          <h3>Statistiques</h3>
          <div class="stat-card">
            <span class="stat-label">Commandes Totales</span>
            <span class="stat-value">{{ customer()?.ordersCount || 0 }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Commandes Actives</span>
            <span class="stat-value">{{ customer()?.hasActiveOrders ? 'Oui' : 'Non' }}</span>
          </div>
        </div>
      </div>

      <ng-template #noData>
        <div *ngIf="!loading()" class="empty-state">
          Client introuvable.
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      color: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
    }

    .detail-row {
      display: flex;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      width: 150px;
      color: #a0a0a0;
      font-weight: 500;
    }

    .value {
      color: white;
      flex: 1;
    }

    .stats-section {
      margin-top: 2rem;
    }

    .stats-section h3 {
      margin-bottom: 1rem;
      color: #a0a0a0;
      font-size: 1.1rem;
    }

    .stat-card {
      display: inline-flex;
      flex-direction: column;
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 8px;
      margin-right: 1rem;
      min-width: 150px;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #a0a0a0;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  customer = this.store.selectSignal(selectSelectedCustomer);
  loading = this.store.selectSignal(selectLoadingDetail);

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.store.dispatch(CustomerActions.loadCustomerById({id: +params['id']}));
      }
    });
  }
}
