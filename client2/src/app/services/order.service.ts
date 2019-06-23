import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Product } from '../model/Product';
import { Cart } from '../model/Cart';
import { CartPage } from '../model/CartPage';
import { CartFilter } from '../model/CartFilter';
import { CartStatusStat } from '../model/CartStatusStat';
import { OrderResult } from '../model/OrderResult';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class OrderService {

    constructor(
        private http: HttpClient) { }

    listCartByFilter(filter: CartFilter): Observable<CartPage> {
        let body = JSON.stringify({ filter });
        return this.http.post<CartPage>('api/cart/list', body, httpOptions);
    }

    pageCartByFilter(filter: CartFilter): Observable<CartPage> {
        let body = JSON.stringify({ filter });
        return this.http.post<CartPage>('api/cart/page', body, httpOptions);
    }

    statCartByStatus(filter: CartFilter): Observable<CartStatusStat[]> {
        let body = JSON.stringify({ filter });
        return this.http.post<CartStatusStat[]>('api/cart/stat/status', body, httpOptions);
    }

    statCartByProduct(filter: CartFilter): Observable<Product[]> {
        let body = JSON.stringify({ filter });
        return this.http.post<Product[]>('api/cart/stat/product', body, httpOptions);
    }

    statCartNumberByStatus(filter: CartFilter): Observable<any> {
        let body = JSON.stringify({ filter });
        return this.http.post('api/cart/stat/number', body, httpOptions);
    }

    statCartEarningByStatus(filter: CartFilter): Observable<any> {
        let body = JSON.stringify({ filter });
        return this.http.post('api/cart/stat/earning', body, httpOptions);
    }

    statEarningByCreatedOn(filter: CartFilter): Observable<Map<string, number>> {
        let body = JSON.stringify({ filter });
        return this.http.post<Map<string, number>>('api/cart/stat/earning/createdOn', body, httpOptions);
    }

    purchase(cart: Cart): Observable<OrderResult> {
        let body = JSON.stringify({ cart });
        return this.http.post<OrderResult>('api/cart/purchase', body, httpOptions);
    }

    paying(id: number): Observable<OrderResult> {
        return this.http.get<OrderResult>('api/cart/paying/' + id);
    }

    paid(id: number): Observable<OrderResult> {
        return this.http.get<OrderResult>('api/cart/paid/' + id);
    }

    deliver(id: number): Observable<OrderResult> {
        return this.http.get<OrderResult>('api/cart/deliver/' + id);
    }
}   