import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/Models/CartItem';
import { Category } from 'src/app/Models/Category';
import { IProduct } from 'src/app/Models/IProduct';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductService } from 'src/app/services/product.service';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faTruck} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cards-container',
  templateUrl: './cards-container.component.html',
  styleUrls: ['./cards-container.component.css']
})
export class CardsContainerComponent implements OnInit {
  @Input() searchText: string;
  @Input() minPrice: number;
  products: IProduct[];
  categories: Category[]
  cartProducts: CartItem[]
  private categoryIdSubscription: Subscription;
  amountOfProducts: number;
  faTruck = faTruck
  faClock = faClock

  constructor(private productService: ProductService, private categoriesService: CategoriesService, private toastService: ToastrService) {
    this.categoryIdSubscription = this.categoriesService.categorySwitch().subscribe(
      newCategoryId => {
        let observable = this.productService.getByCategoryID(newCategoryId);
        observable.subscribe((categoriesList: IProduct[]) => {
          if (newCategoryId === 0) {
            this.getProducts()
          }
          this.products = categoriesList;
        }, error => {
          this.toastService.warning("Failed to load the page, pleas try again")
        }
        )
      }
    )
  }
  getProducts() {
    let observable = this.productService.getAllProducts()
    observable.subscribe((productsList: IProduct[]) => {
      this.products = productsList;
      this.productService.products = productsList;
    }, error => {
      this.toastService.warning("Failed to load the page, pleas try again")
    })
  }

  ngOnInit(): void {
    this.searchText = "";
    this.minPrice = 0;
    this.getProducts()
  }
  ngOnDestroy(): void {
    this.categoryIdSubscription.unsubscribe()
  }
}
