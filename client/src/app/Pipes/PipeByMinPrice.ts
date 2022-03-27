import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../Models/IProduct';

@Pipe({
    name: 'minPricePipe'
})
export class PipeByMinPrice implements PipeTransform {

    transform(products: IProduct[], minPrice: number): any {
        // return products.filter(product => product.product_price > minPrice);

        // if(!products){
        //     return [];
        //   }
        //   if(!searchText){
        //     return products
        //   }
        //   searchText = searchText.toLowerCase();
        if(minPrice === 0){
            return products;
        }

        return products.filter(product => product.product_price > minPrice);
    }

}
