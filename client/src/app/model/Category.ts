import {Merchant} from './Merchant';
import {Product} from './Product';

export class Category {

    id: number;
    name: string;    
    description: string;
    merchant: Merchant;
    products: Array<Product>;
    version: number;    
    
    constructor() { }
}