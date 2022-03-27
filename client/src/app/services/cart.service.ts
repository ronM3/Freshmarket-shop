import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CartItem } from '../Models/CartItem';
import { ICart } from '../Models/ICart';
import { IProduct } from '../Models/IProduct';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  showCart: boolean = false;
  cartArray: any[] = new Array()
  item: CartItem;
  product: IProduct
  cart_id: number;
  cartSubtotal: number = 0;
  activeCart = false;
  private addItemSubject: Subject<CartItem> = new Subject<CartItem>();
  private updatedItemSubject: Subject<CartItem> = new Subject<CartItem>();
  private deleteItemSubject:Subject<number> = new Subject<number>();
  constructor(private http: HttpClient) { }

  public cart: ICart = {
    cart_id: 0,
    date_created: '',
    cartItems: [],
    sum_price: 0
  };

  getCartSubtotal(): number {
    this.cartSubtotal = 0;
    this.cartArray.forEach((item: CartItem)=>{      
      this.cartSubtotal = this.cartSubtotal + item.sum_price
    })
    return this.cartSubtotal
  }

  // Delete all items from cart and
  removeAllItemsFromCart(cart_id: number): Observable<number>{
    return this.http.delete<number>(`/cart/empty/${cart_id}`)
  }

  createNewCart(newCart:{}): Observable<any>{
    return this.http.post<any>("/cart/new", newCart)
  }

  setDeleteItemSubject(itemID: number){
    this.deleteItemSubject.next(itemID);
  }

  getDeleteItemSubject(): Observable<number>{
    return this.deleteItemSubject.asObservable();
  }
  deleteProductCart(itemID: number): Observable<number> {
    return this.http.delete<number>(`/cart/${itemID}`)
  }

  // add Item to cart
  setAddItemSubject(addedItem: CartItem): void {
    this.addItemSubject.next(addedItem);
  }
  getAddOneItemSubject(): Observable<CartItem> {
    return this.addItemSubject.asObservable();
  }
  addProductToCart(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>("/cart/add/", item)
  }

// Update Item in cart
  setUpdateItemSubject(updatedItem: CartItem): void {
    this.updatedItemSubject.next(updatedItem);
  }
  getUpdateItemSubject(): Observable<CartItem> {
    return this.updatedItemSubject.asObservable();
  }
  updateProduct(item: CartItem): Observable<CartItem> {
    console.log("This is the cart item",this.item);  
    return this.http.put<CartItem>("/cart/", item)
  }

  getCartProductsById(): Observable<ICart[]> {
    return this.http.get<ICart[]>("/cart/user")
  }

  openNav() {
    this.showCart = false;
  }
  close() {
    this.showCart = true;
  }
}
