import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenStorageService } from 'src/app/services/TokenStorageService';

@Component({
  selector: 'app-header-cart',
  templateUrl: './header-cart.component.html',
  styleUrls: ['./header-cart.component.css']
})
export class HeaderCartComponent implements OnInit {
  userType: string;
  showCartButton: boolean = false;
  isMenuCollapsed = true;

  constructor(public cartService: CartService, public prodcutService: ProductService, public categoriesService: CategoriesService, private tokenStorageService: TokenStorageService) { }

  openNav() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this.cartService.openNav()
    if (this.cartService.showCart) {
      this.isMenuCollapsed = false;
    }
  }
  onCategoryClicked(categoryID: number) {
    window.scrollTo(0, 0)
    this.categoriesService.setCategoryId(categoryID)
  }
  ngOnInit(): void {
    this.userType = this.tokenStorageService.getUserType()
    if (this.userType === "admin") {
      this.showCartButton = false;
    }
    else {
      this.showCartButton = true;
    }
  }
}
