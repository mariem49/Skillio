export interface Company {
    id: number;
    name: string;
    description: string;
    industry: string;
    location: string;
    website: string;
    logoUrl?: string; // Included as it exists in backend
    email: string;
    phone: string;
    enterpriseUserId: number;
    createdAt: string;

    // Optional frontend fields
    jobOffersCount?: number;
}
