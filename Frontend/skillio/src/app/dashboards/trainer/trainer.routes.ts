import { Routes } from '@angular/router';

export const TRAINER_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./trainer-dashboard.component').then(m => m.TrainerDashboardComponent),
        title: 'Trainer Dashboard — Skillio'
    }
];
