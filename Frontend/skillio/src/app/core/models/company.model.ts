export interface Company {
    id: number;
    name: string;
    description: string;
    industry: string;
    location: string;
    website: string;
    logoUrl: string;
    email: string;
    phone: string;
    enterpriseUserId: number;
    createdAt?: string;

    // Optional frontend fields
    jobOffersCount?: number;
}
