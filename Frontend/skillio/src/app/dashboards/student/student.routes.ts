import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./student-dashboard.component').then(m => m.StudentDashboardComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./home/student-home.component').then(m => m.StudentHomeComponent),
                title: 'Student Dashboard — Skillio'
            },
            {
                path: 'jobs',
                loadComponent: () => import('./browse-jobs/browse-jobs.component').then(m => m.BrowseJobsComponent),
                title: 'Browse Jobs — Skillio'
            },
            {
                path: 'subscription',
                loadComponent: () => import('./subscription/student-subscription.component').then(m => m.StudentSubscriptionComponent),
                title: 'Student Subscription — Skillio'
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
