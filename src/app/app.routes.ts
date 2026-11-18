import { Routes } from '@angular/router';

import { RestaurantList } from './pages/restaurant-list/restaurant-list';

export const routes: Routes = [
    { path:'', component: RestaurantList, title: 'Restaurantes | Menu Digital' },
    { path: '**', redirectTo: '' },
];
