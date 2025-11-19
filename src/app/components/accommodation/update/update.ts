import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AccommodationService } from '../../../services/accommodation';
import { DestinationService } from '../../../services/destination';
import { AccommodationI, AccommodationResponseI } from '../../../models/accommodation';

@Component({
  selector: 'app-accommodation-update',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Select,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrl: './update.css'
})
export class Update implements OnInit, OnDestroy {
  accommodationForm!: FormGroup;
  accommodation: AccommodationResponseI | null = null;
  loading = false;
  loadingData = true;
  accommodationId: number = 0;
  destinations: any[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accommodationService: AccommodationService,
    private destinationService: DestinationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDestinations();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accommodationId = Number(id);
      this.loadAccommodation(this.accommodationId);
    } else {
      this.router.navigate(['/accommodations']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.accommodationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: [''],
      address: [''],
      destination: [null, [Validators.required]]
    });
  }

  loadDestinations(): void {
    this.subscription.add(
      this.destinationService.getAlldestinations().subscribe({
        next: (destinations) => {
          this.destinations = destinations;
        },
        error: (error) => {
          console.error('Error loading destinations:', error);
        }
      })
    );
  }

  loadAccommodation(id: number): void {
    this.subscription.add(
      this.accommodationService.getaccommodationById(id).subscribe({
        next: (accommodation) => {
          this.accommodation = accommodation;
          this.populateForm(accommodation);
          this.loadingData = false;
        },
        error: (error) => {
          console.error('Error loading accommodation:', error);
          this.loadingData = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el alojamiento'
          });
        }
      })
    );
  }

  populateForm(accommodation: AccommodationResponseI): void {
    this.accommodationForm.patchValue({
      name: accommodation.name,
      type: accommodation.type || '',
      address: accommodation.address || '',
      destination: accommodation.destination?.id || null
    });
  }

  onSubmit(): void {
    if (this.accommodationForm.valid) {
      this.loading = true;
      const accommodationData: Partial<AccommodationI> = this.accommodationForm.value;

      this.subscription.add(
        this.accommodationService.updateaccommodation(this.accommodationId, accommodationData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Alojamiento actualizado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/accommodations']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating accommodation:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el alojamiento'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.accommodationForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/accommodations']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.accommodationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.accommodationForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}