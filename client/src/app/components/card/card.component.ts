import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from 'src/app/Models/IProduct';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenStorageService } from 'src/app/services/TokenStorageService';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() product: IProduct
  amount: number = 1;
  totalPrice: number | any = 0;

  constructor(public cartService: CartService, private productService: ProductService, private tokenStorageService: TokenStorageService, private toastService: ToastrService) {
  }

  incrementProduct(product: any) {
    this.amount++
  }
  decrement(product: any) {
    if (this.amount === 1) {
      return;
    }
    this.amount--
  }
  setAmount(event: any, product: any) {
    this.amount = +event.target.value;
  }
  isAddedToCart(product: IProduct): any {
    for (let i = 0; i < this.cartService.cartArray.length; i++) {
      if (this.cartService.cartArray[i].productID === product.productID) {
        this.amount = this.cartService.cartArray[i].amount
      }
    }
  }
  addItemToCart(product: IProduct) {
    if (this.tokenStorageService.getToken() == null) {
      this.toastService.warning("Pleas log in to your account in order to start shopping")
    }
    else if (this.tokenStorageService.getUserType() === "admin") {
      this.toastService.info("Please log in to your customer account")
    }
    else {
      this.cartService.activeCart = true;
      const item = {
        cart_id: this.cartService.cart.cart_id,
        product_name: product.product_name,
        product_price: product.product_price,
        productID: product.productID,
        image: product.image,
        amount: this.amount,
        sum_price: this.amount * product.product_price,
        isProductInCart: product.isProductInCart = true
      };
      if (this.cartService.cartArray.filter((product) => product.productID === item.productID).length > 0) {
        this.toastService.warning("Item already in cart, please click on the update button")
        return;
      }
      else {
        let observable = this.cartService.addProductToCart(item);
        observable.subscribe(response => {
          this.isAddedToCart(product)
          this.cartService.setAddItemSubject(item)
        }, serverErrorResponse => {
          this.toastService.warning("looks like there is a problem, pleas try again")
        });
      }
    }
  }

  updateCartItem(product: IProduct) {
    const item = {
      product_name: product.product_name,
      product_price: product.product_price,
      productID: product.productID,
      image: product.image,
      amount: this.amount,
      sum_price: this.amount * product.product_price,
      isProductInCart: product.isProductInCart
    };
    let observable = this.cartService.updateProduct(item);
    observable.subscribe(response => {
      this.amount = item.amount
      this.cartService.setUpdateItemSubject(item)
    }, serverErrorResponse => {
      this.toastService.warning("looks like there is a problem, pleas try again")
    });
  }
  ngOnInit(): void {
  }
}
