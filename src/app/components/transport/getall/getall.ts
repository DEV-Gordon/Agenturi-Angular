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
import { transportservice } from '../../../services/transport';
import { TransportResponseI } from '../../../models/transport';

@Component({
  selector: 'app-transport-getall',
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
  transports: TransportResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private transportservice: transportservice,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadtransports();
    // Subscribe to plan updates
    this.subscription.add(
      this.transportservice.transports$.subscribe(transports => {
        this.transports = transports;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadtransports(): void {
    this.loading = true;
    this.subscription.add(
      this.transportservice.getAlltransports().subscribe({
        next: (transports) => {
          this.transports = transports;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transports:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los clientes'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(transport: TransportResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar a ${transport.company}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteplan(transport.id!);
      }
    });
  }

  deleteplan(id: number): void {
    this.subscription.add(
      this.transportservice.deletetransport(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente eliminado correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting plan:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el cliente'
          });
        }
      })
    );
  }
}