import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';  

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  addProductForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {
    this.addProductForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      productQuantity: ['', [Validators.required, Validators.min(0)]],
      productCategory: ['', Validators.required],
      productDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      this.router.navigate(['/admin-login']);
      return;
    }
  }

  onSubmit() {
    if (this.addProductForm.valid) {
      const formData = this.addProductForm.value;
      const payload = {
        id: Date.now(),  
        name: formData.productName,
        category: formData.productCategory,
        quantityAvailable: formData.productQuantity,
        price: formData.productPrice,
        description: formData.productDescription,
        isActive: true  
      };

      this.productService.addProduct(payload).subscribe({
        next: (res) => {
          console.log('Product Added:', res);
          alert('Product added successfully.');
          this.router.navigate(['/product-management']);
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Failed to add product. Check the console for more details.');
        }
      });
    } else {
      alert('Please fill all the required fields correctly.');
    }
  }
}

