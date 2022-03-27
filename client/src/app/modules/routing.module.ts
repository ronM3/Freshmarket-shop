import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../components/layout/layout.component';
import { LoginComponent } from '../components/login/login.component';
import { CardsContainerComponent } from '../components/cardsContainer/cards-container.component';
import { RegisterComponent } from '../components/register/register.component';
import { AdminComponent } from '../components/admin/admin.component';
import { AdminGuard } from '../guard/admin.guard';
import { OrderComponent } from '../components/order/order.component';
import { Page404Component } from '../components/page404/page404.component';
import { CheckoutGuard } from '../guard/checkout.guard';

const routes: Routes = [
  { path: "home", component: CardsContainerComponent },
  // { path: "about", component: AboutComponent },
  { path: "login", component: LoginComponent },
  { path: 'regiser', component: RegisterComponent },
  { path: "customer", component: CardsContainerComponent },
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  { path: "checkout", component: OrderComponent, canActivate: [CheckoutGuard],},
  { path: "", redirectTo: "home", pathMatch: "full" }, // pathMatch = התאמת המחרוזת הריקה לכלל הנתיב
  { path: "**", component: Page404Component } // Page not Found (Must be the last one)
];

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      RouterModule.forRoot(routes) // Importing the above routes
  ]
  })
export class RoutingModule {

 }
