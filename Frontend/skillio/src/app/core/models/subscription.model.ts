export interface Subscription {
    id: number;
    userId: number;
    userRole: string;
    planId: number;
    billingCycle: string;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;

    // Optional for frontend display
    planName?: string;
}
