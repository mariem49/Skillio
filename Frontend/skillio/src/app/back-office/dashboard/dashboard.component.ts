import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [MatCardModule, MatIconModule],
    template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- KPI Card -->
      <mat-card class="bg-navy-800 border border-navy-700 text-white p-4 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm font-medium">Total Students</p>
            <h3 class="text-2xl font-bold mt-1">26,354</h3>
            <span class="text-green-400 text-xs font-medium flex items-center mt-1">
              <mat-icon class="text-xs w-3 h-3 mr-1">arrow_upward</mat-icon> 12.5%
            </span>
          </div>
          <div class="p-3 bg-blue-500/10 rounded-lg">
            <mat-icon class="text-blue-500">people</mat-icon>
          </div>
        </div>
      </mat-card>

      <mat-card class="bg-navy-800 border border-navy-700 text-white p-4 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm font-medium">Active Courses</p>
            <h3 class="text-2xl font-bold mt-1">1,248</h3>
            <span class="text-green-400 text-xs font-medium flex items-center mt-1">
              <mat-icon class="text-xs w-3 h-3 mr-1">arrow_upward</mat-icon> 8.2%
            </span>
          </div>
          <div class="p-3 bg-purple-500/10 rounded-lg">
            <mat-icon class="text-purple-500">school</mat-icon>
          </div>
        </div>
      </mat-card>

      <mat-card class="bg-navy-800 border border-navy-700 text-white p-4 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm font-medium">Revenue</p>
            <h3 class="text-2xl font-bold mt-1">$125,430</h3>
            <span class="text-green-400 text-xs font-medium flex items-center mt-1">
              <mat-icon class="text-xs w-3 h-3 mr-1">arrow_upward</mat-icon> 15.3%
            </span>
          </div>
          <div class="p-3 bg-green-500/10 rounded-lg">
            <mat-icon class="text-green-500">attach_money</mat-icon>
          </div>
        </div>
      </mat-card>

      <mat-card class="bg-navy-800 border border-navy-700 text-white p-4 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm font-medium">Events</p>
            <h3 class="text-2xl font-bold mt-1">42</h3>
            <span class="text-red-400 text-xs font-medium flex items-center mt-1">
              <mat-icon class="text-xs w-3 h-3 mr-1">arrow_downward</mat-icon> 3.1%
            </span>
          </div>
          <div class="p-3 bg-orange-500/10 rounded-lg">
            <mat-icon class="text-orange-500">event</mat-icon>
          </div>
        </div>
      </mat-card>
    </div>

    <!-- Charts Section Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <mat-card class="bg-navy-800 border border-navy-700 text-white p-6 rounded-xl shadow-lg h-80">
        <h3 class="font-bold text-lg mb-4">Revenue Analytics</h3>
        <div class="flex items-center justify-center h-full text-gray-500">
          Chart Placeholder
        </div>
      </mat-card>
      
      <mat-card class="bg-navy-800 border border-navy-700 text-white p-6 rounded-xl shadow-lg h-80">
        <h3 class="font-bold text-lg mb-4">Traffic Overview</h3>
        <div class="flex items-center justify-center h-full text-gray-500">
          Chart Placeholder
        </div>
      </mat-card>
    </div>
  `
})
export class DashboardComponent { }
