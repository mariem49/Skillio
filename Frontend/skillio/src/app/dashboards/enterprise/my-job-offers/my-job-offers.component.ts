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
          <p class="text-gray-500">Manage job postings</p>
        </div>
        <button mat-flat-button color="primary" (click)="toggleForm()" class="bg-violet-600">
          <mat-icon>add</mat-icon> Post New Job
        </button>
      </div>

      <!-- Job Offer Form -->
      <div *ngIf="showForm()" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">{{ isEditing() ? 'Edit Job Offer' : 'New Job Offer' }}</h2>
        <form [formGroup]="offerForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="form-group md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input formControlName="title" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300">
            </div>

           <div class="form-group md:col-span-2">
  <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
  <select formControlName="companyId" class="w-full px-4 py-2 rounded-lg border border-gray-300">
    <option [ngValue]="null" disabled>Select a company</option>
    <option *ngFor="let comp of companies" [ngValue]="comp.id">{{ comp.name }}</option>
  </select>
</div>

            <!-- Contract Type -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
              <select formControlName="contractType" class="w-full px-4 py-2 rounded-lg border border-gray-300">
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>

            <!-- Location -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input formControlName="location" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300">
            </div>

            <!-- Salary -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">Salary (Annual)</label>
              <input formControlName="salary" type="number" class="w-full px-4 py-2 rounded-lg border border-gray-300">
            </div>

            <!-- Remote -->
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">Remote Policy</label>
              <select formControlName="remote" class="w-full px-4 py-2 rounded-lg border border-gray-300">
                <option value="ON_SITE">On Site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="FULL_REMOTE">Full Remote</option>
              </select>
            </div>

            <!-- Active -->
            <div class="form-group md:col-span-2">
              <div class="flex items-center">
                <input formControlName="isActive" type="checkbox" id="isActive" class="w-4 h-4">
                <label for="isActive" class="ml-2 text-sm font-medium text-gray-900">Active</label>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea formControlName="description" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300"></textarea>
            </div>

            <!-- Requirements -->
            <div class="form-group md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <textarea formControlName="requirements" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300"></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" (click)="toggleForm()" class="px-6 py-2 rounded-lg border border-gray-300">Cancel</button>
            <button type="submit" [disabled]="offerForm.invalid" class="px-6 py-2 rounded-lg bg-violet-600 text-white">
              {{ isEditing() ? 'Update Offer' : 'Post Offer' }}
            </button>
          </div>
        </form>
      </div>

      <!-- List of Offers -->
      <div class="grid gap-4">
        <div *ngFor="let offer of offers()">
          <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <h3 class="font-bold">{{ offer.title }}</h3>
              <p>Company ID: {{ offer.companyId }}</p>
            </div>
            <div class="flex gap-2">
              <button mat-icon-button (click)="editOffer(offer)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button (click)="deleteOffer(offer.id)"><mat-icon>delete</mat-icon></button>
            </div>
          </div>
        </div>
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
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  companies: Company[] = [];

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
  isActive: [true],
  companyId: [null as number | null, Validators.required] // important
});

  ngOnInit() {
    this.loadCompanies();
    console.log('ngOnInit called');
  this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getAll().subscribe({
      next: (comps) => {
        this.companies = comps;
        console.log(this.companies);
      },
      error: (err) => console.error(err)
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
      title: '',
      description: '',
      contractType: 'CDI',
      location: '',
      salary: 0,
      remote: 'ON_SITE',
      requirements: '',
      isActive: true,
      companyId: null
    });
    this.isEditing.set(false);
    this.editId = null;
  }

  editOffer(offer: JobOffer) {
    this.isEditing.set(true);
    this.editId = offer.id;
    this.offerForm.patchValue({
      ...offer,
      companyId: offer.companyId
    });
    this.showForm.set(true);
  }

  deleteOffer(id: number) {
    if (!confirm('Are you sure?')) return;
    this.jobOfferService.delete(id).subscribe({
      next: () => {
        this.toastr.success('Offer deleted');
        this.loadOffers();
      },
      error: () => this.toastr.error('Failed to delete offer')
    });
  }

  onSubmit() {
    if (this.offerForm.invalid) return;
    const formValue = this.offerForm.value;
    const offerData: Partial<JobOffer> = {
      ...formValue,
      title: formValue.title ?? '',
      description: formValue.description ?? '',
      location: formValue.location ?? '',
      contractType: formValue.contractType ?? 'CDI',
      remote: formValue.remote ?? 'ON_SITE',
      salary: formValue.salary ?? 0,
      requirements: formValue.requirements ?? '',
      isActive: formValue.isActive ?? true,
      companyId: formValue.companyId! // ✅ assure number
    };

    if (this.isEditing() && this.editId) {
      this.jobOfferService.update(this.editId, offerData).subscribe({
        next: () => {
          this.toastr.success('Offer updated');
          this.loadOffers();
          this.toggleForm();
        },
        error: () => this.toastr.error('Failed to update offer')
      });
    } else {
      this.jobOfferService.create(offerData).subscribe({
        next: () => {
          this.toastr.success('Offer posted');
          this.loadOffers();
          this.toggleForm();
        },
        error: () => this.toastr.error('Failed to post offer')
      });
    }
  }

  loadOffers() {
    this.jobOfferService.getAll().subscribe({
      next: (data) => this.offers.set(data),
      error: (err) => console.error(err)
    });
  }
}
