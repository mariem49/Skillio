import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule],
  template: `
    <div class="group relative bg-white dark:bg-navy-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-navy-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <!-- Image -->
      <div class="relative aspect-video overflow-hidden">
        <img [src]="course.thumbnail" [alt]="course.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Category Badge -->
        @if (course.categoryName) {
            <span class="absolute top-3 left-3 bg-white/90 dark:bg-navy-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-violet-600 uppercase tracking-wide">
            {{course.categoryName}}
            </span>
        }
      </div>

      <!-- Content -->
      <div class="p-5 flex-1 flex flex-col">
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1 text-amber-400">
                <mat-icon class="text-sm w-4 h-4">star</mat-icon>
                <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{course.rating}}</span>
                <span class="text-xs text-gray-500">({{course.studentsEnrolled | number}} students)</span>
            </div>
        </div>

        <h3 class="font-heading font-bold text-lg text-navy-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
            <a [routerLink]="['/courses', course.id]" class="before:absolute before:inset-0">{{course.title}}</a>
        </h3>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{course.trainerName}}</p>
        
        <div class="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-navy-700 pt-4">
             <div class="flex items-center gap-2">
                <span class="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300">{{course.level}}</span>
             </div>
             <div class="font-bold text-xl text-violet-600">
                {{ course.price === 0 ? 'Free' : (course.price | currency:course.currency) }}
             </div>
        </div>
      </div>
    </div>
  `
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;
}
