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
import { DiscountType } from '../model/DiscountType';
import { Category } from '../model/Category';
import { Cart } from '../model/Cart';
import { CartItem } from '../model/CartItem';
import { OpenRange } from '../model/OpenRange';
import { Product } from '../model/Product';
import { OrderResult } from '../model/OrderResult';
import { OrderAddress } from '../model/OrderAddress';

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

    orderAddress: OrderAddress;

    imagePreUrl: string = this.storeService.imagePreUrl;

    cartTakeTime: Array<any> = new Array();

    productOpenTimeNoOverlap: boolean = false;

    selectNextDay: boolean = false;

    inDoorForm: FormGroup;

    outDoorForm: FormGroup;

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

        this.inDoorForm = this.formBuilder.group({
            'takeTimeRange': [, [Validators.required]],
            'remark': ['', [Validators.minLength(0), Validators.maxLength(255)]]
        });

        this.outDoorForm = this.formBuilder.group({
            'name': ['', Validators.required],
            'address': ['', Validators.required],
            'phone': ['', Validators.required],
            'remark': ['', [Validators.minLength(0), Validators.maxLength(255)]]
        });
    }

    ngOnInit() {
        document.body.style.backgroundColor = '#f2f0f0';

        this.slimLoader.start();

        this.securityService.findCustomerWithOrderAddrress().then(dbCustomer => {
            this.customer = dbCustomer;
            this.carts = JSON.parse(localStorage.getItem('carts'));
            console.log(this.carts);

            let address = '';
            if (this.customer.orderAddresses) {
                for (let orderAddress of this.customer.orderAddresses) {
                    if (orderAddress.lastCheck) {
                        address = orderAddress.address;
                        break;
                    }
                }
            }
            (<FormControl>this.outDoorForm.controls['name']).setValue(this.customer.name);
            (<FormControl>this.outDoorForm.controls['phone']).setValue(this.customer.phone);
            (<FormControl>this.outDoorForm.controls['address']).setValue(address);


            this.sub = this.route.params.subscribe(params => {
                let merchantId = +params['merchantId']; // (+) converts string 'id' to a number
                for (let cart of this.carts) {
                    if (cart.merchant.id === merchantId) {
                        this.cart = cart;
                        break;
                    }
                }
                console.log(this.cart);
                let openRanges: Array<OpenRange> = new Array<OpenRange>();
                for (let cartItem of this.cart.cartItems) {
                    let product: Product = cartItem.product;
                    for (let range of product.openRanges) {
                        let beginDate: moment.Moment = moment(range.beginTime.toString(), "HH:mm:ss");
                        let endDate: moment.Moment = moment(range.endTime.toString(), "HH:mm:ss");
                        range.beginTime = beginDate.toDate();
                        range.endTime = endDate.toDate();

                        let exist: boolean = false;
                        for (let openRange of openRanges) {
                            if (range.id === openRange.id) {
                                exist = true;
                                openRange.index = openRange.index++;
                                break;
                            }
                        }
                        if (!exist) {
                            range.index = 1;
                            openRanges.push(range);
                        }
                    }
                }
                //openRanges = openRanges.filter(openRange => openRange.index === this.cart.cartItems.length);
                if (openRanges.length === 0) {
                    this.productOpenTimeNoOverlap = true;
                } else {
                    this.covertTimeToDate(openRanges);
                    this.covertNextTimeToDate(openRanges);
                }
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

    getItemDiscount(item: CartItem) {
        let price = item.unitPrice;
        if (this.cart.merchant.discountType != null) {
            if (this.cart.merchant.discountType == DiscountType.PERCNET) {
                price = price * this.cart.merchant.discount;
            } else if (this.cart.merchant.discountType == DiscountType.AMOUNT) {
                price = price - this.cart.merchant.amount;
            }
        }
        return price;
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

    getPayPrice() {
        let payPrice = this.getTotalPirce();
        if (this.cart.merchant.discountType != null) {
            if (this.cart.merchant.discountType == DiscountType.PERCNET) {
                payPrice = payPrice * this.cart.merchant.discount;
            } else if (this.cart.merchant.discountType == DiscountType.AMOUNT) {
                let numberOfItem = 0;
                for (let item of this.cart.cartItems) {
                    numberOfItem = numberOfItem + item.quantity;
                }
                payPrice = payPrice - this.cart.merchant.amount * numberOfItem;
            }
        }
        return payPrice;
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

        // use current merchant opentime range
        let userCurrentOpenTime: boolean = true;
        for (let cartItem of this.cart.cartItems) {
            let product: Product = cartItem.product;
            if (!product.openRange) {
                userCurrentOpenTime = false;
            }
        }

        let now: moment.Moment = moment(new Date());
        now = now.add(takeTimeLimit, 'minutes');
        for (let openRange of openRanges) {
            let beginDateTime: moment.Moment = moment(new Date());
            beginDateTime = beginDateTime.hours(openRange.beginTime.getHours()).minutes(openRange.beginTime.getMinutes()).seconds(openRange.beginTime.getSeconds()).milliseconds(0);
            let beginTimes = beginDateTime.format('HH:mm:ss').split(':');

            let endDateTime: moment.Moment = moment(new Date());
            endDateTime = endDateTime.hours(openRange.endTime.getHours()).minutes(openRange.endTime.getMinutes()).seconds(openRange.endTime.getSeconds()).milliseconds(0);
            let endTimes = endDateTime.format('HH:mm:ss').split(':');

            if (now.isBefore(beginDateTime)) {
                this.cartTakeTime.push({
                    takeBeginTime: beginDateTime.toDate(),
                    takeEndTime: endDateTime.toDate(),
                    desc: beginTimes[0] + ':' + beginTimes[1] + ' - ' + endTimes[0] + ':' + endTimes[1],
                    nextDay: false
                });
            } else if (now.isBetween(beginDateTime, endDateTime) && userCurrentOpenTime) {
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

    covertNextTimeToDate(openRanges: Array<OpenRange>) {
        for (let openRange of openRanges) {
            let beginDateTime: moment.Moment = moment(new Date()).add(1, 'd');
            beginDateTime = beginDateTime.hours(openRange.beginTime.getHours()).minutes(openRange.beginTime.getMinutes()).seconds(openRange.beginTime.getSeconds()).milliseconds(0);
            let beginTimes = beginDateTime.format('HH:mm:ss').split(':');
            let endDateTime: moment.Moment = moment(new Date()).add(1, 'd');
            endDateTime = endDateTime.hours(openRange.endTime.getHours()).minutes(openRange.endTime.getMinutes()).seconds(openRange.endTime.getSeconds()).milliseconds(0);
            let endTimes = endDateTime.format('HH:mm:ss').split(':');

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

    changeOrderAddress(selectedAddress: string) {
        (<FormControl>this.outDoorForm.controls['address']).setValue(selectedAddress);
    }

    onInDoorSubmit() {
        this.slimLoader.start();
        this.orderResult = null;
        this.cart.takeOut = false;
        this.cart.takeBeginTime = this.inDoorForm.value.takeTimeRange.takeBeginTime;
        this.cart.takeEndTime = this.inDoorForm.value.takeTimeRange.takeEndTime;
        this.cart.remark = this.inDoorForm.value.remark;

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

    onOutDoorSubmit() {
        this.slimLoader.start();
        this.orderResult = null;
        this.cart.takeOut = true;
        this.cart.name = this.outDoorForm.value.name;
        this.cart.address = this.outDoorForm.value.address;
        this.cart.phone = this.outDoorForm.value.phone;
        this.cart.remark = this.outDoorForm.value.remark;

        let beginDate: moment.Moment = moment(new Date());
        beginDate.hours(0).minutes(0).seconds(0).milliseconds(0);
        this.cart.takeBeginTime = beginDate.toDate();

        let endDate: moment.Moment = moment(new Date());
        endDate.hours(23).minutes(59).seconds(59).milliseconds(0);
        this.cart.takeEndTime = endDate.toDate();

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

    changeNextDay(event: any) {
        this.selectNextDay = !this.selectNextDay;
    }

    isOneTime() {
        let result = false;
        let todayTakeTime = [];
        for (var i = 0; i < this.cartTakeTime.length; i++) {
            if (!this.cartTakeTime[i].nextDay) {
                todayTakeTime.push(this.cartTakeTime[i]);
            }
        }
        if (todayTakeTime.length == 1) {
            return true;
        } else {
            return false;
        }
    }
}

