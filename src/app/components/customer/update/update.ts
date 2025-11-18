import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../../services/customer';
import { CustomerI, CustomerResponseI } from '../../../models/customer';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Button,
    InputText,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class Update implements OnInit, OnDestroy {
  customerForm!: FormGroup;
  customer: CustomerResponseI | null = null;
  loading = false;
  loadingData: boolean = true;
  customerId: number = 0;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customerId = Number(id);
      this.loadCustomer(this.customerId);
    } else {
      this.router.navigate(['/customers']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  loadCustomer(id: number): void {
    this.loadingData = true;
    console.log('Loading customer with ID:', id);
    
    this.subscription.add(
      this.customerService.getcustomerById(id).subscribe({
        next: (customer) => {
          console.log('Customer loaded successfully:', customer);
          this.customer = customer;
          this.populateForm(customer);
          this.loadingData = false;
        },
        error: (error) => {
          console.error('Error loading customer:', error);
          console.error('Error details:', {
            status: error?.status,
            statusText: error?.statusText,
            message: error?.message,
            url: error?.url
          });
          this.loadingData = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo cargar el cliente con ID ${id}. Revisa que exista en la base de datos.`
          });
        }
      })
    );
  }

  populateForm(customer: CustomerResponseI): void {
    this.customerForm.patchValue({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone || ''
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.loading = true;
      const customerData: Partial<CustomerI> = this.customerForm.value;

      this.subscription.add(
        this.customerService.updatecustomer(this.customerId, customerData).subscribe({
          next: (response) => {
            console.log('Customer updated:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cliente actualizado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/customers']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating customer:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el cliente'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.customerForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor, complete todos los campos requeridos correctamente'
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}