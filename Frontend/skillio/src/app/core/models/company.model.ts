export interface Company {
    id: number;
    name: string;
    logo: string;
    description: string;
    industry: 'tech' | 'finance' | 'healthcare' | 'education' | 'other';
    size: '1-10' | '11-50' | '51-200' | '200+';
    location: string;
    website?: string;
    email?: string;
    status: 'active' | 'inactive';
    jobOffersCount?: number;
}
