import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PricingPlan } from '../models/pricing-plan.model';
import { Subscription } from '../models/subscription.model';

@Injectable({
    providedIn: 'root'
})
export class PricingService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8091/sub';

    readonly plans = signal<PricingPlan[]>([]);

    getActivePlans(): Observable<PricingPlan[]> {
        return this.http.get<PricingPlan[]>(`${this.apiUrl}/plans`);
    }

    getAllPlans(): Observable<PricingPlan[]> {
        return this.http.get<PricingPlan[]>(`${this.apiUrl}/plans/all`);
    }

    getPlanById(id: number): Observable<PricingPlan> {
        return this.http.get<PricingPlan>(`${this.apiUrl}/plans/${id}`);
    }

    createPlan(plan: Partial<PricingPlan>): Observable<PricingPlan> {
        return this.http.post<PricingPlan>(`${this.apiUrl}/plans`, plan);
    }

    updatePlan(id: number, plan: Partial<PricingPlan>): Observable<PricingPlan> {
        return this.http.put<PricingPlan>(`${this.apiUrl}/plans/${id}`, plan);
    }

    deletePlan(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/plans/${id}`);
    }

    subscribe(userId: number, userRole: string, planId: number, billingCycle: string): Observable<Subscription> {
        const subscriptionData = {
            userId,
            userRole,
            planId,
            billingCycle
        };
        return this.http.post<Subscription>(`${this.apiUrl}/subscriptions`, subscriptionData);
    }

    getAllSubscriptions(): Observable<Subscription[]> {
        return this.http.get<Subscription[]>(`${this.apiUrl}/subscriptions`);
    }

    getCurrentSubscription(userId: number): Observable<Subscription> {
        return this.http.get<Subscription>(`${this.apiUrl}/subscriptions/user/${userId}/current`);
    }

    cancelSubscription(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/subscriptions/${id}/cancel`, {});
    }

    deleteSubscription(id: number | string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/subscriptions/${id}`);
    }
}
