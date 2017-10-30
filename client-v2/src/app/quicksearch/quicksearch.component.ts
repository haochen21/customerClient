import { Component, ApplicationRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { SecurityService } from '../core/security.service';
import { WeixinService } from '../core/weixin.service';

import { Customer } from '../model/Customer';
import { Merchant } from '../model/Merchant';


const URL = 'http://shop.km086.com:8080/ticketServer/security/merchant/image/';

@Component({
    selector: 'quicksearch-portal',
    templateUrl: './quicksearch.component.html',
    styleUrls: ['./quicksearch.component.css']
})
export class QuickSearchComponent implements OnInit, OnDestroy {

    merchants: Array<Merchant> = new Array<Merchant>();

    imagePreUrl: string = URL;

    showBtn:boolean = false;

    constructor(
        private router: Router,
        private zone: NgZone,
        private _applicationRef: ApplicationRef,
        private securityService: SecurityService,
        private weixinService: WeixinService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {
        this.slimLoader.start();
        this.securityService.findMechantsOfCustomer().then(result => {
            this.merchants = result;
            this.slimLoader.complete();
            if (this.merchants.length === 1 && this.merchants[0].open) {
                this.goToMerchant(this.merchants[0]);
            }else {
                this.showBtn = true;
            }
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
            if (error.status && error.status === 401) {
                this.router.navigate(['/login']);
            }
        });
    }

    ngOnDestroy() {

    }

    addMerchant(event) {
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/merchant']);
    }

    goToMerchant(merchant: Merchant) {
        if (merchant.open) {
            this.router.navigate(['/quicksearch', merchant.id]);
        }
    }
}