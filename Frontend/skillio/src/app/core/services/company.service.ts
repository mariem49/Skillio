import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Company } from '../models/company.model';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private mockCompanies = signal<Company[]>([
        {
            id: 1,
            name: 'TechCorp',
            logo: 'https://ui-avatars.com/api/?name=TechCorp&background=random',
            description: 'Leading provider of cloud solutions.',
            industry: 'tech',
            size: '51-200',
            location: 'Paris, France',
            website: 'https://techcorp.com',
            status: 'active',
            jobOffersCount: 5
        },
        {
            id: 2,
            name: 'GreenFinance',
            logo: 'https://ui-avatars.com/api/?name=GreenFinance&background=random',
            description: 'Sustainable finance for a better future.',
            industry: 'finance',
            size: '200+',
            location: 'Lyon, France',
            website: 'https://greenfi.com',
            status: 'active',
            jobOffersCount: 2
        },
        {
            id: 3,
            name: 'EduLearn',
            logo: 'https://ui-avatars.com/api/?name=EduLearn&background=random',
            description: 'EdTech platform transforming education.',
            industry: 'education',
            size: '11-50',
            location: 'Remote',
            status: 'active',
            jobOffersCount: 8
        }
    ]);

    getAll(): Observable<Company[]> {
        return of(this.mockCompanies()).pipe(delay(500));
    }

    getById(id: number): Observable<Company | undefined> {
        const company = this.mockCompanies().find(c => c.id === Number(id));
        return of(company).pipe(delay(400));
    }
}
