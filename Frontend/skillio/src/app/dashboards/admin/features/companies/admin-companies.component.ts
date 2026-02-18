import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../../core/services/company.service';
import { Company } from '../../../../core/models/company.model';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Companies Management</h1>
        <button mat-flat-button color="primary" (click)="toggleForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          <mat-icon class="mr-2">add</mat-icon> {{ showForm() ? 'Cancel' : 'Add Company' }}
        </button>
      </div>

      <!-- Form Section -->
      @if (showForm()) {
        <div class="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-navy-700">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{{ isEditing() ? 'Edit Company' : 'New Company' }}</h2>
          <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" formControlName="name" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                <input type="text" formControlName="industry" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" formControlName="location" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                <input type="text" formControlName="website" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
                <input type="text" formControlName="logoUrl" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" formControlName="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="text" formControlName="phone" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enterprise User ID</label>
                <input type="number" formControlName="enterpriseUserId" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea formControlName="description" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" (click)="toggleForm()" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" [disabled]="companyForm.invalid" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Logo</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Industry</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Location</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">User ID</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-navy-700">
              @for (company of companies(); track company.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors">
                  <td class="px-6 py-4">
                    <img [src]="company.logoUrl || 'https://ui-avatars.com/api/?name=' + company.name" class="w-10 h-10 rounded-lg object-cover bg-gray-100">
                  </td>
                  <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ company.name }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ company.industry }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ company.location }}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{ company.enterpriseUserId }}</td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="editCompany(company)" class="text-blue-500 hover:text-blue-600 mr-3">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button (click)="deleteCompany(company.id)" class="text-red-500 hover:text-red-600">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-8 text-center text-gray-500">No companies found</td>
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
export class AdminCompaniesComponent {
  private companyService = inject(CompanyService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  companies = signal<Company[]>([]);
  showForm = signal(false);
  isEditing = signal(false);
  editId: number | null = null;

  companyForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    industry: ['', Validators.required],
    location: ['', Validators.required],
    website: [''],
    logoUrl: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    enterpriseUserId: [null, Validators.required]
  });

  constructor() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getAll().subscribe({
      next: (data: Company[]) => this.companies.set(data),
      error: (err) => console.error('Error loading companies', err)
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.companyForm.reset();
    this.isEditing.set(false);
    this.editId = null;
  }

  editCompany(company: Company) {
    this.isEditing.set(true);
    this.editId = company.id;
    this.companyForm.patchValue(company as any);
    this.showForm.set(true);
  }

  deleteCompany(id: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Company deleted successfully');
          this.loadCompanies();
        },
        error: () => this.toastr.error('Failed to delete company')
      });
    }
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const formValue = this.companyForm.value;

      if (this.isEditing() && this.editId) {
        const companyData = { ...formValue, id: this.editId } as any;
        this.companyService.update(this.editId, companyData).subscribe({
          next: () => {
            this.toastr.success('Company updated successfully');
            this.loadCompanies();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to update company')
        });
      } else {
        const companyData = formValue as any;
        this.companyService.create(companyData).subscribe({
          next: () => {
            this.toastr.success('Company created successfully');
            this.loadCompanies();
            this.toggleForm();
          },
          error: () => this.toastr.error('Failed to create company')
        });
      }
    }
  }
}
