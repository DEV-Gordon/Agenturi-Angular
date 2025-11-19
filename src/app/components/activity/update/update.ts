import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivityService } from '../../../services/activity';
import { ActivityI, ActivityResponseI } from '../../../models/activity';

@Component({
  selector: 'app-activity-update',
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
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class Update implements OnInit, OnDestroy {
  activityForm!: FormGroup;
  activity: ActivityResponseI | null = null;
  loading = false;
  loadingData = true;
  activityId: number = 0;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.activityId = Number(id);
      this.loadActivity(this.activityId);
    } else {
      this.router.navigate(['/activities']);
    }
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

  loadActivity(id: number): void {
    this.subscription.add(
      this.activityService.getActivityById(id).subscribe({
        next: (activity) => {
          this.activity = activity;
          this.populateForm(activity);
          this.loadingData = false;
        },
        error: (error) => {
          console.error('Error loading activity:', error);
          this.loadingData = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la actividad'
          });
        }
      })
    );
  }

  populateForm(activity: ActivityResponseI): void {
    this.activityForm.patchValue({
      name: activity.name,
      description: activity.description || '',
      extra_cost: activity.extra_cost,
      itinerary: activity.itinerary?.id || null
    });
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      this.loading = true;
      const activityData: Partial<ActivityI> = this.activityForm.value;

      this.subscription.add(
        this.activityService.updateActivity(this.activityId, activityData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Actividad actualizada correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/activities']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating activity:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar la actividad'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.activityForm);
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