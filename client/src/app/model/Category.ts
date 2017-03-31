import {Merchant} from './Merchant';
import {Product} from './Product';

export class Category {

    id: number;
    name: string;    
    description: string;
    sequence: number;
    merchant: Merchant;
    products: Array<Product>;
    version: number;    
    
    constructor() { }
}