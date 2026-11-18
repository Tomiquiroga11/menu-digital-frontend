import { CategoryMenu } from './category';

export interface Restaurant {
    id: number;
    name: string;
    address: string;
    phone: string;
    openingTime: string;
    closingTime: string;
    isOpen: boolean;
}

export interface RestaurantMenu extends Restaurant {
    categories : CategoryMenu[];
}