import { CartStatusStat } from './CartStatusStat';
import { Product } from './Product';
import { OpenRangeType } from './OpenRangeType';

export class OpenRange {

    id: number;
    beginTime: Date;
    endTime: Date;
    type: OpenRangeType;
    statusStat: Array<CartStatusStat>;
    products: Array<Product>;
    
    index:number;
    
    constructor() { }
}