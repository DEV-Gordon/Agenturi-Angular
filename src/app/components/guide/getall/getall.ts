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
import { GuideService } from '../../../services/guide';
import { GuideResponseI } from '../../../models/guide';

@Component({
  selector: 'app-guide-getall',
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
  guides: GuideResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private GuideService: GuideService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadGuides();
    this.subscription.add(
      this.GuideService.guides$.subscribe(guides => {
        this.guides = guides;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadGuides(): void {
    this.loading = true;
    this.subscription.add(
      this.GuideService.getAllGuides().subscribe({
        next: (guides) => {
          this.guides = guides;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading guides:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los guías'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(guide: GuideResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar al guía "${guide.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteGuide(guide.id!);
      }
    });
  }

  deleteGuide(id: number): void {
    this.subscription.add(
      this.GuideService.deleteGuide(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Guía eliminado correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting guide:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el guía'
          });
        }
      })
    );
  }
}