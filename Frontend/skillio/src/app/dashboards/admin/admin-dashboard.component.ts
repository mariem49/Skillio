import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
    template: `
    <div class="min-h-screen bg-navy-900">
      <!-- Header -->
      <div class="bg-navy-800 border-b border-navy-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p class="text-gray-400 text-sm mt-1">Welcome back, {{ userName() }}</p>
          </div>
          <div class="flex items-center gap-4">
            <button mat-icon-button class="text-gray-400 hover:text-white">
              <mat-icon>notifications</mat-icon>
            </button>
            <div class="flex items-center gap-3">
              <img [src]="userAvatar()" class="w-10 h-10 rounded-full border-2 border-blue-500">
              <div class="text-right">
                <p class="text-sm font-medium text-white">{{ userName() }}</p>
                <p class="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Students -->
          <div class="stat-card stat-card--blue">
            <div class="stat-card__icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-card__content">
              <p class="stat-card__label">Total Students</p>
              <h3 class="stat-card__value">{{ totalStudents() | number }}</h3>
              <span class="stat-card__trend stat-card__trend--up">
                <mat-icon class="text-xs">arrow_upward</mat-icon> {{ studentsGrowth() }}%
              </span>
            </div>
          </div>

          <!-- Active Courses -->
          <div class="stat-card stat-card--purple">
            <div class="stat-card__icon">
              <mat-icon>school</mat-icon>
            </div>
            <div class="stat-card__content">
              <p class="stat-card__label">Active Courses</p>
              <h3 class="stat-card__value">{{ activeCourses() }}</h3>
              <span class="stat-card__trend stat-card__trend--up">
                <mat-icon class="text-xs">arrow_upward</mat-icon> {{ coursesGrowth() }}%
              </span>
            </div>
          </div>

          <!-- Revenue -->
          <div class="stat-card stat-card--green">
            <div class="stat-card__icon">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="stat-card__content">
              <p class="stat-card__label">Revenue</p>
              <h3 class="stat-card__value">\${{ totalRevenue() | number }}</h3>
              <span class="stat-card__trend stat-card__trend--up">
                <mat-icon class="text-xs">arrow_upward</mat-icon> {{ revenueGrowth() }}%
              </span>
            </div>
          </div>

          <!-- Events -->
          <div class="stat-card stat-card--orange">
            <div class="stat-card__icon">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-card__content">
              <p class="stat-card__label">Events</p>
              <h3 class="stat-card__value">{{ totalEvents() }}</h3>
              <span class="stat-card__trend stat-card__trend--down">
                <mat-icon class="text-xs">arrow_downward</mat-icon> {{ eventsChange() }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="chart-card">
            <div class="chart-card__header">
              <h3>Revenue Analytics</h3>
              <select class="select-timeframe">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div class="chart-card__body">
              <div class="chart-placeholder">
                <mat-icon class="text-6xl text-gray-600">show_chart</mat-icon>
                <p class="text-gray-500 mt-2">Chart will be integrated here</p>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-card__header">
              <h3>Traffic Overview</h3>
            </div>
            <div class="chart-card__body">
              <div class="chart-placeholder">
                <mat-icon class="text-6xl text-gray-600">bar_chart</mat-icon>
                <p class="text-gray-500 mt-2">Chart will be integrated here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities Table -->
        <div class="table-card">
          <div class="table-card__header">
            <h3>Recent Activities</h3>
            <button mat-button class="text-blue-500">View All</button>
          </div>
          <div class="table-card__body">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (activity of recentActivities(); track activity.id) {
                  <tr>
                    <td>
                      <div class="user-cell">
                        <img [src]="activity.userAvatar" [alt]="activity.userName" class="w-8 h-8 rounded-full">
                        <span>{{ activity.userName }}</span>
                      </div>
                    </td>
                    <td>{{ activity.action }}</td>
                    <td>{{ activity.date | date:'short' }}</td>
                    <td>
                      <span class="status-badge" [ngClass]="'status-badge--' + activity.status">
                        {{ activity.status }}
                      </span>
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
      background: linear-gradient(135deg, #1E293B 0%, rgba(59,130,246,0.05) 100%);
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      gap: 16px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      border-color: #3B82F6;
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
    }

    .stat-card__icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card--blue .stat-card__icon {
      background: rgba(59, 130, 246, 0.15);
      color: #3B82F6;
    }

    .stat-card--purple .stat-card__icon {
      background: rgba(139, 92, 246, 0.15);
      color: #8B5CF6;
    }

    .stat-card--green .stat-card__icon {
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
    }

    .stat-card--orange .stat-card__icon {
      background: rgba(245, 158, 11, 0.15);
      color: #F59E0B;
    }

    .stat-card__label {
      color: #94A3B8;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-card__value {
      font-size: 32px;
      font-weight: 700;
      color: #F8FAFC;
      margin: 4px 0;
    }

    .stat-card__trend {
      font-size: 14px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .stat-card__trend--up {
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
    }

    .stat-card__trend--down {
      background: rgba(239, 68, 68, 0.15);
      color: #EF4444;
    }

    .chart-card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
    }

    .chart-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .chart-card__header h3 {
      color: #F8FAFC;
      font-size: 18px;
      font-weight: 700;
    }

    .select-timeframe {
      background: #0F172A;
      border: 1px solid #334155;
      color: #F8FAFC;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
    }

    .chart-placeholder {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .table-card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
    }

    .table-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-card__header h3 {
      color: #F8FAFC;
      font-size: 18px;
      font-weight: 700;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table thead th {
      text-align: left;
      padding: 12px;
      color: #94A3B8;
      font-size: 14px;
      font-weight: 600;
      border-bottom: 1px solid #334155;
    }

    .admin-table tbody td {
      padding: 16px 12px;
      color: #F8FAFC;
      border-bottom: 1px solid #334155;
    }

    .admin-table tbody tr:hover {
      background: rgba(59, 130, 246, 0.05);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge--completed {
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
    }

    .status-badge--pending {
      background: rgba(245, 158, 11, 0.15);
      color: #F59E0B;
    }

    .status-badge--active {
      background: rgba(59, 130, 246, 0.15);
      color: #3B82F6;
    }
  `]
})
export class AdminDashboardComponent {
    private authService = inject(AuthService);

    userName = signal('Admin User');
    userAvatar = signal('https://ui-avatars.com/api/?name=Admin+User&background=3B82F6');

    // Stats
    totalStudents = signal(26354);
    studentsGrowth = signal(12.5);
    activeCourses = signal(1248);
    coursesGrowth = signal(8.2);
    totalRevenue = signal(125430);
    revenueGrowth = signal(15.3);
    totalEvents = signal(42);
    eventsChange = signal(3.1);

    // Recent Activities
    recentActivities = signal([
        {
            id: 1,
            userName: 'John Doe',
            userAvatar: 'https://ui-avatars.com/api/?name=John+Doe',
            action: 'Enrolled in Angular Course',
            date: new Date(),
            status: 'completed'
        },
        {
            id: 2,
            userName: 'Jane Smith',
            userAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
            action: 'Submitted assignment',
            date: new Date(),
            status: 'pending'
        },
        {
            id: 3,
            userName: 'Mike Johnson',
            userAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson',
            action: 'Started new course',
            date: new Date(),
            status: 'active'
        }
    ]);
}
