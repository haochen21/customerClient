import {OpenRange} from './OpenRange';

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
    takeByPhone: boolean;
    takeByPhoneSuffix: boolean;
    imageSource: string;
    qrCode: string;
    discount: number;
    openRanges: Array<OpenRange>;
    version: number;
    concern:boolean;
    
    constructor() {
    }
}