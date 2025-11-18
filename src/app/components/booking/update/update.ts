import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { BookingI, BookingResponseI } from '../../../models/booking';
import { CustomerResponseI } from '../../../models/customer';
import { PlanResponseI } from '../../../models/plan';

@Component({
  selector: 'app-booking-update',
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
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class Update implements OnInit, OnDestroy {
  bookingForm!: FormGroup;
  booking: BookingResponseI | null = null;
  loading = false;
  loadingData: boolean = true;
  bookingId: number = 0;
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
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private planService: PlanService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    this.loadPlans();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookingId = Number(id);
      this.loadBooking(this.bookingId);
    } else {
      this.router.navigate(['/bookings']);
    }
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

  loadBooking(id: number): void {
    this.loadingData = true;
    console.log('Loading booking with ID:', id);
    
    this.subscription.add(
      this.bookingService.getBookingById(id).subscribe({
        next: (booking: BookingResponseI) => {
          console.log('Booking loaded successfully:', booking);
          this.booking = booking;
          // Wait a bit to ensure customers and plans are loaded
          setTimeout(() => {
            this.populateForm(booking);
            this.loadingData = false;
          }, 100);
        },
        error: (error: unknown) => {
          console.error('Error loading booking:', error);
          console.error('Error details:', {
            status: (error as any)?.status,
            statusText: (error as any)?.statusText,
            message: (error as any)?.message,
            url: (error as any)?.url
          });
          this.loadingData = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo cargar la reserva con ID ${id}. Revisa que exista en la base de datos.`
          });
        }
      })
    );
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

  populateForm(booking: BookingResponseI): void {
    // Parse the booking_date string to Date object
    const bookingDate = booking.booking_date ? new Date(booking.booking_date) : null;
    
    // Find the customer object from the customers array
    let customer = null;
    if (booking.customer?.id) {
      customer = this.customers.find(c => c.id === booking.customer.id);
      // If customer not found in array, create a minimal object from booking data
      if (!customer && booking.customer) {
        customer = {
          id: booking.customer.id,
          first_name: booking.customer.first_name,
          last_name: booking.customer.last_name,
          email: '',
          phone: ''
        };
      }
    }
    
    // Find the plan object from the plans array
    let plan = null;
    if (booking.plan?.id) {
      plan = this.plans.find(p => p.id === booking.plan.id);
      // If plan not found in array, create a minimal object from booking data
      if (!plan && booking.plan) {
        plan = {
          id: booking.plan.id,
          name: booking.plan.name,
          base_price: 0,
          destination: { id: 0, name: '' }
        };
      }
    }

    this.bookingForm.patchValue({
      booking_date: bookingDate,
      status: booking.status || 'pending',
      customer: customer,
      plan: plan
    });
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
      
      console.log('Form value:', formValue);
      console.log('Booking data to send:', bookingData);

      this.subscription.add(
        this.bookingService.updateBooking(this.bookingId, bookingData).subscribe({
          next: (response: unknown) => {
            console.log('Booking updated:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Reserva actualizada correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/bookings']);
            }, 1500);
          },
          error: (error: unknown) => {
            console.error('Error updating booking:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar la reserva'
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
}
