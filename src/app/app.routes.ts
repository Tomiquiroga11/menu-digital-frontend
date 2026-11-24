import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { OwnerDashboard } from './pages/owner-dashboard/owner-dashboard';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Register } from './pages/register/register';
import { RestaurantDetail } from './pages/restaurant-detail/restaurant-detail';
import { RestaurantList } from './pages/restaurant-list/restaurant-list';
import { ProductForm } from './pages/product-form/product-form';

export const routes: Routes = [
  // Públicas: invitados y dueños
  { path: '', component: RestaurantList, title: 'Restaurantes | Menú Digital' },
  { path: 'restaurants/:id', component: RestaurantDetail, title: 'Menú | Menú Digital' },
  {
    path: 'restaurants/:restaurantId/products/:productId',
    component: ProductDetail,
    title: 'Producto | Menú Digital',
  },

  // Solo invitados (sin sesión)
  { path: 'cart', component: Cart, canActivate: [guestGuard], title: 'Tu pedido | Menú Digital' },
  { path: 'login', component: Login, canActivate: [guestGuard], title: 'Ingresar | Menú Digital' },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
    title: 'Registrá tu restaurante | Menú Digital',
  },

  // Solo dueños (con sesión)
  { path: 'owner', component: OwnerDashboard, canActivate: [authGuard], title: 'Mi panel | Menú Digital' },
  {
  path: 'owner/products/new',
  component: ProductForm,
  canActivate: [authGuard],
  title: 'Nuevo producto | Menú Digital',
},
{
  path: 'owner/products/:productId/edit',
  component: ProductForm,
  canActivate: [authGuard],
  title: 'Editar producto | Menú Digital',
},

  // Cualquier otra URL vuelve al inicio (siempre al final)
  { path: '**', redirectTo: '' },
];