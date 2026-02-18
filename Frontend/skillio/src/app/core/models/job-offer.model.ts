export interface JobOffer {
    id: number;
    title: string;
    description: string;
    contractType: string; // CDI, CDD, etc.
    location: string;
    salary: number;
    remote: string; // ON_SITE, HYBRID, etc.
    requirements: string;
    companyId: number;
    createdAt: string;
    isActive: boolean;

    // Optional frontend fields
    companyName?: string;
    companyLogo?: string;
    matchingScore?: number;
    requiredSkills?: string[];
    requiredLevel?: string;
    experienceYears?: number;
}
