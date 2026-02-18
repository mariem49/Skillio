import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { Company } from '../../../core/models/company.model';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p class="text-gray-500">Manage your company information</p>
        </div>
        @if (company() && !isEditing()) {
          <button mat-flat-button color="primary" (click)="enableEdit()" class="bg-violet-600">
            <mat-icon>edit</mat-icon> Edit Profile
          </button>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      } @else if (!company() && !isEditing()) {
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-violet-600 text-2xl">business</mat-icon>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">No Company Profile Found</h2>
          <p class="text-gray-500 mb-8 max-w-md mx-auto">Create your company profile to start posting job offers and finding talent.</p>
          <button mat-flat-button color="primary" (click)="enableEdit()" class="bg-violet-600 px-8 py-2 h-12 rounded-xl">
            Create Profile
          </button>
        </div>
      } @else if (company() && !isEditing()) {
        <!-- Display Mode -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-8 border-b border-gray-100 flex items-start gap-6">
            <img [src]="company()?.logoUrl || 'https://ui-avatars.com/api/?name=' + company()?.name" class="w-24 h-24 rounded-xl object-cover bg-gray-50 border border-gray-200">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ company()?.name }}</h2>
              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                <span class="flex items-center gap-1"><mat-icon class="text-gray-400 text-sm">category</mat-icon> {{ company()?.industry }}</span>
                <span class="flex items-center gap-1"><mat-icon class="text-gray-400 text-sm">location_on</mat-icon> {{ company()?.location }}</span>
                <span class="flex items-center gap-1"><mat-icon class="text-gray-400 text-sm">language</mat-icon> {{ company()?.website }}</span>
              </div>
            </div>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2 space-y-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">About Us</h3>
                <p class="text-gray-600 leading-relaxed">{{ company()?.description }}</p>
              </div>
            </div>
            <div class="space-y-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Contact Info</h3>
                <div class="space-y-3 text-sm">
                  <div class="flex items-center gap-3 text-gray-600">
                    <mat-icon class="text-violet-500">email</mat-icon>
                    {{ company()?.email }}
                  </div>
                  <div class="flex items-center gap-3 text-gray-600">
                    <mat-icon class="text-violet-500">phone</mat-icon>
                    {{ company()?.phone }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Edit Form -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input formControlName="name" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input formControlName="industry" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input formControlName="location" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input formControlName="website" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input formControlName="email" type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input formControlName="phone" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="md:col-span-2 form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input formControlName="logoUrl" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
              </div>
              <div class="md:col-span-2 form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea formControlName="description" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"></textarea>
              </div>
            </div>
            
            <div class="flex justify-end gap-3">
              <button type="button" (click)="cancelEdit()" class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" [disabled]="profileForm.invalid" class="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
                {{ company() ? 'Update Profile' : 'Create Profile' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
})
export class CompanyProfileComponent implements OnInit {
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  company = signal<Company | null>(null);
  loading = signal(true);
  isEditing = signal(false);

  profileForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    industry: ['', Validators.required],
    location: ['', Validators.required],
    website: [''],
    logoUrl: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['']
  });

  ngOnInit() {
    this.loadCompany();
  }

  loadCompany() {
    const userIds = this.authService.currentUser()?.id;
    if (!userIds) return;
    const userId = Number(userIds);

    this.loading.set(true);
    this.companyService.getByEnterpriseUserId(userId).subscribe({
      next: (data: Company) => {
        this.company.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.log('No company profile found or error', err);
      }
    });
  }

  enableEdit() {
    this.isEditing.set(true);
    if (this.company()) {
      this.profileForm.patchValue(this.company()! as any);
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.profileForm.reset();
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const formValue = this.profileForm.value;
    const userIds = this.authService.currentUser()?.id;
    if (!userIds) return;
    const userId = Number(userIds);

    if (this.company()) {
      const companyData = { ...formValue, enterpriseUserId: userId, id: this.company()!.id } as any;
      this.companyService.update(this.company()!.id, companyData).subscribe({
        next: (updated: Company) => {
          this.company.set(updated);
          this.isEditing.set(false);
          this.toastr.success('Company profile updated successfully');
        },
        error: () => this.toastr.error('Failed to update company profile')
      });
    } else {
      const companyData = { ...formValue, enterpriseUserId: userId } as any;
      this.companyService.create(companyData).subscribe({
        next: (created: Company) => {
          this.company.set(created);
          this.isEditing.set(false);
          this.toastr.success('Company profile created successfully');
        },
        error: () => this.toastr.error('Failed to create company profile')
      });
    }
  }
}
