import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://localhost:8000/api/plans';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/${id}/`);
  }

  create(plan: Plan): Observable<Plan> {
    return this.http.post<Plan>(`${this.apiUrl}/`, plan);
  }

  update(id: number, plan: Plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.apiUrl}/${id}/`, plan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}