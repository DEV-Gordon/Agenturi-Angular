import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accommodation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private apiUrl = 'http://localhost:8000/api/accommodations';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Accommodation[]> {
    return this.http.get<Accommodation[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${this.apiUrl}/${id}/`);
  }

  create(accommodation: Accommodation): Observable<Accommodation> {
    return this.http.post<Accommodation>(`${this.apiUrl}/`, accommodation);
  }

  update(id: number, accommodation: Accommodation): Observable<Accommodation> {
    return this.http.put<Accommodation>(`${this.apiUrl}/${id}/`, accommodation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}