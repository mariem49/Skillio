import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule],
  template: `
    <footer class="bg-gray-50 dark:bg-navy-900 border-t border-gray-200 dark:border-navy-800 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          <!-- Brand Column -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span class="font-heading font-bold text-xl text-navy-900 dark:text-white">Skillio</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Skillio creates a unique opportunity for learners to enhance their skills and for instructors to share their knowledge across the world.
            </p>
            <div class="flex gap-4">
              <button mat-icon-button class="text-gray-400 hover:text-violet-600"><mat-icon fontIcon="facebook"></mat-icon></button>
              <button mat-icon-button class="text-gray-400 hover:text-violet-600"><mat-icon fontIcon="dataset"></mat-icon></button> <!-- LinkedId substitute -->
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-heading font-bold text-navy-900 dark:text-white mb-6">Company</h4>
            <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li><a routerLink="/about" class="hover:text-violet-600 transition-colors">About Us</a></li>
              <li><a routerLink="/careers" class="hover:text-violet-600 transition-colors">Careers</a></li>
              <li><a routerLink="/blog" class="hover:text-violet-600 transition-colors">Blog</a></li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h4 class="font-heading font-bold text-navy-900 dark:text-white mb-6">Resources</h4>
            <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li><a routerLink="/courses" class="hover:text-violet-600 transition-colors">Courses</a></li>
              <li><a routerLink="/events" class="hover:text-violet-600 transition-colors">Events</a></li>
              <li><a routerLink="/pricing" class="hover:text-violet-600 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-heading font-bold text-navy-900 dark:text-white mb-6">Contact</h4>
            <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-start gap-3">
                <mat-icon class="text-violet-600 w-5 h-5 text-sm">location_on</mat-icon>
                <span>123 Education St,<br>Learning City, 10010</span>
              </li>
              <li class="flex items-center gap-3">
                <mat-icon class="text-violet-600 w-5 h-5 text-sm">email</mat-icon>
                <span>support&#64;skillio.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div class="pt-8 border-t border-gray-200 dark:border-navy-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 Skillio. All rights reserved.</p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a href="#" class="hover:text-violet-600">Privacy</a>
            <a href="#" class="hover:text-violet-600">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }
