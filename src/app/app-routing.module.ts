import { NgModule } from '@angular/core';
import{ReactiveFormsModule,FormsModule} from '@angular/forms';
import {BrowserModule} from  '@angular/platform-browser';
import {AppComponent} from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {WelcomeComponent} from'./pages/welcome/welcome.component';
import {LoginComponent} from'./pages/login/login.component';
import {RegisterComponent} from'./pages/register/register.component';
import {HomeComponent} from'./pages/home/home.component';
import {CartComponent} from'./pages/cart/cart.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { CustomerManagementComponent } from './pages/customer-management/customer-management.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ViewOrdersComponent } from './pages/view-orders/view-orders.component';

const routes: Routes = [
  {path:'',component:WelcomeComponent},
  {path:'home',component:HomeComponent },
  {path:'cart',component:CartComponent },
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'admin-login',component:AdminLoginComponent},
  {path:'admin-home',component:AdminHomeComponent},
  {path:'my-profile',component:MyProfileComponent},
  {path:'customer-management',component:CustomerManagementComponent},
  {path:'product-management',component:ProductManagementComponent},
  {path:'add-product',component:AddProductComponent},
  {path:'view-orders',component:ViewOrdersComponent},
];

@NgModule({
  imports: [BrowserModule,RouterModule.forRoot(routes)],
  
 
  exports: [RouterModule]
})
export class AppRoutingModule {}
