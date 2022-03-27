import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../Models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  constructor(private http: HttpClient) { }

  addNewOrder(order: IOrder | any): Observable<IOrder>{
    return this.http.post<IOrder>("/orders/", order)
  }
}
