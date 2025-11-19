import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { ItineraryI, ItineraryResponseI } from '../models/itinerary';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private baseUrl = 'http://127.0.0.1:8000/api/itineraries';
  private itinerariesSubject = new BehaviorSubject<ItineraryResponseI[]>([]);
  public itineraries$ = this.itinerariesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllItineraries(): Observable<ItineraryResponseI[]> {
    return this.http.get<ItineraryResponseI[]>(this.baseUrl)
      .pipe(
        tap((itineraries: ItineraryResponseI[]) => {
          console.log('Fetched itineraries:', itineraries);
          this.itinerariesSubject.next(itineraries);
        }),
        catchError((error: unknown) => {
          console.error('Error fetching itineraries:', error);
          return throwError(() => error);
        })
      );
  }

  getItineraryById(id: number): Observable<ItineraryResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Fetching itinerary from URL:', url);
    return this.http.get<ItineraryResponseI>(url)
      .pipe(
        catchError((error: unknown) => {
          console.error('Error fetching itinerary:', error);
          console.error('Request URL was:', url);
          return throwError(() => error);
        })
      );
  }

  createItinerary(itinerary: ItineraryI): Observable<ItineraryResponseI> {
    return this.http.post<ItineraryResponseI>(`${this.baseUrl}/`, itinerary)
      .pipe(
        tap(response => {
          console.log('Itinerary created:', response);
          this.refreshItineraries();
        }),
        catchError(error => {
          console.error('Error creating itinerary:', error);
          return throwError(() => error);
        })
      );
  }

  updateItinerary(id: number, itinerary: Partial<ItineraryI>): Observable<ItineraryResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Updating itinerary at URL:', url, 'with data:', itinerary);
    return this.http.put<ItineraryResponseI>(url, itinerary)
      .pipe(
        tap(response => {
          console.log('Itinerary updated:', response);
          this.refreshItineraries();
        }),
        catchError(error => {
          console.error('Error updating itinerary:', error);
          return throwError(() => error);
        })
      );
  }

  deleteItinerary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('Itinerary deleted:', id);
          this.refreshItineraries();
        }),
        catchError(error => {
          console.error('Error deleting itinerary:', error);
          return throwError(() => error);
        })
      );
  }

  refreshItineraries(): void {
    this.getAllItineraries().subscribe({
      next: (itineraries) => {
        this.itinerariesSubject.next(itineraries);
      },
      error: (error) => {
        console.error('Error refreshing itineraries:', error);
      }
    });
  }
}