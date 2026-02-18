import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';

interface ApiLog {
    timestamp: Date;
    method: string;
    url: string;
    status: number;
    success: boolean;
    response: any;
}

@Component({
    selector: 'app-crud-test',
    standalone: true,
    imports: [CommonModule, MatTabsModule, MatButtonModule, MatIconModule, MatTableModule, MatExpansionModule, FormsModule],
    template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <div class="mb-6 flex justify-between items-center">
        <div>
           <h1 class="text-3xl font-bold text-gray-900">CRUD Verification Dashboard</h1>
           <p class="text-gray-600">Testing Endpoints at <span class="font-mono bg-gray-200 px-2 py-0.5 rounded text-sm">http://localhost:8091</span></p>
        </div>
        <button mat-raised-button color="warn" (click)="clearLogs()">Clear Logs</button>
      </div>

      <mat-tab-group (selectedTabChange)="onTabChange($event)" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <!-- COMPANIES TAB -->
        <mat-tab label="Companies">
          <div class="p-6">
            <div class="flex gap-4 mb-6">
              <button mat-raised-button color="primary" (click)="loadCompanies()">
                <mat-icon>refresh</mat-icon> Load All
              </button>
              <button mat-stroked-button color="accent" (click)="createTestCompany()">
                <mat-icon>add</mat-icon> Create Test Company
              </button>
            </div>
            
            <table mat-table [dataSource]="companies()" class="w-full border border-gray-200 rounded-lg overflow-hidden" *ngIf="companies().length">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef> ID </th>
                <td mat-cell *matCellDef="let element"> {{element.id}} </td>
              </ng-container>
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef> Name </th>
                <td mat-cell *matCellDef="let element"> {{element.name}} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" (click)="updateCompany(element)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCompany(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['id', 'name', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id', 'name', 'actions'];"></tr>
            </table>
          </div>
        </mat-tab>

        <!-- JOB OFFERS TAB -->
        <mat-tab label="Job Offers">
           <div class="p-6">
            <div class="flex gap-4 mb-6">
              <button mat-raised-button color="primary" (click)="loadJobs()">
                <mat-icon>refresh</mat-icon> Load All
              </button>
              <button mat-stroked-button color="accent" (click)="createTestJob()">
                <mat-icon>add</mat-icon> Create Test Job
              </button>
            </div>
            
            <table mat-table [dataSource]="jobs()" class="w-full border border-gray-200 rounded-lg overflow-hidden" *ngIf="jobs().length">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef> ID </th>
                <td mat-cell *matCellDef="let element"> {{element.id}} </td>
              </ng-container>
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef> Title </th>
                <td mat-cell *matCellDef="let element"> {{element.title}} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" (click)="updateJob(element)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteJob(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['id', 'title', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id', 'title', 'actions'];"></tr>
            </table>
          </div>
        </mat-tab>

        <!-- PLANS TAB -->
        <mat-tab label="Plans">
           <div class="p-6">
            <div class="flex gap-4 mb-6">
              <button mat-raised-button color="primary" (click)="loadPlans()">
                <mat-icon>refresh</mat-icon> Load All
              </button>
              <button mat-stroked-button color="accent" (click)="createTestPlan()">
                <mat-icon>add</mat-icon> Create Test Plan
              </button>
            </div>
            
            <table mat-table [dataSource]="plans()" class="w-full border border-gray-200 rounded-lg overflow-hidden" *ngIf="plans().length">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef> ID </th>
                <td mat-cell *matCellDef="let element"> {{element.id}} </td>
              </ng-container>
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef> Name </th>
                <td mat-cell *matCellDef="let element"> {{element.name}} </td>
              </ng-container>
              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef> Price (Mo) </th>
                <td mat-cell *matCellDef="let element"> {{element.monthlyPrice}} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" (click)="updatePlan(element)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deletePlan(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['id', 'name', 'price', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id', 'name', 'price', 'actions'];"></tr>
            </table>
          </div>
        </mat-tab>

        <!-- SUBSCRIPTIONS TAB -->
        <mat-tab label="Subscriptions">
           <div class="p-6">
            <div class="flex gap-4 mb-6">
              <button mat-raised-button color="primary" (click)="loadSubscriptions()">
                <mat-icon>refresh</mat-icon> Load All
              </button>
              <button mat-stroked-button color="accent" (click)="createTestSubscription()">
                <mat-icon>add</mat-icon> Create Test Sub
              </button>
            </div>
            
            <table mat-table [dataSource]="subscriptions()" class="w-full border border-gray-200 rounded-lg overflow-hidden" *ngIf="subscriptions().length">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef> ID </th>
                <td mat-cell *matCellDef="let element"> {{element.id}} </td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef> Status </th>
                <td mat-cell *matCellDef="let element"> 
                    <span [class.text-green-600]="element.status === 'ACTIVE'" [class.text-red-600]="element.status !== 'ACTIVE'" class="font-bold">
                        {{element.status}}
                    </span>
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let element">
                  <button mat-button color="warn" (click)="cancelSubscription(element.id)">
                    Cancel
                  </button>
                   <button mat-icon-button color="warn" (click)="deleteSubscription(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['id', 'status', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id', 'status', 'actions'];"></tr>
            </table>
          </div>
        </mat-tab>

      </mat-tab-group>

      <!-- Logs Section -->
      <div class="mt-8">
         <h2 class="text-xl font-bold text-gray-900 mb-4">Operation Logs</h2>
         <div class="space-y-4">
            @for (log of logs().slice().reverse(); track log) {
                <mat-expansion-panel [class.border-l-4]="true" [class.border-green-500]="log.success" [class.border-red-500]="!log.success">
                    <mat-expansion-panel-header>
                        <mat-panel-title class="flex gap-4 items-center">
                             <mat-icon [class.text-green-500]="log.success" [class.text-red-500]="!log.success">
                                {{ log.success ? 'check_circle' : 'error' }}
                             </mat-icon>
                             <span class="font-bold font-mono text-sm px-2 py-1 rounded bg-gray-100">{{ log.method }}</span>
                             <span class="font-mono text-sm text-gray-600">{{ log.url }}</span>
                             <span class="font-bold ml-auto" [class.text-green-600]="log.success" [class.text-red-600]="!log.success">
                                Status: {{ log.status }}
                             </span>
                        </mat-panel-title>
                    </mat-expansion-panel-header>
                    <div class="py-4">
                        <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">{{ log.response | json }}</pre>
                    </div>
                </mat-expansion-panel>
            }
         </div>
      </div>
    </div>
  `
})
export class CrudTestComponent {
    private http = inject(HttpClient);

    // Data Signals
    companies = signal<any[]>([]);
    jobs = signal<any[]>([]);
    plans = signal<any[]>([]);
    subscriptions = signal<any[]>([]);

    // Logs
    logs = signal<ApiLog[]>([]);

    private baseUrl = 'http://localhost:8091';

    clearLogs() {
        this.logs.set([]);
    }

    onTabChange(event: any) {
        // Optionally auto-load data when switching tabs
    }

    private log(method: string, url: string, status: number, response: any) {
        const success = status >= 200 && status < 300;
        this.logs.update(prev => [...prev, {
            timestamp: new Date(),
            method,
            url,
            status,
            success,
            response
        }]);
    }

    private request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, body?: any): any {
        const url = `\${this.baseUrl}\${endpoint}`;
        return this.http.request(method, url, { body, observe: 'response' }).subscribe({
            next: (res) => {
                this.log(method, url, res.status, res.body);
                return res.body;
            },
            error: (err: HttpErrorResponse) => {
                this.log(method, url, err.status, err.error || err.message);
            }
        });
    }

    // --- Companies ---
    loadCompanies() {
        this.http.get(`\${this.baseUrl}/entreprise/companies`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.companies.set(res.body);
                this.log('GET', '/entreprise/companies', res.status, res.body);
            },
            error: (err) => this.log('GET', '/entreprise/companies', err.status, err)
        });
    }

    createTestCompany() {
        const dummy = {
            name: `Test Comp \${Math.floor(Math.random() * 1000)}`,
            description: "Auto generated for testing",
            industry: "Testing",
            location: "Virtual",
            website: "https://example.com",
            email: `test\${Math.floor(Math.random() * 1000)}@test.com`,
            phone: "1234567890",
            enterpriseUserId: 1
        };
        this.http.post(`\${this.baseUrl}/entreprise/companies`, dummy, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('POST', '/entreprise/companies', res.status, res.body);
                this.loadCompanies();
            },
            error: (err) => this.log('POST', '/entreprise/companies', err.status, err)
        });
    }

    updateCompany(company: any) {
        const updated = { ...company, name: company.name + ' (Updated)' };
        this.http.put(`\${this.baseUrl}/entreprise/companies/\${company.id}`, updated, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('PUT', `/entreprise/companies/\${company.id}`, res.status, res.body);
                this.loadCompanies();
            },
            error: (err) => this.log('PUT', `/entreprise/companies/\${company.id}`, err.status, err)
        });
    }

    deleteCompany(id: number) {
        if (!confirm('Delete company?')) return;
        this.http.delete(`\${this.baseUrl}/entreprise/companies/\${id}`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('DELETE', `/entreprise/companies/\${id}`, res.status, res.body);
                this.loadCompanies();
            },
            error: (err) => this.log('DELETE', `/entreprise/companies/\${id}`, err.status, err)
        });
    }

    // --- Job Offers ---
    loadJobs() {
        this.http.get(`\${this.baseUrl}/entreprise/job-offers`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.jobs.set(res.body);
                this.log('GET', '/entreprise/job-offers', res.status, res.body);
            },
            error: (err) => this.log('GET', '/entreprise/job-offers', err.status, err)
        });
    }

    createTestJob() {
        const dummy = {
            title: `Java Dev \${Math.floor(Math.random() * 100)}`,
            description: "Auto generated job",
            contractType: "CDI",
            location: "Paris",
            salary: 45000,
            remote: "HYBRID",
            requirements: "Java 17",
            companyId: 1, // Assumes company 1 exists
            isActive: true
        };
        this.http.post(`\${this.baseUrl}/entreprise/job-offers`, dummy, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('POST', '/entreprise/job-offers', res.status, res.body);
                this.loadJobs();
            },
            error: (err) => this.log('POST', '/entreprise/job-offers', err.status, err)
        });
    }

    updateJob(job: any) {
        const updated = { title: job.title + ' v2', salary: job.salary + 1000 };
        this.http.put(`\${this.baseUrl}/entreprise/job-offers/\${job.id}`, updated, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('PUT', `/entreprise/job-offers/\${job.id}`, res.status, res.body);
                this.loadJobs();
            },
            error: (err) => this.log('PUT', `/entreprise/job-offers/\${job.id}`, err.status, err)
        });
    }

    deleteJob(id: number) {
        if (!confirm('Delete job?')) return;
        this.http.delete(`\${this.baseUrl}/entreprise/job-offers/\${id}`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('DELETE', `/entreprise/job-offers/\${id}`, res.status, res.body);
                this.loadJobs();
            },
            error: (err) => this.log('DELETE', `/entreprise/job-offers/\${id}`, err.status, err)
        });
    }

    // --- Plans ---
    loadPlans() {
        this.http.get(`\${this.baseUrl}/sub/plans/all`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.plans.set(res.body);
                this.log('GET', '/sub/plans/all', res.status, res.body);
            },
            error: (err) => this.log('GET', '/sub/plans/all', err.status, err)
        });
    }

    createTestPlan() {
        const dummy = {
            name: `PLAN-\${Math.floor(Math.random() * 100)}`,
            monthlyPrice: 99.99,
            yearlyPrice: 999.99,
            isActive: true,
            highlight: false
        };
        this.http.post(`\${this.baseUrl}/sub/plans`, dummy, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('POST', '/sub/plans', res.status, res.body);
                this.loadPlans();
            },
            error: (err) => this.log('POST', '/sub/plans', err.status, err)
        });
    }

    updatePlan(plan: any) {
        const updated = { ...plan, name: plan.name + ' UPDATED', monthlyPrice: plan.monthlyPrice + 10 };
        this.http.put(`\${this.baseUrl}/sub/plans/\${plan.id}`, updated, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('PUT', `/sub/plans/\${plan.id}`, res.status, res.body);
                this.loadPlans();
            },
            error: (err) => this.log('PUT', `/sub/plans/\${plan.id}`, err.status, err)
        });
    }

    deletePlan(id: number) {
        if (!confirm('Delete plan?')) return;
        this.http.delete(`\${this.baseUrl}/sub/plans/\${id}`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('DELETE', `/sub/plans/\${id}`, res.status, res.body);
                this.loadPlans();
            },
            error: (err) => this.log('DELETE', `/sub/plans/\${id}`, err.status, err)
        });
    }

    // --- Subscriptions ---
    loadSubscriptions() {
        this.http.get(`\${this.baseUrl}/sub/subscriptions`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.subscriptions.set(res.body);
                this.log('GET', '/sub/subscriptions', res.status, res.body);
            },
            error: (err) => this.log('GET', '/sub/subscriptions', err.status, err)
        });
    }

    createTestSubscription() {
        const dummy = {
            userId: 1,
            userRole: "ENTERPRISE",
            planId: 1, // Assumes plan 1 exists
            billingCycle: "MONTHLY"
        };
        this.http.post(`\${this.baseUrl}/sub/subscriptions`, dummy, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('POST', '/sub/subscriptions', res.status, res.body);
                this.loadSubscriptions();
            },
            error: (err) => this.log('POST', '/sub/subscriptions', err.status, err)
        });
    }

    cancelSubscription(id: number) {
        this.http.put(`\${this.baseUrl}/sub/subscriptions/\${id}/cancel`, {}, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('PUT', `/sub/subscriptions/\${id}/cancel`, res.status, res.body);
                this.loadSubscriptions();
            },
            error: (err) => this.log('PUT', `/sub/subscriptions/\${id}/cancel`, err.status, err)
        });
    }

    deleteSubscription(id: number) {
        if (!confirm('Delete subscription?')) return;
        this.http.delete(`\${this.baseUrl}/sub/subscriptions/\${id}`, { observe: 'response' }).subscribe({
            next: (res: any) => {
                this.log('DELETE', `/sub/subscriptions/\${id}`, res.status, res.body);
                this.loadSubscriptions();
            },
            error: (err) => this.log('DELETE', `/sub/subscriptions/\${id}`, err.status, err)
        });
    }
}
