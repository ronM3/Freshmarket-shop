import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdExist } from 'src/app/Models/IdExist';
import { NewUserDetails } from 'src/app/Models/newUserDetails';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import Validation from '../../confirmed.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public newUserDetails: NewUserDetails;
  public idExist: IdExist
  private usersService: UserService;
  firstStep: FormGroup;
  secondStep: FormGroup;
  registerForm: FormGroup;
  successfulRegister: boolean = false;
  serverErrorShow: boolean = false;
  public idExistError: boolean = false;
  first_step: boolean = false;
  second_Step: boolean = true;
  cities: string[] = ['Jerusalem', 'Tel aviv', 'Haifa', 'Rishon lezion', 'Petah tikva', 'Ashdod', 'netanya', 'beer sheva', 'Bnei brak', 'Holon']

  constructor(usersService: UserService, private router: Router, public cartService: CartService) {
    this.newUserDetails = new NewUserDetails();
    this.idExist = new IdExist()
    this.usersService = usersService;
  }

  changeCity(event: any) {
    const city = event.target.value;
    this.cityName.setValue(city);
  }
  get first() { return this.firstStep.controls; }
  get second() { return this.secondStep.controls; }

  get idField(): any {
    return this.firstStep.get('id');
  }
  get emailField(): any {
    return this.firstStep.get('email');
  }
  get passwordField(): any {
    return this.firstStep.get('password');
  }
  get passwordConfirmation(): any {
    return this.firstStep.get('passwordConfirm');
  }
  get cityName(): any {
    return this.secondStep.get('cityName');
  }
  get streetField(): any {
    return this.secondStep.get('street');
  }
  get firstNameField(): any {
    return this.secondStep.get('firstName');
  }
  get lastNameField(): any {
    return this.secondStep.get('lastName');
  }

  register() {
    this.registerForm = new FormGroup({
      id: this.idField,
      email: this.emailField,
      password: this.passwordField,
      city: this.cityName,
      street: this.streetField,
      firstName: this.firstNameField,
      lastName: this.lastNameField
    })
    let newUserInfo = this.registerForm.value
    const observable = this.usersService.createUser(newUserInfo)
    observable.subscribe(SuccessfulAddingUserResponse => {
      this.addNewCart(SuccessfulAddingUserResponse.insertId)
      this.successfulRegister = true
      setTimeout(() => {
        this.successfulRegister = false;
        this.router.navigate(["/login"]);
      }, 7000);

      this.first_step = false;
    }, serverErrorResponse => { // Reaching here means that the server had failed
      this.serverErrorShow = true;
      setTimeout(() => {
        this.serverErrorShow = false;
      }, 3000);
    });
  }

  nextStep() {
    this.idExist = this.idField.value
    let observable = this.usersService.isUserIdExist(this.idExist);
    observable.subscribe(response => {
      // moving to next step
      this.first_step = true;
      this.second_Step = false;
    }, serverErrorResponse => { // Reaching here means that the server had failed
      // preventing moving to next step
      this.first_step = false;
      this.second_Step = true;
      this.idExistError = true;
      setTimeout(() => {
        this.idExistError = false;
      }, 3000);
      console.log(serverErrorResponse.error + serverErrorResponse.status)
    });
  }
  stepBack() {
    this.first_step = false;
    this.second_Step = true;
  }

  addNewCart(user_id: number | any) {
    let newCartToAdd = { user_id: user_id };
    let observable = this.cartService.createNewCart(newCartToAdd);
    observable.subscribe(response => {
      this.cartService.cart.cart_id = response.insertId
    }, serverErrorResponse => {
      console.log(serverErrorResponse.error + serverErrorResponse.status)
    })
  }

  ngOnInit(): void {
    this.firstStep = new FormGroup({
      id: new FormControl('', [Validators.required, Validators.minLength(9), Validators.pattern("^[0-9]*$")]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(6)])
    },
      {
        validators: [Validation.match('password', 'passwordConfirm')]
      }
    );
    this.secondStep = new FormGroup({
      cityName: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    })
  }
}
