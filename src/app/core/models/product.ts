export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    finalPrice: number;
    imageUrl: string | null;
    isFeatured: boolean;
    discountPercentage: number;
    isHappyHour: boolean;
    categoryId: number;
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    isFeatured: boolean;
    categoryId: number;
}