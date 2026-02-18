import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobOfferService } from '../../../../core/services/job-offer.service';
import { JobOffer } from '../../../../core/models/job-offer.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-job-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Job Offers Management</h1>
        <button mat-flat-button color="primary" (click)="toggleForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          <mat-icon class="mr-2">add</mat-icon> {{ showForm() ? 'Cancel' : 'Add Job Offer' }}
        </button>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 mb-6 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-navy-700">
        <select [(ngModel)]="filterContract" (change)="loadOffers()" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white">
          <option value="">All Contracts</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FREELANCE">Freelance</option>
        </select>
        <select [(ngModel)]="filterRemote" (change)="loadOffers()" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white">
          <option value="">All Remote</option>
          <option value="ON_SITE">On Site</option>
          <option value="HYBRID">Hybrid</option>
          <option value="FULL_REMOTE">Full Remote</option>
        </select>
        <button (click)="loadOffers()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700">Apply Filters</button>
      </div>

      <!-- Form Section -->
      @if (showForm()) {
        <div class="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-navy-700">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{{ isEditing() ? 'Edit Offer' : 'New Offer' }}</h2>
          <form [formGroup]="offerForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" formControlName="title" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company ID</label>
                <input type="number" formControlName="companyId" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contract Type</label>
                <select formControlName="contractType" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" formControlName="location" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
                <input type="number" formControlName="salary" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remote</label>
                <select formControlName="remote" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="ON_SITE">On Site</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="FULL_REMOTE">Full Remote</option>
                </select>
              </div>
              <div class="form-group flex items-center">
                <input type="checkbox" formControlName="isActive" id="isActive" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="isActive" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
              </div>
              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea formControlName="description" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements</label>
                <textarea formControlName="requirements" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" (click)="toggleForm()" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" [disabled]="offerForm.invalid" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Company ID</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Contract</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Location</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Salary</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Active</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-navy-700">
              @for (offer of offers(); track offer.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ offer.title }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ offer.companyId }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{{ offer.contractType }}</span>
                  </td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {{ offer.location }} <span class="text-xs text-gray-400">({{ offer.remote }})</span>
                  </td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ offer.salary | currency }}</td>
                  <td class="px-6 py-4">
                    <span [class]="offer.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ offer.isActive ? 'True' : 'False' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="editOffer(offer)" class="text-blue-500 hover:text-blue-600 mr-3">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button (click)="deleteOffer(offer.id)" class="text-red-500 hover:text-red-600">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-6 py-8 text-center text-gray-500">No job offers found</td>
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
export class AdminJobOffersComponent {
  private jobOfferService = inject(JobOfferService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  offers = signal<JobOffer[]>([]);
  showForm = signal(false);
  isEditing = signal(false);
  editId: number | null = null;

  filterContract = '';
  filterRemote = '';

  offerForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    contractType: ['CDI', Validators.required],
    location: ['', Validators.required],
    salary: [0, Validators.required],
    remote: ['ON_SITE', Validators.required],
    requirements: ['', Validators.required],
    companyId: [null, Validators.required],
    isActive: [true]
  });

  constructor() {
    this.loadOffers();
  }

  loadOffers() {
    const filters: any = {};
    if (this.filterContract) filters.contractType = this.filterContract;
    if (this.filterRemote) filters.remote = this.filterRemote;

    this.jobOfferService.getAll(filters).subscribe({
      next: (data: JobOffer[]) => this.offers.set(data),
      error: (err) => console.error('Error loading offers', err)
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.offerForm.reset({
      contractType: 'CDI',
      remote: 'ON_SITE',
      isActive: true,
      salary: 0
    });
    this.isEditing.set(false);
    this.editId = null;
  }

  editOffer(offer: JobOffer) {
    this.isEditing.set(true);
    this.editId = offer.id;
    this.offerForm.patchValue(offer as any);
    this.showForm.set(true);
  }

  deleteOffer(id: number) {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.jobOfferService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Offer deleted successfully');
          this.loadOffers();
        },
        error: () => this.toastr.error('Failed to delete offer')
      });
    }
  }

  onSubmit() {
    if (this.offerForm.valid) {
      const formValue = this.offerForm.value;

      if (this.isEditing() && this.editId) {
        const offerData = { ...formValue, id: this.editId } as any;
        this.jobOfferService.update(this.editId, offerData).subscribe({
          next: () => {
            this.toastr.success('Offer updated successfully');
            this.loadOffers();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to update offer')
        });
      } else {
        const offerData = formValue as any;
        this.jobOfferService.create(offerData).subscribe({
          next: () => {
            this.toastr.success('Offer created successfully');
            this.loadOffers();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to create offer')
        });
      }
    }
  }
}
