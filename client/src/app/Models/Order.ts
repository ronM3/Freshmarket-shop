export interface IOrder {
    cart_id:number;
    order_total:number
    city:string;
    street:string;
    shipping_date?:string
    credit_card:number
}