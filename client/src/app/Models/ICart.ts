export interface ICart {
    cart_id: number;
    date_created: string;
    cartItems: Array<any>;
    sum_price: number;
}