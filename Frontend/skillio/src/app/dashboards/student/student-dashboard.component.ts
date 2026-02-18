import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
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

          <!-- Navigation Links (NEW) -->
          <nav class="hidden md:flex items-center gap-1">
             <a routerLink="/student/dashboard" routerLinkActive="bg-violet-50 text-violet-700" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Dashboard</a>
             <a routerLink="/student/jobs" routerLinkActive="bg-violet-50 text-violet-700" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Browse Jobs</a>
             <a routerLink="/my-courses" routerLinkActive="bg-violet-50 text-violet-700" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">My Courses</a>
             <a routerLink="/student/subscription" routerLinkActive="bg-violet-50 text-violet-700" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Subscription</a>
          </nav>

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
         <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class StudentDashboardComponent {
  userName = signal('John Doe');
  userAvatar = signal('https://ui-avatars.com/api/?name=John+Doe&background=7C3AED');
}
