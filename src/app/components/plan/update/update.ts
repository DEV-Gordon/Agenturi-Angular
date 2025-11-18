import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PlanService } from '../../../services/plan';
import { DestinationService } from '../../../services/destination';
import { PlanResponseI, PlanI } from '../../../models/plan';

@Component({
  selector: 'app-plan-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Select,
    InputText,
    Textarea,
    Button,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './update.html'
})
export class Update implements OnInit, OnDestroy {

  form!: FormGroup;
  loading = false;
  loadingData = true;

  destinations: any[] = [];
  planId: number = 0;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private destinationService: DestinationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/plans']);
      return;
    }

    this.planId = Number(id);

    this.loadDestinations();
    this.loadPlan(this.planId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      base_price: [0, Validators.required],
      destination_id: [null, Validators.required]
    });
  }

  loadDestinations(): void {
    this.destinationService.getAlldestinations().subscribe({
      next: (data) => this.destinations = data,
      error: () => console.error("Error cargando destinos")
    });
  }

  loadPlan(id: number): void {
    this.planService.getPlanById(id).subscribe({
      next: (data: PlanResponseI) => {
        this.form.patchValue({
          name: data.name,
          description: data.description,
          base_price: data.base_price,
          destination_id: data.destination.id
        });
        this.loadingData = false;
      },
      error: (err) => {
        console.error("Error cargando plan", err);
        this.router.navigate(['/plans']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.subscription.add(
      this.planService.updateplan(this.planId, this.form.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plan actualizado correctamente'
          });

          setTimeout(() => this.router.navigate(['/plans']), 800);
        },
        error: (err) => {
          console.error("Error actualizando plan", err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el plan'
          });
          this.loading = false;
        }
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/plans']);
  }

}
