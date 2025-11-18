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

import { transportservice } from '../../../services/transport';
import { DestinationService } from '../../../services/destination';
import { TransportResponseI } from '../../../models/transport';

@Component({
  selector: 'app-transport-update',
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
  transportId: number = 0;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transportService: transportservice,
    private destinationService: DestinationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/transports']);
      return;
    }

    this.transportId = Number(id);

    this.loadDestinations();
    this.loadTransport(this.transportId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.form = this.fb.group({
      type: ['', Validators.required],
      company: ['', Validators.required],
      destination_id: [null, Validators.required]
    });
  }

  loadDestinations() {
    this.destinationService.getAlldestinations().subscribe({
      next: (data) => this.destinations = data,
      error: () => console.error("Error cargando destinos")
    });
  }

  loadTransport(id: number) {
    this.transportService.getTransportyId(id).subscribe({
      next: (data: TransportResponseI) => {
        this.form.patchValue({
          type: data.type,
          company: data.company,
          destination_id: data.destination.id
        });

        this.loadingData = false;
      },
      error: (err) => {
        console.error("Error cargando transporte", err);
        this.router.navigate(['/transports']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    this.subscription.add(
      this.transportService.updateTransport(this.transportId, this.form.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Transporte actualizado correctamente'
          });

          setTimeout(() => this.router.navigate(['/transports']), 800);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el transporte'
          });
          this.loading = false;
        }
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/transports']);
  }
}
