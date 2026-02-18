export interface Subscription {
    id: number;
    userId: number;
    userRole: string;
    planId: number;
    billingCycle: 'MONTHLY' | 'YEARLY';
    status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
    startDate: string;
    endDate?: string;
    createdAt?: string;

    // Optional for frontend display
    planName?: string;
    planPrice?: number;
}
