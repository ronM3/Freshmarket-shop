import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { TokenStorageService } from '../services/TokenStorageService';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
  constructor(private router: Router, public userSerive: UserService, private tokenStorageService: TokenStorageService, private cartService: CartService) { }

  canActivate(): boolean {
    const token = this.tokenStorageService.getToken();
    if (token !== null && this.cartService.cartArray.length > 1) {
      return true;
    }
    this.router.navigate(["/"])
    return false;
  }
}
