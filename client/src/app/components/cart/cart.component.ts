import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/Models/CartItem';
import { IProduct } from 'src/app/Models/IProduct';
import { CartService } from 'src/app/services/cart.service';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import { TokenStorageService } from 'src/app/services/TokenStorageService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})

export class CartComponent implements OnInit {
  @Input() product: IProduct;
  cart_date: string;
  formatedDate: string | any;
  faTrash = faTrashCan;
  addSubscription = new Subscription();
  deleteSubscription = new Subscription();

  constructor(public cartService: CartService, private tokenStorageService: TokenStorageService, private modalService: NgbModal, private router: Router, private toastr: ToastrService) {
    this.addSubscription = this.cartService.getAddOneItemSubject().subscribe((newCartItem: CartItem) => {
      this.cartService.cartArray.push(newCartItem)
      this.cartService.cartSubtotal = this.cartService.getCartSubtotal()
    })
    // listening to updates on item in the cart
    this.cartService.getUpdateItemSubject().subscribe((updateCartItem: CartItem) => {
      this.cartService.cartArray.forEach((cartItem: CartItem) => {
        if (cartItem.productID === updateCartItem.productID) {
          cartItem.amount = updateCartItem.amount
          cartItem.sum_price = updateCartItem.sum_price
          this.cartService.cartSubtotal = this.cartService.getCartSubtotal()
        }
      })
    })
    // istening to change if item got deleted from cart
    this.deleteSubscription = this.cartService.getDeleteItemSubject().subscribe((productID: number) => {
      this.cartService.cartArray.forEach((item, index) => {
        if (item.productID === productID) {
          this.cartService.cartArray.splice(index, 1)
          this.cartService.cartSubtotal = this.cartService.getCartSubtotal()
        }
      })
    })
  }
  ngOnInit() {
    this.getUserCart()
  }
  openModal(content: any) {
    if (this.cartService.cartArray.length < 1) {
      this.toastr.info("Your cart is already empty")
      return false;
    }
    if (this.modalService.hasOpenModals()) {
      return false;
    }
    this.modalService.open(content, {
      backdrop: 'static',
      size: "sm"
    });
    return true;
  }

  checkOut() {
    if (this.tokenStorageService.getToken() == null) {
      this.toastr.info('Please create an account in order to start shopping');
      return false;
    }
    else if (this.cartService.cartArray.length < 1) {
      this.toastr.info("Your cart is empty")
      return false;
    }
    else {
      this.router.navigate(["/checkout"]);
      return true;
    }
  }

  deleteAllItemsInCart() {
    let observable = this.cartService.removeAllItemsFromCart(this.cartService.cart.cart_id)
    observable.subscribe(response => {
      this.cartService.cartArray = []
      this.cartService.cartSubtotal = 0;
      this.cartService.activeCart = false;
    }, serverErrorResponse => {
      this.toastr.warning("Action failed, pleas try again")
    })
  }
  getUserCart() {
    if (this.tokenStorageService.getUserType() === "admin") {
      this.toastr.info("Please log in to your customer account")
    }
    else if (this.tokenStorageService.getToken() == null) {
      this.toastr.info("Welcome please create an account in order to start shopping")
    }
    else {
      let observable = this.cartService.getCartProductsById();
      observable.subscribe(response => {
        console.log(response);
        if (response !== [] || response.length > 0 && response[0].sum_price != null) {
          if (response[0].sum_price == null) {
            this.cartService.cart.cart_id = response[0].cart_id
            this.cartService.cartArray.splice(0, this.cartService.cartArray.length)
            return;
          }
          this.cartService.cartArray = response
          this.cart_date = response[0].date_created
          const date = new Date(this.cart_date);
          this.formatedDate = date.toISOString().split('T')[0];
          this.cartService.activeCart = true
          this.cartService.cart.cart_id = response[0].cart_id
          this.cartService.getCartSubtotal()
        }
        else {
          this.addNewCart(this.tokenStorageService.getUserId())
        }
      }, serverErrorResponse => {
        this.toastr.warning("Unable to load your cart, please refresh the page")
      });
    }
  }
  addNewCart(user_id: number | any) {
    let newCartToAdd = { user_id: user_id };
    let observable = this.cartService.createNewCart(newCartToAdd);
    observable.subscribe(response => {
      this.cartService.cart.cart_id = response.insertId
    }, serverErrorResponse => {
      this.toastr.warning("Unable to load your cart, please refresh the page")
    })
  }
  closeNav() {
    this.cartService.close();
  }
  ngOnDestroy() {
    this.addSubscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
  }
}
