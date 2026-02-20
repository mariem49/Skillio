import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('../../back-office/layout/back-office-layout.component').then(m => m.BackOfficeLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent),
                title: 'Admin Dashboard — Skillio'
            },
            {
                path: 'companies',
                loadComponent: () => import('./features/companies/admin-companies.component').then(m => m.AdminCompaniesComponent),
                title: 'Companies Management — Skillio'
            },
            {
                path: 'job-offers',
                loadComponent: () => import('./features/job-offers/admin-job-offers.component').then(m => m.AdminJobOffersComponent),
                title: 'Job Offers Management — Skillio'
            },
            {
                path: 'pricing',
                loadComponent: () => import('./features/pricing/admin-pricing.component').then(m => m.AdminPricingComponent),
                title: 'Pricing Plans — Skillio'
            },
            {
                path: 'subscriptions',
                loadComponent: () => import('./features/subscriptions/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent),
                title: 'Subscriptions Management — Skillio'
            },
            {
                path: 'formations',
                loadComponent: () => import('./features/formations/admin-formations.component').then(m => m.AdminFormationsComponent),
                title: 'Formations Management — Skillio'
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
