import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { JobOffer } from '../models/job-offer.model';
import { Application } from '../models/application.model';

@Injectable({
    providedIn: 'root'
})
export class JobOfferService {
    private mockOffers = signal<JobOffer[]>([
        {
            id: 1,
            companyId: 1,
            companyName: 'TechCorp',
            companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=random',
            title: 'Angular Developer',
            description: 'We are looking for a skilled Angular Developer...',
            contractType: 'CDI',
            location: 'Paris',
            remote: 'partial',
            salary: '45k-55k',
            startDate: '2024-05-01',
            requiredLevel: 'Bac+5',
            experienceYears: 2,
            requiredSkills: ['Angular', 'TypeScript', 'RxJS', 'HTML/CSS'],
            requiredLanguages: [{ language: 'English', level: 'B2' }],
            postedAt: '2024-03-20'
        },
        {
            id: 2,
            companyId: 2,
            companyName: 'GreenFinance',
            companyLogo: 'https://ui-avatars.com/api/?name=GreenFinance&background=random',
            title: 'Junior Data Analyst',
            description: 'Join our data team to analyze...',
            contractType: 'Stage',
            duration: '6 months',
            location: 'Lyon',
            remote: 'no',
            salary: '1200/mo',
            startDate: '2024-09-01',
            requiredLevel: 'Bac+3',
            experienceYears: 0,
            requiredSkills: ['Python', 'SQL', 'Excel'],
            requiredLanguages: [{ language: 'French', level: 'Native' }],
            postedAt: '2024-03-22'
        },
        {
            id: 3,
            companyId: 3,
            companyName: 'EduLearn',
            companyLogo: 'https://ui-avatars.com/api/?name=EduLearn&background=random',
            title: 'UX/UI Designer',
            description: 'Create beautiful interfaces for learners.',
            contractType: 'Alternance',
            location: 'Remote',
            remote: 'full-remote',
            salary: 'Standard',
            startDate: '2024-09-01',
            requiredLevel: 'Bac+3',
            experienceYears: 1,
            requiredSkills: ['Figma', 'Prototyping', 'User Research'],
            requiredLanguages: [{ language: 'English', level: 'C1' }],
            postedAt: '2024-03-25'
        }
    ]);

    getAll(filters?: any): Observable<JobOffer[]> {
        return of(this.mockOffers()).pipe(delay(600));
    }

    getById(id: number): Observable<JobOffer | undefined> {
        const offer = this.mockOffers().find(o => o.id === Number(id));
        return of(offer).pipe(delay(400));
    }

    getByCompany(companyId: number): Observable<JobOffer[]> {
        const offers = this.mockOffers().filter(o => o.companyId === Number(companyId));
        return of(offers).pipe(delay(500));
    }

    apply(offerId: number, data: any): Observable<boolean> {
        console.log('Applied to offer:', offerId, data);
        return of(true).pipe(delay(1000));
    }
}
