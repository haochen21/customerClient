import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Category } from '../model/Category';
import { Product } from '../model/Product';
import { SecurityService } from './security.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    //imagePreUrl: string = "http://127.0.0.1:8080/ticketServer/store/product/image/";

    imagePreUrl: string = "http://120.25.90.244:8080/ticketServer/store/product/image/";

    constructor(
        private http: HttpClient,
        private securityService: SecurityService) { }


    findCategoryByMerchantId(merchantId: number): Observable<Category[]> {
        return this.http.get<Category[]>('api/category/find/merchant/' + merchantId);
    }

    findProduct(id: number): Observable<Product> {
        return this.http.get<Product>('api/product/' + id);
    }

    findProductByMerchantId(merchantId: number): Observable<Product[]> {
        return this.http.get<Product[]>('api/product/find/merchant/' + merchantId);
    }

    quickSearch(merchantId: number, code: string): Observable<Product[]> {
        return this.http.get<Product[]>('api/product/quicksearch/' + merchantId + "/" + code);
    }
}   