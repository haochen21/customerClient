import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import * as moment from 'moment';

import { SecurityService } from '../core/security.service';
import { StoreService } from '../core/store.service';
import { OrderService } from '../core/order.service';
import { CartService } from '../core/cart.service';

import { Customer } from '../model/Customer';
import { Merchant } from '../model/Merchant';
import { Category } from '../model/Category';
import { Cart } from '../model/Cart';
import { CartItem } from '../model/CartItem';
import { OpenRange } from '../model/OpenRange';
import { Product } from '../model/Product';
import { OrderResult } from '../model/OrderResult';

@Component({
    selector: 'ticket-cartbill',
    providers: [StoreService, OrderService],
    templateUrl: './cart-bill.component.html',
    styleUrls: ['./cart-bill.component.css']
})
export class CartBillComponent implements OnInit, OnDestroy {

    customer: Customer;

    carts: Array<Cart>;

    cart: Cart;

    imagePreUrl: string = this.storeService.imagePreUrl;

    cartTakeTime: Array<any> = new Array();

    nextDay: boolean = false;

    selectNextDay: boolean = false;

    form: FormGroup;

    orderResult: OrderResult;

    private sub: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private storeService: StoreService,
        private securityService: SecurityService,
        private orderService: OrderService,
        private cartService: CartService,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private slimLoader: SlimLoadingBarService) {
        this.toastyConfig.theme = 'material';
    }

    ngOnInit() {
        document.body.style.backgroundColor = '#f2f0f0';

        this.slimLoader.start();

        this.securityService.findUser().then(user => {
            this.customer = <Customer>user;
            this.carts = JSON.parse(localStorage.getItem('carts'));
            console.log(this.carts);
            this.form = this.formBuilder.group({
                'takeTimeRange': [, [Validators.required]]
            });
            this.sub = this.route.params.subscribe(params => {
                let merchantId = +params['merchantId']; // (+) converts string 'id' to a number
                for (let cart of this.carts) {
                    if (cart.merchant.id === merchantId) {
                        this.cart = cart;
                        break;
                    }
                }
                console.log(this.cart);
                this.securityService.findOpenRangesByMerchantId(merchantId).then(value => {
                    this.covertTimeToDate(value.openRanges);
                    if (this.cartTakeTime.length === 0) {
                        this.nextDay = true;
                        this.covertNextTimeToDate(value.openRanges);
                    }
                }).catch(error => {
                    console.log(error);
                });
            });
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });


    }

    ngOnDestroy() {
        document.body.style.backgroundColor = '';
        this.sub.unsubscribe();
    }

    getTotalPirce() {
        let total: number = 0;
        for (let item of this.cart.cartItems) {
            if (item.isChecked) {
                total = total + item.totalPrice;
            }
        }
        return total;
    }

    covertTimeToDate(openRanges: Array<OpenRange>) {

        //get max take time
        let takeTimeLimit: number = 0;
        for (let cartItem of this.cart.cartItems) {
            let product: Product = cartItem.product;
            if (product.needPay && product.takeTimeLimit > takeTimeLimit) {
                takeTimeLimit = product.takeTimeLimit;
            }
        }
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
                    desc: beginTimes[0] + ':' + beginTimes[1] + ' - ' + endTimes[0] + ':' + endTimes[1]
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
                desc: beginTimes[0] + ':' + beginTimes[1] + ' - ' + endTimes[0] + ':' + endTimes[1]
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

    onSubmit() {
        this.slimLoader.start();
        this.orderResult = null;
        this.cart.takeBeginTime = this.form.value.takeTimeRange.takeBeginTime;
        this.cart.takeEndTime = this.form.value.takeTimeRange.takeEndTime;

        this.orderService.purchase(this.cart).then(value => {
            this.orderResult = value;
            console.log(this.orderResult);
            if (this.orderResult.result) {
                this.carts = this.carts.filter(c => c.merchant.id !== this.cart.merchant.id);
                localStorage.setItem('carts', JSON.stringify(this.carts));
                this.cartService.changeCarts(this.carts);
                let needPay = this.orderResult.cart.needPay ? 1 : 0;
                this.router.navigate(['/order', needPay]);
            }
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });

    }

    addToast(title: string, msg: string) {
        var toastOptions: ToastOptions = {
            title: title,
            msg: msg,
            showClose: true,
            timeout: 3000,
            theme: "material",
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function (toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
        this.toastyService.success(toastOptions);
    }
}

