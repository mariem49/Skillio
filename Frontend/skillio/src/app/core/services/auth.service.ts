import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'TRAINER' | 'STUDENT' | 'ENTERPRISE';
    avatar: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _user = signal<User | null>(null);

    readonly currentUser = this._user.asReadonly();
    readonly isLoggedIn = computed(() => !!this._user());
    readonly userRole = computed(() => this._user()?.role ?? null);
    readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');

    login(credentials: any): Observable<User> {
        const email = credentials.email;
        const role: User['role'] =
            email.includes('admin') ? 'ADMIN'
                : email.includes('trainer') ? 'TRAINER'
                    : email.includes('enterprise') ? 'ENTERPRISE'
                        : 'STUDENT';

        const user: User = {
            id: '1',
            name: role === 'ADMIN' ? 'Admin User'
                : role === 'TRAINER' ? 'Trainer User'
                    : role === 'ENTERPRISE' ? 'Enterprise User'
                        : 'Student User',
            email,
            role,
            avatar: `https://ui-avatars.com/api/?name=${email}&background=random`
        };

        localStorage.setItem('skillio_user', JSON.stringify(user));
        this._user.set(user);
        // Mock token for interceptors if needed, though this is a mock service now
        localStorage.setItem('token', 'mock-token');

        return of(user).pipe(delay(800));
    }

    logout(): void {
        localStorage.removeItem('skillio_user');
        localStorage.removeItem('token');
        this._user.set(null);
        inject(Router).navigate(['/auth/login']);
    }

    loadFromStorage(): void {
        const raw = localStorage.getItem('skillio_user');
        if (raw) {
            this._user.set(JSON.parse(raw));
        }
    }

    // Helper for register flow mock
    register(userData: any): Observable<User> {
        const role = userData.role || 'STUDENT';
        const user: User = {
            id: '1',
            name: userData.fullName || 'New User',
            email: userData.email,
            role: role,
            avatar: `https://ui-avatars.com/api/?name=${userData.fullName}&background=random`
        };

        localStorage.setItem('skillio_user', JSON.stringify(user));
        localStorage.setItem('token', 'mock-token');
        this._user.set(user);

        return of(user).pipe(delay(800));
    }
}
