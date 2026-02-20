import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from '../../../core/services/pricing.service';
import { AuthService } from '../../../core/services/auth.service';
import { PricingPlan } from '../../../core/models/pricing-plan.model';
import { Subscription } from '../../../core/models/subscription.model';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-student-subscription',
   standalone: true,
   imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
   template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Student Premium</h1>
        <p class="text-gray-500">Unlock unlimited courses and premium features</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      } @else if (currentSubscription()) {
        <div class="bg-white rounded-2xl shadow-lg border border-violet-100 overflow-hidden max-w-3xl mx-auto">
          <div class="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white relative overflow-hidden">
             <div class="relative z-10">
                <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm mb-4 inline-block">CURRENT PLAN</span>
                <h2 class="text-3xl font-bold mb-2">{{ getPlanName(currentSubscription()!.planId) }}</h2>
                <p class="opacity-90">Renews on {{ currentSubscription()!.endDate | date:'mediumDate' }}</p>
             </div>
             <div class="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </div>
          <div class="p-8">
             <div class="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                <div>
                   <p class="text-sm text-gray-500 mb-1">Billing Cycle</p>
                   <p class="font-semibold text-gray-900">{{ currentSubscription()!.billingCycle }}</p>
                </div>
                <div>
                   <p class="text-sm text-gray-500 mb-1">Status</p>
                   <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">ACTIVE</span>
                </div>
                <div>
                   <p class="text-sm text-gray-500 mb-1">Started</p>
                   <p class="font-semibold text-gray-900">{{ currentSubscription()!.startDate | date:'mediumDate' }}</p>
                </div>
             </div>
             
             <div class="flex justify-end">
                <button mat-stroked-button color="warn" (click)="cancelSubscription()" class="text-red-600 border-red-200 hover:bg-red-50">
                   Cancel Subscription
                </button>
             </div>
          </div>
        </div>
      } @else {
        <div class="flex justify-center mb-8">
           <div class="bg-gray-100 p-1 rounded-xl inline-flex items-center">
              <button (click)="billingCycle.set('MONTHLY')" [class.bg-white]="billingCycle() === 'MONTHLY'" [class.shadow-sm]="billingCycle() === 'MONTHLY'" class="px-6 py-2 rounded-lg text-sm font-medium transition-all">Monthly</button>
              <button (click)="billingCycle.set('YEARLY')" [class.bg-white]="billingCycle() === 'YEARLY'" [class.shadow-sm]="billingCycle() === 'YEARLY'" class="px-6 py-2 rounded-lg text-sm font-medium transition-all">Yearly <span class="text-xs text-green-600 font-bold ml-1">-20%</span></button>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           @for (plan of plans(); track plan.id) {
              <div class="relative bg-white rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl p-8 flex flex-col"
                 [class.border-violet-500]="plan.highlight"
                 [class.shadow-lg]="plan.highlight"
                 [class.border-gray-200]="!plan.highlight">
                 @if (plan.highlight) {
                    <div class="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">RECOMMENDED</div>
                 }
                 <h3 class="text-xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
                 <p class="text-gray-500 text-sm mb-6">{{ plan.description }}</p>
                 <div class="mb-6">
                    <span class="text-4xl font-bold text-gray-900">{{ billingCycle() === 'MONTHLY' ? (plan.monthlyPrice | currency) : (plan.yearlyPrice | currency) }}</span>
                    <span class="text-gray-500">/{{ billingCycle() === 'MONTHLY' ? 'mo' : 'yr' }}</span>
                 </div>
                 <div class="flex-1 space-y-3 mb-8">
                    @for (feature of parseFeatures(plan.features); track feature) {
                       <div class="flex items-start gap-3">
                          <mat-icon class="text-green-500 text-sm mt-0.5">check_circle</mat-icon>
                          <span class="text-sm text-gray-600">{{ feature }}</span>
                       </div>
                    }
                 </div>
                 <button mat-flat-button color="primary" (click)="subscribe(plan)" class="w-full py-3 h-auto rounded-xl font-bold" [class.bg-violet-600]="plan.highlight" [class.bg-gray-900]="!plan.highlight">Choose {{ plan.name }}</button>
              </div>
           }
        </div>
      }
    </div>
  `
})
export class StudentSubscriptionComponent implements OnInit {
   private pricingService = inject(PricingService);
   private authService = inject(AuthService);
   private toastr = inject(ToastrService);

   plans = signal<PricingPlan[]>([]);
   currentSubscription = signal<Subscription | null>(null);
   loading = signal(true);
   billingCycle = signal<'MONTHLY' | 'YEARLY'>('MONTHLY');

   ngOnInit() {
      this.loadData();
   }

   loadData() {
      const userIds = this.authService.currentUser()?.id;
      if (!userIds) return;
      const userId = Number(userIds);

      this.loading.set(true);
      this.pricingService.getCurrentSubscription(userId).subscribe({
         next: (sub) => {
            if (sub && sub.status === 'ACTIVE') this.currentSubscription.set(sub);
            this.loading.set(false);
         },
         error: () => this.loading.set(false)
      });

      this.pricingService.getActivePlans().subscribe({
         next: (data) => this.plans.set(data)
      });
   }

   getPlanName(planId: number): string {
      const plan = this.plans().find(p => p.id === planId);
      return plan ? plan.name : 'Unknown Plan';
   }

   parseFeatures(featuresStr: string): string[] {
      if (!featuresStr) return [];
      return featuresStr.split(',').map(f => f.trim());
   }

   subscribe(plan: PricingPlan) {
      const userIds = this.authService.currentUser()?.id;
      if (!userIds) return;
      const userId = Number(userIds);

      if (confirm(`Subscribe to ${plan.name} (${this.billingCycle()})?`)) {
         this.pricingService.subscribe(userId, 'STUDENT', plan.id, this.billingCycle()).subscribe({
            next: (sub: Subscription) => {
               this.currentSubscription.set(sub);
               this.toastr.success(`Subscribed to ${plan.name} successfully!`);
            },
            error: () => this.toastr.error('Subscription failed')
         });
      }
   }

   cancelSubscription() {
      const sub = this.currentSubscription();
      if (!sub) return;

      if (confirm('Cancel subscription?')) {
         this.pricingService.cancelSubscription(sub.id).subscribe({
            next: () => {
               this.currentSubscription.set(null);
               this.toastr.info('Subscription cancelled');
            },
            error: () => this.toastr.error('Cancellation failed')
         });
      }
   }
}
