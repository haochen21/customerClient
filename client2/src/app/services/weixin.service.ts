import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Cart } from '../model/Cart';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class WeixinService {

    constructor(
        private http: HttpClient) { }

    getJsConfig(): Observable<any> {
        return this.http.get('weixin/pay/jsconfig');
    }

    getInfo(cart: Cart): Observable<any> {
        let body = JSON.stringify({ cart });
        return this.http.post('weixin/pay/info', body, httpOptions);
    }
}   