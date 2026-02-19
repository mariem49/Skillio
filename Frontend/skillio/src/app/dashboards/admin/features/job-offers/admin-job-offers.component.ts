import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobOfferService } from '../../../../core/services/job-offer.service';
import { CompanyService } from '../../../../core/services/company.service';
import { JobOffer } from '../../../../core/models/job-offer.model';
import { Company } from '../../../../core/models/company.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-job-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Job Offers Management</h1>
        <button mat-flat-button color="primary" (click)="toggleForm()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          <mat-icon class="mr-2">add</mat-icon> {{ showForm() ? 'Cancel' : 'Add Job Offer' }}
        </button>
      </div>

      <!-- Job Offer Form -->
      <div *ngIf="showForm()" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{{ isEditing() ? 'Edit Offer' : 'New Offer' }}</h2>
        <form [formGroup]="offerForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input type="text" formControlName="title"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
              <select formControlName="companyId"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option [ngValue]="null" disabled>Select a company</option>
                <option *ngFor="let comp of companies" [ngValue]="comp.id">{{ comp.name }}</option>
              </select>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Contract Type</label>
              <select formControlName="contractType"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input type="text" formControlName="location"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Salary</label>
              <input type="number" formControlName="salary"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Remote</label>
              <select formControlName="remote"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option value="ON_SITE">On Site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="FULL_REMOTE">Full Remote</option>
              </select>
            </div>

            <div class="flex items-center">
              <input type="checkbox" formControlName="isActive" id="isActive"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="isActive" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Active</label>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea formControlName="description" rows="3"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</label>
              <textarea formControlName="requirements" rows="3"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" (click)="toggleForm()"
              class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" [disabled]="offerForm.invalid"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditing() ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Table of Job Offers -->
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
  <table class="w-full text-left border-collapse">
    <thead class="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <tr>
        <th class="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
        <th class="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Company</th>
        <th class="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Contract</th>
        <th class="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Location</th>
        <th class="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Salary</th>
        <th class="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Active</th>
        <th class="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
      <tr *ngFor="let offer of offers()" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <td class="px-6 py-4 text-gray-900 dark:text-white font-medium">{{ offer.title }}</td>
        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ offer.companyName }}</td>
        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
          <span class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-xs font-semibold">{{ offer.contractType }}</span>
        </td>
        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ offer.location }} ({{ offer.remote }})</td>
        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ offer.salary | currency }}</td>
        <td class="px-6 py-4 text-center">
          <span [ngClass]="offer.isActive ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'" 
                class="px-3 py-1 rounded-full text-xs font-semibold">
            {{ offer.isActive ? 'Yes' : 'No' }}
          </span>
        </td>
        <td class="px-6 py-4 text-center flex justify-center gap-2">
          <button (click)="editOffer(offer)" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1">
            <mat-icon class="text-sm">edit</mat-icon> Edit
          </button>
          <button (click)="deleteOffer(offer.id)" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1">
            <mat-icon class="text-sm">delete</mat-icon> Delete
          </button>
        </td>
      </tr>
      <tr *ngIf="offers().length === 0">
        <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No job offers found</td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  `
})
export class AdminJobOffersComponent implements OnInit {
  private jobOfferService = inject(JobOfferService);
  private companyService = inject(CompanyService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  offers = signal<(JobOffer & { companyName: string })[]>([]);
  companies: Company[] = [];

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
    companyId: [null, Validators.required],
    isActive: [true]
  });

  ngOnInit() {
    this.loadCompanies();
    this.loadOffers();
  }

  loadCompanies() {
    this.companyService.getAll().subscribe({
      next: (data) => { this.companies = data; this.mapCompanyNames(); },
      error: (err) => console.error(err)
    });
  }

  loadOffers() {
    this.jobOfferService.getAll().subscribe({
      next: (data: JobOffer[]) => { this.offers.set(data.map(o => ({ ...o, companyName: this.getCompanyName(o.companyId) }))); },
      error: (err) => console.error(err)
    });
  }

  getCompanyName(companyId: number | null) {
    return this.companies.find(c => c.id === companyId)?.name ?? 'Unknown';
  }

  mapCompanyNames() {
    this.offers.set(this.offers().map(o => ({ ...o, companyName: this.getCompanyName(o.companyId) })));
  }

  toggleForm() { this.showForm.update(v => !v); if (!this.showForm()) this.resetForm(); }
  resetForm() { this.offerForm.reset({ title:'', description:'', contractType:'CDI', location:'', salary:0, remote:'ON_SITE', requirements:'', companyId:null, isActive:true }); this.isEditing.set(false); this.editId=null; }
  editOffer(offer: JobOffer & { companyName: string }) { this.isEditing.set(true); this.editId = offer.id; this.offerForm.patchValue(offer as any); this.showForm.set(true); }
  deleteOffer(id: number) { if(confirm('Are you sure?')) this.jobOfferService.delete(id).subscribe({next:()=>{this.toastr.success('Offer deleted'); this.loadOffers();}, error:()=>this.toastr.error('Failed')}); }

  onSubmit() {
    if (!this.offerForm.valid) return;
    const formValue = this.offerForm.value;
    const offerData: Partial<JobOffer> = {
      title: formValue.title ?? '',
      description: formValue.description ?? '',
      contractType: formValue.contractType ?? 'CDI',
      location: formValue.location ?? '',
      salary: formValue.salary ?? 0,
      remote: formValue.remote ?? 'ON_SITE',
      requirements: formValue.requirements ?? '',
      isActive: formValue.isActive ?? true,
      companyId: formValue.companyId!
    };

    if (this.isEditing() && this.editId) {
      this.jobOfferService.update(this.editId, offerData).subscribe({
        next: () => { this.toastr.success('Offer updated'); this.loadOffers(); this.toggleForm(); },
        error: () => this.toastr.error('Failed to update offer')
      });
    } else {
      this.jobOfferService.create(offerData).subscribe({
        next: () => { this.toastr.success('Offer created'); this.loadOffers(); this.toggleForm(); },
        error: () => this.toastr.error('Failed to create offer')
      });
    }
  }
}
