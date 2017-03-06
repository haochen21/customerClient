import { OpenRange } from './OpenRange';
import { DiscountType } from './DiscountType';

export class Merchant {

    id: number;
    loginName: string;
    name: string;
    password: string;
    phone: string;
    mail: string;
    createdOn: Date;
    deviceNo: string;
    shortName: string;
    address: string;
    description: string;
    open: boolean;
    takeOut: boolean;
    takeByPhone: boolean;
    takeByPhoneSuffix: boolean;
    imageSource: string;
    qrCode: string;
    discountType: DiscountType;
    discount: number;
    amount: number;
    openRanges: Array<OpenRange>;
    version: number;
    concern: boolean;

    constructor() {
    }
}