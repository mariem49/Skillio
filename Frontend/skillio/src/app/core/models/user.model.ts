export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'STUDENT' | 'TRAINER' | 'ENTERPRISE';
    avatar?: string;
    createdAt?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
}

export interface UserProfile extends User {
    bio?: string;
    phoneNumber?: string;
    address?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
}
