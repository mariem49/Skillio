import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
    template: `
    <div class="forgot-container animate-fade-slide-up">
      @if (!isSuccess()) {
        <!-- LOCK ICON -->
        <div class="icon-circle lock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h1>Forgot your password?</h1>
        <p class="subtitle">Enter your email and we'll send you a reset link.</p>

        <form (ngSubmit)="sendLink()">
           <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <span class="icon">✉</span>
              <input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" required>
            </div>
          </div>

          <button type="submit" class="submit-btn" [disabled]="!email">Send Reset Link</button>
        </form>

        <a routerLink="/auth/login" class="back-link">← Back to Login</a>

      } @else {
        <!-- SUCCESS STATE -->
        <div class="icon-circle success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        <h1>Check your inbox!</h1>
        <p class="subtitle">We sent a reset link to <span class="email-highlight">{{ email }}</span></p>

        <button class="submit-btn outline" (click)="openInbox()">Open Email App</button>
        
        <p class="resend-text">
            Didn't receive it? 
            <a href="javascript:void(0)" (click)="isSuccess.set(false)">Resend</a>
        </p>

         <a routerLink="/auth/login" class="back-link">← Back to Login</a>
      }
    </div>
  `,
    styles: [`
    .forgot-container {
      max-width: 400px;
      margin: 0 auto;
      text-align: center;
      padding: 20px;
    }

    .icon-circle {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
      color: var(--c-primary);
    }
    .icon-circle.lock {
      background: var(--c-primary-xl);
      box-shadow: 0 0 0 12px rgba(108,63,197,0.08); 
    }
    .icon-circle.success {
      background: #D1FAE5; color: #10B981;
      box-shadow: 0 0 0 12px rgba(16, 185, 129, 0.1);
    }
    .icon-circle svg { width: 28px; height: 28px; }

    h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 28px; margin-bottom: 12px; }
    .subtitle { color: var(--c-gray); font-size: 14px; margin-bottom: 32px; line-height: 1.5; }
    .email-highlight { color: var(--c-primary); font-weight: 600; }

    /* Form */
    .form-group { text-align: left; margin-bottom: 24px; }
    label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
    .input-wrapper { position: relative; }
    input {
      width: 100%; height: 48px; padding-left: 40px; border: 1px solid var(--c-border);
      border-radius: var(--radius-md); font-family: 'DM Sans', sans-serif;
    }
    input:focus { border-color: var(--c-primary); outline: none; }
    .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; filter: grayscale(1); }

    .submit-btn {
      width: 100%; height: 52px; background: linear-gradient(135deg, var(--c-primary), var(--c-primary-lt));
      color: white; border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer;
      font-size: 16px; margin-bottom: 24px;
      transition: all 0.2s;
    }
    .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(108,63,197,0.25); }
    
    .submit-btn.outline {
        background: transparent; border: 2px solid #E5E7EB; color: var(--c-dark);
        margin-top: 12px;
    }
    .submit-btn.outline:hover { border-color: var(--c-gray); transform: none; box-shadow: none; }

    .back-link {
        color: var(--c-gray); text-decoration: none; font-size: 14px; font-weight: 500;
        transition: color 0.2s;
    }
    .back-link:hover { color: var(--c-primary); }

    .resend-text { font-size: 14px; color: var(--c-gray); margin-bottom: 32px; }
    .resend-text a { color: var(--c-primary); text-decoration: none; font-weight: 600; }
  `]
})
export class ForgotPasswordComponent {
    email = '';
    isSuccess = signal(false);

    sendLink() {
        if (this.email) {
            // Simulate API call
            setTimeout(() => {
                this.isSuccess.set(true);
            }, 600);
        }
    }

    openInbox() {
        window.location.href = 'mailto:';
    }
}
