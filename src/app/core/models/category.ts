import { Product } from './product';

export interface Category {
    id: number;
    name: string;
}

export interface CategoryMenu extends Category {
    products: Product[];
}

export interface CategoryRequest {
    name: string;
}