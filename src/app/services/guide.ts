import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guide } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private apiUrl = 'http://localhost:8000/api/guides';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/${id}/`);
  }

  create(guide: Guide): Observable<Guide> {
    return this.http.post<Guide>(`${this.apiUrl}/`, guide);
  }

  update(id: number, guide: Guide): Observable<Guide> {
    return this.http.put<Guide>(`${this.apiUrl}/${id}/`, guide);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}