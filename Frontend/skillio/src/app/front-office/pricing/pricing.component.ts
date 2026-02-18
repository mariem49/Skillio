import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from '../../core/services/pricing.service';
import { PricingPlan } from '../../core/models/pricing-plan.model';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pricing-container">
      <!-- Header -->
      <div class="header-section">
        <h1>Pricing Plans</h1>
        <p class="subtitle">Choose the plan that fits your needs</p>
      </div>

      <!-- Billing Toggle -->
      <div class="toggle-container">
        <div class="toggle-bg">
          <button 
            [class.active]="billingCycle() === 'monthly'"
            (click)="setBilling('monthly')"
            class="toggle-btn">
            Monthly
          </button>
          <button 
            [class.active]="billingCycle() === 'yearly'"
            (click)="setBilling('yearly')"
            class="toggle-btn">
            Yearly <span class="badge">Save 20%</span>
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="cards-grid">
        @for (plan of plans(); track plan.id) {
          <div class="pricing-card" [class.highlight]="plan.highlight">
            @if (plan.highlight) {
              <div class="highlight-badge">Most Popular</div>
            }
            
            <div class="card-header">
              <h3>{{ plan.name }}</h3>
              <p class="desc">{{ plan.description }}</p>
            </div>

            <div class="price-section">
              <span class="currency">$</span>
              <span class="amount">
                {{ billingCycle() === 'monthly' ? plan.monthlyPrice : (plan.yearlyPrice / 12 | number:'1.0-0') }}
              </span>
              <span class="period">/mo</span>
              @if (billingCycle() === 'yearly') {
                <div class="billed-yearly">Billed \${{ plan.yearlyPrice }} yearly</div>
              }
            </div>

            <button class="select-btn" [class.outline]="!plan.highlight">
              Select Plan
            </button>

            <div class="features-list">
              @for (feature of plan.featuresList; track feature.name) {
                <div class="feature-item" [class.excluded]="!feature.included">
                  @if (feature.included) {
                    <span class="check-icon">✓</span>
                  } @else {
                    <span class="cross-icon">×</span>
                  }
                  {{ feature.name }}
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--c-bg, #F5F3FF); /* Using global variable fallback */
      padding: 48px 24px;
      font-family: 'DM Sans', sans-serif;
    }

    .pricing-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header */
    .header-section {
      text-align: center;
      margin-bottom: 48px;
    }

    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 42px;
      font-weight: 800;
      color: var(--c-dark, #1E1B4B);
      margin-bottom: 16px;
    }

    .subtitle {
      font-size: 18px;
      color: var(--c-gray, #6B7280);
    }

    /* Toggle */
    .toggle-container {
      display: flex;
      justify-content: center;
      margin-bottom: 64px;
    }

    .toggle-bg {
      background: white;
      padding: 6px;
      border-radius: 999px;
      border: 1px solid var(--c-border, rgba(108,63,197,0.2));
      display: flex;
      gap: 4px;
    }

    .toggle-btn {
      padding: 10px 24px;
      border-radius: 999px;
      border: none;
      background: transparent;
      color: var(--c-gray, #6B7280);
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toggle-btn.active {
      background: var(--c-primary, #6C3FC5);
      color: white;
      box-shadow: 0 4px 12px rgba(108, 63, 197, 0.2);
    }

    .badge {
      font-size: 12px;
      background: #DCFCE7;
      color: #166534;
      padding: 2px 8px;
      border-radius: 99px;
    }

    .toggle-btn.active .badge {
      background: white;
      color: var(--c-primary, #6C3FC5);
    }

    /* Cards Grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 32px;
    }

    @media (min-width: 768px) {
      .cards-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Card Styles */
    .pricing-card {
      background: white;
      border-radius: 16px; /* Matching --radius-lg */
      padding: 32px;
      border: 1px solid var(--c-border, rgba(108,63,197,0.2));
      position: relative;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .pricing-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--c-shadow, 0 8px 32px rgba(108,63,197,0.18));
      border-color: var(--c-primary-lt, #A855F7);
    }

    .pricing-card.highlight {
      border: 2px solid var(--c-primary, #6C3FC5);
      box-shadow: 0 8px 32px rgba(108,63,197,0.12);
    }

    .highlight-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--c-primary, #6C3FC5);
      color: white;
      padding: 6px 16px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-header {
      margin-bottom: 24px;
      text-align: center;
    }

    h3 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--c-dark, #1E1B4B);
      margin-bottom: 8px;
    }

    .desc {
      color: var(--c-gray, #6B7280);
      font-size: 14px;
    }

    .price-section {
      text-align: center;
      margin-bottom: 32px;
      height: 80px; /* Fixed height to prevent layout shift */
    }

    .currency {
      font-size: 24px;
      font-weight: 600;
      color: var(--c-dark, #1E1B4B);
      vertical-align: top;
    }

    .amount {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 48px;
      font-weight: 800;
      color: var(--c-dark, #1E1B4B);
    }

    .period {
      color: var(--c-gray, #6B7280);
      font-size: 16px;
    }

    .billed-yearly {
      font-size: 13px;
      color: var(--c-gray, #6B7280);
      margin-top: 4px;
    }

    /* Buttons */
    .select-btn {
      width: 100%;
      height: 48px;
      border-radius: 10px; /* --radius-md */
      border: none;
      background: var(--c-primary, #6C3FC5);
      color: white;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 32px;
    }

    .select-btn:hover {
      background: var(--c-primary-lt, #A855F7);
      transform: translateY(-1px);
    }

    .select-btn.outline {
      background: transparent;
      border: 2px solid var(--c-border, rgba(108,63,197,0.2));
      color: var(--c-primary, #6C3FC5);
    }

    .select-btn.outline:hover {
      border-color: var(--c-primary, #6C3FC5);
      background: var(--c-primary-xl, #EDE9FE);
    }

    /* Features List */
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--c-dark, #1E1B4B);
    }

    .feature-item.excluded {
      color: var(--c-gray, #6B7280);
      opacity: 0.7;
    }

    .check-icon {
      color: var(--c-success, #10B981);
      font-weight: bold;
      font-size: 16px;
    }

    .cross-icon {
      color: var(--c-gray, #6B7280);
      font-size: 18px;
    }
  `]
})
export class PricingComponent {
  private pricingService = inject(PricingService);

  rawPlans = this.pricingService.plans;

  plans = computed(() => {
    return this.rawPlans().map((plan: PricingPlan) => ({
      ...plan,
      featuresList: this.parseFeatures(plan.features)
    }));
  });

  billingCycle = signal<'monthly' | 'yearly'>('monthly');

  setBilling(cycle: 'monthly' | 'yearly') {
    this.billingCycle.set(cycle);
  }

  private parseFeatures(features: string): { name: string, included: boolean }[] {
    if (!features) return [];
    // Assuming features are comma separated strings
    // If string starts with "!" it's excluded (optional logic, but simple defaults to included)
    return features.split(',').map(f => {
      const name = f.trim();
      return { name, included: true };
    });
  }
}
