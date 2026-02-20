import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8091/entreprise/companies';

    getAll(): Observable<Company[]> {
        return this.http.get<Company[]>(this.apiUrl);
    }

    getById(id: number): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/${id}`);
    }

    getByEnterpriseUserId(userId: number): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/user/${userId}`);
    }

    create(company: Partial<Company>): Observable<Company> {
        return this.http.post<Company>(this.apiUrl, company);
    }

    update(id: number, company: Partial<Company>): Observable<Company> {
        return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
