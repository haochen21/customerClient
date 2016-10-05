import { CartStatus } from './CartStatus';

export class CartFilter {
    
    no: string;    
    merchantId: number;
    customerId: number;
    statuses: Array<CartStatus>;
    needPay: boolean;  
    createTimeBefore: Date; 
    createTimeAfter: Date;
    takeBeginTimeBefore: Date; 
    takeBeginTimeAfter: Date;
    takeBeginTime: Date;
    takeEndTime: Date;
    productId: number;
    weixinPaid:boolean;
    page: number;
    size: number;
    
    constructor() { }
}