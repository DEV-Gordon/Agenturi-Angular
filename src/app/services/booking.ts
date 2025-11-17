import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingI, BookingResponseI } from '../models';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://127.0.0.1:8000/api/bookings/';
  private bookingsSubject = new BehaviorSubject<BookingResponseI[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllbookings(): Observable<BookingResponseI[]> {
    return this.http.get<PaginatedResponse<BookingResponseI>>(`${this.baseUrl}/`)
      .pipe(
        map(response => response.results),
        tap(bookings => {
          console.log('Fetched bookings:', bookings);
          this.bookingsSubject.next(bookings);
        }),
        catchError(error => {
          console.error('Error fetching bookings:', error);
          return throwError(() => error);
        })
      );
  }

  getBookingById(id: number): Observable<BookingResponseI> {
    return this.http.get<BookingResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching booking:', error);
          return throwError(() => error);
        })
      );
  }

  createBooking(booking: BookingI): Observable<BookingResponseI> {
    return this.http.post<BookingResponseI>(`${this.baseUrl}/`, booking)
      .pipe(
        tap(response => {
          console.log('booking created:', response);
          this.refreshbookings();
        }),
        catchError(error => {
          console.error('Error creating booking:', error);
          return throwError(() => error);
        })
      );
  }

  updateBooking(id: number, booking: Partial<BookingI>): Observable<BookingResponseI> {
    return this.http.put<BookingResponseI>(`${this.baseUrl}/${id}/`, booking)
      .pipe(
        tap(response => {
          console.log('booking updated:', response);
          this.refreshbookings();
        }),
        catchError(error => {
          console.error('Error updating booking:', error);
          return throwError(() => error);
        })
      );
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('booking deleted:', id);
          this.refreshbookings();
        }),
        catchError(error => {
          console.error('Error deleting booking:', error);
          return throwError(() => error);
        })
      );
  }

  refreshbookings(): void {
    this.getAllbookings().subscribe({
      next: (bookings) => {
        this.bookingsSubject.next(bookings);
      },
      error: (error) => {
        console.error('Error refreshing bookings:', error);
      }
    });
  }
}