import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { ItineraryI } from '../../../models/itinerary';

@Component({
  selector: 'app-itinerary-create',
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
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create implements OnInit, OnDestroy {
  itineraryForm!: FormGroup;
  loading = false;
  plans: any[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private itineraryService: ItineraryService,
    private planService: PlanService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlans();
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
    if (this.itineraryForm.valid) {
      this.loading = true;
      const itineraryData: ItineraryI = this.itineraryForm.value;

      this.subscription.add(
        this.itineraryService.createItinerary(itineraryData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Itinerario creado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/itineraries']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error creating itinerary:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el itinerario'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.itineraryForm);
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