import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { PricingPlan } from '../models/pricing-plan.model';
import { Subscription } from '../models/subscription.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PricingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/sub`;

    readonly plans = signal<PricingPlan[]>([]);

    loadPlans(): Observable<PricingPlan[]> {
        return this.http.get<PricingPlan[]>(`${this.apiUrl}/plans`).pipe(
            tap(plans => this.plans.set(plans))
        );
    }

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

    subscribe(userId: number, userRole: string, planId: number, billingCycle: 'MONTHLY' | 'YEARLY'): Observable<Subscription> {
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

    deleteSubscription(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/subscriptions/${id}`);
    }
}
