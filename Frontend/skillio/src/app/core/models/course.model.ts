export interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    discountPrice?: number;
    currency: string;
    trainerId: number;
    trainerName?: string; // Hydrated
    categoryId: number;
    categoryName?: string; // Hydrated
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    language: string;
    rating: number;
    reviewsCount: number;
    studentsEnrolled: number;
    lecturesCount: number;
    duration: string; // e.g. "12h 30m"
    updatedAt: string;
    highlights?: string[]; // "What you'll learn"
    tags?: string[];
}

export interface Section {
    id: number;
    title: string;
    lectures: Lecture[];
}

export interface Lecture {
    id: number;
    title: string;
    type: 'Video' | 'Article' | 'Quiz';
    contentUrl?: string; // Video URL or article content
    duration: string; // "10:05"
    isPreview: boolean;
}

export interface Curriculum {
    sections: Section[];
}
