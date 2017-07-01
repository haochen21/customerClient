import { Component, ApplicationRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { SecurityService } from '../core/security.service';
import { WeixinService } from '../core/weixin.service';

import { Customer } from '../model/Customer';
import { Merchant } from '../model/Merchant';


const URL = 'http://shop.km086.com:8080/ticketServer/security/merchant/image/';

@Component({
    selector: 'ticket-portal',
    templateUrl: './portal.component.html',
    styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit, OnDestroy {

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
            if (this.merchants.length === 1) {
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
            this.router.navigate(['/category', merchant.id]);
        }
    }

    cancelConcern(event, merchant: Merchant) {
        let merchantIds: Array<number> = this.merchants.filter(m => m.id !== merchant.id).map(m => m.id);
        this.securityService.saveMerchantsOfCustomer(merchantIds).then(result => {
            this.merchants = result;
        }).catch(error => {
            console.log(error)
        });
        event.stopPropagation();
        event.preventDefault();
    }
}