import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = 'http://localhost:8000/api/destinations';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/${id}/`);
  }

  create(destination: Destination): Observable<Destination> {
    return this.http.post<Destination>(`${this.apiUrl}/`, destination);
  }

  update(id: number, destination: Destination): Observable<Destination> {
    return this.http.put<Destination>(`${this.apiUrl}/${id}/`, destination);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}