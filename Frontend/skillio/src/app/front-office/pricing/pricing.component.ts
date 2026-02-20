import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PricingService } from '../../core/services/pricing.service';
import { ToastrService } from 'ngx-toastr';
import { PricingPlan } from '../../core/models/pricing-plan.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  private pricingService = inject(PricingService);
  private toastr = inject(ToastrService);

  /** Liste brute de plans */
  rawPlans = signal<PricingPlan[]>([]);

  /** Cycle de facturation */
  billingCycle = signal<'monthly' | 'yearly'>('monthly');

  /** Plans enrichis avec features pour affichage */
  plansForDisplay = computed(() => 
    this.rawPlans().map(plan => ({ plan, featuresList: this.parseFeatures(plan.features) }))
  );

  ngOnInit(): void {
    this.loadPlans();
  }

  /** Charge les plans depuis le service */
  private loadPlans() {
    this.pricingService.getActivePlans().subscribe({
      next: data => this.rawPlans.set(data),
      error: err => console.error('Erreur chargement plans', err)
    });
  }

  /** Change le cycle de facturation */
  setBilling(cycle: 'monthly' | 'yearly') {
    this.billingCycle.set(cycle);
  }

  /** Parse les features d’un plan pour affichage */
  private parseFeatures(features: string): { name: string; included: boolean }[] {
    if (!features) return [];
    return features.split(',').map(f => ({ name: f.trim(), included: true }));
  }

  /** Crée une nouvelle subscription */
  subscribeToPlan(plan: PricingPlan) {
    const userId = 1;       // Adapter selon ton contexte
    const userRole = 'STUDENT';
    const cycle = this.billingCycle();

    this.pricingService.subscribe(userId, userRole, plan.id, cycle).subscribe({
      next: () => this.toastr.success(`Subscribed to ${plan.name} successfully!`),
      error: () => this.toastr.error(`Failed to subscribe to ${plan.name}`)
    });
  }
}
