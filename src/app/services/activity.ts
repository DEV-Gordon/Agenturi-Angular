
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityI, ActivityResponseI } from '../models';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private baseUrl = 'http://localhost:8000/api/modelos';
  private modelosSubject = new BehaviorSubject<ActivityResponseI[]>([]);
  public modelos$ = this.modelosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllModelos(): Observable<ActivityResponseI[]> {
    return this.http.get<PaginatedResponse<ActivityResponseI>>(`${this.baseUrl}/`)
      .pipe(
        map(response => response.results),
        tap(modelos => {
          console.log('Fetched modelos:', modelos);
          this.modelosSubject.next(modelos);
        }),
        catchError(error => {
          console.error('Error fetching modelos:', error);
          return throwError(() => error);
        })
      );
  }

  getModeloById(id: number): Observable<ActivityResponseI> {
    return this.http.get<ActivityResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching modelo:', error);
          return throwError(() => error);
        })
      );
  }

  createModelo(modelo: ActivityI): Observable<ActivityResponseI> {
    return this.http.post<ActivityResponseI>(`${this.baseUrl}/`, modelo)
      .pipe(
        tap(response => {
          console.log('Modelo created:', response);
          this.refreshModelos();
        }),
        catchError(error => {
          console.error('Error creating modelo:', error);
          return throwError(() => error);
        })
      );
  }

  updateModelo(id: number, modelo: Partial<ActivityI>): Observable<ActivityResponseI> {
    return this.http.put<ActivityResponseI>(`${this.baseUrl}/${id}/`, modelo)
      .pipe(
        tap(response => {
          console.log('Modelo updated:', response);
          this.refreshModelos();
        }),
        catchError(error => {
          console.error('Error updating modelo:', error);
          return throwError(() => error);
        })
      );
  }

  deleteModelo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('Modelo deleted:', id);
          this.refreshModelos();
        }),
        catchError(error => {
          console.error('Error deleting modelo:', error);
          return throwError(() => error);
        })
      );
  }

  refreshModelos(): void {
    this.getAllModelos().subscribe({
      next: (modelos) => {
        this.modelosSubject.next(modelos);
      },
      error: (error) => {
        console.error('Error refreshing modelos:', error);
      }
    });
  }
}