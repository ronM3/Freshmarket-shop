import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IProduct } from 'src/app/Models/IProduct';
import { Alert } from 'src/app/Models/Alert';
import { ProductService } from 'src/app/services/product.service';
import { faSquarePlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/Models/Category';
import { debounceTime, Subject } from 'rxjs';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  @Input() product: IProduct;
  @Input() searchText: string;
  @Input() editAble: boolean = false;
  products: IProduct[] | any;
  categories: Category[] | any;
  showProgression: boolean = false;
  page = 1;
  pageSize = 7;
  collectionSize: number;
  editNameField: string;
  editPriceField: number;
  editedPriceField: number;
  editedImage: string | undefined;
  addProductForm: FormGroup;
  newProductForm: FormGroup;
  editInfoField: string | undefined;
  fileName = '';
  imagePath = '';
  formData = new FormData()
  faEdit = faEdit;
  faSquarePlus = faSquarePlus;
  showAddProduct: boolean = false;
  alert: Alert;
  private _success = new Subject<string>();
  @ViewChild('nameEdit', { static: false }) NameEdit: { contenteditable: boolean; };
  successMessage = '';
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;

  constructor(private productService: ProductService, private categoryService: CategoriesService, private fileUploadService: FileUploadService, private toastService: ToastrService) {
    this.alert = {
      type: 'success',
      message: 'This is an success alert',
    }
  }
  showAddProductForm() {
    this.showAddProduct = true;
  }
  showAllProducts() {
    this.showAddProduct = false;
  }

  // getting add product fields
  get product_name(): any {
    return this.addProductForm.get('productName');
  }
  get product_price(): any {
    return this.addProductForm.get('productPrice');
  }
  get categoryName(): any {

    return this.addProductForm.get('categoryName');
  }
  get productImage(): any {
    return this.addProductForm.get('productImage');
  }
  get productInfo(): any {
    return this.addProductForm.get('productInfo');
  }
  changeCategory(event: any | Category) {
    const category = event.target.value as object;
    this.categoryName.setValue(category);
  }

  addNewProduct() {
    this.showProgression = true
    for (let index = 0; index < this.categories.length; index++) {
      if (this.categories[index].category_name === this.categoryName.value) {
        this.categoryName.setValue(this.categories[index].categoryID, { onlySelf: false, emitEvent: true, emitModelToViewChange: true, emitViewToModelChange: true });
      }
    }
    let newProductInfo: IProduct = {
      product_name: this.product_name.value,
      categoryID: this.categoryName.value,
      product_price: this.product_price.value,
      image: this.fileName,
      info: this.productInfo.value,
      amount: 1,
      isProductInCart: false
    }
    let observable = this.productService.addNewProduct(newProductInfo)
    observable.subscribe((response) => {
      this.imageUpload(this.formData)
      this.showProgression = false;
      this.addProductForm.reset()
      this._success.next(`${new Date()} - Product successfully added.`);
    }, error => {
      this.toastService.error('Failed to add new product please try again later');
    })
  }

  // getting text fields from table
  onNameChanged(productID: number, event: any) {
    this.editNameField = event.target.textContent;
  }
  onPriceChanged(productID: number, event: any) {
    this.editPriceField = event.target.textContent;
  }
  oninfoChanged(productID: number, event: any) {
    this.editInfoField = event.target.textContent;
  }

  // saving new edited product to server and db
  saveEditedProduct(productID: number, product: IProduct) {
    this.editedImage = this.fileName
    if (this.editNameField === undefined) {
      this.editNameField = product.product_name
    }
    if (this.editPriceField === undefined) {
      this.editPriceField = product.product_price
    }
    if (this.editInfoField === undefined) {
      this.editInfoField = product.info
    }
    if (this.editedImage === "") {
      this.editedImage = product.image
    }
    let productToEdit = {
      product_name: this.editNameField,
      categoryID: product.categoryID,
      product_price: this.editPriceField,
      image: this.editedImage,
      info: this.editInfoField,
      amount: 1,
      productID: product.productID
    }
    this.imageUpload(this.formData)
    for (let index = 0; index < this.products.length; index++) {
      if (this.products[index].productID === productID) {
        this.products[index].product_name = this.editNameField
        this.products[index].product_price = this.editPriceField
        this.products[index].info = this.editInfoField
        this.products[index].image = this.editedImage
        if (confirm('Are you sure you want to save the updates?')) {
          let observable = this.productService.editProduct(productToEdit)
          observable.subscribe(response => {
          }, serverErrorResponse => {
            this.toastService.error('Failed to save new details, pleas try again');
          });
        }
        this.editPriceField = product.product_price
      }
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.formData.append("file", file);
      this.formData.append("fileName", this.fileName);
    }
  }
  imageUpload(formData: FormData) {
    let observable = this.fileUploadService.uploadImgae(formData)
    observable.subscribe(response => {
    }, error => {
      this.toastService.error('Failed to add image ' + JSON.stringify(error));
    })
  }

  getProducts() {
    let observable = this.productService.getAllProducts()
    observable.subscribe((productsList: IProduct[]) => {
      this.collectionSize = productsList.length;
      this.products = productsList
    }, error => {
      this.toastService.error('Failed to get products ' + JSON.stringify(error));
    })
  }
  getCategories() {
    let observable = this.categoryService.getAllCategories()
    observable.subscribe((categories: Category[]) => {
      this.categories = categories;
    }, error => {
      this.toastService.error('Failed to get categories ' + JSON.stringify(error));
    })
  }

  ngOnInit(): void {
    this.addProductForm = new FormGroup({
      productName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      productPrice: new FormControl('', [Validators.required, Validators.minLength(1)]),
      categoryName: new FormControl('', [Validators.required]),
      productImage: new FormControl('', [Validators.required]),
      productInfo: new FormControl('', [Validators.required])
    });
    this.getProducts();
    this.getCategories();
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }
}
