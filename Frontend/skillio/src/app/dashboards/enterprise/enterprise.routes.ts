import { Routes } from '@angular/router';

export const ENTERPRISE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./enterprise-dashboard.component').then(m => m.EnterpriseDashboardComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./home/enterprise-home.component').then(m => m.EnterpriseHomeComponent),
                title: 'Dashboard — Skillio'
            },
            {
                path: 'profile',
                loadComponent: () => import('./company-profile/company-profile.component').then(m => m.CompanyProfileComponent),
                title: 'Company Profile — Skillio'
            },
            {
                path: 'job-offers',
                loadComponent: () => import('./my-job-offers/my-job-offers.component').then(m => m.MyJobOffersComponent),
                title: 'My Job Offers — Skillio'
            },
            {
                path: 'subscription',
                loadComponent: () => import('./subscription/enterprise-subscription.component').then(m => m.EnterpriseSubscriptionComponent),
                title: 'Subscription — Skillio'
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
