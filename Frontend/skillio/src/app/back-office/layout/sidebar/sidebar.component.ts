import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <div class="h-full flex flex-col bg-navy-900 text-gray-300 w-64 border-r border-navy-800">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-navy-800">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span class="font-heading font-bold text-xl text-white tracking-tight">Skillio Admin</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <div class="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Main
        </div>
        <a routerLink="/admin/dashboard" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">dashboard</mat-icon>
          Dashboard
        </a>

        <div class="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Management
        </div>
        <a routerLink="/admin/companies" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">business</mat-icon>
          Companies
        </a>
        <a routerLink="/admin/job-offers" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">work</mat-icon>
          Job Offers
        </a>
         <a routerLink="/admin/pricing" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">monetization_on</mat-icon>
          Pricing Plans
        </a>
        <a routerLink="/admin/users" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">people</mat-icon>
          Users
        </a>
        <a routerLink="/admin/formations" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">school</mat-icon>
          Formations
        </a>
        <a routerLink="/admin/events" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">event</mat-icon>
          Events
        </a>
        <a routerLink="/admin/subscriptions" routerLinkActive="bg-navy-800 text-white border-l-4 border-blue-500" class="flex items-center px-6 py-3 hover:bg-navy-800 hover:text-white transition-colors group border-l-4 border-transparent">
          <mat-icon class="mr-3 text-gray-400 group-hover:text-blue-400">card_membership</mat-icon>
          Subscriptions
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-navy-800">
        <button class="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-navy-800 rounded-md transition-colors">
          <mat-icon class="mr-3 text-base">logout</mat-icon>
          Sign Out
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent { }
