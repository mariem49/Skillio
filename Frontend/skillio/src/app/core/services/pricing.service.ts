import { Injectable, signal } from '@angular/core';

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: { name: string; included: boolean }[];
    highlight?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PricingService {
    readonly plans = signal<PricingPlan[]>([
        {
            id: 'basic',
            name: 'Basic Plan',
            description: 'Perfect for getting started',
            monthlyPrice: 20,
            yearlyPrice: 192, // 20% discount: 20 * 12 * 0.8
            features: [
                { name: 'Access to free courses', included: true },
                { name: 'Limited course materials', included: true },
                { name: 'Basic support', included: true },
                { name: 'Certificate of completion', included: false },
                { name: '1-on-1 Mentorship', included: false },
                { name: 'Offline access', included: false },
            ]
        },
        {
            id: 'pro',
            name: 'Professional Plan',
            description: 'Best for career growth',
            monthlyPrice: 59,
            yearlyPrice: 566, // 20% discount
            highlight: true,
            features: [
                { name: 'Access to all courses', included: true },
                { name: 'Full course materials', included: true },
                { name: 'Priority support', included: true },
                { name: 'Certificate of completion', included: true },
                { name: '1-on-1 Mentorship', included: false },
                { name: 'Offline access', included: false },
            ]
        },
        {
            id: 'premium',
            name: 'Premium Plan',
            description: 'Complete mastery package',
            monthlyPrice: 99,
            yearlyPrice: 950, // 20% discount
            features: [
                { name: 'Access to all courses', included: true },
                { name: 'Full course materials', included: true },
                { name: '24/7 Priority support', included: true },
                { name: 'Certificate of completion', included: true },
                { name: '1-on-1 Mentorship', included: true },
                { name: 'Offline access', included: true },
            ]
        }
    ]);
}
