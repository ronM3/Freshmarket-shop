import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardsContainerComponent } from './components/cardsContainer/cards-container.component';
import { CardComponent } from './components/card/card.component';
import { HeaderCartComponent } from './components/header-cart/header-cart.component';
import { SearchByNamePipe } from './Pipes/SearchByNamePipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeByMinPrice } from './Pipes/PipeByMinPrice';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { UserService } from './services/user.service';
import { RouterModule } from '@angular/router';
import { RoutingModule } from './modules/routing.module';
import { TokenStorageService } from './services/TokenStorageService';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { AuthenticationInterceptor } from './interceptors/AuthenticationInterceptor';
import { AdminComponent } from './components/admin/admin.component';
import { AdminProductsPipe } from './Pipes/admin-products.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimateComponent } from './utils/animate.component';
import { OrderComponent } from './components/order/order.component';
import { CustomAdapter } from './utils/CustomAdapter';
import { BsDatepickerDirective, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { Page404Component } from './components/page404/page404.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    CardsContainerComponent,
    CardComponent,
    HeaderCartComponent,
    SearchByNamePipe,
    PipeByMinPrice,
    CartComponent,
    CartItemComponent,
    RegisterComponent,
    AdminComponent,
    AdminProductsPipe,
    AnimateComponent,
    OrderComponent,
    Page404Component,
    FileUploadComponent,
  ],
  imports: [
    CommonModule, FontAwesomeModule,
    BrowserModule, BrowserAnimationsModule,
    NgbModule, FormsModule, HttpClientModule, RouterModule, RoutingModule, ReactiveFormsModule, BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true })
  ],
  providers: [ProductService, UserService, TokenStorageService, { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }, { provide: BsDatepickerDirective, useClass: CustomAdapter }],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
