import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { PlanI, PlanResponseI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private baseUrl = 'http://127.0.0.1:8000/api/plans';
  private plansSubject = new BehaviorSubject<PlanResponseI[]>([]);
  public plans$ = this.plansSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllplans(): Observable<PlanResponseI[]> {
    return this.http.get<PlanResponseI[]>(this.baseUrl)
      .pipe(
        tap((plans: PlanResponseI[]) => {
          console.log('Fetched plans:', plans);
          this.plansSubject.next(plans);
        }),
        catchError((error: unknown) => {
          console.error('Error fetching plans:', error);
          return throwError(() => error);
        })
      );
  }

  getPlanById(id: number): Observable<PlanResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Fetching plan from URL:', url);
    return this.http.get<PlanResponseI>(url)
      .pipe(
        catchError((error: unknown) => {
          console.error('Error fetching plan:', error);
          console.error('Request URL was:', url);
          return throwError(() => error);
        })
      );
  }

  refreshplans(): void {
    this.getAllplans().subscribe({
      next: (plans) => {
        this.plansSubject.next(plans);
      },
      error: (error) => {
        console.error('Error refreshing plans:', error);
      }
    });
  }
}

