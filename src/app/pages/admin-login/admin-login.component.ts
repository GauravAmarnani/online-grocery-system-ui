// src/app/pages/admin-login/admin-login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  private apiUrl = 'http://onlinegrocerybackend.gauravamarnani.in:8081/login'; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient 
  ) {
    this.loginForm = this.fb.group({
      adminID: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { adminID, password } = this.loginForm.value;
      const loginRequest = { username: adminID, password: password };

      this.http.post(this.apiUrl, loginRequest, { observe: 'response', responseType: 'text' })
        .subscribe({
          next: (response: HttpResponse<string>) => {
            if (response.status === 200) {
              if (response.body) { 
                try {
                  const responseBody = JSON.parse(response.body);
                  console.log('Login successful:', responseBody);
                  localStorage.setItem('admin', JSON.stringify({ adminId: responseBody.adminId, adminName: responseBody.adminName }));
                  this.router.navigate(['/admin-home']);
                  this.errorMessage = '';
                } catch (error) {
                  console.error('Error parsing login response:', error);
                  this.errorMessage = 'Login successful, but error parsing data.';
                  this.router.navigate(['/admin-home']); // Still navigate, but log error
                }
              } else {
                console.warn('Empty response body on successful login.');
                this.errorMessage = 'Login successful, but received empty data.';
                this.router.navigate(['/admin-home']); // Still navigate
              }
            } else {
              console.warn('Unexpected successful response:', response);
              this.errorMessage = 'An unexpected success response occurred.';
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Login failed:', error);
            if (error.status === 401) {
              this.errorMessage = 'Invalid AdminID or Password';
            } else {
              this.errorMessage = `An unexpected error occurred: ${error.message}`;
            }
          }
        });
    } else {
      this.errorMessage = 'Please fill out all required fields.';
    }
  }
}
