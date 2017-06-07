import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Merchant } from '../model/Merchant';
import { Customer } from '../model/Customer';
import { OpenRange } from '../model/OpenRange';

@Injectable()
export class SecurityService {


    constructor(private http: Http) { }

    menuName: String = 'portal';

    setMenuName(name: String) {
        this.menuName = name;
    }

    getMenuName() {
        return this.menuName;
    }
    login(loginName: String, password: String): Promise<any> {
        let params = {
            loginName: loginName,
            password: password
        }
        return this.http.post('api/login', params)
            .toPromise()
            .then(response => {
                console.log(response.json());
                return response.json();
            })
            .catch(this.handleError);
    }

    logout() {
        return this.http.get('logout')
            .toPromise()
            .then(response => {
                return { logout: true };
            })
            .catch(this.handleError);
    }

    findCustomer(): Promise<Customer> {
        return this.http.get('api/customer')
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    findCustomerWithOrderAddrress(): Promise<Customer> {
        return this.http.get('api/customer/orderAddress')
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    registerCustomer(customer: Customer): Promise<Customer> {
        let body = JSON.stringify({ customer });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/customer', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    modifyCustomer(customer: Customer): Promise<Customer> {
        let body = JSON.stringify({ customer });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('api/customer', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    modifyCustomerPhone(phone: String): Promise<any> {
        let params = {
            phone: phone
        }

        return this.http.put('api/modifyPhone', params)
            .toPromise()
            .then(response => {
                 return response.json();
            })
            .catch(this.handleError);
    }


    modifyPassword(password: String): Promise<any> {
        let params = {
            password: password
        }

        return this.http.put('api/password', params)
            .toPromise()
            .then(response => {
                return Promise.resolve();
            })
            .catch(this.handleError);
    }


    findOpenRangesByMerchantId(merchantId: number): Promise<Merchant> {
        return this.http.get('api/merchant/openRange/' + merchantId)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }


    saveMerchantsOfCustomer(merchantIds: Array<number>): Promise<Array<Merchant>> {
        let params = {
            merchantIds: merchantIds
        }
        return this.http.post('api/merchant', params)
            .toPromise()
            .then(response => {
                console.log(response.json());
                return response.json();
            })
            .catch(this.handleError);
    }

    findMerchantById(id: number): Promise<Merchant> {
        return this.http.get('api/merchant/id/' + id)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    findMerchantByIdWithIntro(id: number): Promise<Merchant> {
        return this.http.get('api/merchant/introduce/id/' + id)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    findMechantByName(name: string): Promise<Array<Merchant>> {
        return this.http.get('api/merchant/name/' + name)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    findMechantsOfCustomer(): Promise<Array<Merchant>> {
        return this.http.get('api/merchant')
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    countMechantsOfCustomer(): any {
        return this.http.get('api/merchant/size')
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}