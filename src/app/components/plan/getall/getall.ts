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
import { PlanService } from '../../../services/plan';
import { PlanResponseI } from '../../../models/plan';

@Component({
  selector: 'app-plan-getall',
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
  plans: PlanResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private PlanService: PlanService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadplans();
    // Subscribe to plan updates
    this.subscription.add(
      this.PlanService.plans$.subscribe(plans => {
        this.plans = plans;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadplans(): void {
    this.loading = true;
    this.subscription.add(
      this.PlanService.getAllplans().subscribe({
        next: (plans) => {
          this.plans = plans;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading plans:', error);
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

  confirmDelete(plan: PlanResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar a ${plan.name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteplan(plan.id!);
      }
    });
  }

  deleteplan(id: number): void {
    this.subscription.add(
      this.PlanService.deleteplan(id).subscribe({
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