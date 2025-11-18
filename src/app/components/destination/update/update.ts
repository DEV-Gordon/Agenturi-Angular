import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DestinationService } from '../../../services/destination';
import { DestinationI, DestinationResponseI } from '../../../models/destination';

@Component({
  selector: 'app-destination-update',
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
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class Update implements OnInit, OnDestroy {
  destinationForm!: FormGroup;
  destination: DestinationResponseI | null = null;
  loading = false;
  loadingData: boolean = true;
  destinationId: number = 0;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private destinationService: DestinationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.destinationId = Number(id);
      this.loadDestination(this.destinationId);
    } else {
      this.router.navigate(['/destinations']);
    }
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

  loadDestination(id: number): void {
    this.loadingData = true;
    console.log('Loading destination with ID:', id);
    
    this.subscription.add(
      this.destinationService.getDestinationById(id).subscribe({
        next: (destination) => {
          console.log('Destination loaded successfully:', destination);
          this.destination = destination;
          this.populateForm(destination);
          this.loadingData = false;
        },
        error: (error) => {
          console.error('Error loading destination:', error);
          this.loadingData = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo cargar el destino con ID ${id}`
          });
        }
      })
    );
  }

  populateForm(destination: DestinationResponseI): void {
    this.destinationForm.patchValue({
      name: destination.name,
      city: destination.city || '',
      country: destination.country || ''
    });
  }

  onSubmit(): void {
    if (this.destinationForm.valid) {
      this.loading = true;
      const destinationData: Partial<DestinationI> = this.destinationForm.value;

      this.subscription.add(
        this.destinationService.updateDestination(this.destinationId, destinationData).subscribe({
          next: (response) => {
            console.log('Destination updated:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Destino actualizado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/destinations']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating destination:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el destino'
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