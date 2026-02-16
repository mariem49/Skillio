import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { CourseService } from '../../../core/services/course.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    CourseCardComponent
  ],
  template: `
    <div class="bg-gray-50 dark:bg-navy-900 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-heading font-bold text-navy-900 dark:text-white">All Courses</h1>
            <p class="text-gray-500 text-sm mt-1">Explore our comprehensive catalog</p>
          </div>
          <div class="flex items-center gap-4">
             <div class="relative">
                <input type="text" placeholder="Search courses..." class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 focus:ring-2 focus:ring-violet-500 focus:outline-none w-64 shadow-sm">
                <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</mat-icon>
             </div>
             <div class="w-40">
               <mat-select value="newest" class="bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-700 px-3 py-1.5 shadow-sm">
                  <mat-option value="newest">Newest</mat-option>
                  <mat-option value="rating">Rating</mat-option>
                  <mat-option value="price-low">Price: Low to High</mat-option>
                  <mat-option value="price-high">Price: High to Low</mat-option>
               </mat-select>
             </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-4 gap-8">
          
          <!-- Sidebar Filters -->
          <div class="lg:col-span-1 space-y-8">
            <div class="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-card border border-gray-100 dark:border-navy-700">
              <h3 class="font-bold text-navy-900 dark:text-white mb-4">Categories</h3>
              <div class="space-y-3">
                @for (cat of categories; track cat) {
                  <mat-checkbox color="primary" class="w-full text-sm text-gray-600 dark:text-gray-300">
                    {{ cat.name }} <span class="text-gray-400">({{ cat.count }})</span>
                  </mat-checkbox>
                }
              </div>

              <div class="my-6 border-t border-gray-100 dark:border-navy-700"></div>

              <h3 class="font-bold text-navy-900 dark:text-white mb-4">Price Level</h3>
              <div class="space-y-3">
                 <mat-checkbox color="primary" class="w-full text-sm">Free (120)</mat-checkbox>
                 <mat-checkbox color="primary" class="w-full text-sm">Paid (480)</mat-checkbox>
              </div>

              <div class="my-6 border-t border-gray-100 dark:border-navy-700"></div>

              <h3 class="font-bold text-navy-900 dark:text-white mb-4">Skill Level</h3>
              <div class="space-y-3">
                 <mat-checkbox color="primary" class="w-full text-sm">Beginner</mat-checkbox>
                 <mat-checkbox color="primary" class="w-full text-sm">Intermediate</mat-checkbox>
                 <mat-checkbox color="primary" class="w-full text-sm">Advanced</mat-checkbox>
              </div>

              <button mat-flat-button color="primary" class="w-full mt-8 rounded-lg !py-6 bg-violet-600">Filter Results</button>
            </div>
          </div>

          <!-- Course Grid -->
          <div class="lg:col-span-3">
            @if (isLoading()) {
              <div class="flex justify-center items-center h-64">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
            } @else {
              <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                 @for (course of courses(); track course.id) {
                    <app-course-card [course]="course"></app-course-card>
                 }
              </div>
              
              <!-- Pagination -->
              <div class="mt-12 flex justify-center">
                <nav class="flex items-center gap-2">
                   <button mat-icon-button class="border border-gray-200 dark:border-navy-700"><mat-icon>chevron_left</mat-icon></button>
                   <button mat-flat-button class="bg-violet-600 text-white min-w-[40px] px-0">1</button>
                   <button mat-stroked-button class="min-w-[40px] px-0">2</button>
                   <button mat-stroked-button class="min-w-[40px] px-0">3</button>
                   <span class="px-2 text-gray-400">...</span>
                   <button mat-stroked-button class="min-w-[40px] px-0">12</button>
                   <button mat-icon-button class="border border-gray-200 dark:border-navy-700"><mat-icon>chevron_right</mat-icon></button>
                </nav>
              </div>
            }
          </div>

        </div>
      </div>
    </div>
  `
})
export class CatalogComponent {
  private courseService = inject(CourseService);

  categories = [
    { name: 'Web Development', count: 120 },
    { name: 'Graphic Design', count: 45 },
    { name: 'Data Science', count: 32 },
    { name: 'Marketing', count: 28 },
    { name: 'Finance', count: 15 }
  ];

  // Using signals for data
  isLoading = signal(false);

  // Real usage of resource or just calling it in constructor
  // toSignal handles observable subscription
  courses = toSignal(this.courseService.getAll(), { initialValue: [] });
}
