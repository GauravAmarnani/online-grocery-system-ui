import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  searchForm: FormGroup;
  products: Product[] = []; 
  filteredProducts: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      productName: ['']
    });
  }

  ngOnInit(): void {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      this.router.navigate(['/admin-login']);
      return;
    }
    this.loadProducts(); 
  }

    onSearch() {
      const searchValue = this.searchForm.get('productName')?.value?.toLowerCase();
      
      if (searchValue) {
        this.filteredProducts = this.products.filter(product =>
          product.name?.toLowerCase().includes(searchValue) ||
          product.category?.toLowerCase().includes(searchValue) ||
          product.description?.toLowerCase().includes(searchValue)
        );
      } else {
        this.filteredProducts = [...this.products];
      }
    }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => { 
        this.products = data;
        this.filteredProducts = [...this.products];
      },
      error: (error: any) => { 
        console.error('Error loading products:', error);
      }
    });
  }

  onDelete(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
          next: (response: string) => {
            console.log('Product deleted:', response);
            this.loadProducts(); 
          },
          error: (error: any) => {
            console.error('Error deleting product:', error);
          }
        });
  }
}
