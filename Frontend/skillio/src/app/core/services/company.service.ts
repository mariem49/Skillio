import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/entreprise/companies`;

    // Get all companies
    getAll(): Observable<Company[]> {
        return this.http.get<Company[]>(this.apiUrl);
    }

    // Get company by ID
    getById(id: number): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/${id}`);
    }

    // Get company by enterprise user ID
    getByEnterpriseUserId(userId: number): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/user/${userId}`);
    }

    // Create new company
    create(company: Partial<Company>): Observable<Company> {
        return this.http.post<Company>(this.apiUrl, company);
    }

    // Update existing company
    update(id: number, company: Partial<Company>): Observable<Company> {
        return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
    }

    // Delete company
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
