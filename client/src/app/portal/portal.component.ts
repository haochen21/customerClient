import { Component, ApplicationRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { SecurityService } from '../core/security.service';
import { WeixinService } from '../core/weixin.service';

import { Customer } from '../model/Customer';
import { Merchant } from '../model/Merchant';


const URL = 'http://shop.km086.com:8080/ticketServer/security/merchant/image/';

var wx = require('imports-loader?this=>window!../../../jweixin-1.0.0.js')

@Component({
    selector: 'ticket-portal',
    templateUrl: './portal.component.html',
    styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit, OnDestroy {

    merchants: Array<Merchant> = new Array<Merchant>();

    imagePreUrl: string = URL;

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
            this.weixinService.getJsConfig().then(data => {
                wx.config(data);
            }).catch(error => {
                console.log(error);
                this.slimLoader.complete();
            });

        }).catch(error => {
            console.log(error);
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

    scanBarCode(event) {
        event.stopPropagation();
        event.preventDefault();
        let _that = this;
        wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                var values = result.split('=');
                if (values[0] === 'merchant') {
                    let merchantId = +values[1];
                    let isNew: boolean = true;
                    let merchantIds: Array<number> = new Array();
                    for (let merchant of _that.merchants) {
                        merchantIds.push(merchant.id);
                        if (merchantId === merchant.id) {
                            isNew = false;
                            break;
                        }
                    }
                    if (isNew) {
                        merchantIds.push(merchantId);
                        _that.securityService.saveMerchantsOfCustomer(merchantIds).then(result => {
                            _that.merchants = result;
                            _that.zone.run(() => _that._applicationRef.tick());
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
            }
        });
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