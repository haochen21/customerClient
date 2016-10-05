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

    findCategoryByMerchant(): Promise<Category[]> {
        return this.http.get('api/category/find/merchant')
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    findCategoryByMerchantId(merchantId: number): Promise<Category[]> {
        return this.http.get('api/category/find/merchant/' + merchantId)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    createCategory(category: Category): Promise<Category> {
        let body = JSON.stringify({ category });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/category', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    modifyCategory(category: Category): Promise<Category> {  
        let body = JSON.stringify({ category });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('api/category', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    deleteCategory(id: number): Promise<any> {
        return this.http.delete('api/category/' + id)
            .toPromise()
            .then(response => {
                let result = response.json();
                return response.json();
            })
            .catch(this.handleError);
    }

    findCategory(id: number): Promise<Category> {
        return this.http.get('api/category/' + id)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    createProduct(product: Product): Promise<Product> {
        let body = JSON.stringify({ product });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('api/product', body, options)
            .toPromise()
            .then(response => {
                return response.json();
            })
            .catch(this.handleError);
    }

    modifyProduct(product: Product): Promise<Product> {
        let body = JSON.stringify({ product });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put('api/product', body, options)
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

    findProductByMerchant(): Promise<Product[]> {
        return this.http.get('api/product/find/merchant')
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

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}   