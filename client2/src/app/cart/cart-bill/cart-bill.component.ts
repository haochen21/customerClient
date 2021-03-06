import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { map, flatMap } from 'rxjs/operators';

import * as moment from 'moment';

import { SecurityService } from '../../services/security.service';
import { StoreService } from '../../services/store.service';
import { OrderService } from '../../services/order.service';

import { Customer } from '../../model/Customer';
import { DiscountType } from '../../model/DiscountType';
import { Cart } from '../../model/Cart';
import { CartItem } from '../../model/CartItem';
import { OpenRange } from '../../model/OpenRange';
import { OpenRangeType } from '../../model/OpenRangeType';
import { Product } from '../../model/Product';
import { OrderResult } from '../../model/OrderResult';
import { OrderAddress } from '../../model/OrderAddress';

@Component({
    selector: 'app-cartbill',
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

    selectToday: boolean = true;

    selectNextDay: boolean = false;

    inDoorForm: FormGroup;

    outDoorForm: FormGroup;

    orderResult: OrderResult;

    private sub: any;

    openRangeType: OpenRangeType = OpenRangeType.OFF;

    errorInfo: string = null;

    takeTimeOk: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private storeService: StoreService,
        private securityService: SecurityService,
        private orderService: OrderService) {

        this.inDoorForm = this.formBuilder.group({
            'takeTimeRange': [, [Validators.required]],
            'remark': ['', [Validators.minLength(0), Validators.maxLength(255)]]
        });

        this.outDoorForm = this.formBuilder.group({
            'takeTimeRange': [],
            'name': ['', Validators.required],
            'address': ['', Validators.required],
            'phone': ['', Validators.required],
            'remark': ['', [Validators.minLength(0), Validators.maxLength(255)]]
        });
    }

    ngOnInit() {
        //document.body.style.backgroundColor = '#f2f0f0';
        let merchantId = +this.route.snapshot.params.merchantId;

        this.securityService.findCustomerWithOrderAddrress()
            .pipe(flatMap(dbCustomer => {
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
                for (let cart of this.carts) {
                    if (cart.merchant.id === merchantId) {
                        this.cart = cart;

                        (<FormControl>this.outDoorForm.controls['remark']).setValue(this.cart.remark);
                        (<FormControl>this.inDoorForm.controls['remark']).setValue(this.cart.remark);

                        return this.securityService.findOpenRangesByMerchantId(this.cart.merchant.id);
                    }
                }
            }))
            .pipe(map(value => {
                this.covertOpenRangeTimeToDate(value.openRanges);
                this.cart.merchant = value;
                return value;
            }))
            .subscribe(value => {
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
    }

    ngOnDestroy() {
        //document.body.style.backgroundColor = '';
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
        if (this.cart.merchant.packageFee != null) {
            payPrice = payPrice + this.cart.merchant.packageFee;
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
        this.takeTimeOk = true;
    }

    changeOrderAddress(selectedAddress: string) {
        (<FormControl>this.outDoorForm.controls['address']).setValue(selectedAddress);
    }

    onInDoorSubmit() {
        this.orderResult = null;
        this.cart.takeOut = false;
        if (this.inDoorForm.value.takeTimeRange) {
            this.cart.takeBeginTime = this.inDoorForm.value.takeTimeRange.takeBeginTime;
            this.cart.takeEndTime = this.inDoorForm.value.takeTimeRange.takeEndTime;
        } else {
            let todayTakeTime = [];
            if (this.selectToday) {
                for (var i = 0; i < this.cartTakeTime.length; i++) {
                    if (!this.cartTakeTime[i].nextDay) {
                        todayTakeTime.push(this.cartTakeTime[i]);
                    }
                }
            } else if (this.selectNextDay) {
                for (var i = 0; i < this.cartTakeTime.length; i++) {
                    if (this.cartTakeTime[i].nextDay) {
                        todayTakeTime.push(this.cartTakeTime[i]);
                    }
                }
            }
            this.cart.takeBeginTime = todayTakeTime[0].takeBeginTime;
            this.cart.takeEndTime = todayTakeTime[0].takeEndTime;
        }

        this.cart.remark = this.inDoorForm.value.remark;

        this.orderService.purchase(this.cart)
            .subscribe(value => {
                this.orderResult = value;
                console.log(this.orderResult);
                if (this.orderResult.result) {
                    this.carts = this.carts.filter(c => c.merchant.id !== this.cart.merchant.id);
                    localStorage.setItem('carts', JSON.stringify(this.carts));
                    let needPay = this.orderResult.cart.needPay ? 1 : 0;
                    if (needPay == 1) {
                        this.router.navigate(['/order/paying']);
                    } else {
                        this.router.navigate(['/my/orderlist']);
                    }
                }
            });

    }

    onOutDoorSubmit() {
        this.orderResult = null;
        this.cart.takeOut = true;
        this.cart.name = this.outDoorForm.value.name;
        this.cart.address = this.outDoorForm.value.address;
        this.cart.phone = this.outDoorForm.value.phone;
        this.cart.remark = this.outDoorForm.value.remark;

        if (this.outDoorForm.value.takeTimeRange) {
            this.cart.takeBeginTime = this.outDoorForm.value.takeTimeRange.takeBeginTime;
            this.cart.takeEndTime = this.outDoorForm.value.takeTimeRange.takeEndTime;
        } else {
            let todayTakeTime = [];
            if (this.selectToday) {
                for (var i = 0; i < this.cartTakeTime.length; i++) {
                    if (!this.cartTakeTime[i].nextDay) {
                        todayTakeTime.push(this.cartTakeTime[i]);
                    }
                }
            } else if (this.selectNextDay) {
                for (var i = 0; i < this.cartTakeTime.length; i++) {
                    if (this.cartTakeTime[i].nextDay) {
                        todayTakeTime.push(this.cartTakeTime[i]);
                    }
                }
            }
            this.cart.takeBeginTime = todayTakeTime[0].takeBeginTime;
            this.cart.takeEndTime = todayTakeTime[0].takeEndTime;
        }

        if (this.isMerchantOff()) {
            this.errorInfo = '商家下单时间结束';
        } else {
            this.orderService.purchase(this.cart)
                .subscribe(value => {
                    this.orderResult = value;
                    console.log(this.orderResult);
                    if (this.orderResult.result) {
                        this.carts = this.carts.filter(c => c.merchant.id !== this.cart.merchant.id);
                        localStorage.setItem('carts', JSON.stringify(this.carts));
                        let needPay = this.orderResult.cart.needPay ? 1 : 0;
                        if (needPay == 1) {
                            this.router.navigate(['/order/paying']);
                        } else {
                            this.router.navigate(['/my/orderlist']);
                        }
                    } else {
                        this.errorInfo = '订单生成失败，请从购物车中删除当前订单，并重新下单';
                    }
                });
        }
    }



    changeNextDay(event: any) {
        this.selectToday = !this.selectToday;
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

    isNextDayOneTime() {
        let result = false;
        let nextDayTakeTime = [];
        for (var i = 0; i < this.cartTakeTime.length; i++) {
            if (this.cartTakeTime[i].nextDay) {
                nextDayTakeTime.push(this.cartTakeTime[i]);
            }
        }
        if (nextDayTakeTime.length == 1) {
            return true;
        } else {
            return false;
        }
    }

    covertOpenRangeTimeToDate(openRanges: Array<OpenRange>) {
        for (let openRange of openRanges) {
            if (openRange.beginTime && openRange.endTime) {
                let beginDate: moment.Moment = moment(openRange.beginTime.toString(), "HH:mm:ss");
                let endDate: moment.Moment = moment(openRange.endTime.toString(), "HH:mm:ss");

                openRange.beginTime = beginDate.toDate();
                openRange.endTime = endDate.toDate();
            }
        }
    }

    isMerchantOff() {
        let now: moment.Moment = moment(new Date());
        if (this.cart.merchant.openRanges) {
            for (let openRange of this.cart.merchant.openRanges) {
                if (openRange.type === OpenRangeType.OFF && now.isBetween(openRange.beginTime, openRange.endTime)) {
                    return true;
                }
            }
        }
        return false;
    }
}

