import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { BookingI, BookingResponseI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://127.0.0.1:8000/api/bookings';
  private bookingsSubject = new BehaviorSubject<BookingResponseI[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllbookings(): Observable<BookingResponseI[]> {
    return this.http.get<BookingResponseI[]>(this.baseUrl)
      .pipe(
        tap((bookings: BookingResponseI[]) => {
          console.log('Fetched bookings:', bookings);
          this.bookingsSubject.next(bookings);
        }),
        catchError((error: unknown) => {
          console.error('Error fetching bookings:', error);
          return throwError(() => error);
        })
      );
  }

  getBookingById(id: number): Observable<BookingResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Fetching booking from URL:', url);
    return this.http.get<BookingResponseI>(url)
      .pipe(
        catchError((error: unknown) => {
          console.error('Error fetching booking:', error);
          console.error('Request URL was:', url);
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
    const url = `${this.baseUrl}/${id}/`;
    console.log('Updating booking at URL:', url, 'with data:', booking);
    return this.http.put<BookingResponseI>(url, booking)
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