import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
    providedIn: 'root'
})
export class JobOfferService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8091/entreprise/job-offers';

    getAll(filters?: { contractType?: string, location?: string, remote?: string }): Observable<JobOffer[]> {
        let params = new HttpParams();
        if (filters) {
            if (filters.contractType) params = params.set('contractType', filters.contractType);
            if (filters.location) params = params.set('location', filters.location);
            if (filters.remote) params = params.set('remote', filters.remote);
        }
        return this.http.get<JobOffer[]>(this.apiUrl, { params });
    }

    getById(id: number): Observable<JobOffer> {
        return this.http.get<JobOffer>(`${this.apiUrl}/${id}`);
    }

    getByCompany(companyId: number): Observable<JobOffer[]> {
        return this.http.get<JobOffer[]>(`${this.apiUrl}/company/${companyId}`);
    }

    create(offer: Partial<JobOffer>): Observable<JobOffer> {
        return this.http.post<JobOffer>(this.apiUrl, offer);
    }

    update(id: number, offer: Partial<JobOffer>): Observable<JobOffer> {
        return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, offer);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
