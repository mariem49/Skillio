import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobOfferService } from '../../core/services/job-offer.service';
import { MatchingService } from '../../core/services/matching.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
   selector: 'app-job-offers-list',
   standalone: true,
   imports: [
      CommonModule, RouterModule, FormsModule,
      MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule
   ],
   template: `
    <div class="bg-gray-50 dark:bg-navy-900 min-h-screen py-8">
      <div class="max-w-7xl mx-auto px-4">
        
        <!-- Header -->
        <div class="bg-violet-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-lg">
           <div class="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
           <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                 <h1 class="text-3xl font-bold mb-2">Job Offers & Internships</h1>
                 <p class="text-violet-100">Find the perfect match for your career.</p>
              </div>
              <div class="relative w-full md:w-96">
                 <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Search by title, skill, or company..." 
                        class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-violet-200 backdrop-blur-sm focus:outline-none focus:bg-white/30 transition">
                 <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-violet-200">search</mat-icon>
              </div>
           </div>
        </div>

        <div class="grid lg:grid-cols-4 gap-8">
           <!-- Filters Sidebar -->
           <div class="lg:col-span-1 space-y-6">
              <!-- Stats Card -->
              <div class="bg-white dark:bg-navy-800 p-6 rounded-xl border border-gray-100 dark:border-navy-700 shadow-sm">
                 <h3 class="font-bold text-navy-900 dark:text-white mb-4">Your Stats</h3>
                 <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-3 bg-violet-50 rounded-lg">
                       <div class="text-2xl font-bold text-violet-600">{{ filteredOffers().length }}</div>
                       <div class="text-xs text-gray-500 uppercase tracking-wide">Total</div>
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded-lg">
                       <div class="text-2xl font-bold text-green-600">
                         {{ recommendedCount() }}
                       </div>
                       <div class="text-xs text-gray-500 uppercase tracking-wide">Matches</div>
                    </div>
                 </div>
              </div>

              <!-- Filter Controls -->
              <div class="bg-white dark:bg-navy-800 p-6 rounded-xl border border-gray-100 dark:border-navy-700 shadow-sm">
                  <div class="flex justify-between items-center mb-4">
                      <h3 class="font-bold text-navy-900 dark:text-white">Filters</h3>
                      <button (click)="resetFilters()" class="text-xs text-violet-600 hover:underline">Reset</button>
                  </div>
                  
                  <div class="space-y-4">
                     <div>
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">Contract Type</label>
                        <div class="space-y-2">
                           <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                              <input type="checkbox" [ngModel]="filterCdi()" (ngModelChange)="filterCdi.set($event)" class="rounded text-violet-600 focus:ring-violet-500"> CDI
                           </label>
                           <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                              <input type="checkbox" [ngModel]="filterStage()" (ngModelChange)="filterStage.set($event)" class="rounded text-violet-600 focus:ring-violet-500"> Internship
                           </label>
                           <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                              <input type="checkbox" [ngModel]="filterAlternance()" (ngModelChange)="filterAlternance.set($event)" class="rounded text-violet-600 focus:ring-violet-500"> Alternance
                           </label>
                        </div>
                     </div>
                     
                     <div>
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">Remote Work</label>
                        <select [ngModel]="filterRemote()" (ngModelChange)="filterRemote.set($event)" class="w-full rounded-lg border-gray-200 text-sm">
                           <option value="all">Any</option>
                           <option value="full-remote">Full Remote</option>
                           <option value="partial">Hybrid</option>
                           <option value="no">On-site</option>
                        </select>
                     </div>
                  </div>
              </div>
           </div>

           <!-- Main List -->
           <div class="lg:col-span-3">
              @if (isLoading()) {
                 <div class="flex justify-center p-12"><mat-spinner></mat-spinner></div>
              } @else {
                 <div class="space-y-4">
                    @for (offer of filteredOffers(); track offer.id) {
                       <div class="bg-white dark:bg-navy-800 rounded-xl p-5 border border-gray-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
                            [routerLink]="['/offers', offer.id]">
                          
                          <!-- Matching Score Badge (Absolute) -->
                          <div class="absolute top-4 right-4 flex flex-col items-center">
                             <div class="w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-sm bg-white z-10"
                                  [ngClass]="getScoreColorClass(offer.matchingScore)">
                                {{ offer.matchingScore }}%
                             </div>
                             <span class="text-[10px] text-gray-400 font-bold uppercase mt-1">Match</span>
                          </div>

                          <div class="flex gap-4 pr-16">
                             <div class="w-16 h-16 rounded-lg border border-gray-100 p-1 shrink-0 bg-white">
                                <img [src]="offer.companyLogo" class="w-full h-full object-contain rounded">
                             </div>
                             
                             <div class="flex-1">
                                <h3 class="font-bold text-lg text-navy-900 group-hover:text-violet-600 transition-colors">{{ offer.title }}</h3>
                                <div class="text-sm text-gray-500 mb-2">{{ offer.companyName }}</div>
                                
                                <div class="flex flex-wrap gap-2 text-xs mb-3">
                                   <span class="px-2 py-1 rounded bg-gray-100 font-medium">{{ offer.contractType }}</span>
                                   <span class="px-2 py-1 rounded bg-gray-100 flex items-center gap-1"><mat-icon class="text-[14px] w-[14px] h-[14px]">location_on</mat-icon> {{ offer.location }}</span>
                                   @if(offer.remote !== 'no') {
                                     <span class="px-2 py-1 rounded bg-green-50 text-green-700 flex items-center gap-1"><mat-icon class="text-[14px] w-[14px] h-[14px]">wifi</mat-icon> {{ offer.remote }}</span>
                                   }
                                </div>
                                
                                <div class="flex gap-2">
                                   @for (skill of offer.requiredSkills.slice(0, 4); track skill) {
                                      <span class="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">{{ skill }}</span>
                                   }
                                </div>
                             </div>
                          </div>
                       </div>
                    }
                 </div>
              }
           </div>
        </div>
      </div>
    </div>
  `,
   styles: [`
    .border-red-500 { border-color: #EF4444; color: #EF4444; }
    .border-orange-500 { border-color: #F59E0B; color: #F59E0B; }
    .border-green-500 { border-color: #10B981; color: #10B981; }
  `]
})
export class JobOffersListComponent {
   private jobOfferService = inject(JobOfferService);
   private matchingService = inject(MatchingService);

   isLoading = signal(false);
   rawOffers = toSignal(this.jobOfferService.getAll(), { initialValue: [] });

   // Reactive filters
   searchQuery = signal('');
   filterCdi = signal(false);
   filterStage = signal(false);
   filterAlternance = signal(false);
   filterRemote = signal('all');

   // Enhance offers with matching score
   enhancedOffers = computed(() => {
      return this.rawOffers().map((offer: any) => ({
         ...offer,
         matchingScore: this.matchingService.calculateMatchingScore(offer)
      })).sort((a: any, b: any) => b.matchingScore - a.matchingScore);
   });

   filteredOffers = computed(() => {
      let offers = this.enhancedOffers();
      const query = this.searchQuery().toLowerCase();

      // Search
      if (query) {
         offers = offers.filter((o: any) => o.title.toLowerCase().includes(query) || o.companyName.toLowerCase().includes(query) || o.requiredSkills.some((s: string) => s.toLowerCase().includes(query)));
      }

      // Contract
      const types: string[] = [];
      if (this.filterCdi()) types.push('CDI');
      if (this.filterStage()) types.push('Stage');
      if (this.filterAlternance()) types.push('Alternance');

      if (types.length > 0) {
         offers = offers.filter((o: any) => types.includes(o.contractType));
      }

      // Remote
      const remote = this.filterRemote();
      if (remote !== 'all') {
         if (remote === 'full-remote') offers = offers.filter((o: any) => o.remote === 'full-remote');
         else if (remote === 'partial') offers = offers.filter((o: any) => o.remote === 'partial');
         else if (remote === 'no') offers = offers.filter((o: any) => o.remote === 'no');
      }

      return offers;
   });

   recommendedCount = computed(() => {
      return this.enhancedOffers().filter((o: any) => o.matchingScore >= 70).length;
   });

   getScoreColorClass(score: number): string {
      if (score >= 80) return 'border-green-500';
      if (score >= 60) return 'border-orange-500';
      return 'border-red-500';
   }

   resetFilters() {
      this.searchQuery.set('');
      this.filterCdi.set(false);
      this.filterStage.set(false);
      this.filterAlternance.set(false);
      this.filterRemote.set('all');
   }
}
