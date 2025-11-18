import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DestinationService } from '../../../services/destination';
import { DestinationI } from '../../../models/destination';

@Component({
  selector: 'app-destination-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create implements OnInit, OnDestroy {
  destinationForm!: FormGroup;
  loading = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private destinationService: DestinationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.destinationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      city: [''],
      country: ['']
    });
  }

  onSubmit(): void {
    if (this.destinationForm.valid) {
      this.loading = true;
      const destinationData: DestinationI = this.destinationForm.value;

      this.subscription.add(
        this.destinationService.createDestination(destinationData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Destino creado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/destinations']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error creating destination:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el destino'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.destinationForm);
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
    this.router.navigate(['/destinations']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.destinationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.destinationForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}