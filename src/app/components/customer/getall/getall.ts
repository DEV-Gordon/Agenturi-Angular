// src/app/components/customer/getall/getall.ts

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
import { CustomerService } from '../../../services/customer';
import { CustomerResponseI } from '../../../models/customer';

@Component({
  selector: 'app-customer-getall',
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
  customers: CustomerResponseI[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    // Subscribe to customer updates
    this.subscription.add(
      this.customerService.customers$.subscribe(customers => {
        this.customers = customers;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCustomers(): void {
    this.loading = true;
    this.subscription.add(
      this.customerService.getAllcustomers().subscribe({
        next: (customers) => {
          this.customers = customers;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading customers:', error);
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

  confirmDelete(customer: CustomerResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar a ${customer.first_name} ${customer.last_name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteCustomer(customer.id!);
      }
    });
  }

  deleteCustomer(id: number): void {
    this.subscription.add(
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente eliminado correctamente'
          });
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
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