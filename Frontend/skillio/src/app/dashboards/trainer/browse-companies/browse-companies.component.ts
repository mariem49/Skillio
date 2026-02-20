import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models/company.model';

@Component({
    selector: 'app-browse-companies',
    standalone: true,
    imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule],
    template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Browse Companies</h1>
        <p class="text-gray-600">Discover partners for your courses</p>
      </div>

      <!-- Filters -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
            <mat-icon class="absolute left-3 top-2.5 text-gray-400">search</mat-icon>
            <input [(ngModel)]="searchQuery" type="text" placeholder="Search by name or industry..." class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500">
        </div>
        <div class="relative">
             <mat-icon class="absolute left-3 top-2.5 text-gray-400">location_on</mat-icon>
            <input [(ngModel)]="searchLocation" type="text" placeholder="Filter by location..." class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500">
        </div>
      </div>

      <!-- Company Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         @if (loading()) {
             <div class="col-span-full flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
             </div>
         } @else if (filteredCompanies().length > 0) {
             @for (company of filteredCompanies(); track company.id) {
                <div class="company-card bg-white rounded-2xl border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-shadow">
                   <div class="flex items-start justify-between mb-4">
                      <img [src]="company.logoUrl || 'assets/placeholder-company.png'" class="w-16 h-16 rounded-xl object-cover bg-gray-50">
                      <button mat-icon-button class="text-gray-400 hover:text-violet-600">
                         <mat-icon>bookmark_border</mat-icon>
                      </button>
                   </div>
                   
                   <h3 class="text-xl font-bold text-gray-900 mb-1">{{ company.name }}</h3>
                   <span class="text-sm text-violet-600 font-medium mb-4 block">{{ company.industry }}</span>
                   
                   <p class="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{{ company.description }}</p>

                   <div class="space-y-2 text-sm text-gray-500 mb-6">
                      <div class="flex items-center gap-2">
                         <mat-icon class="text-gray-400 text-sm">location_on</mat-icon>
                         {{ company.location }}
                      </div>
                      <div class="flex items-center gap-2">
                         <mat-icon class="text-gray-400 text-sm">language</mat-icon>
                         <a [href]="company.website" target="_blank" class="hover:text-violet-600 truncate">{{ company.website }}</a>
                      </div>
                   </div>

                   <button mat-stroked-button color="primary" class="w-full rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50">
                      View Profile
                   </button>
                </div>
             }
         } @else {
             <div class="col-span-full text-center py-12 text-gray-500">
                <mat-icon class="text-4xl text-gray-300 mb-2">business</mat-icon>
                <p>No companies found matching your criteria.</p>
             </div>
         }
      </div>
    </div>
  `,
    styles: [`
    .company-card { height: 100%; }
  `]
})
export class BrowseCompaniesComponent implements OnInit {
    private companyService = inject(CompanyService);

    companies = signal<Company[]>([]);
    loading = signal(true);

    searchQuery = signal('');
    searchLocation = signal('');

    filteredCompanies = computed(() => {
        let list = this.companies();
        const query = this.searchQuery().toLowerCase();
        const loc = this.searchLocation().toLowerCase();

        if (query) {
            list = list.filter(c => c.name.toLowerCase().includes(query) || c.industry.toLowerCase().includes(query));
        }
        if (loc) {
            list = list.filter(c => c.location.toLowerCase().includes(loc));
        }
        return list;
    });

    ngOnInit() {
        this.loading.set(true);
        this.companyService.getAll().subscribe({
            next: (data) => {
                this.companies.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
