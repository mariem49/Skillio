export interface Application {
    id: number;
    jobOfferId: number;
    studentId: number;
    status: 'pending' | 'accepted' | 'rejected';
    matchingScore?: number;
    coverLetter?: string;
    appliedAt: string;
}
