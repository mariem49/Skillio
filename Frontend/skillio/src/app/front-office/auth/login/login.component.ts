import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, CommonModule],
    template: `
    <div class="login-container">
      <div class="heading-block">
        <h1>Welcome back 👋</h1>
        <p>Continue your learning journey</p>
      </div>

      <div class="social-buttons">
        <button type="button" class="social-btn">
          <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
          Google
        </button>
        <button type="button" class="social-btn">
          <svg height="20" viewBox="0 0 16 16" width="20"><path fill="#333" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub
        </button>
      </div>

      <div class="divider">
        <span class="line"></span>
        <span class="text">or continue with email</span>
        <span class="line"></span>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <!-- Email -->
        <div class="form-group">
          <label>Email address</label>
          <div class="input-wrapper" [class.error]="isFieldInvalid('email')">
            <span class="icon left">📧</span>
            <input type="email" formControlName="email" placeholder="you@example.com">
          </div>
          @if (isFieldInvalid('email')) {
            <span class="error-msg">Please enter a valid email address</span>
          }
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password</label>
          <div class="input-wrapper" [class.error]="isFieldInvalid('password')">
            <span class="icon left">🔒</span>
            <input [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="••••••••">
            <button type="button" class="icon right toggle-pwd" (click)="hidePassword = !hidePassword">
              {{ hidePassword ? '👁️' : '🚫' }}
            </button>
          </div>
           @if (isFieldInvalid('password')) {
            <span class="error-msg">Password must be at least 6 characters</span>
          }
        </div>

        <!-- Options Row -->
        <div class="options-row">
            <label class="remember-me">
              <input type="checkbox" formControlName="rememberMe">
              <span>Remember me</span>
            </label>
            <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
        </div>

        <!-- Submit -->
        <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading()">
          @if (isLoading()) {
            <div class="loading-dots">
              <span></span><span></span><span></span>
            </div>
          } @else {
            Log In
          }
        </button>

        <!-- Error Banner -->
        @if (errorMessage()) {
          <div class="error-banner">
            ❌ {{ errorMessage() }}
          </div>
        }

        <!-- Register Link -->
        <div class="register-link">
          Don't have an account? <a routerLink="/auth/register">Sign up for free →</a>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .login-container {
      max-width: 420px;
      margin: 0 auto;
      padding: 0;
      animation: fadeSlideUp 0.4s ease-out forwards;
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      color: var(--c-dark);
      margin-bottom: 8px;
    }

    .heading-block p {
      color: var(--c-gray);
      font-size: 15px;
      margin-bottom: 28px;
    }

    .social-buttons {
      display: flex;
      gap: 12px;
    }

    .social-btn {
      flex: 1;
      height: 44px;
      background: white;
      border: 1px solid var(--c-border);
      border-radius: var(--radius-md);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .social-btn:hover {
      border-color: var(--c-primary);
      background: var(--c-primary-xl);
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 24px 0;
      color: var(--c-gray);
      font-size: 13px;
    }
    .divider .line { flex: 1; height: 1px; background: #E5E7EB; }
    .divider .text { padding: 0 12px; }

    .form-group { margin-bottom: 16px; }
    
    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--c-dark);
      margin-bottom: 6px;
    }

    .input-wrapper {
      position: relative;
    }

    .input-wrapper input {
      width: 100%;
      height: 48px;
      padding-left: 40px;
      padding-right: 12px;
      border: 1px solid var(--c-border);
      border-radius: var(--radius-md);
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      transition: all 0.2s;
    }
    
    .input-wrapper input:focus {
      border-color: var(--c-primary);
      box-shadow: 0 0 0 3px rgba(108,63,197,0.1);
      outline: none;
    }

    .input-wrapper.error input {
      border-color: var(--c-error);
      box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
    }

    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      filter: grayscale(1);
      transition: filter 0.2s;
    }
    .icon.left { left: 14px; }
    .icon.right { right: 14px; cursor: pointer; background:none; border:none;}
    
    .input-wrapper input:focus + .icon,
    .input-wrapper input:focus ~ .icon { filter: grayscale(0); }

    .error-msg {
      display: block;
      color: var(--c-error);
      font-size: 12px;
      margin-top: 4px;
      animation: slideDown 0.3s ease-out;
    }

    .options-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 400;
      margin-bottom: 0;
    }

    .forgot-link {
      color: var(--c-primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    .forgot-link:hover { text-decoration: underline; }

    .submit-btn {
      width: 100%;
      height: 52px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--c-primary), var(--c-primary-lt));
      color: white;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(108,63,197,0.2);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 12px rgba(108,63,197,0.3);
    }
    
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-dots { display: flex; justify-content: center; gap: 4px; }
    .loading-dots span {
      width: 6px; height: 6px; background: white; border-radius: 50%;
      animation: bounce 0.6s infinite alternate;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

    .error-banner {
      margin-top: 16px;
      background: rgba(239,68,68,0.08);
      border-left: 3px solid var(--c-error);
      padding: 10px 14px;
      border-radius: 8px;
      color: var(--c-error);
      font-size: 13px;
    }

    .register-link {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      color: var(--c-gray);
    }
    .register-link a {
      color: var(--c-primary);
      font-weight: 500;
      text-decoration: none;
    }
    .register-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    hidePassword = true;
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false]
    });

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            this.errorMessage.set(null);

            this.authService.login(this.loginForm.value).subscribe({
                next: (user) => {
                    if (user.role === 'ADMIN') {
                        this.router.navigate(['/admin/dashboard']);
                    } else {
                        this.router.navigate(['/']);
                    }
                    this.isLoading.set(false);
                },
                error: () => {
                    this.errorMessage.set('Invalid email or password. Please try again.');
                    this.isLoading.set(false);
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    isFieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}
