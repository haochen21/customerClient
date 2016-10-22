import {Merchant} from './Merchant';
import {Category} from './Category';
import {ProductStatus} from './ProductStatus';
import {OpenRange} from './OpenRange';

export class Product {

    id: number;
    name: string;    
    unitPrice: number;
    description: string;
    unitsInStock: number;
    unitsInOrder: number;
    infinite: boolean;
    needPay: boolean;
    openRange: boolean;
    payTimeLimit: number;
    takeTimeLimit: number;
    imageSource: string;
    createdOn: Date;
    updatedOn: Date;
    status: ProductStatus;
    category: Category;
    merchant: Merchant;
    openRanges: Array<OpenRange>;
    version: number;    
    
    takeNumber: number;
    unTakeNumber: number;
    
    constructor() { }
}