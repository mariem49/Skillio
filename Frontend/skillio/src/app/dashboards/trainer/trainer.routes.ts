import { Routes } from '@angular/router';

export const TRAINER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./trainer-dashboard.component').then(m => m.TrainerDashboardComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./home/trainer-home.component').then(m => m.TrainerHomeComponent),
                title: 'Trainer Dashboard — Skillio'
            },
            {
                path: 'companies',
                loadComponent: () => import('./browse-companies/browse-companies.component').then(m => m.BrowseCompaniesComponent),
                title: 'Browse Companies — Skillio'
            },
            {
                path: 'subscription',
                loadComponent: () => import('./subscription/trainer-subscription.component').then(m => m.TrainerSubscriptionComponent),
                title: 'Trainer Subscription — Skillio'
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
