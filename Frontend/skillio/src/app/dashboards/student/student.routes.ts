import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./student-dashboard.component').then(m => m.StudentDashboardComponent),
        title: 'Student Dashboard — Skillio'
    }
];
