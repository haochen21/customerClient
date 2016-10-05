import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Category } from '../model/Category';
import { Merchant } from '../model/Merchant';
import { Product } from '../model/Product';
import { Cart } from '../model/Cart';
import { CartPage } from '../model/CartPage';
import { CartFilter } from '../model/CartFilter';
import { CartStatusStat } from '../model/CartStatusStat';
import { CartProductStat } from '../model/CartProductStat';
import { OrderResult } from '../model/OrderResult';

@Injectable()
export class OrderService {

    constructor(
        private http: Http) { }

    listCartByFilter(filter: CartFilter): Promise<CartPage> {
        let body = JSON.stringify({ filter });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/list', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    pageCartByFilter(filter: CartFilter): Promise<CartPage> {
        let body = JSON.stringify({ filter });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/page', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    statCartByStatus(filter: CartFilter): Promise<Array<CartStatusStat>> {
        let body = JSON.stringify({ filter });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/stat/status', body, options)
            .toPromise()
            .then(response => {
                return new Promise(resolve => {
                    resolve(response.json());
                });
            })
            .catch(this.handleError);
    }

    statCartByProduct(filter: CartFilter): Promise<Array<Product>> {
        let body = JSON.stringify({ filter });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/stat/product', body, options)
            .toPromise()
            .then(response => {
                return new Promise(resolve => {
                    resolve(response.json());
                });
            })
            .catch(this.handleError);
    }
    
    statCartNumberByStatus(filter: CartFilter): Promise<any> {
        let body = JSON.stringify({ filter });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/stat/number', body, options)
            .toPromise()
            .then(response => {
                return new Promise(resolve => {
                    resolve(response.json());
                });
            })
            .catch(this.handleError);
    }

    statCartEarningByStatus(filter: CartFilter): Promise<any> {
        let body = JSON.stringify({ filter });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/stat/earning', body, options)
            .toPromise()
            .then(response => {
                return new Promise(resolve => {
                    resolve(response.json());
                });
            })
            .catch(this.handleError);
    }

    statEarningByCreatedOn(filter: CartFilter): Promise<Map<string,number>> {
        let body = JSON.stringify({ filter });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/stat/earning/createdOn', body, options)
            .toPromise()
            .then(response => {
                return new Promise(resolve => {
                    resolve(response.json());
                });
            })
            .catch(this.handleError);
    }

    purchase(cart: Cart): Promise<OrderResult> {
        let body = JSON.stringify({ cart });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/cart/purchase', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    paying(id: number): Promise<OrderResult> {
        return this.http.get('api/cart/paying/'+id)
            .toPromise()
            .then(response => {
                return new Promise(resolve => {
                    resolve(response.json());
                });
            })
            .catch(this.handleError);
    }

    paid(id: number): Promise<OrderResult> {
        return this.http.get('api/cart/paid/'+id)
            .toPromise()
            .then(response => {
                return new Promise(resolve => {
                    resolve(response.json());
                });
            })
            .catch(this.handleError);
    }

    deliver(id: number): Promise<OrderResult> {
        return this.http.get('api/cart/deliver/'+id)
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