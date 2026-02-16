import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CourseService } from '../../core/services/course.service';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { Observable } from 'rxjs'; // Import Observable

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, CourseCardComponent],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section relative overflow-hidden bg-navy-900 text-white pt-20 pb-32">
        <!-- Background Elements -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-3xl animate-pulse"></div>
          <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="flex flex-col lg:flex-row items-center gap-12">
            <div class="lg:w-1/2 text-center lg:text-left">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 animate-fade-in-up">
                <span class="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                <span class="text-sm font-medium text-accent-100">New courses available</span>
              </div>
              
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">
                Master New Skills with <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-accent">Skillio</span>
              </h1>
              
              <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style="animation-delay: 0.2s;">
                Unlock your potential with expert-led courses in coding, design, business, and more. Start learning today.
              </p>
              
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style="animation-delay: 0.3s;">
                <a routerLink="/courses" mat-flat-button color="primary" class="!px-8 !py-6 !rounded-full !text-lg font-bold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all transform hover:-translate-y-1">
                  Explore Courses
                </a>
                <a routerLink="/auth/register" mat-stroked-button class="!px-8 !py-6 !rounded-full !text-lg font-bold !border-white/30 !text-white hover:bg-white/10 transition-all">
                  Join for Free
                </a>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-8 mt-16 border-t border-white/10 pt-8 animate-fade-in-up" style="animation-delay: 0.4s;">
                <div>
                  <div class="text-3xl font-bold text-white mb-1">10k+</div>
                  <div class="text-sm text-gray-400">Active Students</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-white mb-1">500+</div>
                  <div class="text-sm text-gray-400">Expert Instructors</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-white mb-1">1.2k+</div>
                  <div class="text-sm text-gray-400">Courses</div>
                </div>
              </div>
            </div>

            <div class="lg:w-1/2 relative animate-float">
              <!-- Hero Image Placeholder / Graphic -->
              <div class="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-navy-800/50 backdrop-blur-md p-4">
                 <div class="aspect-video bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl overflow-hidden relative group">
                    <!-- Abstract Code UI Concept -->
                    <div class="absolute top-0 left-0 w-full h-8 bg-navy-950 flex items-center px-4 gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div class="pt-12 px-8 font-mono text-sm text-gray-300">
                        <div class="mb-2"><span class="text-violet-400">class</span> <span class="text-yellow-400">Learner</span> <span class="text-white">{{ '{' }}</span></div>
                        <div class="pl-4 mb-2"><span class="text-violet-400">const</span> potential = <span class="text-green-400">'unlimited'</span>;</div>
                        <div class="pl-4 mb-2"><span class="text-violet-400">async</span> <span class="text-blue-400">startJourney</span>() <span class="text-white">{{ '{' }}</span></div>
                        <div class="pl-8 mb-2"><span class="text-violet-400">await</span> <span class="text-yellow-400">Skillio</span>.<span class="text-blue-400">enroll</span>();</div>
                         <div class="pl-8 mb-2"><span class="text-violet-400">return</span> <span class="text-green-400">Success</span>;</div>
                        <div class="pl-4 mb-2"><span class="text-white">{{ '}' }}</span></div>
                        <div class="text-white">{{ '}' }}</div>
                    </div>
                 </div>
              </div>
              
              <!-- Floating Elements -->
              <div class="absolute -top-12 -right-12 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-bounce-slow">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white"><mat-icon>check</mat-icon></div>
                    <div>
                        <div class="text-xs text-gray-300 uppercase font-bold tracking-wider">Status</div>
                        <div class="font-bold text-white">Certified</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trusted By (Logos) -->
      <section class="py-10 bg-gray-50 dark:bg-navy-950 border-b border-gray-200 dark:border-navy-800">
         <div class="container mx-auto px-4">
             <p class="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Trusted by leading companies</p>
             <div class="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 <!-- Placeholder Logos -->
                 <div class="font-heading font-bold text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2"><mat-icon>token</mat-icon> TechCorp</div>
                 <div class="font-heading font-bold text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2"><mat-icon>hexagon</mat-icon> HexaLab</div>
                 <div class="font-heading font-bold text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2"><mat-icon>diamond</mat-icon> Brilliant</div>
                 <div class="font-heading font-bold text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2"><mat-icon>waves</mat-icon> Streamline</div>
                 <div class="font-heading font-bold text-xl text-gray-600 dark:text-gray-400 flex items-center gap-2"><mat-icon>hub</mat-icon> Connect</div>
             </div>
         </div>
      </section>

      <!-- Popular Courses -->
      <section class="py-20 bg-white dark:bg-navy-900">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-end mb-12">
            <div>
              <h2 class="text-3xl md:text-4xl font-heading font-bold text-navy-900 dark:text-white mb-4">Popular Courses</h2>
              <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">Explore our highest-rated courses and start learning today.</p>
            </div>
            <a routerLink="/courses" mat-button color="primary" class="hidden md:inline-flex">View All Courses <mat-icon>arrow_forward</mat-icon></a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             @for (course of popularCourses$ | async; track course.id) {
               <app-course-card [course]="course"></app-course-card>
             }
          </div>
          
           <div class="mt-8 text-center md:hidden">
              <a routerLink="/courses" mat-stroked-button color="primary">View All Courses</a>
           </div>
        </div>
      </section>

      <!-- Become an Instructor -->
      <section class="py-20 bg-violet-600 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="container mx-auto px-4 relative z-10 text-center text-white">
          <span class="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">Join Our Community</span>
          <h2 class="text-4xl font-heading font-bold mb-6">Become an Instructor</h2>
          <p class="text-lg text-white/90 mb-8 max-w-lg mx-auto">
            Instructors from around the world teach millions of students on Skillio. We provide the tools and skills to teach what you love.
          </p>
          <button mat-flat-button class="bg-white text-violet-900 hover:bg-gray-100 !px-8 !py-6 !rounded-full !text-lg font-bold shadow-xl">
            Start Teaching Today
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-bounce-slow { animation: bounce 3s infinite; }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
  `]
})
export class HomeComponent {
  popularCourses$!: Observable<any[]>; // Use correct type

  constructor(private courseService: CourseService) {
    this.popularCourses$ = this.courseService.getPopularCourses();
  }
}
