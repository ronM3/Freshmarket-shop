import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/Models/CartItem';
import { IProduct } from 'src/app/Models/IProduct';
import { CartService } from 'src/app/services/cart.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  animations: [
    trigger('toggleBox', [
      state('open', style({
        opacity: "1",
      })),
      state('closed', style({
        height: "150px",
        width: "1px",
        opacity: "0",
        transition: "all .55s ease",
        transform: "translateX(400px) rotate(720deg)"
      })),
      transition('open => closed', [
        animate('.4s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ])
  ]
})
export class CartItemComponent implements OnInit {
  @Input() product: CartItem;
  deleteItemAnimation = false;
  faTrash = faTrash
  isOpen: boolean;
  constructor(private cartService: CartService, private toastService: ToastrService) { }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  deleteCartItem(product: IProduct | any, event: any) {
    this.isOpen = !this.isOpen;
    const productID = product.productID
    let observable = this.cartService.deleteProductCart(productID)
    observable.subscribe(response => {
      product.isProductInCart = false
      setTimeout(() => {
        this.cartService.setDeleteItemSubject(productID)
      }, 1000, this.cartService.getCartSubtotal());
    }, serverErrorResponse => {
      this.toastService.warning("Action failed, pleas try again")
    });
  }
  ngOnInit(): void {
  }
}
