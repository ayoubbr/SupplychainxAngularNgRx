import {Routes} from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import {LoginComponent} from './features/auth/login/login.component';
import {DashboardComponent} from './features/procurement/components/dashboard/dashboard.component';
import {DashboardComponent as DC} from './features/production/components/dashboard/dashboard.component';
import {SuppliersComponent} from './features/procurement/components/suppliers/suppliers.component';
import {MaterialsComponent} from './features/procurement/components/materials/materials.component';
import {SupplyOrdersComponent} from './features/procurement/components/supply-orders/supply-orders.component';
import {ProductsComponent} from './features/production/components/products/products.component';
import {BillOfMaterialComponent} from './features/production/components/bill-of-material/bill-of-material.component';
import {
  ProductionOrdersComponent
} from './features/production/components/production-orders/production-orders.component';
import {authGuard} from './core/guards/auth.guard';
import {RegisterComponent} from './features/auth/register/register.component';
import {ProfileComponent} from './features/users/profile/profile.component';

export const routes: Routes = [
  {path: "", component: HomeComponent},

  // Procurement - Admin Only
  {
    path: "procurement/dashboard",
    component: DashboardComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: "procurement/suppliers",
    component: SuppliersComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: "procurement/materials",
    component: MaterialsComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: "procurement/orders",
    component: SupplyOrdersComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },

  // Production - ROLE_Admin Only
  {path: "production/dashboard", component: DC, canActivate: [authGuard], data: {roles: ['ROLE_ADMIN']}},
  {path: "production/products", component: ProductsComponent, canActivate: [authGuard], data: {roles: ['ROLE_ADMIN']}},
  {
    path: "production/bill-of-materials",
    component: BillOfMaterialComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: "production/production-orders",
    component: ProductionOrdersComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },

  // Delivery - ROLE_ADMIN
  {
    path: "delivery/dashboard",
    loadComponent: () => import('./features/delivery/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: "delivery/customers",
    loadComponent: () => import('./features/delivery/customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: "delivery/orders",
    loadComponent: () => import('./features/delivery/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: "delivery/deliveries",
    loadComponent: () => import('./features/delivery/deliveries/deliveries.component').then(m => m.DeliveriesComponent),
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },

  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "profile", component: ProfileComponent},
  // { path: "profile", component: ProfileComponent, canActivate: [authGuard] }, // Authenticated users only, no specific role checks for basic profile
  {path: "**", redirectTo: ""},
];
