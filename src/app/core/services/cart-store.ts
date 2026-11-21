import { Injectable, computed, effect, signal } from '@angular/core';

import { CartRestaurant, CartState } from '../models/cart';
import { Product } from '../models/product';

const STORAGE_KEY = 'menu-digital-cart';
const EMPTY_CART: CartState = { restaurant: null, items: [] };

@Injectable({ providedIn: 'root' })
export class CartStore {
    private readonly state = signal<CartState>(this.loadFromStorage());

    readonly restaurant = computed(() => this.state().restaurant);
    readonly items = computed(() => this.state().items);
    readonly totalQuantity = computed(() => 
        this.state().items.reduce((total, item) => total + item.quantity, 0),    
    );

    readonly subtotal = computed(() => 
        this.state().items.reduce((total, item) => total + item.product.finalPrice * item.quantity, 0),
    );

    private readonly saveToStorage = effect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    });

    add(product: Product, restaurant: CartRestaurant): boolean {
        const current = this.state();
        const isOtherReastaurant = current.items.length > 0 && current.restaurant?.id !== restaurant.id;

        if(isOtherReastaurant) {
            const confirmed = confirm(
                `Tu carrito tiene productos de ${current.restaurant?.name}. ¿Querés vaciarlo y empezar un pedido en ${restaurant.name}?`,
            );
            if (!confirmed) {
                return false;
            }
        }

        this.state.update((state) => {
            const items = isOtherReastaurant ? [] : state.items;
            const existing = items.find((item) => item.product.id === product.id);

            const newItems = existing
                ? items.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1} : item,
                )
                : [...items, { product, quantity: 1 }];
            
            return { restaurant, items: newItems };
        });

        return true;
    }

    increment(productId: number): void {
        this.state.update((state) => ({
            ...state,
            items: state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
        }));
    }

    decrement(productId: number): void {
        this.state.update((state) => ({
            ...state,
            items: state.items
                .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0),
        }));
    }

    remove(productId: number): void {
        this.state.update((state) => ({
            ...state,
            items: state.items.filter((item) => item.product.id !== productId),
        }));
    }

    clear(): void{
        this,this.state.set(EMPTY_CART);
    }

    private loadFromStorage(): CartState {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : EMPTY_CART;
        } catch {
            return EMPTY_CART;
        }
    }
}