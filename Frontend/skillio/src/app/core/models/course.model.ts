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

// Deprecated: Section/Lecture/Curriculum removed
