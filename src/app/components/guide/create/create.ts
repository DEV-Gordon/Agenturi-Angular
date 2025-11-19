import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { GuideService } from '../../../services/guide';
import { PlanService } from '../../../services/plan';
import { GuideI } from '../../../models/guide';

@Component({
  selector: 'app-guide-create',
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
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create implements OnInit, OnDestroy {
  guideForm!: FormGroup;
  loading = false;
  plans: any[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private guideService: GuideService,
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
    this.guideForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required]],
      language: ['', [Validators.required]],
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
    if (this.guideForm.valid) {
      this.loading = true;
      const guideData: GuideI = this.guideForm.value;

      this.subscription.add(
        this.guideService.createGuide(guideData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Guía creado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/guides']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error creating guide:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el guía'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.guideForm);
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
    this.router.navigate(['/guides']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.guideForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.guideForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}