export interface Account {
    userId: number;
    name: string;
    email: string;
    restaurantId: number;
    restaurantName: string;
    address: string;
    phone: string;
    openingTime: string;
    closingTime: string;
}

export interface UpdateAccountRequest {
    name: string;
    restaurantName: string;
    address: string;
    phone: string;
    openingTime: string;
    closingTime: string;
}