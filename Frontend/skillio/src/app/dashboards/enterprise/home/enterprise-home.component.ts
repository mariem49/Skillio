import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from '../../../shared/components/subscription/subscription.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-enterprise-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatSelectModule, SubscriptionComponent],
  template: `
    <app-subscription></app-subscription>
      <div class="max-w-7xl mx-auto p-6">
        <!-- Hero -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ companyName() }} Dashboard 🏢</h1>
          <p class="text-gray-600">Manage job offers and candidates</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="stat-card stat-card--violet">
            <div class="stat-card__icon">
              <mat-icon>work</mat-icon>
            </div>
            <div class="stat-card__content">
              <h3>{{ activeOffers() }}</h3>
              <p>Active Job Offers</p>
            </div>
          </div>

          <div class="stat-card stat-card--blue">
            <div class="stat-card__icon">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-card__content">
              <h3>{{ totalApplications() }}</h3>
              <p>Total Applications</p>
            </div>
          </div>

          <div class="stat-card stat-card--orange">
            <div class="stat-card__icon">
              <mat-icon>forum</mat-icon>
            </div>
            <div class="stat-card__content">
              <h3>{{ interviewedCandidates() }}</h3>
              <p>Interviewed</p>
            </div>
          </div>

          <div class="stat-card stat-card--green">
            <div class="stat-card__icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-card__content">
              <h3>{{ hiredCandidates() }}</h3>
              <p>Hired</p>
            </div>
          </div>
        </div>

        <!-- Active Job Offers -->
        <section class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Active Job Offers</h2>
            <button mat-flat-button color="primary" routerLink="/enterprise/offers" class="bg-violet-600 hover:bg-violet-700 rounded-xl">
              + Post New Job
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (offer of activeJobOffers(); track offer.id) {
              <div class="enterprise-offer-card">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-bold text-gray-900">{{ offer.title }}</h3>
                  <span class="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
                    {{ offer.contractType }}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-violet-600">{{ offer.applicationsCount }}</div>
                    <div class="text-xs text-gray-600">Applications</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">{{ offer.viewsCount }}</div>
                    <div class="text-xs text-gray-600">Views</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">{{ offer.matchedCandidates }}</div>
                    <div class="text-xs text-gray-600">High Match</div>
                  </div>
                </div>

                <div class="flex gap-2 text-sm text-gray-600 mb-4">
                  <span class="flex items-center gap-1">
                    <mat-icon class="text-sm">location_on</mat-icon>
                    {{ offer.location }}
                  </span>
                  <span class="flex items-center gap-1">
                    <mat-icon class="text-sm">calendar_today</mat-icon>
                    {{ offer.postedDate | date:'dd/MM/yyyy' }}
                  </span>
                </div>

                <div class="flex gap-2">
                  <button mat-flat-button color="primary" [routerLink]="['/enterprise/offers', offer.id]" class="flex-1 bg-violet-600 rounded-lg">
                    View Applications
                  </button>
                  <button mat-icon-button class="text-gray-600">
                    <mat-icon>edit</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Recent Applications -->
        <div class="dashboard-card mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Recent Applications</h2>
            <div class="flex gap-3">
              <select [(ngModel)]="filterStatus" class="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Candidate</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Position</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Match Score</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (application of filteredApplications(); track application.id) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <img [src]="application.candidateAvatar" class="w-10 h-10 rounded-full">
                        <div>
                          <p class="font-medium text-gray-900">{{ application.candidateName }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-600">{{ application.jobTitle }}</td>
                    <td class="py-3 px-4">
                      <span class="font-bold text-green-600">{{ application.matchScore }}%</span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 bg-gray-100 rounded text-xs">{{ application.status }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <button mat-icon-button class="text-violet-600"><mat-icon>visibility</mat-icon></button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      gap: 16px;
      align-items: center;
      transition: all 0.3s ease;
    }
    .stat-card:hover { opacity: 0.9; }
    /* ... (simplified styles for brevity, assuming Tailwind does most work) ... */
    .stat-card__icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-card--violet .stat-card__icon { background: rgba(124, 58, 237, 0.1); color: #7C3AED; }
    .stat-card--blue .stat-card__icon { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
    .stat-card--orange .stat-card__icon { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .stat-card--green .stat-card__icon { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .enterprise-offer-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; }
    .dashboard-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; }
  `]
})
export class EnterpriseHomeComponent {
  companyName = signal('TechCorp');

  // Stats
  activeOffers = signal(8);
  totalApplications = signal(156);
  interviewedCandidates = signal(24);
  hiredCandidates = signal(6);

  // Filters
  filterStatus = 'all';

  // Job Offers
  activeJobOffers = signal([
    {
      id: 1,
      title: 'Angular Developer',
      contractType: 'CDI',
      applicationsCount: 45,
      viewsCount: 234,
      matchedCandidates: 12,
      location: 'Paris',
      postedDate: new Date('2024-01-01')
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      contractType: 'CDI',
      applicationsCount: 38,
      viewsCount: 189,
      matchedCandidates: 8,
      location: 'Lyon',
      postedDate: new Date('2024-01-05')
    }
  ]);

  // Applications
  applications = signal([
    {
      id: 1,
      candidateName: 'John Doe',
      candidateAvatar: 'https://ui-avatars.com/api/?name=John+Doe',
      jobTitle: 'Angular Developer',
      matchScore: 85,
      status: 'pending'
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      candidateAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      jobTitle: 'Full Stack Engineer',
      matchScore: 92,
      status: 'shortlisted'
    }
  ]);

  filteredApplications = computed(() => {
    let apps = this.applications();
    if (this.filterStatus !== 'all') {
      apps = apps.filter(a => a.status === this.filterStatus);
    }
    return apps;
  });
}
