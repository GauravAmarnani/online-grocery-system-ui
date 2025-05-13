import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { CustomerManagementComponent } from './pages/customer-management/customer-management.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ViewOrdersComponent } from './pages/view-orders/view-orders.component';

import { HttpClientModule } from '@angular/common/http'; // ADD THIS

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CartComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    MyProfileComponent,
    CustomerManagementComponent,
    ProductManagementComponent,
    AddProductComponent,
    ViewOrdersComponent
  ],
  imports: [
    BrowserModule, // ADD THIS (you missed it before)
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule // REGISTER HERE
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
