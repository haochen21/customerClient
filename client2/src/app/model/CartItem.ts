import { Product } from './Product';
import { SelectProductProperty } from './SelectProductProperty';

export class CartItem {

    id: number;
    name: string;    
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectProductProperties: SelectProductProperty[] = new Array<SelectProductProperty>();
    product: Product;
    version: number;    
    isChecked:boolean;
    
    constructor() { }
}