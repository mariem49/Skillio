import { Routes } from '@angular/router';

export const BACK_OFFICE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/back-office-layout.component').then(m => m.BackOfficeLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            // Admin Users, Formations, etc. will go here
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
