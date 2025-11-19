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
import { ItineraryService } from '../../../services/itinerary';
import { ItineraryResponseI } from '../../../models/itinerary';

@Component({
  selector: 'app-itinerary-getall',
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
  itineraries: ItineraryResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private itineraryService: ItineraryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadItineraries();
    this.subscription.add(
      this.itineraryService.itineraries$.subscribe(itineraries => {
        this.itineraries = itineraries;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadItineraries(): void {
    this.loading = true;
    this.subscription.add(
      this.itineraryService.getAllItineraries().subscribe({
        next: (itineraries) => {
          this.itineraries = itineraries;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading itineraries:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los itinerarios'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(itinerary: ItineraryResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el Día ${itinerary.day} del itinerario?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteItinerary(itinerary.id!);
      }
    });
  }

  deleteItinerary(id: number): void {
    this.subscription.add(
      this.itineraryService.deleteItinerary(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Itinerario eliminado correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting itinerary:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el itinerario'
          });
        }
      })
    );
  }

  truncateText(text: string | undefined, maxLength: number = 100): string {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}