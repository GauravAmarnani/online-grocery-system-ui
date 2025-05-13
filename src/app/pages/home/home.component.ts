import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 

interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  selectedQuantity: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  cart: { [productId: number]: number } = {}; 
  username: string = '';

  constructor(private http: HttpClient, private router: Router) { } 

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    this.username = email ? email : 'Guest';
    this.loadProducts(); 
    this.loadCartFromLocalStorage();
  }

  ngAfterViewInit(): void {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }
  }

  @HostListener('window:beforeunload')
  saveScrollPosition(): void {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  }

  scrollToProducts(): void {
    const productCards = document.getElementById('product-card');
    if (productCards) {
      productCards.scrollIntoView({ behavior: 'smooth' });
    }
  }

  loadProducts(): void {
    this.http.get<Product[]>('https://onlinegrocerybackend.gauravamarnani.in/api/shop/products').subscribe(
      (data) => {
        this.products = data.map(product => ({ ...product, selectedQuantity: this.cart[product.id] || 0 }));
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  increaseQuantity(product: Product): void {
    if (product.selectedQuantity < product.quantityAvailable) {
      product.selectedQuantity++;
      this.updateCart(product.id, product.selectedQuantity);
    }
  }

  decreaseQuantity(product: Product): void {
    if (product.selectedQuantity > 0) {
      product.selectedQuantity--;
      this.updateCart(product.id, product.selectedQuantity);
    }
  }

  updateCart(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cart[productId] = quantity;
    } else {
      delete this.cart[productId];
    }
    this.saveCartToLocalStorage();
  }

  saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
		

