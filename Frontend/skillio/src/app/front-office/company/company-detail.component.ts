// Fix for CompanyDetailComponent logic
import { Component, inject, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyService } from '../../core/services/company.service';
import { JobOfferService } from '../../core/services/job-offer.service';

@Component({
    selector: 'app-company-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    template: `
    @if (company(); as comp) {
        <div class="bg-gray-50 dark:bg-navy-900 min-h-screen pb-20">
            <!-- Header Banner -->
            <div class="h-64 bg-gradient-to-r from-violet-900 to-indigo-900 relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div class="bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-navy-700 flex flex-col md:flex-row gap-8 items-start">
                    <div class="w-32 h-32 rounded-2xl bg-white p-2 border border-gray-200 shadow-md shrink-0">
                        <img [src]="comp.logo" [alt]="comp.name" class="w-full h-full object-contain rounded-xl">
                    </div>
                    
                    <div class="flex-1">
                        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                                <h1 class="text-3xl font-bold text-navy-900 dark:text-white mb-2">{{ comp.name }}</h1>
                                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span class="flex items-center gap-1"><mat-icon class="text-xs">business</mat-icon> {{ comp.industry | titlecase }}</span>
                                    <span class="flex items-center gap-1"><mat-icon class="text-xs">location_on</mat-icon> {{ comp.location }}</span>
                                    <span class="flex items-center gap-1"><mat-icon class="text-xs">people</mat-icon> {{ comp.size }} employees</span>
                                </div>
                            </div>
                            <div class="flex gap-3 mt-4 md:mt-0">
                                <a [href]="comp.website" target="_blank" mat-stroked-button class="!border-gray-300">Website</a>
                                <button mat-flat-button color="primary">Follow</button>
                            </div>
                        </div>
                        
                        <div class="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
                            <p>{{ comp.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Job Offers Section -->
                <div class="mt-12">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-2xl font-bold text-navy-900 dark:text-white">Active Job Offers</h2>
                        <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{{ offers()?.length || 0 }} open positions</span>
                    </div>

                    <div class="grid gap-6">
                        @for (offer of offers(); track offer.id) {
                            <div class="bg-white dark:bg-navy-800 rounded-xl p-6 border border-gray-100 dark:border-navy-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6 group cursor-pointer" 
                                 [routerLink]="['/offers', offer.id]">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h3 class="text-lg font-bold text-navy-900 dark:text-white group-hover:text-violet-600 transition-colors">{{ offer.title }}</h3>
                                        @if (offer.contractType) {
                                            <span class="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
                                                  [ngClass]="{
                                                    'bg-blue-50 text-blue-600': offer.contractType === 'CDI',
                                                    'bg-purple-50 text-purple-600': offer.contractType === 'CDD',
                                                    'bg-green-50 text-green-600': offer.contractType === 'Stage',
                                                    'bg-orange-50 text-orange-600': offer.contractType === 'Alternance'
                                                  }">
                                                {{ offer.contractType }}
                                            </span>
                                        }
                                    </div>
                                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span class="flex items-center gap-1"><mat-icon class="text-xs">location_on</mat-icon> {{ offer.location }}</span>
                                        <span class="flex items-center gap-1"><mat-icon class="text-xs">schedule</mat-icon> {{ offer.postedAt | date }}</span>
                                        @if (offer.remote !== 'no') {
                                            <span class="flex items-center gap-1 text-green-600"><mat-icon class="text-xs">wifi</mat-icon> {{ offer.remote }}</span>
                                        }
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        @for (skill of offer.requiredSkills.slice(0, 4); track skill) {
                                            <span class="px-2 py-1 bg-gray-100 dark:bg-navy-700 rounded text-xs text-gray-600 dark:text-gray-300">{{ skill }}</span>
                                        }
                                        @if (offer.requiredSkills.length > 4) {
                                            <span class="text-xs text-gray-400">+{{ offer.requiredSkills.length - 4 }}</span>
                                        }
                                    </div>
                                </div>
                                <div class="self-start md:self-center shrink-0">
                                   <button mat-stroked-button color="primary" class="rounded-full">Apply Now</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    } @else {
        <div class="flex justify-center items-center h-screen bg-gray-50">
            <mat-spinner></mat-spinner>
        </div>
    }
  `
})
export class CompanyDetailComponent implements OnInit {
    private companyService = inject(CompanyService);
    private jobOfferService = inject(JobOfferService);

    @Input() id!: string; // Router param is string

    company = signal<any>(null);
    offers = signal<any[]>([]);

    ngOnInit() {
        if (this.id) {
            this.companyService.getById(Number(this.id)).subscribe(c => this.company.set(c));
            this.jobOfferService.getByCompany(Number(this.id)).subscribe(o => this.offers.set(o));
        }
    }
}
