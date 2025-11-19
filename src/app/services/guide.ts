import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { GuideI, GuideResponseI } from '../models/guide';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private baseUrl = 'http://127.0.0.1:8000/api/guides';
  private guidesSubject = new BehaviorSubject<GuideResponseI[]>([]);
  public guides$ = this.guidesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllGuides(): Observable<GuideResponseI[]> {
    return this.http.get<GuideResponseI[]>(this.baseUrl)
      .pipe(
        tap((guides: GuideResponseI[]) => {
          console.log('Fetched guides:', guides);
          this.guidesSubject.next(guides);
        }),
        catchError((error: unknown) => {
          console.error('Error fetching guides:', error);
          return throwError(() => error);
        })
      );
  }

  getGuideById(id: number): Observable<GuideResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Fetching guide from URL:', url);
    return this.http.get<GuideResponseI>(url)
      .pipe(
        catchError((error: unknown) => {
          console.error('Error fetching guide:', error);
          console.error('Request URL was:', url);
          return throwError(() => error);
        })
      );
  }

  createGuide(guide: GuideI): Observable<GuideResponseI> {
    return this.http.post<GuideResponseI>(`${this.baseUrl}/`, guide)
      .pipe(
        tap(response => {
          console.log('Guide created:', response);
          this.refreshGuides();
        }),
        catchError(error => {
          console.error('Error creating guide:', error);
          return throwError(() => error);
        })
      );
  }

  updateGuide(id: number, guide: Partial<GuideI>): Observable<GuideResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Updating guide at URL:', url, 'with data:', guide);
    return this.http.put<GuideResponseI>(url, guide)
      .pipe(
        tap(response => {
          console.log('Guide updated:', response);
          this.refreshGuides();
        }),
        catchError(error => {
          console.error('Error updating guide:', error);
          return throwError(() => error);
        })
      );
  }

  deleteGuide(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('Guide deleted:', id);
          this.refreshGuides();
        }),
        catchError(error => {
          console.error('Error deleting guide:', error);
          return throwError(() => error);
        })
      );
  }

  refreshGuides(): void {
    this.getAllGuides().subscribe({
      next: (guides) => {
        this.guidesSubject.next(guides);
      },
      error: (error) => {
        console.error('Error refreshing guides:', error);
      }
    });
  }
}