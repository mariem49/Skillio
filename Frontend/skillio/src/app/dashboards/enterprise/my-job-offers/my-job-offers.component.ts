import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobOfferService } from '../../../core/services/job-offer.service';
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { JobOffer } from '../../../core/models/job-offer.model';
import { Company } from '../../../core/models/company.model';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-my-job-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Job Offers</h1>
          <p class="text-gray-500">Manage your job postings</p>
        </div>
        @if (company()) {
          <button mat-flat-button color="primary" (click)="toggleForm()" class="bg-violet-600">
            <mat-icon>add</mat-icon> Post New Job
          </button>
        }
      </div>

      @if (!company()) {
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4">
          <mat-icon class="text-yellow-600">info</mat-icon>
          <div>
            <h3 class="font-semibold text-yellow-800">Company Profile Required</h3>
            <p class="text-yellow-700 mt-1">You need to create a company profile before posting job offers.</p>
            <button mat-button class="mt-3 text-yellow-800 font-semibold" routerLink="/enterprise/profile">Go to Profile</button>
          </div>
        </div>
      } @else if (showForm()) {
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">{{ isEditing() ? 'Edit Job Offer' : 'New Job Offer' }}</h2>
          <form [formGroup]="offerForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input formControlName="title" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                <select formControlName="contractType" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Remote Policy</label>
                <select formControlName="remote" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                  <option value="ON_SITE">On Site</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="FULL_REMOTE">Full Remote</option>
                </select>
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input formControlName="location" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Salary (Annual)</label>
                <input formControlName="salary" type="number" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea formControlName="description" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"></textarea>
              </div>
              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea formControlName="requirements" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"></textarea>
              </div>
              <div class="form-group md:col-span-2">
                <div class="flex items-center">
                  <input formControlName="isActive" type="checkbox" id="isActive" class="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500">
                  <label for="isActive" class="ml-2 text-sm font-medium text-gray-900">Active (Visible to candidates)</label>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" (click)="toggleForm()" class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" [disabled]="offerForm.invalid" class="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
                {{ isEditing() ? 'Update Offer' : 'Post Offer' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- List -->
      <div class="grid gap-4">
        @for (offer of offers(); track offer.id) {
          <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ offer.title }}</h3>
                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{{ offer.contractType }}</span>
                @if (!offer.isActive) {
                  <span class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-medium">Inactive</span>
                }
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1"><mat-icon class="text-sm">location_on</mat-icon> {{ offer.location }} ({{ offer.remote }})</span>
                <span class="flex items-center gap-1"><mat-icon class="text-sm">attach_money</mat-icon> {{ offer.salary | currency }}</span>
                <span class="text-gray-400">Posted {{ offer.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button mat-icon-button (click)="editOffer(offer)" class="text-gray-600 hover:text-violet-600">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteOffer(offer.id)" class="text-gray-600 hover:text-red-600">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        } @empty {
          @if (company()) {
            <div class="text-center py-12 text-gray-500">
              <mat-icon class="text-4xl text-gray-300 mb-2">work_off</mat-icon>
              <p>No job offers posted yet.</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class MyJobOffersComponent implements OnInit {
  private jobOfferService = inject(JobOfferService);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  company = signal<Company | null>(null);
  offers = signal<JobOffer[]>([]);
  showForm = signal(false);
  isEditing = signal(false);
  editId: number | null = null;

  offerForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    contractType: ['CDI', Validators.required],
    location: ['', Validators.required],
    salary: [0, Validators.required],
    remote: ['ON_SITE', Validators.required],
    requirements: ['', Validators.required],
    isActive: [true]
  });

  ngOnInit() {
    this.loadCompanyAndOffers();
  }

  loadCompanyAndOffers() {
    const userIds = this.authService.currentUser()?.id;
    if (!userIds) return;
    const userId = Number(userIds);

    this.companyService.getByEnterpriseUserId(userId).subscribe({
      next: (comp: Company) => {
        this.company.set(comp);
        this.loadOffers(comp.id);
      },
      error: () => console.log('No company profile found')
    });
  }

  loadOffers(companyId: number) {
    this.jobOfferService.getByCompany(companyId).subscribe({
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
          this.toastr.success('Offer deleted');
          if (this.company()) this.loadOffers(this.company()!.id);
        },
        error: () => this.toastr.error('Failed to delete offer')
      });
    }
  }

  onSubmit() {
    if (this.offerForm.invalid || !this.company()) return;

    const formValue = this.offerForm.value;

    if (this.isEditing() && this.editId) {
      const offerData = { ...formValue, id: this.editId, companyId: this.company()!.id } as any;
      this.jobOfferService.update(this.editId, offerData).subscribe({
        next: () => {
          this.toastr.success('Offer updated');
          this.loadOffers(this.company()!.id);
          this.toggleForm();
        },
        error: () => this.toastr.error('Failed to update')
      });
    } else {
      const offerData = { ...formValue, companyId: this.company()!.id } as any;
      this.jobOfferService.create(offerData).subscribe({
        next: () => {
          this.toastr.success('Offer posted');
          this.loadOffers(this.company()!.id);
          this.toggleForm();
        },
        error: () => this.toastr.error('Failed to post')
      });
    }
  }
}
