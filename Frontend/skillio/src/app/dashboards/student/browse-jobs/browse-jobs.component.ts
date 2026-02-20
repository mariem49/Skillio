import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { JobOfferService } from '../../../core/services/job-offer.service';
import { JobOffer } from '../../../core/models/job-offer.model';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-browse-jobs',
   standalone: true,
   imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule, MatInputModule, MatSelectModule, MatPaginatorModule],
   template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Browse Job Offers</h1>
        <p class="text-gray-600">Find your next opportunity</p>
      </div>

      <!-- Filters -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="form-group">
            <label class="text-sm font-medium text-gray-700 mb-1 block">Search Location</label>
            <div class="relative">
                <mat-icon class="absolute left-3 top-2.5 text-gray-400">location_on</mat-icon>
                <input [(ngModel)]="searchLocation" type="text" placeholder="e.g. Paris" class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500">
            </div>
        </div>
        <div class="form-group">
            <label class="text-sm font-medium text-gray-700 mb-1 block">Contract Type</label>
            <select [(ngModel)]="filterContract" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500">
                <option value="">All Contracts</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
            </select>
        </div>
        <div class="form-group">
            <label class="text-sm font-medium text-gray-700 mb-1 block">Remote Policy</label>
            <select [(ngModel)]="filterRemote" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500">
                <option value="">All Types</option>
                <option value="ON_SITE">On Site</option>
                <option value="HYBRID">Hybrid</option>
                <option value="FULL_REMOTE">Full Remote</option>
            </select>
        </div>
        <div class="flex items-end">
             <button mat-flat-button color="primary" (click)="resetFilters()" class="w-full h-[42px] bg-gray-200 text-gray-700 hover:bg-gray-300">
                Reset Filters
             </button>
        </div>
      </div>

      <!-- Job List -->
      <div class="grid gap-6">
          @if (loading()) {
            <div class="flex justify-center py-12">
               <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          } @else if (paginatedJobs().length > 0) {
            @for (job of paginatedJobs(); track job.id) {
               <mat-card class="job-card">
                  <div class="p-6">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                       <div class="flex items-start gap-4">
                          <div class="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xl">
                             {{ job.title.charAt(0) }}
                          </div>
                          <div>
                             <h3 class="text-xl font-bold text-gray-900">{{ job.title }}</h3>
                             <p class="text-gray-600 font-medium">Company #{{ job.companyId }}</p> <!-- Mapping company name would require robust setup -->
                          </div>
                       </div>
                       <div class="flex flex-wrap gap-2">
                          <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{{ job.contractType }}</span>
                          <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{{ job.remote }}</span>
                       </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                       <div class="flex items-center gap-2">
                          <mat-icon class="text-gray-400">location_on</mat-icon>
                          {{ job.location }}
                       </div>
                       <div class="flex items-center gap-2">
                          <mat-icon class="text-gray-400">attach_money</mat-icon>
                          {{ job.salary | currency }}
                       </div>
                       <div class="flex items-center gap-2">
                          <mat-icon class="text-gray-400">schedule</mat-icon>
                          Posted {{ job.createdAt | date:'mediumDate' }}
                       </div>
                    </div>

                    <mat-expansion-panel class="shadow-none border border-gray-100 rounded-lg">
                       <mat-expansion-panel-header class="bg-gray-50 h-12">
                          <mat-panel-title class="text-sm font-medium text-gray-700">
                             View Details & Requirements
                          </mat-panel-title>
                       </mat-expansion-panel-header>
                       <div class="py-4 space-y-4">
                          <div>
                             <h4 class="font-bold text-gray-900 mb-2">Description</h4>
                             <p class="text-gray-600 leading-relaxed">{{ job.description }}</p>
                          </div>
                          <div>
                             <h4 class="font-bold text-gray-900 mb-2">Requirements</h4>
                             <p class="text-gray-600 leading-relaxed">{{ job.requirements }}</p>
                          </div>
                          <div class="pt-4 border-t border-gray-100 flex justify-end">
                              <button mat-flat-button color="primary" (click)="apply(job)" class="bg-violet-600 text-white px-8">
                                 Apply Now
                              </button>
                          </div>
                       </div>
                    </mat-expansion-panel>
                  </div>
               </mat-card>
            }
          } @else {
             <div class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <mat-icon class="text-6xl text-gray-300 mb-4">search_off</mat-icon>
                <h3 class="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p class="text-gray-500">Try adjusting your filters to see more results</p>
                <button mat-button color="primary" (click)="resetFilters()" class="mt-4">Clear Filters</button>
             </div>
          }
      </div>

      <!-- Paginator -->
      <mat-paginator [length]="filteredJobs().length"
                     [pageSize]="10"
                     [pageSizeOptions]="[5, 10, 25]"
                     (page)="onPageChange($event)"
                     class="mt-8 bg-transparent">
      </mat-paginator>
    </div>
  `,
   styles: [`
    .job-card { border-radius: 16px; border: 1px solid #E5E7EB; box-shadow: none; transition: all 0.2s; overflow: hidden; background: white; }
    .job-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.05); border-color: #DDD; }
    ::ng-deep .mat-expansion-panel-body { padding: 0 24px 24px !important; }
  `]
})
export class BrowseJobsComponent implements OnInit {
   private jobService = inject(JobOfferService);
   private toastr = inject(ToastrService);

   allJobs = signal<JobOffer[]>([]);
   loading = signal(true);

   // Filters
   searchLocation = signal('');
   filterContract = signal('');
   filterRemote = signal('');

   // Pagination
   pageSize = signal(10);
   pageIndex = signal(0);

   filteredJobs = computed(() => {
      let jobs = this.allJobs();
      const loc = this.searchLocation().toLowerCase();
      const contract = this.filterContract();
      const remote = this.filterRemote();

      if (loc) {
         jobs = jobs.filter(j => j.location.toLowerCase().includes(loc));
      }
      if (contract) {
         jobs = jobs.filter(j => j.contractType === contract);
      }
      if (remote) {
         jobs = jobs.filter(j => j.remote === remote);
      }

      // Only show active jobs? Assuming service returns all.
      return jobs.filter(j => j.isActive);
   });

   paginatedJobs = computed(() => {
      const startIndex = this.pageIndex() * this.pageSize();
      return this.filteredJobs().slice(startIndex, startIndex + this.pageSize());
   });

   ngOnInit() {
      this.loadJobs();
   }

   loadJobs() {
      this.loading.set(true);
      this.jobService.getAll().subscribe({
         next: (data) => {
            this.allJobs.set(data);
            this.loading.set(false);
         },
         error: () => this.loading.set(false)
      });
   }

   resetFilters() {
      this.searchLocation.set('');
      this.filterContract.set('');
      this.filterRemote.set('');
      this.pageIndex.set(0);
   }

   onPageChange(event: PageEvent) {
      this.pageIndex.set(event.pageIndex);
      this.pageSize.set(event.pageSize);
   }

   apply(job: JobOffer) {
      this.toastr.success(`Application sent for ${job.title}!`, 'Success');
   }
}
