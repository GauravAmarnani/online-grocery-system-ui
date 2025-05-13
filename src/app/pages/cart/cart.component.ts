import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  price: number;
  quantityAvailable: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const userEmailData = localStorage.getItem('userEmail');
    if (!userEmailData) {
      this.router.navigate(['']);
      return;
    }
    this.loadCartDetails();
  }

  loadCartDetails(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      const productIds = Object.keys(cart).map(Number);
      if (productIds.length > 0) {
        this.http.get<Product[]>('http://onlinegrocerybackend.gauravamarnani.in/api/shop/products').subscribe(
          (products) => {
            this.cartItems = products
              .filter(product => cart.hasOwnProperty(product.id))
              .map(product => ({ product: product, quantity: cart[product.id] }));
            this.calculateTotalAmount();
          },
          (error) => {
            console.error('Error loading product details:', error);
          }
        );
      } else {
        this.cartItems = [];
        this.totalAmount = 0;
      }
    } else {
      this.cartItems = [];
      this.totalAmount = 0;
    }
  }

  removeProduct(productId: number): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      delete cart[productId];
      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadCartDetails();
    }
  }

  increaseQuantity(item: { product: Product, quantity: number }): void {
    // Need to fetch the latest quantity available from the backend to prevent over-ordering
    this.http.get<Product>(`http://onlinegrocerybackend.gauravamarnani.in/api/shop/products/${item.product.id}`).subscribe(
      (product) => {
        if (item.quantity < product.quantityAvailable) {
          item.quantity++;
          this.updateCartQuantity(item.product.id, item.quantity);
          this.calculateTotalAmount();
        } else {
          alert(`Only ${product.quantityAvailable} available.`);
        }
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  decreaseQuantity(item: { product: Product, quantity: number }): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartQuantity(item.product.id, item.quantity);
      this.calculateTotalAmount();
    } else if (item.quantity === 1) {
      this.removeProduct(item.product.id);
    }
  }

  updateCartQuantity(productId: number, quantity: number): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      cart[productId] = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  placeOrder(): void {
    const storedCart = localStorage.getItem('cart');
    const customerId = localStorage.getItem('userEmail');

    if (!customerId) {
      alert('Please log in to place an order.');
      this.router.navigate(['/login']); // Redirect to login page
      return;
    }

    if (storedCart) {
      const cart = JSON.parse(storedCart);

      // Check if the cart has any items with quantity > 0
      const hasItemsToOrder = Object.values(cart).some((quantity: any) => quantity > 0);

      if (!hasItemsToOrder) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
      }

      this.http.post(`http://onlinegrocerybackend.gauravamarnani.in/api/shop/order/place-order/${customerId}`, cart).subscribe({
        next: (response: any) => {
          console.log('Order placed successfully:', response);
          localStorage.removeItem('cart');
          this.cartItems = [];
          this.totalAmount = 0;
          alert('Your order has been placed successfully!');
          this.router.navigate(['/home']); // Navigate to a success page
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error placing order:', error);
          if (error.status === 400 && error.error) {
            alert(`Could not place order: ${error.error}`); // Display backend error message
          } else {
            alert('Could not place order. Please try again later.');
          }
        }
      });
    } else {
      alert('Your cart is empty.');
    }
  }
}
