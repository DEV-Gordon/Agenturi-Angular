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
import { BookingService } from '../../../services/booking';
import { BookingResponseI } from '../../../models/booking';

@Component({
  selector: 'app-booking-getall',
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
  bookings: BookingResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private bookingService: BookingService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    // Subscribe to booking updates
    this.subscription.add(
      this.bookingService.bookings$.subscribe(bookings => {
        this.bookings = bookings;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadBookings(): void {
    this.loading = true;
    this.subscription.add(
      this.bookingService.getAllbookings().subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las reservas'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(booking: BookingResponseI): void {
    const customerName = booking.customer ? `${booking.customer.first_name} ${booking.customer.last_name}` : 'esta reserva';
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la reserva de ${customerName}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteBooking(booking.id!);
      }
    });
  }

  deleteBooking(id: number): void {
    this.subscription.add(
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Reserva eliminada correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la reserva'
          });
        }
      })
    );
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'paid': 'Pagada',
      'canceled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      'pending': 'warning',
      'paid': 'success',
      'canceled': 'danger'
    };
    return severityMap[status] || 'info';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
