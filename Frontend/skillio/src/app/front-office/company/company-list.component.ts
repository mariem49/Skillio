import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/models/company.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-company-list',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule,
        MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule
    ],
    template: `
    <div class="bg-gray-50 dark:bg-navy-900 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 class="text-3xl font-heading font-bold text-navy-900 dark:text-white">Partner Companies</h1>
            <p class="text-gray-500 text-sm mt-1">Discover opportunities with our trusted partners</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative">
              <input type="text" [(ngModel)]="searchQuery" placeholder="Search companies..." 
                     class="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 w-full sm:w-64 focus:ring-2 focus:ring-violet-500 focus:outline-none shadow-sm transition-all">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</mat-icon>
            </div>
            
            <select [(ngModel)]="selectedIndustry" class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-violet-500 focus:outline-none shadow-sm">
                <option value="">All Industries</option>
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
            </select>
          </div>
        </div>

        @if (isLoading()) {
            <div class="flex justify-center items-center h-64">
                <mat-spinner diameter="40"></mat-spinner>
            </div>
        } @else {
            <!-- Company Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                @for (company of filteredCompanies(); track company.id) {
                    <div class="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group">
                        <div class="flex items-start justify-between mb-6">
                            <div class="w-16 h-16 rounded-xl bg-gray-50 p-2 border border-gray-100 dark:border-navy-700">
                                <img [src]="company.logoUrl" [alt]="company.name" class="w-full h-full object-contain rounded-lg">
                            </div>
                            <span class="px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-bold uppercase tracking-wide">
                                {{ company.industry }}
                            </span>
                        </div>
                        
                        <h3 class="text-xl font-bold text-navy-900 dark:text-white mb-2 group-hover:text-violet-600 transition-colors">
                            {{ company.name }}
                        </h3>
                        
                        <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 h-10">
                            {{ company.description }}
                        </p>
                        
                        <div class="flex items-center justify-between border-t border-gray-100 dark:border-navy-700 pt-4">
                            <div class="flex items-center gap-2 text-gray-500 text-xs">
                                <mat-icon class="text-sm w-4 h-4">location_on</mat-icon>
                                {{ company.location }}
                            </div>
                            <div class="flex items-center gap-2 text-gray-500 text-xs">
                                <mat-icon class="text-sm w-4 h-4">work</mat-icon>
                                {{ company.jobOffersCount || 0 }} offers
                            </div>
                        </div>
                        
                        <a [routerLink]="['/companies', company.id]" mat-flat-button color="primary" class="w-full mt-6 rounded-xl !py-5 bg-violet-600 shadow-lg shadow-violet-200 dark:shadow-none">
                            View Details
                        </a>
                    </div>
                }
            </div>

            @if (filteredCompanies().length === 0) {
                <div class="text-center py-20">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <mat-icon>search_off</mat-icon>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">No companies found</h3>
                    <p class="text-gray-500">Try adjusting your filters</p>
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
export class CompanyListComponent {
    private companyService = inject(CompanyService);

    isLoading = signal(false); // Should be managed by service or interceptor actually

    // Load companies
    companies = toSignal(this.companyService.getAll(), { initialValue: [] });

    // Filters
    searchQuery = signal('');
    selectedIndustry = signal('');

    // Computed filter
    filteredCompanies = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const industry = this.selectedIndustry();

        return this.companies().filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
            const matchesIndustry = industry ? c.industry === industry : true;
            return matchesSearch && matchesIndustry;
        });
    });
}
