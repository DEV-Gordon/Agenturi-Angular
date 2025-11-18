
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationI, DestinationResponseI } from '../models';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private baseUrl = 'http://127.0.0.1:8000/api/destinations/';
  private destinationsSubject = new BehaviorSubject<DestinationResponseI[]>([]);
  public destinations$ = this.destinationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAlldestinations(): Observable<DestinationResponseI[]> {
    return this.http.get<any>(`${this.baseUrl}`)
      .pipe(
        map(response =>
          Array.isArray(response)
            ? response     // ✔ Tu caso: viene como array directo
            : response.results ?? []  // ✔ por si luego activas paginación
        ),
        tap(destinations => {
          console.log('Fetched destinations:', destinations);
          this.destinationsSubject.next(destinations);
        }),
        catchError(error => {
          console.error('Error fetching destinations:', error);
          return throwError(() => error);
        })
      );
  }

  getdestinationById(id: number): Observable<DestinationResponseI> {
    return this.http.get<DestinationResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching destination:', error);
          return throwError(() => error);
        })
      );
  }

  createDestination(destination: DestinationI): Observable<DestinationResponseI> {
    return this.http.post<DestinationResponseI>(`${this.baseUrl}/`, destination)
      .pipe(
        tap(response => {
          console.log('destination created:', response);
          this.refreshdestinations();
        }),
        catchError(error => {
          console.error('Error creating destination:', error);
          return throwError(() => error);
        })
      );
  }

  updateDestination(id: number, destination: Partial<DestinationI>): Observable<DestinationResponseI> {
    return this.http.put<DestinationResponseI>(`${this.baseUrl}/${id}/`, destination)
      .pipe(
        tap(response => {
          console.log('destination updated:', response);
          this.refreshdestinations();
        }),
        catchError(error => {
          console.error('Error updating destination:', error);
          return throwError(() => error);
        })
      );
  }

  deleteDestination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('destination deleted:', id);
          this.refreshdestinations();
        }),
        catchError(error => {
          console.error('Error deleting destination:', error);
          return throwError(() => error);
        })
      );
  }

  refreshdestinations(): void {
    this.getAlldestinations().subscribe({
      next: (destinations) => {
        this.destinationsSubject.next(destinations);
      },
      error: (error) => {
        console.error('Error refreshing destinations:', error);
      }
    });
  }
}