import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

// Custom Validator
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
        return { mismatch: true };
    }
    return null;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, CommonModule],
    template: `
    <div class="register-container">
      
      <!-- Progress Indicator -->
      <div class="progress-bar">
        <div class="step" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
           <div class="step-circle">1</div>
           <span class="step-label">Account Type</span>
        </div>
        <div class="line" [class.filled]="currentStep() > 1"></div>
        <div class="step" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
           <div class="step-circle">2</div>
           <span class="step-label">Your Info</span>
        </div>
        <div class="line" [class.filled]="currentStep() > 2"></div>
         <div class="step" [class.active]="currentStep() >= 3" [class.completed]="registrationSuccess()">
           <div class="step-circle">3</div>
           <span class="step-label">Confirm</span>
        </div>
      </div>

      <!-- STEP 1: Role Selection -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-slide-up">
          <h2 class="section-title">I want to...</h2>
          <p class="section-subtitle">Choose how you'll use Skillio</p>

          <div class="role-grid">
            <!-- Student -->
            <div class="role-card" 
                 [class.selected]="selectedRole() === 'STUDENT'"
                 (click)="selectRole('STUDENT')">
               <div class="icon-circle student">🎓</div>
               <h3>Student</h3>
               <p>Access 1000+ courses and grow your skills</p>
               @if(selectedRole() === 'STUDENT') { <div class="check-badge">✓</div> }
            </div>

            <!-- Trainer -->
             <div class="role-card" 
                 [class.selected]="selectedRole() === 'TRAINER'"
                 (click)="selectRole('TRAINER')">
               <div class="icon-circle trainer">👨‍🏫</div>
               <h3>Trainer</h3>
               <p>Share your expertise and earn income</p>
               @if(selectedRole() === 'TRAINER') { <div class="check-badge">✓</div> }
            </div>

            <!-- Enterprise -->
             <div class="role-card" 
                 [class.selected]="selectedRole() === 'ENTERPRISE'"
                 (click)="selectRole('ENTERPRISE')">
               <div class="icon-circle enterprise">🏢</div>
               <h3>Enterprise</h3>
               <p>Train your entire team on one platform</p>
               @if(selectedRole() === 'ENTERPRISE') { <div class="check-badge">✓</div> }
            </div>
          </div>

          <button class="next-btn" [disabled]="!selectedRole()" (click)="nextStep()">
            Next Step →
          </button>
        </div>
      }

      <!-- STEP 2: Personal Info -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-slide-up">
           <h2 class="section-title">Personal Information</h2>
           <p class="section-subtitle">Tell us a bit about yourself</p>

           <form [formGroup]="registerForm">
              <div class="form-group">
                <label>Full Name</label>
                <div class="input-wrapper">
                  <span class="icon">👤</span>
                  <input type="text" formControlName="fullName" placeholder="John Doe">
                </div>
              </div>

               <div class="form-group">
                <label>Email Address</label>
                <div class="input-wrapper">
                  <span class="icon">✉</span>
                  <input type="email" formControlName="email" placeholder="john@example.com">
                </div>
              </div>

               <div class="form-group">
                <label>Password</label>
                <div class="input-wrapper">
                  <span class="icon">🔒</span>
                  <input type="password" formControlName="password" placeholder="••••••••" (input)="updatePasswordStrength()">
                </div>
                <!-- Strength Meter -->
                <div class="strength-meter">
                   <div class="bar" [class.active]="passwordStrength() >= 1" [style.background-color]="strengthColor()"></div>
                   <div class="bar" [class.active]="passwordStrength() >= 2" [style.background-color]="strengthColor()"></div>
                   <div class="bar" [class.active]="passwordStrength() >= 3" [style.background-color]="strengthColor()"></div>
                   <div class="bar" [class.active]="passwordStrength() >= 4" [style.background-color]="strengthColor()"></div>
                   <span class="strength-text" [style.color]="strengthColor()">{{ strengthLabel() }}</span>
                </div>
              </div>

               <div class="form-group">
                <label>Confirm Password</label>
                <div class="input-wrapper">
                  <span class="icon">🔐</span>
                  <input type="password" formControlName="confirmPassword" placeholder="••••••••">
                </div>
                 @if (registerForm.get('confirmPassword')?.hasError('mismatch') && registerForm.get('confirmPassword')?.touched) {
                    <span class="error-msg">Passwords do not match</span>
                 }
              </div>
              
              <!-- Enterprise Fields -->
               @if (selectedRole() === 'ENTERPRISE') {
                 <div class="enterprise-fields animate-fade-slide-up">
                   <div class="divider"><span>COMPANY DETAILS</span></div>
                    <div class="form-group">
                      <label>Company Name</label>
                      <div class="input-wrapper">
                        <span class="icon">🏢</span>
                        <input type="text" formControlName="companyName" placeholder="Acme Inc.">
                      </div>
                    </div>
                 </div>
               }

              <div class="btns-row">
                 <button type="button" class="back-btn" (click)="prevStep()">← Back</button>
                 <button type="button" class="next-btn" [disabled]="registerForm.invalid" (click)="nextStep()">Next Step →</button>
              </div>
           </form>
        </div>
      }

      <!-- STEP 3: Confirmation -->
      @if (currentStep() === 3 && !registrationSuccess()) {
         <div class="step-content animate-fade-slide-up">
            <h2 class="section-title">Confirm Details</h2>
            <p class="section-subtitle">Please review your information</p>

            <div class="summary-card">
              <span class="role-badge" [class.student]="selectedRole() === 'STUDENT'"
                                       [class.trainer]="selectedRole() === 'TRAINER'"
                                       [class.enterprise]="selectedRole() === 'ENTERPRISE'">
                 {{ selectedRole() }}
              </span>
              <div class="summary-row">
                 <span class="label">Name:</span>
                 <span class="value">{{ registerForm.get('fullName')?.value }}</span>
              </div>
               <div class="summary-row">
                 <span class="label">Email:</span>
                 <span class="value">{{ registerForm.get('email')?.value }}</span>
              </div>
            </div>

            <div class="checkbox-group">
               <label>
                  <input type="checkbox" required>
                  <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
               </label>
                <label>
                  <input type="checkbox">
                  <span>Send me course recommendations and updates</span>
               </label>
            </div>

             <div class="btns-row">
                 <button type="button" class="back-btn" (click)="prevStep()">← Back</button>
                 <button type="button" class="submit-btn" (click)="submitRegistration()">Create Account</button>
              </div>
         </div>
      }

      <!-- SUCCESS STATE -->
      @if (registrationSuccess()) {
        <div class="success-state animate-scale-in">
           <div class="success-icon">
             <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
               <polyline points="20 6 9 17 4 12"></polyline>
             </svg>
           </div>
           <h2>🎉 Welcome to Skillio!</h2>
           <p>Your account is ready. Redirecting you to the dashboard...</p>
        </div>
      }

    </div>
  `,
    styles: [`
    .register-container {
      max-width: 600px; /* Wider for role cards */
      margin: 0 auto;
      padding: 20px;
    }

    /* Progress Bar */
    .progress-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;
      position: relative;
    }
    .step { display: flex; flex-direction: column; align-items: center; z-index: 2; gap: 6px; }
    .step-circle {
      width: 32px; height: 32px; border-radius: 50%;
      background: #E5E7EB; color: #6B7280;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 14px;
      transition: all 0.3s ease;
    }
    .step-label { font-size: 12px; color: #9CA3AF; font-weight: 500; transition: color 0.3s; }
    
    .line { flex: 1; height: 1px; background: #E5E7EB; margin: 0 10px; margin-bottom: 20px; transition: background 0.3s; }
    
    .step.active .step-circle { background: white; border: 2px solid var(--c-primary); color: var(--c-primary); }
    .step.active .step-label { color: var(--c-primary); }
    
    .step.completed .step-circle { background: var(--c-primary); border-color: var(--c-primary); color: white; content: '✓'; }
    .line.filled { background: var(--c-primary); }

    /* Titles */
    .section-title { font-size: 26px; font-weight: 700; color: var(--c-dark); margin-bottom: 4px; }
    .section-subtitle { color: var(--c-gray); font-size: 15px; margin-bottom: 32px; }

    /* Role Grid (Step 1) */
    .role-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .role-card {
      border: 2px solid #E5E7EB;
      border-radius: 16px;
      padding: 24px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .role-card:hover { border-color: var(--c-primary-lt); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .role-card.selected { border-color: var(--c-primary); background: var(--c-primary-xl); }
    
    .icon-circle {
      width: 56px; height: 56px; border-radius: 50%;
      margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 24px;
    }
    .icon-circle.student { background: rgba(108,63,197,0.1); }
    .icon-circle.trainer { background: rgba(245,158,11,0.1); }
    .icon-circle.enterprise { background: rgba(59,130,246,0.1); }

    .role-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
    .role-card p { font-size: 13px; color: var(--c-gray); line-height: 1.4; }
    
    .check-badge {
       position: absolute; top: -10px; right: -10px;
       width: 24px; height: 24px; background: var(--c-primary); color: white;
       border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;
       animation: scale-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Step 2 Form */
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
    .input-wrapper { position: relative; }
    input {
      width: 100%; height: 48px; padding-left: 40px; border: 1px solid var(--c-border);
      border-radius: var(--radius-md); font-family: 'DM Sans', sans-serif;
    }
    input:focus { border-color: var(--c-primary); outline: none; }
    .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; filter: grayscale(1); }
    input:focus + .icon { filter: grayscale(0); }

    .strength-meter { display: flex; gap: 4px; align-items: center; margin-top: 8px; }
    .bar { height: 4px; flex: 1; background: #E5E7EB; border-radius: 2px; transition: background 0.3s; }
    .strength-text { font-size: 11px; margin-left: 8px; font-weight: 600; min-width: 40px; }

    .enterprise-fields { margin-top: 24px; border-top: 1px dashed var(--c-border); padding-top: 24px; }
    .divider { font-size: 12px; color: var(--c-primary); letter-spacing: 1px; font-weight: 700; margin-bottom: 16px; }

    /* Step 3 Summary */
    .summary-card {
      background: var(--c-primary-xl);
      border: 1px solid var(--c-border);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .role-badge {
      display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: white; margin-bottom: 16px;
    }
    .role-badge.student { background: var(--c-primary); }
    .role-badge.trainer { background: var(--c-accent); }
    .role-badge.enterprise { background: #3B82F6; }

    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .summary-row .label { color: var(--c-gray); }
    .summary-row .value { font-weight: 600; color: var(--c-dark); }

    /* Buttons */
    .btns-row { display: flex; justify-content: space-between; margin-top: 32px; gap: 16px; }
    .next-btn, .submit-btn {
      flex: 2; height: 50px; background: linear-gradient(135deg, var(--c-primary), var(--c-primary-lt));
      color: white; border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer;
    }
    .next-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .back-btn {
      flex: 1; height: 50px; background: transparent; border: 1px solid var(--c-border); color: var(--c-gray);
      border-radius: var(--radius-md); font-weight: 600; cursor: pointer;
    }
    .back-btn:hover { color: var(--c-dark); border-color: var(--c-gray); }

    /* Success */
    .success-state { text-align: center; padding: 40px 0; }
    .success-icon {
      width: 80px; height: 80px; background: var(--c-success); border-radius: 50%;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
    }
    .success-icon svg { width: 40px; height: 40px; }
    .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    .error-msg { color: var(--c-error); font-size: 12px; margin-top: 4px; display: block; }
  `]
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    currentStep = signal<1 | 2 | 3>(1);
    selectedRole = signal<'STUDENT' | 'TRAINER' | 'ENTERPRISE' | null>(null);
    passwordStrength = signal(0);
    registrationSuccess = signal(false);

    registerForm = this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        companyName: [''] // Optional unless enterprise
    }, { validators: passwordMatchValidator });

    selectRole(role: 'STUDENT' | 'TRAINER' | 'ENTERPRISE') {
        this.selectedRole.set(role);
    }

    nextStep() {
        if (this.currentStep() === 1 && this.selectedRole()) {
            this.currentStep.set(2);
        } else if (this.currentStep() === 2 && this.registerForm.valid) {
            this.currentStep.set(3);
        }
    }

    prevStep() {
        if (this.currentStep() > 1) {
            this.currentStep.set(this.currentStep() - 1 as 1 | 2 | 3);
        }
    }

    updatePasswordStrength() {
        const val = this.registerForm.get('password')?.value || '';
        let score = 0;
        if (val.length > 5) score++;
        if (val.length > 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        this.passwordStrength.set(score);
    }

    strengthLabel() {
        const s = this.passwordStrength();
        return s < 2 ? 'Weak' : s < 3 ? 'Fair' : s < 4 ? 'Good' : 'Strong';
    }

    strengthColor() {
        const s = this.passwordStrength();
        return s < 2 ? '#EF4444' : s < 3 ? '#F59E0B' : s < 4 ? '#EAB308' : '#10B981';
    }

    submitRegistration() {
        this.registrationSuccess.set(true);

        const userData = {
            ...this.registerForm.value,
            role: this.selectedRole()
        };

        this.authService.register(userData).subscribe(() => {
            setTimeout(() => {
                this.router.navigate(['/']);
            }, 2000);
        });
    }
}
