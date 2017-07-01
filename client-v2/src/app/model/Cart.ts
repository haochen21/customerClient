import { CartStatus } from './CartStatus';
import { CartItem } from './CartItem';
import { Customer } from './Customer';
import { Merchant } from './Merchant';

export class Cart {

    id: number;
    no: string;
    name: string;
    phone: string;
    address: string;
    merchant: Merchant;
    customer: Customer;
    status: CartStatus;
    needPay: boolean;
    totalPrice: number;
    payTimeLimit: number;
    payTime: Date;
    takeTimeLimit: number;
    takeTime: Date;
    takeBeginTime: Date;
    takeEndTime: Date;
    createdOn: Date;
    updatedOn: Date;
    remark: string;
    takeOut: boolean;
    cartItems: Array<CartItem>;
    version: number;

    showDetail: boolean;

    constructor() { }
}