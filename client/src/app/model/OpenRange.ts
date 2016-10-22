import { CartStatusStat } from './CartStatusStat';
import { Product } from './Product';

export class OpenRange {

    id: number;
    beginTime: Date;
    endTime: Date;
    statusStat: Array<CartStatusStat>;
    products: Array<Product>;
    
    index:number;
    
    constructor() { }
}