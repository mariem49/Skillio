import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CompanyService } from '../../core/services/company.service';
import { AuthService } from '../../core/services/auth.service';
import { Company } from '../../core/models/company.model';

@Component({
  selector: 'app-enterprise-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatIconModule,
    MatButtonModule
  ],
  template: `
  <div class="min-h-screen flex bg-gray-50">

    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200">
      <div class="p-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">{{ company()?.name || 'Enterprise' }}</h2>
            <p class="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      <nav class="mt-6">
        <a routerLink="/enterprise/dashboard" routerLinkActive="bg-violet-50 text-violet-700" class="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        <a routerLink="/enterprise/profile" routerLinkActive="bg-violet-50 text-violet-700" class="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </a>
        <a routerLink="/enterprise/job-offers" routerLinkActive="bg-violet-50 text-violet-700" class="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <mat-icon>work</mat-icon>
          <span>My Job Offers</span>
        </a>
        <a routerLink="/enterprise/subscription" routerLinkActive="bg-violet-50 text-violet-700" class="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <mat-icon>paid</mat-icon>
          <span>Subscription</span>
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
  styles: [`
    aside { min-height: 100vh; }
    nav a.active { background-color: #ede9fe; color: #7c3aed; }
  `]
})
export class EnterpriseDashboardComponent {

  company = signal<Company | null>(null);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);

  constructor() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.companyService.getByEnterpriseUserId(userId).subscribe({
        next: (data) => this.company.set(data),
        error: (err) => console.error('Error loading company', err)
      });
    }
  }
}