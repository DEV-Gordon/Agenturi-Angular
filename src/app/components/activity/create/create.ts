import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivityService } from '../../../services/activity';
import { ActivityI } from '../../../models/activity';

@Component({
  selector: 'app-activity-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Textarea,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create implements OnInit, OnDestroy {
  activityForm!: FormGroup;
  loading = false;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
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
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      extra_cost: [0, [Validators.required, Validators.min(0)]],
      itinerary: [null, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      this.loading = true;
      const activityData: ActivityI = this.activityForm.value;

      this.subscription.add(
        this.activityService.createActivity(activityData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Actividad creada correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/activities']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error creating activity:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la actividad'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.activityForm);
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
    this.router.navigate(['/activities']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.activityForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.activityForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return 'El valor debe ser mayor o igual a 0';
    }
    return '';
  }
}