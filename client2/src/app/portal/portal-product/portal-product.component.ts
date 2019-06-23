import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { flatMap } from 'rxjs/operators';

import { StoreService } from '../../services/store.service';
import { SecurityService } from '../../services/security.service';

import { Customer } from '../../model/Customer';
import { Merchant } from '../../model/Merchant';
import { DiscountType } from '../../model/DiscountType';
import { Cart } from '../../model/Cart';
import { CartItem } from '../../model/CartItem';
import { Product } from '../../model/Product';
import { OpenRange } from '../../model/OpenRange';

@Component({
    selector: 'portal-product',
    templateUrl: './portal-product.component.html',
    styleUrls: ['./portal-product.component.css']
})
export class PortalProductComponent implements OnInit {

    customer: Customer;

    merchant: Merchant;

    product: Product;

    cartTakeTime: Array<any> = new Array();

    imagePreUrl: string = this.storeService.imagePreUrl;

    private sub: any;

    constructor(
        private storeService: StoreService,
        private securityService: SecurityService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        let merchantId = +this.route.snapshot.params.merchantId;
        let id = +this.route.snapshot.params['id'];

        this.securityService.findCustomer()
        .pipe(flatMap(dbCustomer => {
            this.customer = dbCustomer;

            return this.securityService.findMerchantById(merchantId);
        }))
        .pipe(flatMap(dbMerchant => {
            this.merchant = dbMerchant;
                    this.storeService.findProduct(id);
                    return this.storeService.findProduct(id);
        }))
        .subscribe(value => {
            this.product = value;
            console.log(this.product);
            this.covertTimeToDate(value.openRanges);
            this.covertNextTimeToDate(value.openRanges);
        });
    }

    getStockDescription() {
        let stockDescription: string = '';
        if (this.product.infinite) {
            stockDescription = '无限库存';
        } else {
            if (this.product.unitsInStock === 0) {
                stockDescription = '库存为0';
            } else if (this.product.unitsInStock > 50) {
                stockDescription = '' + this.product.unitsInStock;
            } else {
                stockDescription = '库存有限，请尽快下单';
            }
        }
        return stockDescription;
    }

    covertNextTimeToDate(openRanges: Array<OpenRange>) {
        for (let openRange of openRanges) {
            let beginDateTime: moment.Moment = moment(new Date()).add(1, 'd');
            let beginTimes: any = openRange.beginTime.toString().split(':');
            beginDateTime = beginDateTime.hours(beginTimes[0]).minutes(beginTimes[1]).seconds(beginTimes[2]).milliseconds(0);

            let endDateTime: moment.Moment = moment(new Date()).add(1, 'd');
            let endTimes: any = openRange.endTime.toString().split(':');
            endDateTime = endDateTime.hours(endTimes[0]).minutes(endTimes[1]).seconds(endTimes[2]).milliseconds(0);

            this.cartTakeTime.push({
                takeBeginTime: beginDateTime.toDate(),
                takeEndTime: endDateTime.toDate(),
                desc: beginTimes[0] + ':' + beginTimes[1] + ' - ' + endTimes[0] + ':' + endTimes[1],
                nextDay: true
            });
        }
        this.cartTakeTime.sort(function (a, b) {
            if (a.takeBeginTime > b.takeBeginTime) {
                return 1;
            }
            if (a.takeBeginTime < b.takeBeginTime) {
                return -1;
            }
            return 0;
        });
        console.log(this.cartTakeTime);
    }

    getProductDiscount(item: CartItem) {
        let price = this.product.unitPrice;
        if (this.merchant.discountType != null) {
            if (this.merchant.discountType == DiscountType.PERCNET) {
                price = price * this.merchant.discount;
            } else if (this.merchant.discountType == DiscountType.AMOUNT) {
                price = price - this.merchant.amount;
            }
        }
        return price;
    }

    addCart(product: Product) {
        let carts: Array<Cart> = JSON.parse(localStorage.getItem('carts'));
        if (!carts) {
            carts = new Array<Cart>();
        }
        let cart: Cart = null;
        for (let c of carts) {
            if (c.merchant.id === this.merchant.id) {
                cart = c;
                break;
            }
        }
        if (!cart) {
            cart = new Cart();
            cart.merchant = this.merchant;
            cart.customer = this.customer;
            cart.cartItems = new Array<CartItem>();

            carts.push(cart);
        }
        let cartItem: CartItem;
        for (let item of cart.cartItems) {
            if (item.product.id === product.id) {
                cartItem = item;
                break;
            }
        }
        if (!cartItem) {
            cartItem = new CartItem();
            cartItem.isChecked = true;
            cartItem.product = product;
            cartItem.name = product.name;
            cartItem.unitPrice = product.unitPrice;
            cartItem.quantity = 1;
            cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;           
            cart.cartItems.push(cartItem);
        }
        console.log(carts);
        localStorage.setItem('carts', JSON.stringify(carts));
        window.history.back();
    }

    covertTimeToDate(openRanges: Array<OpenRange>) {
        //get max take time
        let takeTimeLimit: number = this.product.takeTimeLimit;
        let now: moment.Moment = moment(new Date());
        now = now.add(takeTimeLimit, 'minutes');
        console.log(now.toDate());
        for (let openRange of openRanges) {
            let beginDateTime: moment.Moment = moment(new Date());
            let beginTimes: any = openRange.beginTime.toString().split(':');
            beginDateTime = beginDateTime.hours(beginTimes[0]).minutes(beginTimes[1]).seconds(beginTimes[2]).milliseconds(0);

            let endDateTime: moment.Moment = moment(new Date());
            let endTimes: any = openRange.endTime.toString().split(':');
            endDateTime = endDateTime.hours(endTimes[0]).minutes(endTimes[1]).seconds(endTimes[2]).milliseconds(0);

            if (now.isBefore(beginDateTime)) {
                this.cartTakeTime.push({
                    takeBeginTime: beginDateTime.toDate(),
                    takeEndTime: endDateTime.toDate(),
                    desc: beginTimes[0] + ':' + beginTimes[1] + ' - ' + endTimes[0] + ':' + endTimes[1],
                    nextDay: false
                });
            } else if (now.isBetween(beginDateTime, endDateTime) && this.product.openRange) {
                this.cartTakeTime.push({
                    takeBeginTime: beginDateTime.toDate(),
                    takeEndTime: endDateTime.toDate(),
                    desc: beginTimes[0] + ':' + beginTimes[1] + ' - ' + endTimes[0] + ':' + endTimes[1],
                    nextDay: false
                });
            }
        }
        this.cartTakeTime.sort(function (a, b) {
            if (a.takeBeginTime > b.takeBeginTime) {
                return 1;
            }
            if (a.takeBeginTime < b.takeBeginTime) {
                return -1;
            }
            return 0;
        });
        console.log(this.cartTakeTime);
    }
}