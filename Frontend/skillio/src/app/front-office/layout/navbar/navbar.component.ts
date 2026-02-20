import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-navy-900/80 dark:border-navy-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" routerLink="/">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span class="font-heading font-bold text-xl text-navy-900 dark:text-white tracking-tight">Skillio</span>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/" routerLinkActive="text-violet-600 dark:text-violet-400" [routerLinkActiveOptions]="{exact: true}" class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</a>
            <a routerLink="/courses" routerLinkActive="text-violet-600 dark:text-violet-400" class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Courses</a>
            <a routerLink="/events" routerLinkActive="text-violet-600 dark:text-violet-400" class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Events</a>
            <a routerLink="/pricing" routerLinkActive="text-violet-600 dark:text-violet-400" class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Pricing</a>
            <a routerLink="/companies" routerLinkActive="text-violet-600 dark:text-violet-400" class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Entreprises</a>
          </div>

          <!-- Auth Buttons -->
          <div class="hidden md:flex items-center gap-4">
            @if (isLoggedIn()) {
              <!-- Dashboard Button (Dynamic based on role) -->
              <a [routerLink]="getDashboardRoute()" mat-flat-button class="rounded-full px-6 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 dark:shadow-none flex items-center gap-2">
                <mat-icon class="text-sm">dashboard</mat-icon>
                Mon Dashboard
              </a>
              <button mat-button (click)="logout()" class="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                Logout
              </button>
            } @else {
              <button mat-button class="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" routerLink="/auth/login">
                Sign In
              </button>
              <button mat-flat-button color="primary" class="rounded-full px-6 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 dark:shadow-none" routerLink="/auth/register">
                Get Started
              </button>
            }
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button mat-icon-button (click)="mobileMenuOpen = !mobileMenuOpen">
              <mat-icon>{{mobileMenuOpen ? 'close' : 'menu'}}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen) {
        <div class="md:hidden bg-white dark:bg-navy-800 border-t border-gray-100 dark:border-navy-700 absolute w-full shadow-lg">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a routerLink="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 hover:bg-gray-50 dark:hover:bg-navy-700">Home</a>
            <a routerLink="/courses" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 hover:bg-gray-50 dark:hover:bg-navy-700">Courses</a>
            <a routerLink="/companies" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 hover:bg-gray-50 dark:hover:bg-navy-700">Entreprises</a>
            
            @if (isLoggedIn()) {
              <a [routerLink]="getDashboardRoute()" class="block px-3 py-2 rounded-md text-base font-medium text-violet-600 font-bold bg-violet-50 dark:bg-violet-900/20">Mon Dashboard</a>
              <button (click)="logout()" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 hover:bg-gray-50 dark:hover:bg-navy-700">Logout</button>
            } @else {
              <a routerLink="/auth/login" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 hover:bg-gray-50 dark:hover:bg-navy-700">Sign In</a>
              <a routerLink="/auth/register" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-violet-600 font-bold bg-violet-50 dark:bg-violet-900/20">Get Started</a>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);

  mobileMenuOpen = false;
  isLoggedIn = this.authService.isLoggedIn;
  userRole = this.authService.userRole;

  getDashboardRoute(): string {
    const role = this.userRole();
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'STUDENT': return '/student/dashboard';
      case 'TRAINER': return '/trainer/dashboard';
      case 'ENTERPRISE': return '/enterprise/dashboard';
      default: return '/';
    }
  }

  logout() {
    this.authService.logout();
  }
}
