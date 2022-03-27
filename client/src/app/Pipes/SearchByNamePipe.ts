import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../Models/IProduct';

@Pipe({
  name: 'searchByNamePipe'
})
export class SearchByNamePipe implements PipeTransform {

  transform(products: IProduct [], searchText: string): any {
    if(!products){
      return [];
    }
    if(!searchText){
      return products
    }
    searchText = searchText.toLowerCase();

    return products.filter(product => {
      return product.product_name.toLowerCase().includes(searchText)
    })

  }
  
}
