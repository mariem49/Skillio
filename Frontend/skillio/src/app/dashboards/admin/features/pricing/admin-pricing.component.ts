import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PricingService } from '../../../../core/services/pricing.service';
import { PricingPlan } from '../../../../core/models/pricing-plan.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Pricing Plans Management</h1>
        <button mat-flat-button color="primary" (click)="toggleForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          <mat-icon class="mr-2">add</mat-icon> {{ showForm() ? 'Cancel' : 'Add Plan' }}
        </button>
      </div>

      <!-- Form Section -->
      @if (showForm()) {
        <div class="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-navy-700">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{{ isEditing() ? 'Edit Plan' : 'New Plan' }}</h2>
          <form [formGroup]="planForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <select formControlName="name" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="BASIC">BASIC</option>
                  <option value="PRO">PRO</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input type="text" formControlName="description" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Price</label>
                <input type="number" formControlName="monthlyPrice" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yearly Price</label>
                <input type="number" formControlName="yearlyPrice" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features (comma separated)</label>
                <textarea formControlName="features" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div class="flex items-center gap-6">
                 <div class="flex items-center">
                    <mat-slide-toggle formControlName="isActive" color="primary">Active</mat-slide-toggle>
                 </div>
                 <div class="flex items-center">
                    <mat-slide-toggle formControlName="highlight" color="warn">Highlight (Recommended)</mat-slide-toggle>
                 </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" (click)="toggleForm()" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" [disabled]="planForm.invalid" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isEditing() ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Table Section -->
      <div class="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-navy-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
              <tr>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Monthly</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Yearly</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Active</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Highlight</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-navy-700">
              @for (plan of plans(); track plan.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
                  <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">{{ plan.name }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ plan.description }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ plan.monthlyPrice | currency }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ plan.yearlyPrice | currency }}</td>
                  <td class="px-6 py-4">
                    <span [class]="plan.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ plan.isActive ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    @if (plan.highlight) {
                        <mat-icon class="text-yellow-500">star</mat-icon>
                    }
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="editPlan(plan)" class="text-blue-500 hover:text-blue-600 mr-3">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button (click)="deletePlan(plan.id)" class="text-red-500 hover:text-red-600">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-6 py-8 text-center text-gray-500">No pricing plans found</td>
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
export class AdminPricingComponent {
  private pricingService = inject(PricingService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  plans = signal<PricingPlan[]>([]);
  showForm = signal(false);
  isEditing = signal(false);
  editId: number | null = null;

  planForm = this.fb.group({
    name: ['BASIC', Validators.required],
    description: ['', Validators.required],
    monthlyPrice: [0, Validators.required],
    yearlyPrice: [0, Validators.required],
    features: ['', Validators.required],
    isActive: [true],
    highlight: [false]
  });

  constructor() {
    this.loadPlans();
  }

  loadPlans() {
    this.pricingService.getAllPlans().subscribe({
      next: (data: PricingPlan[]) => this.plans.set(data),
      error: (err) => console.error('Error loading plans', err)
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.planForm.reset({
      name: 'BASIC',
      isActive: true,
      highlight: false,
      monthlyPrice: 0,
      yearlyPrice: 0
    });
    this.isEditing.set(false);
    this.editId = null;
  }

  editPlan(plan: PricingPlan) {
    this.isEditing.set(true);
    this.editId = plan.id;
    this.planForm.patchValue(plan);
    this.showForm.set(true);
  }

  deletePlan(id: number) {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.pricingService.deletePlan(id).subscribe({
        next: () => {
          this.toastr.success('Plan deleted successfully');
          this.loadPlans();
        },
        error: () => this.toastr.error('Failed to delete plan')
      });
    }
  }

  onSubmit() {
    if (this.planForm.valid) {
      const formValue = this.planForm.value;

      if (this.isEditing() && this.editId) {
        const planData = { ...formValue, id: this.editId } as any;
        this.pricingService.updatePlan(this.editId, planData).subscribe({
          next: () => {
            this.toastr.success('Plan updated successfully');
            this.loadPlans();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to update plan')
        });
      } else {
        const planData = formValue as any;
        this.pricingService.createPlan(planData).subscribe({
          next: () => {
            this.toastr.success('Plan created successfully');
            this.loadPlans();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to create plan')
        });
      }
    }
  }
}
