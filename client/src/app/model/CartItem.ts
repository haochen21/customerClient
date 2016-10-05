import {Product} from './Product';

export class CartItem {

    id: number;
    name: string;    
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: Product;
    version: number;    
    isChecked:boolean;
    
    constructor() { }
}