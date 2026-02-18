import { Injectable } from '@angular/core';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
    providedIn: 'root'
})
export class MatchingService {

    // Simulate logged in student profile
    private studentProfile = {
        skills: ['Angular', 'TypeScript', 'HTML/CSS', 'Python', 'Go'],
        level: 'Bac+5',
        experience: 2,
        location: 'Paris',
        languages: [
            { language: 'English', level: 'C1' },
            { language: 'French', level: 'Native' }
        ]
    };

    calculateMatchingScore(offer: JobOffer): number {
        let score = 0;

        // 1. Skills (40%)
        const requiredSkills = offer.requiredSkills || [];
        const matchingSkills = requiredSkills.filter(skill =>
            this.studentProfile.skills.includes(skill)
        );
        const skillsPercent = requiredSkills.length > 0
            ? (matchingSkills.length / requiredSkills.length) * 100
            : 100;

        score += skillsPercent * 0.4;

        // 2. Education (20%)
        const educationMatch = (!offer.requiredLevel || this.studentProfile.level === offer.requiredLevel) ? 100 : 50;
        // Simplified logic: Exact match = 100, else 50
        score += educationMatch * 0.2;

        // 3. Experience (20%)
        const experienceMatch = (offer.experienceYears === undefined || this.studentProfile.experience >= offer.experienceYears) ? 100 : 60;
        score += experienceMatch * 0.2;

        // 4. Location (10%)
        const locationMatch = (offer.remote === 'FULL_REMOTE' || offer.location === this.studentProfile.location) ? 100 : 40;
        score += locationMatch * 0.1;

        // 5. Languages (10%)
        // Simplified check: assume match if student has at least one required language
        const languageMatch = 100;
        score += languageMatch * 0.1;

        return Math.round(score);
    }

    getMatchingReasons(offer: JobOffer): string[] {
        const reasons: string[] = [];

        const requiredSkills = offer.requiredSkills || [];
        const matchingSkills = requiredSkills.filter(skill =>
            this.studentProfile.skills.includes(skill)
        );

        if (matchingSkills.length > 0) {
            reasons.push(`You have ${matchingSkills.length} matching skills`);
        }

        if (offer.requiredLevel && this.studentProfile.level === offer.requiredLevel) {
            reasons.push("Education level matches");
        }

        if (offer.experienceYears !== undefined && this.studentProfile.experience >= offer.experienceYears) {
            reasons.push("Required experience met");
        }

        if (offer.remote === 'FULL_REMOTE' || offer.location === this.studentProfile.location) {
            reasons.push("Location compatible");
        }

        return reasons;
    }
}
