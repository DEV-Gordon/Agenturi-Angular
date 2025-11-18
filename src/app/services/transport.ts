import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { TransportI, TransportResponseI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class transportservice {
  private baseUrl = 'http://127.0.0.1:8000/api/transports';
  private transportsSubject = new BehaviorSubject<TransportResponseI[]>([]);
  public transports$ = this.transportsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAlltransports(): Observable<TransportResponseI[]> {
    return this.http.get<TransportResponseI[]>(this.baseUrl)
      .pipe(
        tap((transports: TransportResponseI[]) => {
          console.log('Fetched transports:', transports);
          this.transportsSubject.next(transports);
        }),
        catchError((error: unknown) => {
          console.error('Error fetching transports:', error);
          return throwError(() => error);
        })
      );
  }

  getTransportyId(id: number): Observable<TransportResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Fetching transport from URL:', url);
    return this.http.get<TransportResponseI>(url)
      .pipe(
        catchError((error: unknown) => {
          console.error('Error fetching transport:', error);
          console.error('Request URL was:', url);
          return throwError(() => error);
        })
      );
  }

createTransport(transport: TransportI): Observable<TransportResponseI> {
    return this.http.post<TransportResponseI>(`${this.baseUrl}/`, transport)
      .pipe(
        tap(response => {
          console.log('transport created:', response);
          this.refreshtransports();
        }),
        catchError(error => {
          console.error('Error creating model:', error);
          return throwError(() => error);
        })
      );
  }

  updateTransport(id: number, transport: Partial<TransportI>): Observable<TransportResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Updating transport at URL:', url, 'with data:', transport);
    return this.http.put<TransportResponseI>(url, transport)
      .pipe(
        tap(response => {
          console.log('transport updated:', response);
          this.refreshtransports();
        }),
        catchError(error => {
          console.error('Error updating model:', error);
          return throwError(() => error);
        })
      );
  }

  deletetransport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('transport deleted:', id);
          this.refreshtransports();
        }),
        catchError(error => {
          console.error('Error deleting model:', error);
          return throwError(() => error);
        })
      );
  }

  refreshtransports(): void {
    this.getAlltransports().subscribe({
      next: (transports) => {
        this.transportsSubject.next(transports);
      },
      error: (error) => {
        console.error('Error refreshing transports:', error);
      }
    });
  }
}

