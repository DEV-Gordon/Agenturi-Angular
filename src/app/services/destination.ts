import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationI, DestinationResponseI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private baseUrl = 'http://127.0.0.1:8000/api/destinations';
  private destinationsSubject = new BehaviorSubject<DestinationResponseI[]>([]);
  public destinations$ = this.destinationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAlldestinations(): Observable<DestinationResponseI[]> {
    return this.http.get<DestinationResponseI[]>(this.baseUrl)
      .pipe(
        tap((destinations: DestinationResponseI[]) => {
          console.log('Fetched destinations:', destinations);
          this.destinationsSubject.next(destinations);
        }),
        catchError((error: unknown) => {
          console.error('Error fetching destinations:', error);
          return throwError(() => error);
        })
      );
  }

  getDestinationById(id: number): Observable<DestinationResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Fetching destination from URL:', url);
    return this.http.get<DestinationResponseI>(url)
      .pipe(
        catchError((error: unknown) => {
          console.error('Error fetching destination:', error);
          console.error('Request URL was:', url);
          return throwError(() => error);
        })
      );
  }

  createDestination(destination: DestinationI): Observable<DestinationResponseI> {
    return this.http.post<DestinationResponseI>(`${this.baseUrl}/`, destination)
      .pipe(
        tap(response => {
          console.log('Destination created:', response);
          this.refreshDestinations();
        }),
        catchError(error => {
          console.error('Error creating destination:', error);
          return throwError(() => error);
        })
      );
  }

  updateDestination(id: number, destination: Partial<DestinationI>): Observable<DestinationResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Updating destination at URL:', url, 'with data:', destination);
    return this.http.put<DestinationResponseI>(url, destination)
      .pipe(
        tap(response => {
          console.log('Destination updated:', response);
          this.refreshDestinations();
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
          console.log('Destination deleted:', id);
          this.refreshDestinations();
        }),
        catchError(error => {
          console.error('Error deleting destination:', error);
          return throwError(() => error);
        })
      );
  }

  refreshDestinations(): void {
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