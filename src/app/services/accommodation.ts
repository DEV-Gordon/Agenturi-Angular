// src/app/services/[accommodation].service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccommodationI, AccommodationResponseI } from '../models';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private baseUrl = 'http://127.0.0.1:8000/api/accommodations/';
  private accommodationsSubject = new BehaviorSubject<AccommodationResponseI[]>([]);
  public accommodations$ = this.accommodationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllaccommodations(): Observable<AccommodationResponseI[]> {
    return this.http.get<PaginatedResponse<AccommodationResponseI>>(`${this.baseUrl}/`)
      .pipe(
        map(response => response.results),
        tap(accommodations => {
          console.log('Fetched accommodations:', accommodations);
          this.accommodationsSubject.next(accommodations);
        }),
        catchError(error => {
          console.error('Error fetching accommodations:', error);
          return throwError(() => error);
        })
      );
  }

  getaccommodationById(id: number): Observable<AccommodationResponseI> {
    return this.http.get<AccommodationResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching accommodation:', error);
          return throwError(() => error);
        })
      );
  }

  createaccommodation(accommodation: AccommodationI): Observable<AccommodationResponseI> {
    return this.http.post<AccommodationResponseI>(`${this.baseUrl}/`, accommodation)
      .pipe(
        tap(response => {
          console.log('accommodation created:', response);
          this.refreshaccommodations();
        }),
        catchError(error => {
          console.error('Error creating accommodation:', error);
          return throwError(() => error);
        })
      );
  }

  updateaccommodation(id: number, accommodation: Partial<AccommodationI>): Observable<AccommodationResponseI> {
    return this.http.put<AccommodationResponseI>(`${this.baseUrl}/${id}/`, accommodation)
      .pipe(
        tap(response => {
          console.log('accommodation updated:', response);
          this.refreshaccommodations();
        }),
        catchError(error => {
          console.error('Error updating accommodation:', error);
          return throwError(() => error);
        })
      );
  }

  deleteaccommodation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('accommodation deleted:', id);
          this.refreshaccommodations();
        }),
        catchError(error => {
          console.error('Error deleting accommodation:', error);
          return throwError(() => error);
        })
      );
  }

  refreshaccommodations(): void {
    this.getAllaccommodations().subscribe({
      next: (accommodations) => {
        this.accommodationsSubject.next(accommodations);
      },
      error: (error) => {
        console.error('Error refreshing accommodations:', error);
      }
    });
  }
}