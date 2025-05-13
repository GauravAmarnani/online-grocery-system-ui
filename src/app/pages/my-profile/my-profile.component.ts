import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  profileForm: FormGroup;
  customerName: string = '';
  userEmail: string | null = localStorage.getItem('userEmail'); 
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userEmail');
    if (!userData) {
      this.router.navigate(['']);
      return;
    }
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    if (this.userEmail) {
      this.http.get<any>(`http://localhost:8082/api/customers/profile/${this.userEmail}`).subscribe({
        next: (data) => {
          this.customerName = data.username;
          this.profileForm.patchValue({
            customerName: data.username,
            email: data.email,
            address: data.address,
            contactNumber: data.contactNumber
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading profile:', error);
          this.errorMessage = 'Error loading profile. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'User not logged in.';
      this.router.navigate(['/login']); 
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.userEmail) {
      const updatedProfile = this.profileForm.value;

      this.http.put<any>(`http://localhost:8082/api/customers/profile/${this.userEmail}`, updatedProfile).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.customerName = response.customerName; 
          alert('Profile updated successfully!');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating profile:', error);
          this.errorMessage = 'Error updating profile. Please try again.';
          if (error.status === 400 && error.error) {
            this.errorMessage = error.error; 
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
