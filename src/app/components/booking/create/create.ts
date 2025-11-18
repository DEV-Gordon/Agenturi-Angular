import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BookingService } from '../../../services/booking';
import { CustomerService } from '../../../services/customer';
import { PlanService } from '../../../services/plan';
import { BookingI } from '../../../models/booking';
import { CustomerResponseI } from '../../../models/customer';
import { PlanResponseI } from '../../../models/plan';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Button,
    Toast,
    Select,
    DatePicker
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create implements OnInit, OnDestroy {
  bookingForm!: FormGroup;
  loading = false;
  customers: CustomerResponseI[] = [];
  plans: PlanResponseI[] = [];
  statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'Pagada', value: 'paid' },
    { label: 'Cancelada', value: 'canceled' }
  ];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private planService: PlanService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    this.loadPlans();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      booking_date: ['', [Validators.required]],
      status: ['pending', [Validators.required]],
      customer: [null, [Validators.required]],
      plan: [null, [Validators.required]]
    });
  }

  loadCustomers(): void {
    this.subscription.add(
      this.customerService.getAllcustomers().subscribe({
        next: (customers: CustomerResponseI[]) => {
          this.customers = customers;
        },
        error: (error: unknown) => {
          console.error('Error loading customers:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los clientes'
          });
        }
      })
    );
  }

  loadPlans(): void {
    this.subscription.add(
      this.planService.getAllplans().subscribe({
        next: (plans: PlanResponseI[]) => {
          this.plans = plans;
        },
        error: (error: unknown) => {
          console.error('Error loading plans:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los planes'
          });
        }
      })
    );
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      const formValue = this.bookingForm.value;
      
      // Extract customer ID
      let customerId: number | undefined;
      if (formValue.customer === null || formValue.customer === undefined) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor seleccione un cliente.'
        });
        return;
      }
      
      if (typeof formValue.customer === 'object') {
        customerId = (formValue.customer as any)?.id;
      } else if (typeof formValue.customer === 'number') {
        customerId = formValue.customer;
      } else {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cliente inválido. Por favor seleccione un cliente.'
        });
        return;
      }
      
      // Extract plan ID
      let planId: number | undefined;
      if (formValue.plan === null || formValue.plan === undefined) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Por favor seleccione un plan.'
        });
        return;
      }
      
      if (typeof formValue.plan === 'object') {
        planId = (formValue.plan as any)?.id;
      } else if (typeof formValue.plan === 'number') {
        planId = formValue.plan;
      } else {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Plan inválido. Por favor seleccione un plan.'
        });
        return;
      }
      
      if (customerId === undefined || customerId === null || isNaN(customerId)) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'ID de cliente inválido. Por favor seleccione un cliente válido.'
        });
        return;
      }
      
      if (planId === undefined || planId === null || isNaN(planId)) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'ID de plan inválido. Por favor seleccione un plan válido.'
        });
        return;
      }
      
      // Django REST Framework typically expects customer_id and plan_id for ForeignKey fields
      const bookingData: any = {
        booking_date: this.formatDateForAPI(formValue.booking_date),
        status: formValue.status,
        customer_id: Number(customerId),
        plan_id: Number(planId)
      };
      
      console.log('=== DEBUG CREATE BOOKING ===');
      console.log('Form value:', formValue);
      console.log('Form value customer:', formValue.customer);
      console.log('Form value customer type:', typeof formValue.customer);
      console.log('Form value plan:', formValue.plan);
      console.log('Form value plan type:', typeof formValue.plan);
      console.log('Extracted customerId:', customerId);
      console.log('Extracted planId:', planId);
      console.log('Booking data to send:', bookingData);
      console.log('Booking data JSON:', JSON.stringify(bookingData));
      console.log('================================');

      this.subscription.add(
        this.bookingService.createBooking(bookingData).subscribe({
          next: (response: unknown) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Reserva creada correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/bookings']);
            }, 1500);
          },
          error: (error: unknown) => {
            console.error('Error creating booking:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la reserva'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.bookingForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor, complete todos los campos requeridos correctamente'
      });
    }
  }

  formatDateForAPI(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/bookings']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }

  getCustomerLabel(customer: CustomerResponseI): string {
    return `${customer.first_name} ${customer.last_name}`;
  }

  getPlanLabel(plan: PlanResponseI): string {
    return plan.name;
  }
}
