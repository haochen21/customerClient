import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Cart } from '../model/Cart';

@Injectable()
export class WeixinService {

    constructor(
        private http: Http) { }
    
    getJsConfig(): Promise<any> {
         return this.http.get('weixin/pay/jsconfig')
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    getInfo(cart: Cart): Promise<any> {
        let body = JSON.stringify({ cart });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('weixin/pay/info', body, options)
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