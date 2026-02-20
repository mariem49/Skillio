import { Component, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TrainingService } from '../../../core/services/training.service';
import { Training } from '../../../core/models/training.model';
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
                 <span class="text-white">{{ c.category }}</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-heading font-bold mb-4">{{ c.title }}</h1>
              <p class="text-lg text-gray-300 max-w-3xl mb-6">{{ c.description }}</p>
              
              <div class="flex flex-wrap items-center gap-6 text-sm">
                 <div class="flex items-center gap-1">
                    <span class="bg-yellow-400 text-navy-900 px-2 py-0.5 rounded font-bold text-xs">Bestseller</span>
                 </div>
                 <div class="flex items-center gap-1">
                    <mat-icon class="icon-sm text-gray-400">language</mat-icon>
                    <span>{{ c.language }}</span>
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
                    <div class="space-y-2">
                      @for (content of c.contents; track content.id) {
                        <div class="flex items-center justify-between text-sm group p-2 rounded hover:bg-gray-100 dark:hover:bg-navy-800">
                          <span class="text-gray-700 dark:text-gray-300">{{ content.title }}</span>
                          <a [href]="content.contentUrl" target="_blank" class="text-violet-600 hover:underline">Open</a>
                        </div>
                      }
                    </div>
                 </div>

                <!-- Instructor section removed: not part of Training DTO -->

              </div>

              <!-- Sidebar -->
              <div class="lg:col-span-1">
                 <div class="sticky top-24 space-y-6">
                    
                    <!-- Video Preview Card -->
                    <div class="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-100 dark:border-navy-700 overflow-hidden">
                       <div class="relative aspect-video group cursor-pointer">
                          <img [src]="c.thumbnailUrl" [alt]="c.title" class="w-full h-full object-cover">
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
                             </div>

                          <div class="space-y-3 mb-6">
                             <button mat-flat-button color="primary" class="w-full !py-6 !text-lg !rounded-lg bg-violet-600 hover:bg-violet-700 font-bold shadow-lg shadow-violet-200 dark:shadow-none">Adds to Cart</button>
                             <button mat-stroked-button class="w-full !py-6 !text-lg !rounded-lg border-2 border-navy-900 text-navy-900 dark:border-gray-500 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-navy-700">Buy Now</button>
                          </div>
                          
                          <p class="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                          <div class="space-y-4">
                             <h4 class="font-bold text-navy-900 dark:text-white">This course includes:</h4>
                             <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">category</mat-icon> {{ c.category }}</li>
                                <li class="flex items-center gap-3"><mat-icon class="icon-xs text-gray-400">school</mat-icon> {{ c.level }}</li>
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
    private trainingService = inject(TrainingService);

    @Input()
    set id(courseId: string) {
        // Fetch course when Input changes (from Router params)
        this.fetchCourse(Number(courseId));
    }

    // Signal for the course
    course = signal<Training | undefined>(undefined);

    private fetchCourse(id: number) {
        this.trainingService.getById(id).subscribe(data => {
            this.course.set(data);
        });
    }
}
