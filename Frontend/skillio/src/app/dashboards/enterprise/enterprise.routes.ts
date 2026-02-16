import { Routes } from '@angular/router';

export const ENTERPRISE_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./enterprise-dashboard.component').then(m => m.EnterpriseDashboardComponent),
        title: 'Enterprise Dashboard — Skillio'
    }
];
