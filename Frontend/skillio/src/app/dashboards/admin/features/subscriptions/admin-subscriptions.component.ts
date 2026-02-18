import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingService } from '../../../../core/services/pricing.service';
import { Subscription } from '../../../../core/models/subscription.model';
import { PricingPlan } from '../../../../core/models/pricing-plan.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, DatePipe],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Subscriptions Management</h1>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 mb-6 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700">
        <select [(ngModel)]="filterStatus" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      <!-- Table Section -->
      <div class="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-navy-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
              <tr>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">User ID</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Plan</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Cycle</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Start Date</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">End Date</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-navy-700">
              @for (sub of filteredSubscriptions(); track sub.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
                  <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ sub.userId }}</td>
                  <td class="px-6 py-4">
                     <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">{{ sub.userRole }}</span>
                  </td>
                  <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ getPlanName(sub.planId) }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ sub.billingCycle }}</td>
                  <td class="px-6 py-4">
                    <span [ngClass]="{
                        'bg-green-100 text-green-700': sub.status === 'ACTIVE',
                        'bg-red-100 text-red-700': sub.status === 'CANCELLED',
                        'bg-yellow-100 text-yellow-700': sub.status === 'EXPIRED'
                    }" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ sub.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">{{ sub.startDate | date:'mediumDate' }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">{{ sub.endDate | date:'mediumDate' }}</td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="deleteSubscription(sub.id)" class="text-red-500 hover:text-red-600" title="Delete Subscription">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="px-6 py-8 text-center text-gray-500">No subscriptions found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminSubscriptionsComponent {
  private pricingService = inject(PricingService);
  private toastr = inject(ToastrService);

  subscriptions = signal<Subscription[]>([]);
  plansMap = new Map<number, string>();

  filterStatus = '';

  filteredSubscriptions = computed(() => {
    const status = this.filterStatus;
    const subs = this.subscriptions();
    if (!status) return subs;
    return subs.filter(s => s.status === status);
  });

  constructor() {
    this.loadData();
  }

  loadData() {
    // Load plans for mapping names
    this.pricingService.getAllPlans().subscribe({
      next: (plans: PricingPlan[]) => {
        plans.forEach(p => this.plansMap.set(p.id, p.name));
      }
    });

    // Load subscriptions
    this.pricingService.getAllSubscriptions().subscribe({
      next: (data: Subscription[]) => this.subscriptions.set(data),
      error: (err) => console.error('Error loading subscriptions', err)
    });
  }

  getPlanName(planId: number): string {
    return this.plansMap.get(planId) || `Plan #${planId}`;
  }

  deleteSubscription(id: number) {
    if (confirm('Are you sure you want to permanently delete this subscription?')) {
      this.pricingService.deleteSubscription(id).subscribe({
        next: () => {
          this.toastr.success('Subscription deleted successfully');
          this.loadData();
        },
        error: () => this.toastr.error('Failed to delete subscription')
      });
    }
  }
}
