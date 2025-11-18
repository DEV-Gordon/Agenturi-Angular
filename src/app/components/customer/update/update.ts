import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../services/customer';
import { CustomerI, CustomerResponseI } from '../../../models/customer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
})

export class Update implements OnInit {
  public customer: CustomerResponseI | null = null;
  public loading: boolean = false;
  public customerId: string | null = null;
  public errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(Number(id));
    } else {
      this.router.navigate(['/customers']);
    }
  }

  loadCustomer(id: number): void {
    this.loading = true;
    this.subscription.add(
      this.customerService.getcustomerById(id).subscribe({
        next: (customer) => {
          console.log('Customer loaded successfully:', customer);
          this.customer = customer;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading customer:', error);
          console.error('Error details:', {
            status: error?.status,
            statusText: error?.statusText,
            message: error?.message,
            url: error?.url
          });
          this.loading = false;
        }
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
