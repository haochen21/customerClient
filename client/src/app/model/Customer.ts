import { OrderAddress } from './OrderAddress';
export class Customer {

    id: number;
    loginName: string;
    name: string;
    password: string;
    phone: string;
    mail: string;
    address: string;
    createdOn: Date;
    cardNo: string;
    orderAddresses: Array<OrderAddress>;
    version: number;

    constructor() {
       
    }
}