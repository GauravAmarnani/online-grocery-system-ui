import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Customer, CustomerService } from '../../services/customer.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit {
  searchcustomerName: string = '';
  allCustomers: Customer[] = []; 

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      this.router.navigate(['/admin-login']);
      return;
    }
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.allCustomers = customers;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  get filteredCustomers(): Customer[] {
  if (!this.searchcustomerName) {
    return this.allCustomers;
  }

  const searchTerm = this.searchcustomerName.toLowerCase();

  return this.allCustomers.filter(customer =>
    customer.username?.toLowerCase().includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm) ||
    customer.contactNumber?.toLowerCase().includes(searchTerm) ||
    customer.address?.toLowerCase().includes(searchTerm)
  );
}

}
