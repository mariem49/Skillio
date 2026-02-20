import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule],
    template: `
    <mat-toolbar class="!bg-navy-800 !text-gray-200 border-b border-navy-700 shadow-sm h-16 px-6 flex justify-between">
      <!-- Left: Search or Breadcrumbs -->
      <div class="flex items-center">
        <button mat-icon-button class="md:hidden mr-2">
          <mat-icon>menu</mat-icon>
        </button>
        <div class="relative hidden sm:block">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <mat-icon class="text-gray-500 text-sm h-4 w-4">search</mat-icon>
          </span>
          <input type="text" class="bg-navy-900 text-gray-300 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-navy-700 placeholder-gray-500" placeholder="Search...">
        </div>
      </div>

      <!-- Right: Notifications & Profile -->
      <div class="flex items-center gap-4">
        <button mat-icon-button class="text-gray-400 hover:text-white">
          <mat-icon [matBadge]="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
        </button>

        <button mat-button [matMenuTriggerFor]="profileMenu" class="flex items-center gap-2 !px-2 !min-w-0">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff" alt="Avatar" class="w-8 h-8 rounded-full">
          <span class="hidden sm:inline text-sm font-medium">Admin User</span>
          <mat-icon class="text-gray-500 icon-sm">arrow_drop_down</mat-icon>
        </button>
        <mat-menu #profileMenu="matMenu" class="bg-white">
          <button mat-menu-item>
            <mat-icon>account_circle</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <button mat-menu-item class="text-red-600">
            <mat-icon class="text-red-600">logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
    styles: [`
    .icon-sm { width: 20px; height: 20px; font-size: 20px; }
  `]
})
export class HeaderComponent { }
