import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from '../../../shared/components/subscription/subscription.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, SubscriptionComponent],
  template: `
    <app-subscription></app-subscription>
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
          <button mat-stroked-button routerLink="/student/jobs" class="rounded-xl border-violet-600 text-violet-600">
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
        <a routerLink="/student/jobs" class="link-view-all">View All Jobs →</a>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        @for (job of recommendedJobs(); track job.id) {
          <div class="job-match-card" [routerLink]="['/student/jobs']"> <!-- mocked link -->
            <div class="job-match-card__header">
              <img [src]="job.companyLogo" [alt]="job.companyName" class="w-12 h-12 rounded-lg">
              <div class="job-match-card__info">
                <h4 class="text-lg font-bold text-gray-900">{{ job.title }}</h4>
                <p class="text-sm text-gray-600">{{ job.companyName }}</p>
              </div>
              <div class="job-match-card__score" [class.high-match]="job.matchScore >= 80" [class.medium-match]="job.matchScore >= 60 && job.matchScore < 80" [class.low-match]="job.matchScore < 60">
                <span class="score-value">{{ job.matchScore }}%</span>
                <span class="score-label">Match</span>
              </div>
            </div>
            <div class="job-match-card__details">
              <span class="detail-badge">{{ job.contractType }}</span>
              <span class="detail-item">📍 {{ job.location }}</span>
              <span class="detail-item">💼 {{ job.remote }}</span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .stat-item { background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; display: flex; gap: 16px; align-items: center; transition: all 0.3s ease; }
    .stat-item:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(124, 58, 237, 0.1); }
    .stat-item__icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-item__icon--violet { background: rgba(124, 58, 237, 0.1); color: #7C3AED; }
    .stat-item__icon--green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .stat-item__icon--blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
    .stat-item__icon--orange { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .stat-item__value { font-size: 28px; font-weight: 700; color: #1F2937; display: block; }
    .stat-item__label { font-size: 14px; color: #6B7280; display: block; margin-top: 4px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; }
    .link-view-all { color: #7C3AED; font-weight: 600; font-size: 14px; text-decoration: none; transition: color 0.2s; }
    .link-view-all:hover { color: #6D28D9; text-decoration: underline; }
    .course-progress-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; transition: all 0.3s ease; }
    .course-progress-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }
    .course-progress-card__image { width: 100%; height: 180px; object-fit: cover; }
    .course-progress-card__content { padding: 20px; }
    .progress-bar { width: 100%; height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden; }
    .progress-bar__fill { height: 100%; background: linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%); border-radius: 4px; transition: width 0.3s ease; }
    .job-match-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s ease; }
    .job-match-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15); border-color: #7C3AED; }
    .job-match-card__header { display: flex; gap: 12px; align-items: start; margin-bottom: 16px; }
    .job-match-card__info { flex: 1; }
    .job-match-card__score { display: flex; flex-direction: column; align-items: center; padding: 8px 12px; border-radius: 12px; min-width: 70px; }
    .job-match-card__score.high-match { background: rgba(16, 185, 129, 0.1); border: 2px solid #10B981; }
    .job-match-card__score.medium-match { background: rgba(245, 158, 11, 0.1); border: 2px solid #F59E0B; }
    .job-match-card__score.low-match { background: rgba(239, 68, 68, 0.1); border: 2px solid #EF4444; }
    .score-value { font-size: 20px; font-weight: 700; }
    .high-match .score-value { color: #10B981; }
    .medium-match .score-value { color: #F59E0B; }
    .low-match .score-value { color: #EF4444; }
    .score-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6B7280; }
    .job-match-card__details { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
    .detail-badge { padding: 4px 12px; background: #7C3AED; color: white; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .detail-item { font-size: 14px; color: #6B7280; }
  `]
})
export class StudentHomeComponent {
  private authService = inject(AuthService);
  userName = signal('John Doe');

  // Stats
  enrolledCourses = signal(8);
  completedCourses = signal(3);
  learningHours = signal(124);
  certificates = signal(2);

  inProgressCourses = signal([
    { id: 1, title: 'Angular 18 Masterclass', instructor: 'Sarah Johnson', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', progress: 65 },
    { id: 2, title: 'TypeScript Advanced', instructor: 'Mike Chen', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400', progress: 42 }
  ]);

  recommendedJobs = signal([
    { id: 1, title: 'Angular Developer', companyName: 'TechCorp', companyLogo: 'https://ui-avatars.com/api/?name=TechCorp', matchScore: 85, contractType: 'CDI', location: 'Paris', remote: 'Hybrid' },
    { id: 2, title: 'Full Stack Developer', companyName: 'StartupXYZ', companyLogo: 'https://ui-avatars.com/api/?name=StartupXYZ', matchScore: 78, contractType: 'CDI', location: 'Lyon', remote: 'Full Remote' }
  ]);
}
