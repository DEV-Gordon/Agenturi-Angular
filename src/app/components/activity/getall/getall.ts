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
import { ActivityService } from '../../../services/activity';
import { ActivityResponseI } from '../../../models/activity';

@Component({
  selector: 'app-activity-getall',
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
  activities: ActivityResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private activityService: ActivityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
    this.subscription.add(
      this.activityService.activities$.subscribe(activities => {
        this.activities = activities;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadActivities(): void {
    this.loading = true;
    this.subscription.add(
      this.activityService.getAllactivities().subscribe({
        next: (activities) => {
          this.activities = activities;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading activities:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las actividades'
          });
          this.loading = false;
        }
      })
    );
  }

  confirmDelete(activity: ActivityResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la actividad "${activity.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteActivity(activity.id!);
      }
    });
  }

  deleteActivity(id: number): void {
    this.subscription.add(
      this.activityService.deleteActivity(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Actividad eliminada correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting activity:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la actividad'
          });
        }
      })
    );
  }
}