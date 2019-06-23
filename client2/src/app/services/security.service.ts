import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Merchant } from '../model/Merchant';
import { Customer } from '../model/Customer';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class SecurityService {


    constructor(private http: HttpClient) { }

    menuName: String = 'portal';

    setMenuName(name: String) {
        this.menuName = name;
    }

    getMenuName() {
        return this.menuName;
    }
    login(loginName: String, password: String): Observable<any> {
        let params = {
            loginName: loginName,
            password: password
        }
        return this.http.post('api/login', params);
    }

    logout() {
        return this.http.get('logout');
    }

    findCustomer(): Observable<Customer> {
        return this.http.get<Customer>('api/customer');
    }

    findCustomerWithOrderAddrress(): Observable<Customer> {
        return this.http.get<Customer>('api/customer/orderAddress');
    }

    registerCustomer(customer: Customer): Observable<Customer> {
        let body = JSON.stringify({ customer });
        return this.http.post<Customer>('api/customer', body, httpOptions);
    }

    modifyCustomer(customer: Customer): Observable<Customer> {
        let body = JSON.stringify({ customer });
        return this.http.put<Customer>('api/customer', body, httpOptions);
    }

    modifyCustomerPhone(phone: String): Observable<any> {
        let params = {
            phone: phone
        }

        return this.http.put('api/modifyPhone', params);
    }


    modifyPassword(password: String): Observable<any> {
        let params = {
            password: password
        }

        return this.http.put('api/password', params);
    }


    findOpenRangesByMerchantId(merchantId: number): Observable<Merchant> {
        return this.http.get<Merchant>('api/merchant/openRange/' + merchantId);
    }


    saveMerchantsOfCustomer(merchantIds: Array<number>): Observable<Merchant[]> {
        let params = {
            merchantIds: merchantIds
        }
        return this.http.post<Merchant[]>('api/merchant', params);
    }

    findMerchantById(id: number): Observable<Merchant> {
        return this.http.get<Merchant>('api/merchant/id/' + id);
    }

    findMerchantByIdWithIntro(id: number): Observable<Merchant> {
        return this.http.get<Merchant>('api/merchant/introduce/id/' + id);
    }

    findMechantByName(name: string): Observable<Merchant[]> {
        return this.http.get<Merchant[]>('api/merchant/name/' + name);
    }

    findMechantsOfCustomer(): Observable<Merchant[]> {
        return this.http.get<Merchant[]>('api/merchant');
    }

    countMechantsOfCustomer(): Observable<any> {
        return this.http.get('api/merchant/size');
    }

}