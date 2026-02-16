import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-back-office-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    template: `
    <div class="flex h-screen bg-navy-900 back-office-theme">
      <!-- Sidebar -->
      <app-sidebar class="hidden md:block"></app-sidebar>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-header></app-header>
        
        <main class="flex-1 overflow-auto p-6 text-gray-200">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class BackOfficeLayoutComponent { }
