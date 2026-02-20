import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from '../../../shared/components/subscription/subscription.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-trainer-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, SubscriptionComponent],
  template: `
    <app-subscription></app-subscription>
    <!-- Hero -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Hello, {{ userName() }}! 📚</h1>
      <p class="text-gray-600">Manage your courses and students</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat-card stat-card--violet">
        <div class="stat-card__icon">
          <mat-icon>school</mat-icon>
        </div>
        <div class="stat-card__content">
          <h3>{{ myCourses() }}</h3>
          <p>My Courses</p>
        </div>
      </div>
      <div class="stat-card stat-card--blue">
        <div class="stat-card__icon">
          <mat-icon>people</mat-icon>
        </div>
        <div class="stat-card__content">
          <h3>{{ totalStudents() }}</h3>
          <p>Total Students</p>
        </div>
      </div>
      <div class="stat-card stat-card--orange">
        <div class="stat-card__icon">
          <mat-icon>star</mat-icon>
        </div>
        <div class="stat-card__content">
          <h3>{{ avgRating() }}/5</h3>
          <p>Average Rating</p>
        </div>
      </div>
      <div class="stat-card stat-card--green">
        <div class="stat-card__icon">
          <mat-icon>attach_money</mat-icon>
        </div>
        <div class="stat-card__content">
          <h3>\${{ monthlyRevenue() | number }}</h3>
          <p>This Month</p>
        </div>
      </div>
    </div>

    <!-- My Courses -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">My Courses</h2>
        <button mat-flat-button color="primary" class="bg-violet-600 hover:bg-violet-700 rounded-xl">
          + Create New Course
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (course of trainerCourses(); track course.id) {
          <div class="trainer-course-card">
            <img [src]="course.thumbnail" [alt]="course.title" class="w-full h-48 object-cover rounded-t-xl">
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ course.title }}</h3>
              <div class="flex gap-4 text-sm text-gray-600 mb-4">
                <span class="flex items-center gap-1">
                  <mat-icon class="text-sm">people</mat-icon>
                  {{ course.enrolledStudents }} students
                </span>
                <span class="flex items-center gap-1">
                  <mat-icon class="text-sm">star</mat-icon>
                  {{ course.rating }}/5
                </span>
              </div>
              <div class="flex gap-2">
                <button mat-stroked-button class="flex-1 rounded-lg border-violet-600 text-violet-600">Edit</button>
                <button mat-stroked-button class="flex-1 rounded-lg">Stats</button>
                <button mat-icon-button [routerLink]="['/courses', course.id]">
                  <mat-icon>visibility</mat-icon>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Bottom Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Recent Activity -->
        <div class="dashboard-card">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
            @for (activity of recentActivity(); track activity.id) {
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <mat-icon class="text-violet-600">{{ activity.icon }}</mat-icon>
                <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.text }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
            </div>
            }
        </div>
        </div>

        <!-- Upcoming Sessions -->
        <div class="dashboard-card">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h3>
        <div class="space-y-4">
            @for (session of upcomingSessions(); track session.id) {
            <div class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div class="text-center min-w-[60px]">
                <div class="text-2xl font-bold text-violet-600">{{ session.date | date:'dd' }}</div>
                <div class="text-xs text-gray-500">{{ session.date | date:'MMM' }}</div>
                </div>
                <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ session.title }}</p>
                <p class="text-sm text-gray-600">{{ session.time }}</p>
                </div>
            </div>
            }
        </div>
        </div>
    </div>
  `,
  styles: [`
    .stat-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; display: flex; gap: 16px; align-items: center; transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(124, 58, 237, 0.1); }
    .stat-card__icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-card--violet .stat-card__icon { background: rgba(124, 58, 237, 0.1); color: #7C3AED; }
    .stat-card--blue .stat-card__icon { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
    .stat-card--orange .stat-card__icon { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .stat-card--green .stat-card__icon { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .stat-card__content h3 { font-size: 28px; font-weight: 700; color: #1F2937; }
    .stat-card__content p { font-size: 14px; color: #6B7280; margin-top: 4px; }
    .trainer-course-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; transition: all 0.3s ease; }
    .trainer-course-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }
    .dashboard-card { background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; }
  `]
})
export class TrainerHomeComponent {
  userName = signal('Sarah Johnson');

  // Stats
  myCourses = signal(12);
  totalStudents = signal(487);
  avgRating = signal(4.8);
  monthlyRevenue = signal(8450);

  trainerCourses = signal([
    { id: 1, title: 'Angular 18 Masterclass', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', enrolledStudents: 156, rating: 4.9 },
    { id: 2, title: 'TypeScript Advanced', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400', enrolledStudents: 98, rating: 4.7 },
    { id: 3, title: 'RxJS Complete Guide', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', enrolledStudents: 124, rating: 4.8 }
  ]);

  recentActivity = signal([
    { id: 1, icon: 'person_add', text: 'New enrollment in Angular Masterclass', time: '2 hours ago' },
    { id: 2, icon: 'star', text: 'New 5-star review on TypeScript course', time: '5 hours ago' },
    { id: 3, icon: 'comment', text: 'New question in course forum', time: '1 day ago' }
  ]);

  upcomingSessions = signal([
    { id: 1, title: 'Angular Workshop', date: new Date('2024-01-15'), time: '14:00 - 16:00' },
    { id: 2, title: 'React Masterclass', date: new Date('2024-01-18'), time: '10:00 - 12:00' }
  ]);
}
