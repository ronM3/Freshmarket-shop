import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category } from '../Models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categorySubject: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }

  setCategoryId(categoryID: number): void {
    this.categorySubject.next(categoryID)
  }

  getAllCategories(): Observable<Category[]>{
    return this.http.get<Category[]>("/categories")
  }
 
  categorySwitch(): Observable<number> {
      // creating a new obersvable that emitting our data with our subject as the source 
    return this.categorySubject.asObservable();
  }

}
