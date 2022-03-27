import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CartItem } from 'src/app/Models/CartItem';
import { CartService } from 'src/app/services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerDirective, DatepickerDateCustomClasses, DatepickerDateTooltipText } from 'ngx-bootstrap/datepicker';
import { OrdersService } from 'src/app/services/orders.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/Models/IUser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @Input() product: CartItem;
  @Input() searchText: string;
  products: CartItem[] | any;
  cartArray: any[] = new Array()
  orderForm: FormGroup;
  newOrderForm: FormGroup;
  collectionSize: number;
  page = 1;
  pageSize = 5;
  totalPrice = 0;
  orderConfirmation = false;
  paymentReceipt = false;
  dateCustomClasses: DatepickerDateCustomClasses[];
  twoDaysAhead = new Date();
  fourDaysAhead = new Date();
  sixDaysAhead = new Date();
  formatedDate: string | any;
  disabledDates: Date;
  cart_id: number;
  faTimes = faTimes
  user: IUser = {
    email: '',
    firstName: '',
    lastName: '',
    city: '',
    street: ''
  }
  @ViewChild('content', { static: false }) content: NgbModal;
  @ViewChild('htmlData') htmlData!: ElementRef;
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  constructor(public cartService: CartService, private ordersService: OrdersService, private modalService: NgbModal, private usersService: UserService, private toastr: ToastrService, private router: Router) {
    const now = new Date();
    this.twoDaysAhead.setDate(now.getDate() + 2);
    this.fourDaysAhead.setDate(now.getDate() + 4);
    this.sixDaysAhead.setDate(now.getDate() + 6)
    this.dateCustomClasses = [
      { date: now, classes: [] },
      { date: this.twoDaysAhead, classes: ['bg-danger', 'text-warning'] },
      { date: this.fourDaysAhead, classes: ['bg-danger', 'text-warning'] },
      { date: this.sixDaysAhead, classes: ['bg-warning'] }
    ]
  }
  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }
  selectedDates: DatepickerDateTooltipText[] = [
    { date: this.twoDaysAhead, tooltipText: 'Full, choose another date' },
    { date: this.fourDaysAhead, tooltipText: 'Full, choose another date' },
    { date: this.sixDaysAhead, tooltipText: 'Order may be delayed' }
  ];
  getUserCart() {
    let observable = this.cartService.getCartProductsById();
    observable.subscribe(response => {
      this.cartArray = response
      this.collectionSize = response.length
      this.cart_id = response[0].cart_id;
      this.cartArray.forEach((item: CartItem) => {
        this.totalPrice = this.totalPrice + item.sum_price
      })
    }, serverErrorResponse => {
      this.toastr.warning("Unable to load your order items, please refresh the page")
    });
  }

  openModal(content: NgbModal) {
    this.modalService.open(this.content, {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: "display: flex, border-radius: 0.75rem",
      animation: true
    });
  }
  completeOrder() {
    this.paymentReceipt = true;
    const date = new Date(this.dateField.value);
    this.formatedDate = date.toISOString().split('T')[0];
    this.dateField.setValue(this.formatedDate)
    let newOrderAdd = {
      cart_id: this.cart_id,
      order_total: this.totalPrice,
      city: this.cityField.value,
      street: this.streetField.value,
      shipping_date: this.dateField.value,
      credit_card: this.creditCardField.value
    }
    let observable = this.ordersService.addNewOrder(newOrderAdd)
    observable.subscribe(() => {
      this.openModal(this.content)
      this.openPDF()
      this.clearCart()
      setTimeout(() => {
        this.paymentReceipt = false;
      }, 2000)
      setTimeout(() => {
        this.router.navigate(["/home"]);
        this.modalService.dismissAll(this.content)
      }, 15000)
    }, () => {
      this.toastr.warning('Failed to add order, please try again later');
    });
  }
  openPDF() {
    this.paymentReceipt = true;
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Payment-receipt.pdf');
    });
    setTimeout(() => {
      this.paymentReceipt = false;
    }, 3000)
  }
  getUserDetails() {
    let observable = this.usersService.getDetailsOfUser();
    observable.subscribe(response => {
      this.user = response[0];
      this.cityField.setValue(this.user.city)
      this.streetField.setValue(this.user.street)
    }, serverErrorResponse => {
    });
  }
  clearCart() {
    let observable = this.cartService.removeAllItemsFromCart(this.cartService.cart.cart_id)
    observable.subscribe(() => {
      this.cartArray = []
      this.cartService.cartArray = []
      this.cartService.cartSubtotal = 0;
      this.cartService.activeCart = false;
    }, () => {
    })
  }
  get cityField(): any {
    return this.orderForm.get('city');
  }
  get streetField(): any {
    return this.orderForm.get('street');
  }
  get dateField(): any {
    return this.orderForm.get('date');
  }
  get creditCardField(): any {
    return this.orderForm.get('creditCard');
  }
  ngOnInit(): void {
    this.getUserCart();
    this.getUserDetails();
    this.cartService.getCartSubtotal();
    this.orderForm = new FormGroup({
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
      street: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      creditCard: new FormControl('', [Validators.required, Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$')])
    })
  }
}
