import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-enterprise-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatSelectModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Top Navbar -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">{{ companyName() }} Dashboard</h1>
              <p class="text-sm text-gray-500">Recruitment Platform</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button mat-icon-button class="text-gray-600">
              <mat-icon>notifications</mat-icon>
            </button>
            <div class="flex items-center gap-3">
              <img [src]="companyLogo()" class="w-10 h-10 rounded-full border-2 border-violet-500">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ companyName() }}</p>
                <p class="text-xs text-gray-500">Enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <button mat-flat-button color="primary" class="bg-violet-600 hover:bg-violet-700 rounded-xl">
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
              <select [(ngModel)]="sortBy" class="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="date">Sort by Date</option>
                <option value="match">Sort by Match %</option>
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
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Applied Date</th>
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
                          <p class="text-xs text-gray-500">{{ application.candidateEmail }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-600">{{ application.jobTitle }}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-24 h-2 rounded-full overflow-hidden"
                             [class.bg-green-200]="application.matchScore >= 80"
                             [class.bg-orange-200]="application.matchScore >= 60 && application.matchScore < 80"
                             [class.bg-red-200]="application.matchScore < 60">
                          <div class="h-full"
                               [class.bg-green-600]="application.matchScore >= 80"
                               [class.bg-orange-600]="application.matchScore >= 60 && application.matchScore < 80"
                               [class.bg-red-600]="application.matchScore < 60"
                               [style.width.%]="application.matchScore"></div>
                        </div>
                        <span class="text-sm font-semibold"
                              [class.text-green-600]="application.matchScore >= 80"
                              [class.text-orange-600]="application.matchScore >= 60 && application.matchScore < 80"
                              [class.text-red-600]="application.matchScore < 60">
                          {{ application.matchScore }}%
                        </span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ application.appliedDate | date:'dd/MM/yyyy' }}</td>
                    <td class="py-3 px-4">
                      <select [(ngModel)]="application.status" class="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex gap-2">
                        <button mat-icon-button class="text-violet-600" title="View Profile">
                          <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button class="text-gray-600" title="Download CV">
                          <mat-icon>download</mat-icon>
                        </button>
                        <button mat-icon-button class="text-gray-600" title="Contact">
                          <mat-icon>email</mat-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Matching Stats -->
          <div class="dashboard-card">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Applications by Match Score</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-4 h-4 bg-green-500 rounded"></div>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">High Match (≥80%)</span>
                    <span class="text-sm font-bold text-gray-900">{{ highMatchCount() }}</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500" [style.width.%]="(highMatchCount() / totalApplications()) * 100"></div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="w-4 h-4 bg-orange-500 rounded"></div>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">Medium Match (60-79%)</span>
                    <span class="text-sm font-bold text-gray-900">{{ mediumMatchCount() }}</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-500" [style.width.%]="(mediumMatchCount() / totalApplications()) * 100"></div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="w-4 h-4 bg-red-500 rounded"></div>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">Low Match (<60%)</span>
                    <span class="text-sm font-bold text-gray-900">{{ lowMatchCount() }}</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-red-500" [style.width.%]="(lowMatchCount() / totalApplications()) * 100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Interviews -->
          <div class="dashboard-card">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-900">Upcoming Interviews</h3>
              <button mat-button class="text-violet-600">Schedule New</button>
            </div>
            <div class="space-y-4">
              @for (interview of upcomingInterviews(); track interview.id) {
                <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-violet-300 transition-colors">
                  <img [src]="interview.candidateAvatar" class="w-12 h-12 rounded-full">
                  <div class="flex-1">
                    <h5 class="font-semibold text-gray-900">{{ interview.candidateName }}</h5>
                    <p class="text-sm text-gray-600">{{ interview.jobTitle }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      📅 {{ interview.date | date:'dd/MM/yyyy' }} at {{ interview.time }}
                    </p>
                  </div>
                  <div class="text-center">
                    <div class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {{ interview.matchScore }}% match
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
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

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.1);
    }

    .stat-card__icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-card--violet .stat-card__icon {
      background: rgba(124, 58, 237, 0.1);
      color: #7C3AED;
    }

    .stat-card--blue .stat-card__icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }

    .stat-card--orange .stat-card__icon {
      background: rgba(245, 158, 11, 0.1);
      color: #F59E0B;
    }

    .stat-card--green .stat-card__icon {
      background: rgba(16, 185, 129, 0.1);
      color: #10B981;
    }

    .stat-card__content h3 {
      font-size: 28px;
      font-weight: 700;
      color: #1F2937;
    }

    .stat-card__content p {
      font-size: 14px;
      color: #6B7280;
      margin-top: 4px;
    }

    .enterprise-offer-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .enterprise-offer-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .dashboard-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 24px;
    }
  `]
})
export class EnterpriseDashboardComponent {
  companyName = signal('TechCorp');
  companyLogo = signal('https://ui-avatars.com/api/?name=TechCorp&background=7C3AED');

  // Stats
  activeOffers = signal(8);
  totalApplications = signal(156);
  interviewedCandidates = signal(24);
  hiredCandidates = signal(6);

  // Filters
  filterStatus = 'all';
  sortBy = 'date';


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
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      contractType: 'Alternance',
      applicationsCount: 28,
      viewsCount: 156,
      matchedCandidates: 6,
      location: 'Remote',
      postedDate: new Date('2024-01-10')
    }
  ]);

  // Applications
  applications = signal([
    {
      id: 1,
      candidateName: 'John Doe',
      candidateEmail: 'john@example.com',
      candidateAvatar: 'https://ui-avatars.com/api/?name=John+Doe',
      jobTitle: 'Angular Developer',
      matchScore: 85,
      appliedDate: new Date('2024-01-12'),
      status: 'pending'
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      candidateEmail: 'jane@example.com',
      candidateAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      jobTitle: 'Full Stack Engineer',
      matchScore: 92,
      appliedDate: new Date('2024-01-11'),
      status: 'shortlisted'
    },
    {
      id: 3,
      candidateName: 'Mike Johnson',
      candidateEmail: 'mike@example.com',
      candidateAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson',
      jobTitle: 'Angular Developer',
      matchScore: 78,
      appliedDate: new Date('2024-01-10'),
      status: 'interview'
    },
    {
      id: 4,
      candidateName: 'Sarah Wilson',
      candidateEmail: 'sarah@example.com',
      candidateAvatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson',
      jobTitle: 'UX/UI Designer',
      matchScore: 55,
      appliedDate: new Date('2024-01-09'),
      status: 'pending'
    }
  ]);

  filteredApplications = computed(() => {
    let apps = this.applications();
    const status = this.filterStatus;

    if (status !== 'all') {
      apps = apps.filter(a => a.status === status);
    }

    return apps;
  });

  highMatchCount = computed(() => this.applications().filter(a => a.matchScore >= 80).length);
  mediumMatchCount = computed(() => this.applications().filter(a => a.matchScore >= 60 && a.matchScore < 80).length);
  lowMatchCount = computed(() => this.applications().filter(a => a.matchScore < 60).length);

  // Upcoming Interviews
  upcomingInterviews = signal([
    {
      id: 1,
      candidateName: 'John Doe',
      candidateAvatar: 'https://ui-avatars.com/api/?name=John+Doe',
      jobTitle: 'Angular Developer',
      date: new Date('2024-01-15'),
      time: '14:00',
      matchScore: 85
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      candidateAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      jobTitle: 'Full Stack Engineer',
      date: new Date('2024-01-16'),
      time: '10:00',
      matchScore: 92
    }
  ]);
}
