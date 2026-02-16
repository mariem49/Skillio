export interface JobOffer {
    id: number;
    companyId: number;
    companyName: string;
    companyLogo: string;
    title: string;
    description: string;
    contractType: 'CDI' | 'CDD' | 'Stage' | 'Alternance';
    location: string;
    remote: 'no' | 'partial' | 'full-remote';
    salary?: string;
    duration?: string; // For Stage/CDD
    startDate: string; // ISO Date
    requiredLevel: 'Bac' | 'Bac+2' | 'Bac+3' | 'Bac+5';
    experienceYears: number;
    requiredSkills: string[];
    requiredLanguages: { language: string; level: string }[];
    postedAt: string;
    matchingScore?: number; // Calculated on frontend
    matchingReasons?: string[];
}
