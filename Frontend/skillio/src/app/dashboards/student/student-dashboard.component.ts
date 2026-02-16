import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { MatchingService } from '../../core/services/matching.service';

@Component({
    selector: 'app-student-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Top Navbar -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">Student Dashboard</h1>
              <p class="text-sm text-gray-500">Skillio Learning Platform</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button mat-icon-button class="text-gray-600">
              <mat-icon>notifications</mat-icon>
            </button>
            <div class="flex items-center gap-3">
              <img [src]="userAvatar()" class="w-10 h-10 rounded-full border-2 border-violet-500">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ userName() }}</p>
                <p class="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto p-6">
        <!-- Hero Section -->
        <div class="dashboard-hero mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, {{ userName() }}! 👋</h1>
              <p class="text-gray-600">Continue learning where you left off</p>
            </div>
            <div class="flex gap-3">
              <button mat-flat-button color="primary" routerLink="/courses" class="bg-violet-600 hover:bg-violet-700 rounded-xl">
                Browse Courses
              </button>
              <button mat-stroked-button routerLink="/offers" class="rounded-xl border-violet-600 text-violet-600">
                Find Jobs
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="stat-item">
            <div class="stat-item__icon stat-item__icon--violet">
              <mat-icon>book</mat-icon>
            </div>
            <div class="stat-item__details">
              <span class="stat-item__value">{{ enrolledCourses() }}</span>
              <span class="stat-item__label">Enrolled Courses</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-item__icon stat-item__icon--green">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-item__details">
              <span class="stat-item__value">{{ completedCourses() }}</span>
              <span class="stat-item__label">Completed</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-item__icon stat-item__icon--blue">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-item__details">
              <span class="stat-item__value">{{ learningHours() }}h</span>
              <span class="stat-item__label">Learning Hours</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-item__icon stat-item__icon--orange">
              <mat-icon>workspace_premium</mat-icon>
            </div>
            <div class="stat-item__details">
              <span class="stat-item__value">{{ certificates() }}</span>
              <span class="stat-item__label">Certificates</span>
            </div>
          </div>
        </div>

        <!-- Continue Learning -->
        <section class="dashboard-section mb-8">
          <div class="section-header">
            <h2 class="text-2xl font-bold text-gray-900">Continue Learning</h2>
            <a routerLink="/my-courses" class="link-view-all">View All →</a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            @for (course of inProgressCourses(); track course.id) {
              <div class="course-progress-card">
                <img [src]="course.thumbnail" [alt]="course.title" class="course-progress-card__image">
                <div class="course-progress-card__content">
                  <h3 class="text-lg font-bold text-gray-900 mb-1">{{ course.title }}</h3>
                  <p class="text-sm text-gray-600 mb-4">{{ course.instructor }}</p>

                  <div class="progress-bar mb-2">
                    <div class="progress-bar__fill" [style.width.%]="course.progress"></div>
                  </div>
                  <p class="text-sm text-gray-600 mb-4">{{ course.progress }}% Complete</p>

                  <button mat-flat-button color="primary" [routerLink]="['/courses', course.id, 'learn']" class="w-full bg-violet-600 hover:bg-violet-700 rounded-xl">
                    Continue
                  </button>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Job Recommendations -->
        <section class="dashboard-section mb-8">
          <div class="section-header">
            <h2 class="text-2xl font-bold text-gray-900">🎯 Job Recommendations</h2>
            <a routerLink="/offers" class="link-view-all">View All Jobs →</a>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            @for (job of recommendedJobs(); track job.id) {
              <div class="job-match-card" [routerLink]="['/offers', job.id]">
                <div class="job-match-card__header">
                  <img [src]="job.companyLogo" [alt]="job.companyName" class="w-12 h-12 rounded-lg">
                  <div class="job-match-card__info">
                    <h4 class="text-lg font-bold text-gray-900">{{ job.title }}</h4>
                    <p class="text-sm text-gray-600">{{ job.companyName }}</p>
                  </div>
                  <div class="job-match-card__score"
                       [class.high-match]="job.matchScore >= 80"
                       [class.medium-match]="job.matchScore >= 60 && job.matchScore < 80"
                       [class.low-match]="job.matchScore < 60">
                    <span class="score-value">{{ job.matchScore }}%</span>
                    <span class="score-label">Match</span>
                  </div>
                </div>

                <div class="job-match-card__details">
                  <span class="detail-badge">{{ job.contractType }}</span>
                  <span class="detail-item">📍 {{ job.location }}</span>
                  <span class="detail-item">💼 {{ job.remote }}</span>
                </div>

                <div class="job-match-card__skills">
                  @for (skill of job.requiredSkills.slice(0, 3); track skill) {
                    <span class="skill-tag">{{ skill }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Bottom Grid: Events & Applications -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Upcoming Events -->
          <div class="dashboard-card">
            <div class="dashboard-card__header">
              <h3 class="text-xl font-bold text-gray-900">Upcoming Events</h3>
              <a routerLink="/events" class="text-violet-600 text-sm font-medium hover:underline">View All</a>
            </div>
            <div class="dashboard-card__body">
              @for (event of upcomingEvents(); track event.id) {
                <div class="event-item">
                  <div class="event-item__date">
                    <span class="day">{{ event.date | date:'dd' }}</span>
                    <span class="month">{{ event.date | date:'MMM' }}</span>
                  </div>
                  <div class="event-item__details">
                    <h4 class="font-semibold text-gray-900">{{ event.title }}</h4>
                    <p class="text-sm text-gray-600">{{ event.time }} • {{ event.location }}</p>
                  </div>
                  <button mat-icon-button class="text-violet-600">
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- My Applications -->
          <div class="dashboard-card">
            <div class="dashboard-card__header">
              <h3 class="text-xl font-bold text-gray-900">My Applications</h3>
              <a routerLink="/my-applications" class="text-violet-600 text-sm font-medium hover:underline">View All</a>
            </div>
            <div class="dashboard-card__body">
              <div class="applications-summary mb-6">
                <div class="app-stat">
                  <span class="app-stat__number">{{ pendingApplications() }}</span>
                  <span class="app-stat__label">Pending</span>
                </div>
                <div class="app-stat">
                  <span class="app-stat__number">{{ interviewApplications() }}</span>
                  <span class="app-stat__label">Interview</span>
                </div>
                <div class="app-stat">
                  <span class="app-stat__number">{{ acceptedApplications() }}</span>
                  <span class="app-stat__label">Accepted</span>
                </div>
              </div>

              <div class="recent-applications">
                @for (app of recentApplications().slice(0, 3); track app.id) {
                  <div class="app-item">
                    <img [src]="app.companyLogo" class="w-10 h-10 rounded-lg">
                    <div class="app-item__info">
                      <h5 class="font-semibold text-gray-900">{{ app.jobTitle }}</h5>
                      <p class="text-sm text-gray-600">{{ app.companyName }}</p>
                    </div>
                    <span class="status-badge status-badge--{{ app.status }}">
                      {{ app.status }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .stat-item {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      gap: 16px;
      align-items: center;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.1);
    }

    .stat-item__icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-item__icon--violet {
      background: rgba(124, 58, 237, 0.1);
      color: #7C3AED;
    }

    .stat-item__icon--green {
      background: rgba(16, 185, 129, 0.1);
      color: #10B981;
    }

    .stat-item__icon--blue {
      background: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }

    .stat-item__icon--orange {
      background: rgba(245, 158, 11, 0.1);
      color: #F59E0B;
    }

    .stat-item__value {
      font-size: 28px;
      font-weight: 700;
      color: #1F2937;
      display: block;
    }

    .stat-item__label {
      font-size: 14px;
      color: #6B7280;
      display: block;
      margin-top: 4px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .link-view-all {
      color: #7C3AED;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: color 0.2s;
    }

    .link-view-all:hover {
      color: #6D28D9;
      text-decoration: underline;
    }

    .course-progress-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .course-progress-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .course-progress-card__image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .course-progress-card__content {
      padding: 20px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #E5E7EB;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar__fill {
      height: 100%;
      background: linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .job-match-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .job-match-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15);
      border-color: #7C3AED;
    }

    .job-match-card__header {
      display: flex;
      gap: 12px;
      align-items: start;
      margin-bottom: 16px;
    }

    .job-match-card__info {
      flex: 1;
    }

    .job-match-card__score {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      border-radius: 12px;
      min-width: 70px;
    }

    .job-match-card__score.high-match {
      background: rgba(16, 185, 129, 0.1);
      border: 2px solid #10B981;
    }

    .job-match-card__score.medium-match {
      background: rgba(245, 158, 11, 0.1);
      border: 2px solid #F59E0B;
    }

    .job-match-card__score.low-match {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid #EF4444;
    }

    .score-value {
      font-size: 20px;
      font-weight: 700;
    }

    .high-match .score-value { color: #10B981; }
    .medium-match .score-value { color: #F59E0B; }
    .low-match .score-value { color: #EF4444; }

    .score-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6B7280;
    }

    .job-match-card__details {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .detail-badge {
      padding: 4px 12px;
      background: #7C3AED;
      color: white;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .detail-item {
      font-size: 14px;
      color: #6B7280;
    }

    .job-match-card__skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-tag {
      padding: 4px 12px;
      background: rgba(124, 58, 237, 0.1);
      color: #7C3AED;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .dashboard-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 24px;
    }

    .dashboard-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .event-item {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #E5E7EB;
    }

    .event-item:last-child {
      border-bottom: none;
    }

    .event-item__date {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: rgba(124, 58, 237, 0.1);
      border-radius: 12px;
      min-width: 60px;
    }

    .event-item__date .day {
      font-size: 20px;
      font-weight: 700;
      color: #7C3AED;
    }

    .event-item__date .month {
      font-size: 12px;
      font-weight: 600;
      color: #7C3AED;
      text-transform: uppercase;
    }

    .event-item__details {
      flex: 1;
    }

    .applications-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .app-stat {
      text-align: center;
      padding: 16px;
      background: #F9FAFB;
      border-radius: 12px;
    }

    .app-stat__number {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #7C3AED;
    }

    .app-stat__label {
      display: block;
      font-size: 12px;
      color: #6B7280;
      margin-top: 4px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .app-item {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #E5E7EB;
    }

    .app-item:last-child {
      border-bottom: none;
    }

    .app-item__info {
      flex: 1;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge--pending {
      background: rgba(245, 158, 11, 0.1);
      color: #F59E0B;
    }

    .status-badge--interview {
      background: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }

    .status-badge--accepted {
      background: rgba(16, 185, 129, 0.1);
      color: #10B981;
    }
  `]
})
export class StudentDashboardComponent {
    private authService = inject(AuthService);

    userName = signal('John Doe');
    userAvatar = signal('https://ui-avatars.com/api/?name=John+Doe&background=7C3AED');

    // Stats
    enrolledCourses = signal(8);
    completedCourses = signal(3);
    learningHours = signal(124);
    certificates = signal(2);

    // In Progress Courses
    inProgressCourses = signal([
        {
            id: 1,
            title: 'Angular 18 Masterclass',
            instructor: 'Sarah Johnson',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
            progress: 65
        },
        {
            id: 2,
            title: 'TypeScript Advanced',
            instructor: 'Mike Chen',
            thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
            progress: 42
        },
        {
            id: 3,
            title: 'UI/UX Design Fundamentals',
            instructor: 'Emma Wilson',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
            progress: 28
        }
    ]);

    // Job Recommendations
    recommendedJobs = signal([
        {
            id: 1,
            title: 'Angular Developer',
            companyName: 'TechCorp',
            companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=random',
            matchScore: 85,
            contractType: 'CDI',
            location: 'Paris',
            remote: 'Hybrid',
            requiredSkills: ['Angular', 'TypeScript', 'RxJS']
        },
        {
            id: 2,
            title: 'Full Stack Developer',
            companyName: 'StartupXYZ',
            companyLogo: 'https://ui-avatars.com/api/?name=StartupXYZ&background=random',
            matchScore: 78,
            contractType: 'CDI',
            location: 'Lyon',
            remote: 'Full Remote',
            requiredSkills: ['Angular', 'Node.js', 'MongoDB']
        }
    ]);

    // Events
    upcomingEvents = signal([
        {
            id: 1,
            title: 'Angular Workshop',
            date: new Date('2024-01-15'),
            time: '14:00',
            location: 'Online'
        },
        {
            id: 2,
            title: 'Career Fair 2024',
            date: new Date('2024-01-20'),
            time: '10:00',
            location: 'Paris Convention Center'
        }
    ]);

    // Applications
    pendingApplications = signal(3);
    interviewApplications = signal(1);
    acceptedApplications = signal(0);

    recentApplications = signal([
        {
            id: 1,
            jobTitle: 'Angular Developer',
            companyName: 'TechCorp',
            companyLogo: 'https://ui-avatars.com/api/?name=TechCorp',
            status: 'pending'
        },
        {
            id: 2,
            jobTitle: 'Frontend Engineer',
            companyName: 'WebAgency',
            companyLogo: 'https://ui-avatars.com/api/?name=WebAgency',
            status: 'interview'
        }
    ]);
}
