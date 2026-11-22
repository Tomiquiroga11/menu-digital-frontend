import { Routes } from '@angular/router';

import { RestaurantDetail } from './pages/restaurant-detail/restaurant-detail';
import { RestaurantList } from './pages/restaurant-list/restaurant-list';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';

export const routes: Routes = [
    { path:'', component: RestaurantList, title: 'Restaurantes | Menu Digital' },
    { path: 'restaurants/:id', component: RestaurantDetail, title: 'Menú | Menú Digital' },
    { path: 'restaurants/:restaurantId/products/:productId', component: ProductDetail, title: 'Producto | Menú Digital' },
    { path: 'cart', component: Cart, title: 'Tu pedido | Menú Digital' },
    { path: '**', redirectTo: '' },
];
