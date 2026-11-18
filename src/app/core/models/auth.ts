export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    restaurantName: string;
    address: string;
    phone: string;
    openingTime: string;
    closingTime: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    name: string;
    email: string;
    restaurantId: number | null;
}

