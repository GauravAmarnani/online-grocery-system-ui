import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface OrderItemDisplay {
  productName: string;
  quantity: number;
  pricePerItem: number;
  itemTotalPrice: number;
}

interface OrderDisplay {
  id: number;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  orderItems: OrderItemDisplay[];
}

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  orders: OrderDisplay[] = [];
  filteredOrders: OrderDisplay[] = [];
  searchCustomerName: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      this.router.navigate(['/admin-login']);
      return;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<OrderDisplay[]>('http://onlinegrocerybackend.gauravamarnani.in:8083/order').subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...this.orders];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Error loading order details. Please try again.';
      }
    });
  }

  onSearch(): void {
  const searchValue = this.searchCustomerName.toLowerCase().trim();

  if (searchValue) {
    this.filteredOrders = this.orders.filter(order =>
      order.customerEmail.toLowerCase().includes(searchValue) ||
      order.orderItems.some(item =>
        item.productName.toLowerCase().includes(searchValue)
      )
    );
  } else {
    this.filteredOrders = [...this.orders];
  }
}
}
