import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AccommodationService } from '../../../services/accommodation';
import { AccommodationResponseI } from '../../../models/accommodation';

@Component({
  selector: 'app-accommodation-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    Button,
    ConfirmDialog,
    Toast,
    Tooltip
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrl: './getall.css'
})
export class Getall implements OnInit, OnDestroy {
  accommodations: AccommodationResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private accommodationService: AccommodationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAccommodations();
    this.subscription.add(
      this.accommodationService.accommodations$.subscribe(accommodations => {
        this.accommodations = accommodations;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAccommodations(): void {
    this.loading = true;
    this.subscription.add(
      this.accommodationService.getAllaccommodations().subscribe({
        next: (accommodations) => {
          this.accommodations = accommodations;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading accommodations:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los alojamientos'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(accommodation: AccommodationResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar "${accommodation.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAccommodation(accommodation.id!);
      }
    });
  }

  deleteAccommodation(id: number): void {
    this.subscription.add(
      this.accommodationService.deleteaccommodation(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Alojamiento eliminado correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting accommodation:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el alojamiento'
          });
        }
      })
    );
  }
}