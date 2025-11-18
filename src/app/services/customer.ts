// plantilla

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerI, CustomerResponseI } from '../models';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://127.0.0.1:8000/api/customers';
  private customersSubject = new BehaviorSubject<CustomerResponseI[]>([]);
  public customers$ = this.customersSubject.asObservable();

  constructor(private http: HttpClient) {}
/*
  getAllcustomers(): Observable<CustomerResponseI[]> {
    return this.http.get<PaginatedResponse<CustomerResponseI>>(this.baseUrl)
      .pipe(
        map(response => response.results),
        tap(customers => {
          console.log('Fetched models:', customers);
          this.customersSubject.next(customers);
        }),
        catchError(error => {
          console.error('Error fetching models:', error);
          return throwError(() => error);
        })
      );
  }*/

  getAllcustomers(): Observable<CustomerResponseI[]> {
    return this.http.get<CustomerResponseI[]>(this.baseUrl)
      .pipe(
        tap((customers: CustomerResponseI[]) => {
          console.log('Fetched models:', customers);
          this.customersSubject.next(customers);
        }),
        catchError((error: unknown) => {
          console.error('Error fetching models:', error);
          return throwError(() => error);
        })
      );
  }

  getcustomerById(id: number): Observable<CustomerResponseI> {
    const url = `${this.baseUrl}/${id}/`;
    console.log('Fetching customer from URL:', url);
    return this.http.get<CustomerResponseI>(url)
      .pipe(
        catchError((error: unknown) => {
          console.error('Error fetching model:', error);
          console.error('Request URL was:', url);
          return throwError(() => error);
        }) 
      ); 
  }

  createcustomer(customer: CustomerI): Observable<CustomerResponseI> {
    return this.http.post<CustomerResponseI>(`${this.baseUrl}/`, customer)
      .pipe(
        tap(response => {
          console.log('customer created:', response);
          this.refreshcustomers();
        }),
        catchError(error => {
          console.error('Error creating model:', error);
          return throwError(() => error);
        })
      );
  }

  updatecustomer(id: number, customer: Partial<CustomerI>): Observable<CustomerResponseI> {
    const url = `${this.baseUrl}/${id}`;
    console.log('Updating customer at URL:', url, 'with data:', customer);
    return this.http.put<CustomerResponseI>(url, customer)
      .pipe(
        tap(response => {
          console.log('customer updated:', response);
          this.refreshcustomers();
        }),
        catchError(error => {
          console.error('Error updating model:', error);
          return throwError(() => error);
        })
      );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          console.log('customer deleted:', id);
          this.refreshcustomers();
        }),
        catchError(error => {
          console.error('Error deleting model:', error);
          return throwError(() => error);
        })
      );
  }

  refreshcustomers(): void {
    this.getAllcustomers().subscribe({
      next: (customers) => {
        this.customersSubject.next(customers);
      },
      error: (error) => {
        console.error('Error refreshing models:', error);
      }
    });
  }
}