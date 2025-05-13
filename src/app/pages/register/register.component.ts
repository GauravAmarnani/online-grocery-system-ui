import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, RegistrationData, RegistrationResponse } from '../../services/customer.service'; 
import { HttpErrorResponse, HttpResponse } from '@angular/common/http'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  registrationSuccess: boolean = false;
  registrationError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.registerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const registrationData: RegistrationData = this.registerForm.value;

    this.customerService.registerCustomer(registrationData).subscribe({
      next: (response: HttpResponse<RegistrationResponse>) => {
        if (response.status === 201) { 
          console.log('Registration successful:', response.body);
          this.registrationSuccess = true;
          this.registrationError = '';
          this.registerForm.reset();
          setTimeout(() => {
            alert('Customer Registration Successful.');
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          console.warn('Unexpected registration success status:', response.status);
          this.registrationError = 'Registration successful but with unexpected status.';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration failed:', error);
        this.registrationSuccess = false;
        if (error.status === 409) { 
          this.registrationError = error.error.message || 'Username already exists.';
        } else {
          this.registrationError = 'Registration failed. Please try again later.';
        }
      }
    });
  }

  get customerName() {
    return this.registerForm.get('customerName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get contactNumber() {
    return this.registerForm.get('contactNumber');
  }
}
