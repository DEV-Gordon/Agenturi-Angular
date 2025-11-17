import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transport } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private apiUrl = 'http://localhost:8000/api/transports';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.apiUrl}/`);
  }

  getById(id: number): Observable<Transport> {
    return this.http.get<Transport>(`${this.apiUrl}/${id}/`);
  }

  create(transport: Transport): Observable<Transport> {
    return this.http.post<Transport>(`${this.apiUrl}/`, transport);
  }

  update(id: number, transport: Transport): Observable<Transport> {
    return this.http.put<Transport>(`${this.apiUrl}/${id}/`, transport);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}