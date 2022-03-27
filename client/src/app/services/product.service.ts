import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../Models/IProduct';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  amountOfProducts: number;
  products: any[] = new Array()
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>("/products")
  }

  editProduct(product: IProduct | any): Observable<IProduct> {
    return this.http.put<IProduct>("/products/", product)
  }

  addNewProduct(product: IProduct | any): Observable<IProduct> {
    return this.http.post<IProduct>("/products/", product)
  }

  getByCategoryID(categoryID: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`/products/${categoryID}`)
  }
  // search(searchText: string): void {
  //   this.products = this.products.filter((product) => product.product_name.toLowerCase().includes(searchText));
  //   console.log(searchText)
  // }
}

