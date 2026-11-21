import { Product } from './product';
export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartRestaurant {
    id: number;
    name: string;
    phone: string;
}

export interface CartState {
    restaurant: CartRestaurant | null;
    items: CartItem[];
}