export interface PricingPlan {
    id: number;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string;
    isActive: boolean;
    highlight: boolean;

    // Helper for frontend logic to parse features string
    featuresList?: { name: string; included: boolean }[];
}
