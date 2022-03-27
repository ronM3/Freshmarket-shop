import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLoginDetails } from 'src/app/Models/UserLoginDetails';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLoginDetails: UserLoginDetails;
  private usersService: UserService;
  unValidDetails = false;
  loginForm: FormGroup;
  isLoggedIn = false;
  passwordIvalid: boolean = false;

  constructor(usersService: UserService, private router: Router, private toastr: ToastrService) {
    this.userLoginDetails = new UserLoginDetails();
    this.usersService = usersService;
  }

  login(): void {
    let loginDetails = this.loginForm.value
    this.userLoginDetails = loginDetails
    const observable = this.usersService.login(this.userLoginDetails)
    observable.subscribe(successfulServerRequestData => {
      this.toastr.success("Successful login")
      this.isLoggedIn = true;
      sessionStorage.setItem("token", successfulServerRequestData.token + "");
      sessionStorage.setItem("userName", this.userLoginDetails.email + "");
      sessionStorage.setItem("userType", successfulServerRequestData.userType + "");
      this.usersService.userType = successfulServerRequestData.userType;

      if (successfulServerRequestData.userType == "customer") {
        this.router.navigate(["/customer"]);
      }
      if (successfulServerRequestData.userType == "admin") {
        this.router.navigate(["/admin"]);
      }
    }, serverErrorResponse => {
      this.passwordIvalid = true;
      this.unValidDetails = true
      setTimeout(() => {
        this.passwordIvalid = false;
        this.unValidDetails = false;
      }, 3000);
    });
  }
  get emailField(): any {
    return this.loginForm.get('email');
  }
  get passwordField(): any {
    return this.loginForm.get('password');
  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }
}
