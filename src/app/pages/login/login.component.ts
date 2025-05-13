import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service'; 
import { HttpErrorResponse, HttpResponse } from '@angular/common/http'; 
import { LoginResponse } from '../../services/customer.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService 
  ) {
    this.loginForm = this.fb.group({
      customerID: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginError = 'Please fill in all required fields.';
      return;
    }

    const { customerID, password } = this.loginForm.value;

    this.customerService.loginCustomer(customerID, password).subscribe({
      next: (response: HttpResponse<LoginResponse>) => {
        if (response.status === 200) {
          console.log('Login successful:', response.body);
          localStorage.setItem('isLoggedIn', 'true'); 
          localStorage.setItem('userEmail', customerID); 
localStorage.setItem('userRole', 'CUSTOMER');
          this.router.navigate(['/home']);
          this.loginError = '';
        } else {
          console.warn('Unexpected login success status:', response.status);
          this.loginError = 'Login successful but with unexpected status.';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          this.loginError = 'Invalid username or password.';
        } else {
          this.loginError = 'Login failed. Please try again later.';
        }
      }
    });
  }
}
