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
import { GuideService } from '../../../services/guide';
import { PlanService } from '../../../services/plan';
import { GuideI, GuideResponseI } from '../../../models/guide';

@Component({
  selector: 'app-guide-update',
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
  styleUrl: './update.css',
})
export class Update implements OnInit, OnDestroy {
  guideForm!: FormGroup;
  guide: GuideResponseI | null = null;
  loading = false;
  loadingData = true;
  guideId: number = 0;
  plans: any[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private guideService: GuideService,
    private planService: PlanService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlans();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.guideId = Number(id);
      this.loadGuide(this.guideId);
    } else {
      this.router.navigate(['/guides']);
    }
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
        }
      })
    );
  }

  loadGuide(id: number): void {
    this.subscription.add(
      this.guideService.getGuideById(id).subscribe({
        next: (guide) => {
          this.guide = guide;
          this.populateForm(guide);
          this.loadingData = false;
        },
        error: (error) => {
          console.error('Error loading guide:', error);
          this.loadingData = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el guía'
          });
        }
      })
    );
  }

  populateForm(guide: GuideResponseI): void {
    this.guideForm.patchValue({
      name: guide.name,
      phone: guide.phone,
      language: guide.language,
      plan: guide.plan?.id || null
    });
  }

  onSubmit(): void {
    if (this.guideForm.valid) {
      this.loading = true;
      const guideData: Partial<GuideI> = this.guideForm.value;

      this.subscription.add(
        this.guideService.updateGuide(this.guideId, guideData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Guía actualizado correctamente'
            });
            setTimeout(() => {
              this.router.navigate(['/guides']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating guide:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el guía'
            });
          }
        })
      );
    } else {
      this.markFormGroupTouched(this.guideForm);
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