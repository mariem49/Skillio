export interface JobOffer {
    id: number;
    title: string;
    description: string;
    contractType: 'CDI' | 'CDD' | 'INTERNSHIP' | 'FREELANCE';
    location: string;
    salary: number;
    remote: 'ON_SITE' | 'HYBRID' | 'FULL_REMOTE';
    requirements: string;
    companyId: number;
    createdAt?: string;
    isActive: boolean;

    // Optional frontend fields
    companyName?: string;
    companyLogo?: string;
    matchingScore?: number;

    // Missing fields used in MatchingService
    requiredSkills?: string[];
    requiredLevel?: string;
    experienceYears?: number;
}
