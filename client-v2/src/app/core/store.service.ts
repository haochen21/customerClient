import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Category } from '../model/Category';
import { Merchant } from '../model/Merchant';
import { Product } from '../model/Product';
import { SecurityService } from './security.service';

@Injectable()
export class StoreService {

    //imagePreUrl: string = "http://127.0.0.1:8080/ticketServer/store/product/image/";

    imagePreUrl: string = "http://120.25.90.244:8080/ticketServer/store/product/image/";

    constructor(
        private http: Http,
        private securityService: SecurityService) { }


    findCategoryByMerchantId(merchantId: number): Promise<Category[]> {
        return this.http.get('api/category/find/merchant/' + merchantId)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    findProduct(id: number): Promise<Product> {
        return this.http.get('api/product/' + id)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    findProductByMerchantId(merchantId: number): Promise<Product[]> {
        return this.http.get('api/product/find/merchant/' + merchantId)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    quickSearch(merchantId: number, code: string): Promise<Product[]> {
        return this.http.get('api/product/quicksearch/' + merchantId + "/" + code)
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