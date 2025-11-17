import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Itinerary } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private apiUrl = 'http://localhost:8000/api/itineraries';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Itinerary> {
    return this.http.get<Itinerary>(`${this.apiUrl}/${id}/`);
  }

  create(itinerary: Itinerary): Observable<Itinerary> {
    return this.http.post<Itinerary>(`${this.apiUrl}/`, itinerary);
  }

  update(id: number, itinerary: Itinerary): Observable<Itinerary> {
    return this.http.put<Itinerary>(`${this.apiUrl}/${id}/`, itinerary);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}