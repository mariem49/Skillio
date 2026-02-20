import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training, TrainingContent } from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8091/trainings';

  getAll(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  getById(id: number): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<Training>): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<Training>): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getContents(trainingId: number): Observable<TrainingContent[]> {
    return this.http.get<TrainingContent[]>(`${this.apiUrl}/${trainingId}/contents`);
  }

  addContent(trainingId: number, payload: Partial<TrainingContent>): Observable<TrainingContent> {
    return this.http.post<TrainingContent>(`${this.apiUrl}/${trainingId}/contents`, payload);
  }

  deleteContent(contentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contents/${contentId}`);
  }
}
