
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
export class ActivityService {
  private baseUrl = 'http://127.0.0.1:8000/api/activities';
  private activitiesSubject = new BehaviorSubject<ActivityResponseI[]>([]);
  public activities$ = this.activitiesSubject.asObservable();

  constructor(private http: HttpClient) {}

getAllactivities(): Observable<ActivityResponseI[]> {
  return this.http.get<ActivityResponseI[]>(this.baseUrl)
    .pipe(
      tap(activities => {
        console.log('Fetched activities:', activities);
        this.activitiesSubject.next(activities);
      }),
      catchError(error => {
        console.error('Error fetching activities:', error);
        return throwError(() => error);
      })
    );
}


  getActivityById(id: number): Observable<ActivityResponseI> {
    return this.http.get<ActivityResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(error => {
          console.error('Error fetching activity:', error);
          return throwError(() => error);
        })
      );
  }

  createActivity(activity: ActivityI): Observable<ActivityResponseI> {
    return this.http.post<ActivityResponseI>(`${this.baseUrl}/`, activity)
      .pipe(
        tap(response => {
          console.log('activity created:', response);
          this.refreshactivities();
        }),
        catchError(error => {
          console.error('Error creating activity:', error);
          return throwError(() => error);
        })
      );
  }

  updateActivity(id: number, activity: Partial<ActivityI>): Observable<ActivityResponseI> {
    return this.http.put<ActivityResponseI>(`${this.baseUrl}/${id}/`, activity)
      .pipe(
        tap(response => {
          console.log('activity updated:', response);
          this.refreshactivities();
        }),
        catchError(error => {
          console.error('Error updating activity:', error);
          return throwError(() => error);
        })
      );
  }

  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('activity deleted:', id);
          this.refreshactivities();
        }),
        catchError(error => {
          console.error('Error deleting activity:', error);
          return throwError(() => error);
        })
      );
  }

  refreshactivities(): void {
    this.getAllactivities().subscribe({
      next: (activities) => {
        this.activitiesSubject.next(activities);
      },
      error: (error) => {
        console.error('Error refreshing activities:', error);
      }
    });
  }
}