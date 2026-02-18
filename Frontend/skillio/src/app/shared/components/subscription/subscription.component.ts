import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

interface PricingPlan {
    id: number;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string;
    isActive: boolean;
    highlight: boolean;
}

interface Subscription {
    id: number;
    userId: number;
    userRole: string;
    planId: number;
    billingCycle: string;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
}

@Component({
    selector: 'app-subscription',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6 bg-slate-900 min-h-screen text-white">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold mb-2">My Subscription</h2>
          <p class="text-slate-400">Manage your plan and billing preferences</p>
        </div>

        <!-- Current Subscription Card -->
        @if (currentSubscription()) {
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-12 shadow-xl animate-fade-in">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-semibold tracking-wider">
                    {{ currentSubscription()?.status }}
                  </span>
                  <h3 class="text-2xl font-bold uppercase tracking-tight">
                    {{ getPlanName(currentSubscription()?.planId) }} Plan
                  </h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-slate-300">
                  <div class="flex items-center gap-3">
                    <span class="text-slate-500 w-24">Billing:</span>
                    <span class="font-medium capitalize">{{ currentSubscription()?.billingCycle }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-slate-500 w-24">Starts:</span>
                    <span class="font-medium">{{ currentSubscription()?.startDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-slate-500 w-24">Expires:</span>
                    <span class="font-medium">{{ currentSubscription()?.endDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-slate-500 w-24">Created:</span>
                    <span class="font-medium">{{ currentSubscription()?.createdAt | date:'mediumDate' }}</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 w-full md:w-auto">
                <button 
                  (click)="cancelSubscription()"
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-900/20">
                  Cancel Subscription
                </button>
                <p class="text-xs text-slate-500 text-center">Cancel any time. No strings attached.</p>
              </div>
            </div>
          </div>
        } @else {
          <!-- Available Plans Logic -->
          <div class="flex justify-center items-center gap-4 mb-10">
            <span [class.text-white]="!isYearly" [class.text-slate-500]="isYearly" class="font-medium">Monthly</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="isYearly" class="sr-only peer">
              <div class="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span [class.text-white]="isYearly" [class.text-slate-500]="!isYearly" class="font-medium flex items-center gap-2">
              Yearly
              <span class="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-lg font-bold border border-green-500/20">Save 20%</span>
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (plan of plans(); track plan.id) {
              <div 
                [class.ring-2]="plan.highlight" 
                [class.ring-blue-600]="plan.highlight"
                class="relative bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col transition-all hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-blue-900/20">
                
                @if (plan.highlight) {
                  <span class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full tracking-widest uppercase">
                    Recommended
                  </span>
                }

                <h4 class="text-xl font-bold mb-2">{{ plan.name }}</h4>
                <p class="text-slate-400 text-sm mb-6 min-h-[40px]">{{ plan.description }}</p>

                <div class="mb-8">
                  <span class="text-4xl font-bold">
                    $ {{ isYearly ? plan.yearlyPrice : plan.monthlyPrice }}
                  </span>
                  <span class="text-slate-500">/{{ isYearly ? 'yr' : 'mo' }}</span>
                </div>

                <ul class="space-y-4 mb-8 flex-grow">
                  @for (feature of getFeaturesList(plan.features); track feature) {
                    <li class="flex items-start gap-3 text-sm text-slate-300">
                      <svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {{ feature }}
                    </li>
                  }
                </ul>

                <button 
                  (click)="subscribe(plan.id)"
                  [class.bg-blue-600]="plan.highlight"
                  [class.hover:bg-blue-700]="plan.highlight"
                  [class.bg-slate-700]="!plan.highlight"
                  [class.hover:bg-slate-600]="!plan.highlight"
                  class="w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Subscribe Now
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SubscriptionComponent implements OnInit {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private apiUrl = 'http://localhost:8091/sub';

    plans = signal<PricingPlan[]>([]);
    currentSubscription = signal<Subscription | null>(null);
    isYearly = false;

    get currentUser() {
        return this.auth.currentUser();
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        if (!this.currentUser) return;

        this.http.get<Subscription>(`${this.apiUrl}/subscriptions/user/${this.currentUser.id}/current`)
            .pipe(catchError(() => of(null)))
            .subscribe((sub: Subscription | null) => {
                if (sub && sub.status === 'ACTIVE') {
                    this.currentSubscription.set(sub);
                    this.loadPlans();
                } else {
                    this.currentSubscription.set(null);
                    this.loadPlans();
                }
            });
    }

    loadPlans() {
        this.http.get<PricingPlan[]>(`${this.apiUrl}/plans`)
            .subscribe((plans: PricingPlan[]) => this.plans.set(plans));
    }

    subscribe(planId: number) {
        if (!this.currentUser) return;

        const body = {
            userId: Number(this.currentUser.id),
            userRole: this.currentUser.role,
            planId: planId,
            billingCycle: this.isYearly ? 'YEARLY' : 'MONTHLY'
        };

        this.http.post<Subscription>(`${this.apiUrl}/subscriptions`, body)
            .subscribe({
                next: (res: Subscription) => {
                    alert('Successfully subscribed to ' + this.getPlanName(planId) + '!');
                    this.refresh();
                },
                error: () => alert('Failed to create subscription. Please try again.')
            });
    }

    cancelSubscription() {
        const sub = this.currentSubscription();
        if (!sub) return;

        if (confirm('Are you sure you want to cancel your active subscription? You will lose access to premium features immediately.')) {
            this.http.put(`${this.apiUrl}/subscriptions/${sub.id}/cancel`, {})
                .subscribe({
                    next: () => {
                        alert('Subscription cancelled successfully.');
                        this.refresh();
                    },
                    error: () => alert('Failed to cancel subscription.')
                });
        }
    }

    getFeaturesList(features: string): string[] {
        return features ? features.split(',').map(f => f.trim()) : [];
    }

    getPlanName(planId: number | undefined): string {
        if (!planId) return 'Unknown';
        const plan = this.plans().find(p => p.id === planId);
        return plan ? plan.name : 'Subscription';
    }
}
