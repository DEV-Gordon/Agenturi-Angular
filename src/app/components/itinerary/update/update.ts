import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ItineraryService } from '../../../services/itinerary';
import { PlanService } from '../../../services/plan';
import { ItineraryI, ItineraryResponseI } from '../../../models/itinerary';

@Component({
  selector: 'app-itinerary-update',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Textarea,
    Select,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class Update implements OnInit, OnDestroy {
  itineraryForm!: FormGroup;
  itinerary: ItineraryResponseI | null = null;
  loading = false;
  loadingData = true;
  itineraryId: number = 0;
  plans: any[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itineraryService: ItineraryService,
    private planService: PlanService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlans();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.itineraryId = Number(id);
      this.loadItinerary(this.itineraryId);
    } else {
      this.router.navigate(['/itineraries']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.itineraryForm = this.fb.group({
      day: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      plan: [null, [Validators.required]]
    });
  }

  loadPlans(): void {
    this.subscription.add(
      this.planService.getAllplans().subscribe({
        next: (plans) => {
          this.plans = plans;
        },
        error: (error) => {
          console.error('Error loading plans:', error);
        }
      })
    );
  }

  loadItinerary(id: number): void {
    this.subscription.add(
      this.itineraryService.getItineraryById(id).subscribe({
        next: (itinerary) => {
          this.itinerary = itinerary;
          this.populateForm(itinerary);
          this.loadingData = false;
        },
        error: (error) => {
          console.error('Error loading itinerary:', error);
          this.loadingData = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el itinerario'
          });
        }
      })
    );
  }

  populateForm(itinerary: ItineraryResponseI): void {
    this.itineraryForm.patchValue({
      day: itinerary.day,
      description: itinerary.description || '',
      plan: itinerary.plan?.id || null
    });
  }

  onSubmit(): void {
    if (this.itineraryForm.valid) {
      this.loading = true;
      const itineraryData: Partial<ItineraryI> = this.itineraryForm.value;

      this.subscription.add(
        this.itineraryService.updateItinerary(this.itineraryId, itineraryData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Itinerario actualizado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/itineraries']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating itinerary:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el itinerario'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.itineraryForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/itineraries']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.itineraryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.itineraryForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('min')) {
      return 'El día debe ser mayor o igual a 1';
    }
    return '';
  }
}