export interface CartItem {
    isProductInCart: boolean;
    product_name?:string
    productID?: number
    product_price?: number
    image?: string
    amount?: number
    sum_price: number
    cart_id?: number
    item_id?:number
}