import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { transportservice } from '../../../services/transport';
import { DestinationService } from '../../../services/destination';

@Component({
  selector: 'app-transport-create',
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
  templateUrl: './create.html'
})
export class Create implements OnInit {
  form!: FormGroup;
  loading = false;
  destinations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private transportservice: transportservice,
    private destinationService: DestinationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      type: ['', Validators.required],
      company: ['', Validators.required],
      destination_id: [null, Validators.required]
    });

    this.loadDestinations();
  }

  loadDestinations() {
    this.destinationService.getAlldestinations().subscribe({
      next: (data) => this.destinations = data,
      error: () => console.error("Error cargando destinos")
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.transportservice.createTransport(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Plan creado correctamente'
        });

        setTimeout(() => this.router.navigate(['/transports']), 800);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el plan'
        });
        this.loading = false;
      }
    });
  }
}
