import { Component, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatExpansionModule,
        MatChipsModule,
        MatProgressSpinnerModule
    ],
    template: `
    @if (course(); as c) {
      <div class="bg-gray-50 dark:bg-navy-900 min-h-screen pb-20">
        <!-- Header / Breadcrumb -->
        <div class="bg-navy-900 text-white py-12">
           <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex items-center gap-2 text-sm text-gray-400 mb-4">
                 <a routerLink="/" class="hover:text-white">Home</a>
                 <mat-icon class="icon-xs">chevron_right</mat-icon>
                 <a routerLink="/courses" class="hover:text-white">Courses</a>
                 <mat-icon class="icon-xs">chevron_right</mat-icon>
                 <span class="text-white">{{ c.categoryName }}</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-heading font-bold mb-4">{{ c.title }}</h1>
              <p class="text-lg text-gray-300 max-w-3xl mb-6">{{ c.description }}</p>
              
              <div class="flex flex-wrap items-center gap-6 text-sm">
                 <div class="flex items-center gap-1">
                    <span class="bg-yellow-400 text-navy-900 px-2 py-0.5 rounded font-bold text-xs">Bestseller</span>
                 </div>
                 <div class="flex items-center gap-1 text-yellow-400">
                    <span class="font-bold text-lg">{{ c.rating }}</span>
                    <mat-icon class="icon-sm">star</mat-icon>
                    <mat-icon class="icon-sm">star</mat-icon>
                    <mat-icon class="icon-sm">star</mat-icon>
                    <mat-icon class="icon-sm">star</mat-icon>
                    <mat-icon class="icon-sm">star_half</mat-icon>
                    <span class="text-gray-400 ml-1">({{ c.reviewsCount }} ratings)</span>
                 </div>
                 <div class="flex items-center gap-1">
                    <mat-icon class="icon-sm text-gray-400">group</mat-icon>
                    <span>{{ c.studentsEnrolled }} students</span>
                 </div>
                 <div class="flex items-center gap-1">
                    <mat-icon class="icon-sm text-gray-400">language</mat-icon>
                    <span>{{ c.language }}</span>
                 </div>
                 <div class="flex items-center gap-1">
                    <mat-icon class="icon-sm text-gray-400">update</mat-icon>
                    <span>Last updated {{ c.updatedAt | date }}</span>
                 </div>
              </div>
           </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
           <div class="grid lg:grid-cols-3 gap-8">
              
              <!-- Main Content -->
              <div class="lg:col-span-2 space-y-8">
                 
                 <!-- What you'll learn -->
                 <div class="bg-white dark:bg-navy-800 p-8 rounded-xl shadow-card border border-gray-100 dark:border-navy-700 mt-8 lg:mt-0">
                    <h3 class="text-xl font-bold text-navy-900 dark:text-white mb-6">What you'll learn</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                       <div class="flex gap-3">
                          <mat-icon class="text-green-500 flex-shrink-0">check</mat-icon>
                          <span class="text-gray-600 dark:text-gray-300 text-sm">Build fully responsive websites</span>
                       </div>
                       <div class="flex gap-3">
                          <mat-icon class="text-green-500 flex-shrink-0">check</mat-icon>
                          <span class="text-gray-600 dark:text-gray-300 text-sm">Master HTML5, CSS3, and JavaScript</span>
                       </div>
                       <div class="flex gap-3">
                          <mat-icon class="text-green-500 flex-shrink-0">check</mat-icon>
                          <span class="text-gray-600 dark:text-gray-300 text-sm">Use modern frameworks like React</span>
                       </div>
                       <div class="flex gap-3">
                          <mat-icon class="text-green-500 flex-shrink-0">check</mat-icon>
                          <span class="text-gray-600 dark:text-gray-300 text-sm">Become a full-stack developer</span>
                       </div>
                    </div>
                 </div>

                 <!-- Curriculum -->
                 <div class="bg-white dark:bg-navy-800 p-8 rounded-xl shadow-card border border-gray-100 dark:border-navy-700">
                    <h3 class="text-xl font-bold text-navy-900 dark:text-white mb-6">Course Content</h3>
                    <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                       <span>{{ c.lecturesCount }} lectures • {{ c.duration }} total length</span>
                       <button mat-button color="primary" class="!px-0">Expand all sections</button>
                    </div>
                    
                    <mat-accordion displayMode="flat" multi>
                       <mat-expansion-panel expanded class="!bg-gray-50 dark:!bg-navy-900">
                          <mat-expansion-panel-header>
                             <mat-panel-title class="font-bold text-navy-900 dark:text-white">
                                Introduction
                             </mat-panel-title>
                             <mat-panel-description>
                                3 lectures • 12m
                             </mat-panel-description>
                          </mat-expansion-panel-header>
                          <div class="space-y-3 pt-2">
                             <div class="flex items-center justify-between text-sm group cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-800 p-2 rounded">
                                <div class="flex items-center gap-3">
                                   <mat-icon class="icon-sm text-gray-400">play_circle_outline</mat-icon>
                                   <span class="text-gray-700 dark:text-gray-300 group-hover:text-violet-600">Welcome to the course</span>
                                </div>
                                <div class="flex items-center gap-4">
                                   <span class="text-violet-600 text-xs font-bold">Preview</span>
                                   <span class="text-gray-500">02:30</span>
                                </div>
                             </div>
                             <div class="flex items-center justify-between text-sm group cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-800 p-2 rounded">
                                <div class="flex items-center gap-3">
                                   <mat-icon class="icon-sm text-gray-400">play_circle_outline</mat-icon>
                                   <span class="text-gray-700 dark:text-gray-300">Course Structure</span>
                                </div>
                                <span class="text-gray-500">05:15</span>
                             </div>
                          </div>
                       </mat-expansion-panel>

                       <mat-expansion-panel class="!bg-gray-50 dark:!bg-navy-900">
                          <mat-expansion-panel-header>
                             <mat-panel-title class="font-bold text-navy-900 dark:text-white">
                                HTML5 Basics
                             </mat-panel-title>
                             <mat-panel-description>
                                8 lectures • 45m
                             </mat-panel-description>
                          </mat-expansion-panel-header>
                          <div class="p-4 text-sm text-gray-500">
                             Content placeholder...
                          </div>
                       </mat-expansion-panel>
                    </mat-accordion>
                 </div>

                 <!-- Instructor -->
                 <div class="bg-white dark:bg-navy-800 p-8 rounded-xl shadow-card border border-gray-100 dark:border-navy-700">
                    <h3 class="text-xl font-bold text-navy-900 dark:text-white mb-6">Instructor</h3>
                    <div class="flex items-start gap-6">
                       <img [src]="'https://ui-avatars.com/api/?name=' + c.trainerName + '&size=128'" alt="Instructor" class="w-24 h-24 rounded-full">
                       <div>
                          <h4 class="text-lg font-bold text-violet-600 hover:underline cursor-pointer">{{ c.trainerName }}</h4>
                          <p class="text-gray-500 text-sm mb-3">Senior Web Developer & Instructor</p>
                          <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                             <div class="flex items-center gap-1"><mat-icon class="icon-xs">star</mat-icon> 4.8 Rating</div>
                             <div class="flex items-center gap-1"><mat-icon class="icon-xs">people</mat-icon> 25k Students</div>
                             <div class="flex items-center gap-1"><mat-icon class="icon-xs">play_circle</mat-icon> 12 Courses</div>
                          </div>
                          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                             David is a professional web developer with over 10 years of experience. He loves teaching and helping others learn code...
                          </p>
                       </div>
                    </div>
                 </div>

              </div>

              <!-- Sidebar -->
              <div class="lg:col-span-1">
                 <div class="sticky top-24 space-y-6">
                    
                    <!-- Video Preview Card -->
                    <div class="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-100 dark:border-navy-700 overflow-hidden">
                       <div class="relative aspect-video group cursor-pointer">
                          <img [src]="c.thumbnail" [alt]="c.title" class="w-full h-full object-cover">
                          <div class="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                             <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <mat-icon class="text-black text-3xl ml-1">play_arrow</mat-icon>
                             </div>
                          </div>
                          <div class="absolute bottom-4 left-0 right-0 text-center text-white font-bold tracking-wide">Preview this course</div>
                       </div>
                       
                       <div class="p-6">
                          <div class="flex items-end gap-3 mb-6">
                             <span class="text-3xl font-bold text-navy-900 dark:text-white">{{ c.price | currency }}</span>
                             @if (c.discountPrice) {
                                <span class="text-lg text-gray-400 line-through mb-1">{{ c.discountPrice | currency }}</span>
                                <span class="text-sm text-red-500 mb-1 font-medium">50% off</span>
                             }
                          </div>

                          <div class="space-y-3 mb-6">
                             <button mat-flat-button color="primary" class="w-full !py-6 !text-lg !rounded-lg bg-violet-600 hover:bg-violet-700 font-bold shadow-lg shadow-violet-200 dark:shadow-none">Adds to Cart</button>
                             <button mat-stroked-button class="w-full !py-6 !text-lg !rounded-lg border-2 border-navy-900 text-navy-900 dark:border-gray-500 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-navy-700">Buy Now</button>
                          </div>
                          
                          <p class="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                          <div class="space-y-4">
                             <h4 class="font-bold text-navy-900 dark:text-white">This course includes:</h4>
                             <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">ondemand_video</mat-icon> {{ c.duration }} on-demand video</li>
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">description</mat-icon> 5 articles</li>
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">file_download</mat-icon> 12 downloadable resources</li>
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">all_inclusive</mat-icon> Full lifetime access</li>
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">smartphone</mat-icon> Access on mobile and TV</li>
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">emoji_events</mat-icon> Certificate of completion</li>
                             </ul>
                          </div>
                       </div>
                    </div>

                    <!-- Share -->
                    <div class="text-center">
                       <button mat-button class="text-gray-500 hover:text-navy-900">
                          <mat-icon>share</mat-icon> Share this course
                       </button>
                    </div>

                 </div>
              </div>

           </div>
        </div>
      </div>
    } @else {
      <div class="flex justify-center items-center h-screen bg-gray-50 dark:bg-navy-900">
         <mat-spinner diameter="50"></mat-spinner>
      </div>
    }
  `,
    styles: [`
    .icon-xs { font-size: 16px; width: 16px; height: 16px; }
    .icon-sm { font-size: 20px; width: 20px; height: 20px; }
  `]
})
export class CourseDetailComponent {
    private courseService = inject(CourseService);

    @Input()
    set id(courseId: string) {
        // Fetch course when Input changes (from Router params)
        this.fetchCourse(Number(courseId));
    }

    // Signal for the course
    course = signal<Course | undefined>(undefined);

    private fetchCourse(id: number) {
        this.courseService.getById(id).subscribe(data => {
            this.course.set(data);
        });
    }
}
