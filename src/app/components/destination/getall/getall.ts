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
import { DestinationService } from '../../../services/destination';
import { DestinationResponseI } from '../../../models/destination';

@Component({
  selector: 'app-destination-getall',
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
  destinations: DestinationResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private destinationService: DestinationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDestinations();
    this.subscription.add(
      this.destinationService.destinations$.subscribe(destinations => {
        this.destinations = destinations;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadDestinations(): void {
    this.loading = true;
    this.subscription.add(
      this.destinationService.getAlldestinations().subscribe({
        next: (destinations) => {
          this.destinations = destinations;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading destinations:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los destinos'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(destination: DestinationResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el destino "${destination.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteDestination(destination.id!);
      }
    });
  }

  deleteDestination(id: number): void {
    this.subscription.add(
      this.destinationService.deleteDestination(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Destino eliminado correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting destination:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el destino'
          });
        }
      })
    );
  }
}