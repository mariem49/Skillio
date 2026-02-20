import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    // Front Office
    {
        path: '',
        loadComponent: () => import('./front-office/layout/front-office-layout.component').then(m => m.FrontOfficeLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./front-office/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'courses',
                loadComponent: () => import('./front-office/courses/catalog/catalog.component').then(m => m.CatalogComponent)
            },
            {
                path: 'courses/:id',
                loadComponent: () => import('./front-office/courses/detail/detail.component').then(m => m.CourseDetailComponent)
            },
            {
                path: 'pricing',
                loadComponent: () => import('./front-office/pricing/pricing.component').then(m => m.PricingComponent)
            },
            {
                path: 'companies',
                loadComponent: () => import('./front-office/company/company-list.component').then(m => m.CompanyListComponent),
                title: 'Companies — Skillio'
            },
            {
                path: 'companies/:id',
                loadComponent: () => import('./front-office/company/company-detail.component').then(m => m.CompanyDetailComponent),
                title: 'Company Details — Skillio'
            },
            {
                path: 'offers',
                loadComponent: () => import('./front-office/company/job-offers-list.component').then(m => m.JobOffersListComponent),
                title: 'Job Offers — Skillio'
            },
            {
                path: 'offers/:id',
                loadComponent: () => import('./front-office/company/job-offer-detail.component').then(m => m.JobOfferDetailComponent),
                title: 'Job Offer Details — Skillio'
            },
            {
                path: 'events',
                loadComponent: () => import('./front-office/events/events.component').then(m => m.EventsComponent),
                title: 'Events — Skillio'
            }
        ]
    },

    // Auth Routes
    {
        path: 'auth',
        loadChildren: () => import('./front-office/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },

    // Admin Dashboard
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard(['ADMIN'])],
        loadChildren: () => import('./dashboards/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    
    // Back Office (template)
    {
        path: 'back-office',
        loadChildren: () => import('./back-office/back-office.routes').then(m => m.BACK_OFFICE_ROUTES)
    },

    // Student Dashboard
    {
        path: 'student',
        canActivate: [authGuard, roleGuard(['STUDENT'])],
        loadChildren: () => import('./dashboards/student/student.routes').then(m => m.STUDENT_ROUTES)
    },

    // Trainer Dashboard
    {
        path: 'trainer',
        canActivate: [authGuard, roleGuard(['TRAINER'])],
        loadChildren: () => import('./dashboards/trainer/trainer.routes').then(m => m.TRAINER_ROUTES)
    },

    // Enterprise Dashboard
    {
        path: 'enterprise',
        canActivate: [authGuard, roleGuard(['ENTERPRISE'])],
        loadChildren: () => import('./dashboards/enterprise/enterprise.routes').then(m => m.ENTERPRISE_ROUTES)
    },

    // Fallback
    { path: 'crud-test', loadComponent: () => import('./test/crud-test.component').then(m => m.CrudTestComponent) },
    { path: '**', redirectTo: '' }
];
