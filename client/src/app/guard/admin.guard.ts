import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/TokenStorageService';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  public constructor(private router: Router ,public userSerive: UserService, private tokenStorageService: TokenStorageService) {}

 public canActivate(): boolean {
    const userType = this.tokenStorageService.getUserType()
    if(userType === "admin"){
      console.log(userType);
      return true;
    }
    this.router.navigate(["/"])
    return false;
  }
  
}
