import { Component, inject, Input, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobOfferService } from '../../core/services/job-offer.service';
import { MatchingService } from '../../core/services/matching.service';

@Component({
    selector: 'app-job-offer-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatDialogModule],
    template: `
    @if (offer(); as job) {
        <div class="bg-gray-50 dark:bg-navy-900 min-h-screen pb-12">
            <!-- Header -->
            <div class="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div class="flex gap-4">
                            <div class="w-20 h-20 rounded-xl bg-gray-50 p-1 border border-gray-100">
                                <img [src]="job.companyLogo" class="w-full h-full object-contain">
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-navy-900 dark:text-white mb-2">{{ job.title }}</h1>
                                <a [routerLink]="['/companies', job.companyId]" class="text-violet-600 font-medium hover:underline">{{ job.companyName }}</a>
                                <div class="flex flex-wrap gap-2 mt-3">
                                    <span class="px-2 py-1 rounded bg-gray-100 text-xs font-semibold uppercase">{{ job.contractType }}</span>
                                    <span class="px-2 py-1 rounded bg-gray-100 text-xs font-semibold flex items-center gap-1"><mat-icon class="text-xs">location_on</mat-icon> {{ job.location }}</span>
                                    @if(job.remote !== 'no') {
                                        <span class="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-1"><mat-icon class="text-xs">wifi</mat-icon> {{ job.remote }}</span>
                                    }
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                           <button mat-flat-button color="primary" class="!px-8 !py-5 bg-violet-600 w-full md:w-auto" (click)="apply()">Apply Now</button>
                           <span class="text-xs text-gray-400">Posted {{ job.postedAt | date }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-8">
                    
                    <!-- Matching Banner -->
                    @if (matchingScore() > 0) {
                        <div class="rounded-xl p-6 border flex gap-6"
                             [ngClass]="getBannerClass(matchingScore())">
                            <div class="flex flex-col items-center justify-center shrink-0 w-24">
                                <div class="text-3xl font-bold">{{ matchingScore() }}%</div>
                                <div class="text-xs font-bold uppercase tracking-wider opacity-80">Match</div>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg mb-2">Why this offers suits you</h3>
                                <ul class="space-y-1">
                                    @for (reason of matchingReasons(); track reason) {
                                        <li class="flex items-center gap-2 text-sm"><mat-icon class="text-sm w-4 h-4">check_circle</mat-icon> {{ reason }}</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    }

                    <div class="bg-white dark:bg-navy-800 rounded-xl p-8 border border-gray-100 dark:border-navy-700 shadow-sm">
                        <h2 class="text-xl font-bold mb-6 text-navy-900 dark:text-white">Job Description</h2>
                        <div class="prose prose-purple max-w-none text-gray-600 dark:text-gray-300">
                             <p>{{ job.description }}</p>
                             
                             <h3>Responsibilities</h3>
                             <ul>
                                 <li>Design and build sophisticated Angular applications</li>
                                 <li>Ensure quality performance</li>
                                 <li>Collaborate with cross-functional teams</li>
                             </ul>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <div class="bg-white dark:bg-navy-800 rounded-xl p-6 border border-gray-100 dark:border-navy-700 shadow-sm">
                        <h3 class="font-bold text-navy-900 dark:text-white mb-4">Key Information</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Experience</span>
                                <span class="font-medium">{{ job.experienceYears }} years</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Education</span>
                                <span class="font-medium">{{ job.requiredLevel }}</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Salary</span>
                                <span class="font-medium">{{ job.salary || 'Not specified' }}</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Duration</span>
                                <span class="font-medium">{{ job.duration || 'Permanent' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-navy-800 rounded-xl p-6 border border-gray-100 dark:border-navy-700 shadow-sm">
                        <h3 class="font-bold text-navy-900 dark:text-white mb-4">Required Skills</h3>
                        <div class="flex flex-wrap gap-2">
                             @for (skill of job.requiredSkills; track skill) {
                                 <span class="px-3 py-1 bg-gray-50 dark:bg-navy-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm border border-gray-100 dark:border-navy-600">{{ skill }}</span>
                             }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
  `
})
export class JobOfferDetailComponent implements OnInit {
    private jobOfferService = inject(JobOfferService);
    private matchingService = inject(MatchingService);

    @Input() id!: string;

    offer = signal<any>(null);
    matchingScore = signal(0);
    matchingReasons = signal<string[]>([]);

    ngOnInit() {
        if (this.id) {
            this.jobOfferService.getById(Number(this.id)).subscribe(job => {
                if (job) {
                    this.offer.set(job);
                    this.matchingScore.set(this.matchingService.calculateMatchingScore(job));
                    this.matchingReasons.set(this.matchingService.getMatchingReasons(job));
                }
            });
        }
    }

    getBannerClass(score: number): string {
        if (score >= 80) return 'bg-green-50 text-green-800 border-green-200';
        if (score >= 60) return 'bg-orange-50 text-orange-800 border-orange-200';
        return 'bg-red-50 text-red-800 border-red-200';
    }

    apply() {
        alert('Application feature coming soon!');
    }
}
