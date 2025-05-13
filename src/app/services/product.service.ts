import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  quantityAvailable: number;
  price: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private viewProductsUrl = 'http://onlinegrocerybackend.gauravamarnani.in:8083/products'; 
  private deleteProductUrl = 'http://onlinegrocerybackend.gauravamarnani.in:8083/products/delete'; 
  private addProductUrl = 'http://onlinegrocerybackend.gauravamarnani.in:8083/products/add';   

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.viewProductsUrl);
  }

  deleteProduct(productId: number): Observable<string> {
    const url = `${this.deleteProductUrl}/${productId}`;
    return this.http.delete<string>(url, { responseType: 'text' as 'json' });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.addProductUrl, product);
  }
}
