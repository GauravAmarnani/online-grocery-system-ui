import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  username: string;
  email: string;
  address: string;
  contactNumber: string;
}

export interface RegistrationData {
  customerName: string;
  email: string;
  password: string;
  address: string;
  contactNumber: string;
}

export interface RegistrationResponse {
  message: string;
  customerId?: string;
}

export interface LoginResponse {
  message: string;
  role: string; 
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private viewCustomersUrl = 'http://onlinegrocerybackend.gauravamarnani.in:8081/customers/view';
  private registrationUrl = 'http://onlinegrocerybackend.gauravamarnani.in:8082/api/customers/register';
  private loginUrl = 'http://onlinegrocerybackend.gauravamarnani.in:8082/api/customers/login'; 

  constructor(private http: HttpClient) { }

  registerCustomer(registrationData: RegistrationData): Observable<HttpResponse<RegistrationResponse>> {
    const registerRequest = {
      username: registrationData.customerName, 
      password: registrationData.password,
      email: registrationData.email,
      address: registrationData.address,
      contactNumber: registrationData.contactNumber
    };
    return this.http.post<RegistrationResponse>(this.registrationUrl, registerRequest, { observe: 'response' });
  }

  loginCustomer(customerId: string, password: string): Observable<HttpResponse<LoginResponse>> {
    const loginRequest = {
      username: customerId, 
      password: password
    };
    return this.http.post<LoginResponse>(this.loginUrl, loginRequest, { observe: 'response' });
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.viewCustomersUrl);
  }
}
