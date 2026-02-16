import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    // Mock Data
    private courses = signal<Course[]>([
        {
            id: 1,
            title: 'Complete Angular Developer Guide 2024',
            description: 'Master Angular 18 and build awesome apps!',
            trainerId: 101,
            trainerName: 'Dr. Angela Yu',
            rating: 4.8,
            reviewsCount: 3200,
            studentsEnrolled: 12500,
            price: 29.99,
            currency: 'USD',
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/1672410_9ff1_5.jpg',
            categoryId: 1,
            categoryName: 'Development',
            level: 'Intermediate',
            language: 'English',
            lecturesCount: 42,
            duration: '28h 30m',
            updatedAt: '2024-01-15',
            highlights: ['Angular 18', 'RxJS', 'NgRx'],
            tags: ['Frontend', 'JavaScript']
        },
        {
            id: 2,
            title: 'The Complete Web Development Bootcamp',
            description: 'Become a full-stack web developer with just one course.',
            trainerId: 102,
            trainerName: 'Colt Steele',
            rating: 4.7,
            reviewsCount: 2100,
            studentsEnrolled: 8500,
            price: 19.99,
            currency: 'USD',
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/625204_436a_3.jpg',
            categoryId: 1,
            categoryName: 'Development',
            level: 'Beginner',
            language: 'English',
            lecturesCount: 65,
            duration: '45h 15m',
            updatedAt: '2024-02-10',
            highlights: ['HTML5', 'CSS3', 'Node.js'],
            tags: ['Fullstack', 'Web']
        },
        {
            id: 3,
            title: 'UI/UX Design Masterclass',
            description: 'Learn to design beautiful interfaces.',
            trainerId: 103,
            trainerName: 'Gary Simon',
            rating: 4.9,
            reviewsCount: 950,
            studentsEnrolled: 5000,
            price: 24.99,
            currency: 'USD',
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/437398_46c3_10.jpg',
            categoryId: 2,
            categoryName: 'Design',
            level: 'All Levels',
            language: 'English',
            lecturesCount: 30,
            duration: '12h 45m',
            updatedAt: '2023-11-20',
            highlights: ['Figma', 'Adobe XD', 'Prototyping'],
            tags: ['UI', 'UX', 'Design']
        },
        {
            id: 4,
            title: 'Machine Learning A-Z™: Hands-On Python',
            description: 'Learn to create Machine Learning Algorithms in Python.',
            trainerId: 104,
            trainerName: 'Kirill Eremenko',
            rating: 4.6,
            reviewsCount: 4500,
            studentsEnrolled: 15000,
            price: 14.99,
            currency: 'USD',
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/950390_270f_3.jpg',
            categoryId: 3,
            categoryName: 'Data Science',
            level: 'Advanced',
            language: 'English',
            lecturesCount: 55,
            duration: '35h 20m',
            updatedAt: '2023-12-05',
            highlights: ['Python', 'Scikit-Learn', 'Deep Learning'],
            tags: ['AI', 'ML', 'Python']
        }
    ]);

    getPopularCourses(): Observable<Course[]> {
        // Return first 4 courses as popular
        return of(this.courses().slice(0, 4)).pipe(delay(500));
    }

    getAll(): Observable<Course[]> {
        return of(this.courses()).pipe(delay(500));
    }

    getById(id: number): Observable<Course | undefined> {
        const course = this.courses().find(c => c.id === Number(id));
        return of(course).pipe(delay(500));
    }
}
