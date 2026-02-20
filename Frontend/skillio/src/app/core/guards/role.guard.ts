import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const userRole = authService.userRole();

        // Check if user is logged in
        if (!authService.isLoggedIn()) {
            return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
        }

        // Check if user has the required role
        if (userRole && allowedRoles.includes(userRole)) {
            return true;
        }

        // User is logged in but doesn't have the right role
        // Redirect to their correct dashboard
        switch (userRole) {
            case 'ADMIN':
                return router.createUrlTree(['/admin/dashboard']);
            case 'STUDENT':
                return router.createUrlTree(['/student/dashboard']);
            case 'TRAINER':
                return router.createUrlTree(['/trainer/dashboard']);
            case 'ENTERPRISE':
                return router.createUrlTree(['/enterprise/dashboard']);
            default:
                return router.createUrlTree(['/']);
        }
    };
};
