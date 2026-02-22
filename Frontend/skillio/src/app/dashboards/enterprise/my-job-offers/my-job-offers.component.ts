import {
  Component, inject, signal, OnInit, OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobOfferService }  from '../../../core/services/job-offer.service';
import { CompanyService }   from '../../../core/services/company.service';
import { AuthService }      from '../../../core/services/auth.service';
import { JobOffer }         from '../../../core/models/job-offer.model';
import { ToastrService }    from 'ngx-toastr';

import { MatButtonModule }    from '@angular/material/button';
import { MatIconModule }      from '@angular/material/icon';
import { MatChipsModule }     from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatSelectModule }    from '@angular/material/select';
import { MatCheckboxModule }  from '@angular/material/checkbox';
import { MatListModule }      from '@angular/material/list';
import { MatTooltipModule }   from '@angular/material/tooltip';

// Leaflet is loaded dynamically from CDN (see loadLeafletCDN below).
// No npm install needed — the global `L` is declared here for TypeScript.
declare const L: any;

@Component({
  selector: 'app-my-job-offers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './my-job-offers.component.html',
  styleUrls:  ['./my-job-offers.component.scss']
})
export class MyJobOffersComponent implements OnInit, OnDestroy {

  // ── Services ──────────────────────────────────────────────────────────────
  private jobOfferService = inject(JobOfferService);
  private companyService  = inject(CompanyService);
  private fb              = inject(FormBuilder);
  private toastr          = inject(ToastrService);
  private authService     = inject(AuthService);
  private cdr             = inject(ChangeDetectorRef);

  // ── State ─────────────────────────────────────────────────────────────────
  offers    = signal<JobOffer[]>([]);
  showForm  = signal(false);
  isEditing = signal(false);
  editId: number | null = null;
  companyId = 0;

  requirementsList: string[] = [];

  // Map
  private map: any    = null;
  private marker: any = null;
  mapClickedOnce  = false;
  selectedLat: number | null = null;
  selectedLng: number | null = null;

  // ── Title Suggestions ─────────────────────────────────────────────────────
  titleSuggestions = [
    'Angular Developer', 'React Developer', 'Vue.js Developer',
    'Full Stack Developer', 'Backend Node.js Developer', 'Frontend Developer',
    'Mobile Developer (Flutter)', 'Mobile Developer (React Native)',
    'Data Analyst', 'Data Scientist', 'Data Engineer',
    'Machine Learning Engineer', 'DevOps Engineer',
    'SRE (Site Reliability Engineer)', 'Software Architect', 'Tech Lead',
    'Cybersecurity Engineer', 'Linux System Administrator',
    'Network Administrator', 'IT Project Manager', 'Product Owner',
    'Scrum Master', 'UX/UI Designer', 'QA Engineer',
    'Java / Spring Boot Developer', 'Python Developer',
    'PHP / Laravel Developer', 'Cloud Engineer (AWS / Azure / GCP)',
    'Blockchain Developer', 'AI / NLP Engineer'
  ];

  // ── Forms ─────────────────────────────────────────────────────────────────
  offerForm = this.fb.group({
    title:        ['', Validators.required],
    description:  ['', Validators.required],
    contractType: ['Full-time', Validators.required],
    location:     ['', Validators.required],
    salary:       [0, Validators.required],
    remote:       ['ON_SITE', Validators.required],
    isActive:     [true],
    requirements: ['']
  });

  /**
   * Standalone sub-form for requirements.
   * Bound with [formGroup]="requirementForm" on a plain <div> —
   * never nested inside the main offerForm <form> tag.
   */
  requirementForm = this.fb.group({
    experience: ['Junior', Validators.required],
    technology: [''],
    skill:      ['']
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.companyService.getByEnterpriseUserId(userId).subscribe({
      next: (comp) => { this.companyId = comp.id; this.loadOffers(); },
      error: (err)  => console.error(err)
    });
  }

  ngOnDestroy(): void { this.destroyMap(); }

  // ── Leaflet CDN Loader ────────────────────────────────────────────────────
  /**
   * Dynamically injects Leaflet CSS + JS from CDN if not already present.
   * Returns a Promise that resolves once the script is loaded.
   */
  private loadLeafletCDN(): Promise<void> {
    return new Promise((resolve) => {
      // Already loaded?
      if (typeof L !== 'undefined') { resolve(); return; }

      // Inject CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id   = 'leaflet-css';
        link.rel  = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Inject JS
      if (!document.getElementById('leaflet-js')) {
        const script   = document.createElement('script');
        script.id      = 'leaflet-js';
        script.src     = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload  = () => resolve();
        script.onerror = () => {
          console.error('Failed to load Leaflet from CDN.');
          resolve(); // resolve anyway so the rest of the app doesn't block
        };
        document.head.appendChild(script);
      } else {
        // Script tag exists but may still be loading — poll
        const poll = setInterval(() => {
          if (typeof L !== 'undefined') { clearInterval(poll); resolve(); }
        }, 50);
      }
    });
  }

  // ── Map ───────────────────────────────────────────────────────────────────
  private initMap(): void {
    // 1. Let Angular render the *ngIf form
    setTimeout(async () => {
      // 2. Load Leaflet from CDN (no-op if already loaded)
      await this.loadLeafletCDN();

      // 3. Let browser paint the map container
      setTimeout(() => {
        if (this.map) return;

        const el = document.getElementById('location-map');
        if (!el) { console.warn('#location-map not in DOM.'); return; }

        this.map = L.map('location-map', {
          zoomControl: true,
          scrollWheelZoom: true
        }).setView([46.6, 2.3], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19
        }).addTo(this.map);

        this.map.invalidateSize();
        this.map.on('click', (e: any) => this.onMapClick(e));

      }, 150);
    }, 0);
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map   = null;
      this.marker = null;
    }
  }

  onMapClick(e: any): void {
    const { lat, lng } = e.latlng;
    this.selectedLat    = Math.round(lat * 10000) / 10000;
    this.selectedLng    = Math.round(lng * 10000) / 10000;
    this.mapClickedOnce = true;

    if (this.marker) {
      this.marker.setLatLng(e.latlng);
    } else {
      this.marker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
      this.marker.on('dragend', (ev: any) => {
        const pos = ev.target.getLatLng();
        this.selectedLat = Math.round(pos.lat * 10000) / 10000;
        this.selectedLng = Math.round(pos.lng * 10000) / 10000;
        this.reverseGeocode(pos.lat, pos.lng);
        this.cdr.detectChanges();
      });
    }

    this.reverseGeocode(lat, lng);
    this.cdr.detectChanges();
  }

  private reverseGeocode(lat: number, lng: number): void {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    )
      .then(r => r.json())
      .then(data => {
        const city    = data.address?.city
                     || data.address?.town
                     || data.address?.village
                     || '';
        const country = data.address?.country || '';
        const label   = city && country
          ? `${city}, ${country}`
          : (data.display_name?.split(',').slice(0, 2).join(', ').trim() || '');
        if (label) {
          this.offerForm.patchValue({ location: label });
          this.cdr.detectChanges();
        }
      })
      .catch(() => {});
  }

  clearMapSelection(): void {
    this.selectedLat    = null;
    this.selectedLng    = null;
    this.mapClickedOnce = false;
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    this.offerForm.patchValue({ location: '' });
  }

  // ── Form Helpers ──────────────────────────────────────────────────────────
  toggleForm(): void {
    const next = !this.showForm();
    this.showForm.set(next);
    if (next) {
      this.initMap();
    } else {
      this.resetForm();
      this.destroyMap();
    }
  }

  resetForm(): void {
    this.offerForm.reset({
      title: '', description: '', contractType: 'Full-time',
      location: '', salary: 0, remote: 'ON_SITE',
      isActive: true, requirements: ''
    });
    this.requirementsList = [];
    this.requirementForm.reset({ experience: 'Junior', technology: '', skill: '' });
    this.isEditing.set(false);
    this.editId = null;
    this.clearMapSelection();
  }

  addRequirementForm(): void {
    const v = this.requirementForm.value;
    if (!v.technology?.trim()) return;

    const label = `${v.experience} — ${v.technology.trim()}`
                + (v.skill?.trim() ? ` (${v.skill.trim()})` : '');

    this.requirementsList = [...this.requirementsList, label];
    this.requirementForm.reset({ experience: 'Junior', technology: '', skill: '' });
  }

  removeRequirement(req: string): void {
    this.requirementsList = this.requirementsList.filter(r => r !== req);
  }

  editOffer(offer: JobOffer): void {
    this.isEditing.set(true);
    this.editId = offer.id;
    this.offerForm.patchValue({
      title:        offer.title        ?? '',
      description:  offer.description  ?? '',
      contractType: offer.contractType ?? 'Full-time',
      location:     offer.location     ?? '',
      salary:       offer.salary       ?? 0,
      remote:       offer.remote       ?? 'ON_SITE',
      isActive:     offer.isActive     ?? true,
      requirements: ''
    });
    this.requirementsList = offer.requirements
      ? offer.requirements.split(',').map(r => r.trim())
      : [];
    this.showForm.set(true);
    this.initMap();
  }

  deleteOffer(id: number): void {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    this.jobOfferService.delete(id).subscribe({
      next: () => { this.toastr.success('Offer deleted'); this.loadOffers(); },
      error: ()  => this.toastr.error('Failed to delete offer')
    });
  }

  onSubmit(): void {
    if (this.offerForm.invalid) return;
    const v = this.offerForm.value;
    const offerData: Partial<JobOffer> = {
      companyId:    this.companyId,
      title:        v.title        ?? '',
      description:  v.description  ?? '',
      contractType: v.contractType ?? 'Full-time',
      location:     v.location     ?? '',
      salary:       v.salary       ?? 0,
      remote:       v.remote       ?? 'ON_SITE',
      isActive:     v.isActive     ?? true,
      requirements: this.requirementsList.join(', ')
    };

    if (this.isEditing() && this.editId) {
      this.jobOfferService.update(this.editId, offerData).subscribe({
        next: () => {
          this.toastr.success('Offer updated');
          this.loadOffers();
          this.toggleForm();
        },
        error: () => this.toastr.error('Failed to update offer')
      });
    } else {
      this.jobOfferService.create(offerData).subscribe({
        next: () => {
          this.toastr.success('Offer published');
          this.loadOffers();
          this.toggleForm();
        },
        error: () => this.toastr.error('Failed to publish offer')
      });
    }
  }

  loadOffers(): void {
    this.jobOfferService.getByCompany(this.companyId).subscribe({
      next: (data) => this.offers.set(data),
      error: (err)  => console.error(err)
    });
  }
}