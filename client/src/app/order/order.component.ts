import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

var wx = require('imports?this=>window!../../../jweixin-1.0.0.js')

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { OrderService } from '../core/order.service';
import { SecurityService } from '../core/security.service';
import { SocketService } from '../core/socket.service';
import { WeixinService } from '../core/weixin.service';

import { Customer } from '../model/Customer';
import { Cart } from '../model/Cart';
import { CartPage } from '../model/CartPage';
import { CartStatus } from '../model/CartStatus';
import { CartFilter } from '../model/CartFilter';



@Component({
    selector: 'ticket-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

    customer: Customer;

    cartPage: CartPage = new CartPage();

    filter: CartFilter;

    size: number = 10;

    connection: any;

    selectedTab: number = 0;

    tabs = [
        { label: '待付款' },
        { label: '待提货' },
        { label: '已完成' }
    ];

    private sub: any;

    constructor(
        private orderService: OrderService,
        private securityService: SecurityService,
        private socketService: SocketService,
        private weixinService: WeixinService,
        private route: ActivatedRoute,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            let needPay = +params['needPay'];
            if (needPay === 1) {
                this.selectedTab = 0;
            } else {
                this.selectedTab = 1;
            }

            this.slimLoader.start();

            this.securityService.findCustomer().then(dbCustomer => {
                this.customer = dbCustomer;
                this.connectWebSocket();

                this.refresh();
                this.slimLoader.complete();
            }).catch(error => {
                console.log(error);
                this.slimLoader.complete();
            });
        });

        this.weixinService.getJsConfig().then(data => {
            wx.config(data);
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });

    }

    ngOnDestroy() {
        this.connection.unsubscribe();
        this.sub.unsubscribe();
    }

    tabChange(event) {
        this.selectedTab = event.index;
        this.refresh();
    }

    getProductNumber(cart: Cart) {
        let number: number = 0;
        for (let i = 0; i < cart.cartItems.length; i++) {
            number += cart.cartItems[i].quantity;
        }
        return number;
    }

    showDetail(cart: Cart) {
        if (cart.showDetail) {
            cart.showDetail = false;
        } else {
            cart.showDetail = true;
        }
    }

    refresh() {
        this.filter = new CartFilter();

        let customerIds = new Array<number>();
        customerIds.push(this.customer.id);
        this.filter.customerIds = customerIds;

        let statuses: Array<CartStatus> = new Array<CartStatus>();
        if (this.selectedTab === 0) {
            statuses.push(CartStatus.PURCHASED);
        } else if (this.selectedTab === 1) {
            statuses.push(CartStatus.CONFIRMED);
        } else if (this.selectedTab === 2) {
            statuses.push(CartStatus.DELIVERED);
        }
        this.filter.statuses = statuses;

        this.filter.page = 0;
        this.filter.size = this.size;

        this.queryByFilter();
    }

    queryByFilter() {
        this.slimLoader.start();
        this.orderService.pageCartByFilter(this.filter).then(value => {
            this.cartPage = value;
            console.log(this.cartPage);
            this.filter.page = this.filter.page + 1;
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

    queryNextPage() {
        this.queryByFilter();
    }

    connectWebSocket() {
        this.connection = this.socketService.get(this.customer).subscribe(value => {
            let cart: Cart = value;
            console.log(cart);
            if (cart.status === CartStatus.CONFIRMED) {
                if (this.selectedTab === 0) {
                    this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
                } else if (this.selectedTab === 1) {
                    this.cartPage.content.unshift(cart);
                }
            } else if (cart.status === CartStatus.DELIVERED) {
                if (this.selectedTab === 0) {
                    this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
                } else if (this.selectedTab === 1) {
                    this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
                } else if (this.selectedTab === 2) {
                    this.cartPage.content.unshift(cart);
                }
            }
        });
    }

    paying(cart: Cart) {
        let _thisObj = this;
        //this.slimLoader.start();
        this.weixinService.getInfo(cart).then(payargs => {
            //this.slimLoader.complete();
            wx.chooseWXPay({
                appId: payargs.appId,
                timestamp: payargs.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: payargs.nonceStr, // 支付签名随机串，不长于 32 位
                package: payargs.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: payargs.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: payargs.paySign, // 支付签名
                success: function (res) {
                    if (res.errMsg == "chooseWXPay:ok") {
                        //支付成功                                         
                        _thisObj.selectedTab = 1;
                        _thisObj.refresh();
                    } else {
                        alert('支付失败');
                    }
                },
                cancel: function (res) {
                }
            });
        }).catch(error => {
            console.log(error);
            //this.slimLoader.complete();
        });
    }

    deliver(cart: Cart) {
        this.slimLoader.start();
        this.orderService.deliver(cart.id).then(value => {
            console.log(value);
            this.selectedTab = 2;
            this.refresh();
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

}