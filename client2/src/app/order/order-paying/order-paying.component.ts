import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faCheck, faYenSign } from '@fortawesome/free-solid-svg-icons';

import * as wx from 'weixin-js-sdk';
import { flatMap } from 'rxjs/operators';

import { OrderService } from '../../services/order.service';
import { SecurityService } from '../../services/security.service';
import { WeixinService } from '../../services/weixin.service';

import { Customer } from '../../model/Customer';
import { Cart } from '../../model/Cart';
import { CartPage } from '../../model/CartPage';
import { CartStatus } from '../../model/CartStatus';
import { CartFilter } from '../../model/CartFilter';


@Component({
    selector: 'app-order-paying',
    templateUrl: './order-paying.component.html',
    styleUrls: ['./order-paying.component.css']
})
export class OrderPayingComponent implements OnInit {

    faCheck = faCheck;
    faYenSign = faYenSign;

    customer: Customer;

    cartPage: CartPage = new CartPage();

    filter: CartFilter;

    size: number = 10;

    constructor(
        private orderService: OrderService,
        private securityService: SecurityService,
        private weixinService: WeixinService,
        private router: Router) {

    }

    ngOnInit() {
        this.securityService.findCustomer()
            .pipe(flatMap(dbCustomer => {
                this.customer = dbCustomer;
                this.refresh();
                return this.weixinService.getJsConfig();
            }))
            .subscribe(data => {
                wx.config(data);
            });
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
        statuses.push(CartStatus.PURCHASED);
        this.filter.statuses = statuses;

        this.filter.page = 0;
        this.filter.size = this.size;

        this.queryByFilter();
    }

    queryByFilter() {
        this.orderService.pageCartByFilter(this.filter)
            .subscribe(value => {
                this.cartPage = value;
                console.log(this.cartPage);
                this.filter.page = this.filter.page + 1;
            });
    }

    queryNextPage() {
        this.queryByFilter();
    }

    paying(cart: Cart) {
        let _thisObj = this;
        this.weixinService.getInfo(cart)
            .subscribe(payargs => {
                wx.chooseWXPay({
                    appId: payargs.appId,
                    timestamp: payargs.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: payargs.nonceStr, // 支付签名随机串，不长于 32 位
                    package: payargs.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: payargs.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: payargs.paySign, // 支付签名
                    success: function (res) {
                        if (res.errMsg === "chooseWXPay:ok") {
                            //支付成功  
                            _thisObj.router.navigate(['/my/orderlist']);
                        } else {
                            alert('支付失败');
                        }
                    },
                    cancel: function (res) {
                    }
                });

            });
    }

}