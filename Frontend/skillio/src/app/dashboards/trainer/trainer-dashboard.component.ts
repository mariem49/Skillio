import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-trainer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Top Navbar -->
      <div class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">Trainer Dashboard</h1>
              <p class="text-sm text-gray-500">Skillio Teaching Platform</p>
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
                <p class="text-xs text-gray-500">Trainer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto p-6">
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
                    <button mat-stroked-button class="flex-1 rounded-lg border-violet-600 text-violet-600">
                      Edit
                    </button>
                    <button mat-stroked-button class="flex-1 rounded-lg">
                      Stats
                    </button>
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

        <!-- Students Performance -->
        <div class="dashboard-card">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Students Performance</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Activity</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Grade</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (student of studentsProgress(); track student.id) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <img [src]="student.avatar" class="w-8 h-8 rounded-full">
                        <span class="font-medium text-gray-900">{{ student.name }}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-gray-600">{{ student.courseName }}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div class="h-full bg-violet-600" [style.width.%]="student.progress"></div>
                        </div>
                        <span class="text-sm text-gray-600">{{ student.progress }}%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ student.lastActivity | date:'short' }}</td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-sm font-semibold"
                            [class.bg-green-100]="student.grade >= 80"
                            [class.text-green-700]="student.grade >= 80"
                            [class.bg-orange-100]="student.grade < 80"
                            [class.text-orange-700]="student.grade < 80">
                        {{ student.grade }}%
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <button mat-icon-button class="text-violet-600">
                        <mat-icon>visibility</mat-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
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

    .trainer-course-card {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .trainer-course-card:hover {
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
export class TrainerDashboardComponent {
    userName = signal('Sarah Johnson');
    userAvatar = signal('https://ui-avatars.com/api/?name=Sarah+Johnson&background=7C3AED');

    // Stats
    myCourses = signal(12);
    totalStudents = signal(487);
    avgRating = signal(4.8);
    monthlyRevenue = signal(8450);

    // Courses
    trainerCourses = signal([
        {
            id: 1,
            title: 'Angular 18 Masterclass',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
            enrolledStudents: 156,
            rating: 4.9
        },
        {
            id: 2,
            title: 'TypeScript Advanced',
            thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
            enrolledStudents: 98,
            rating: 4.7
        },
        {
            id: 3,
            title: 'RxJS Complete Guide',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
            enrolledStudents: 124,
            rating: 4.8
        }
    ]);

    // Recent Activity
    recentActivity = signal([
        { id: 1, icon: 'person_add', text: 'New enrollment in Angular Masterclass', time: '2 hours ago' },
        { id: 2, icon: 'star', text: 'New 5-star review on TypeScript course', time: '5 hours ago' },
        { id: 3, icon: 'comment', text: 'New question in course forum', time: '1 day ago' }
    ]);

    // Upcoming Sessions
    upcomingSessions = signal([
        { id: 1, title: 'Angular Workshop', date: new Date('2024-01-15'), time: '14:00 - 16:00' },
        { id: 2, title: 'React Masterclass', date: new Date('2024-01-18'), time: '10:00 - 12:00' }
    ]);

    // Students Performance
    studentsProgress = signal([
        {
            id: 1,
            name: 'John Doe',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe',
            courseName: 'Angular 18 Masterclass',
            progress: 85,
            lastActivity: new Date(),
            grade: 92
        },
        {
            id: 2,
            name: 'Jane Smith',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
            courseName: 'TypeScript Advanced',
            progress: 65,
            lastActivity: new Date(),
            grade: 78
        },
        {
            id: 3,
            name: 'Mike Johnson',
            avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson',
            courseName: 'RxJS Complete Guide',
            progress: 42,
            lastActivity: new Date(),
            grade: 68
        }
    ]);
}
