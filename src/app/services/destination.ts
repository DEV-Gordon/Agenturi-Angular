// src/app/services/[modelo].service.ts

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
export class ModeloService {
  private baseUrl = 'http://localhost:8000/api/modelos';
  private modelosSubject = new BehaviorSubject<DestinationResponseI[]>([]);
  public modelos$ = this.modelosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllModelos(): Observable<DestinationResponseI[]> {
    return this.http.get<PaginatedResponse<DestinationResponseI>>(`${this.baseUrl}/`)
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

  getModeloById(id: number): Observable<DestinationResponseI> {
    return this.http.get<DestinationResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching modelo:', error);
          return throwError(() => error);
        })
      );
  }

  createModelo(modelo: DestinationI): Observable<DestinationResponseI> {
    return this.http.post<DestinationResponseI>(`${this.baseUrl}/`, modelo)
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

  updateModelo(id: number, modelo: Partial<DestinationI>): Observable<DestinationResponseI> {
    return this.http.put<DestinationResponseI>(`${this.baseUrl}/${id}/`, modelo)
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