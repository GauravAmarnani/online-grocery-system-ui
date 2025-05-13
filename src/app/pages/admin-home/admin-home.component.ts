import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  adminId: string = '';
  adminName: string = ''; 
  totalOrders: number = 0;
  totalSales: number = 0;
  totalCustomers: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      this.router.navigate(['/admin-login']);
      return;
    }

    const admin = JSON.parse(adminData);
    this.adminId = admin.adminId;
    this.adminName = admin.adminName; 

    this.totalOrders = 75;        
    this.totalSales = 65000;      
    this.totalCustomers = 230;    
  }

  logout(): void {
    localStorage.removeItem('admin');
    this.router.navigate(['/admin-login']);
  }
}
