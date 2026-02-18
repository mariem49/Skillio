import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOffer } from '../models/job-offer.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobOfferService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/entreprise/job-offers`;

    // Get all job offers with optional filters
    getAll(filters?: { contractType?: string, location?: string, remote?: string }): Observable<JobOffer[]> {
        let params = new HttpParams();
        if (filters) {
            if (filters.contractType) params = params.set('contractType', filters.contractType);
            if (filters.location) params = params.set('location', filters.location);
            if (filters.remote) params = params.set('remote', filters.remote);
        }
        return this.http.get<JobOffer[]>(this.apiUrl, { params });
    }

    // Get job offer by ID
    getById(id: number): Observable<JobOffer> {
        return this.http.get<JobOffer>(`${this.apiUrl}/${id}`);
    }

    // Get job offers by company ID
    getByCompany(companyId: number): Observable<JobOffer[]> {
        return this.http.get<JobOffer[]>(`${this.apiUrl}/company/${companyId}`);
    }

    // Create new job offer
    create(offer: Partial<JobOffer>): Observable<JobOffer> {
        return this.http.post<JobOffer>(this.apiUrl, offer);
    }

    // Update existing job offer
    update(id: number, offer: Partial<JobOffer>): Observable<JobOffer> {
        return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, offer);
    }

    // Delete job offer
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Apply to job offer (Placeholder for now, implementation depends on Application entity)
    apply(offerId: number, applicationData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${offerId}/apply`, applicationData);
    }
}
