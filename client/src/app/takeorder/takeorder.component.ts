import { Component, OnInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { OrderService } from '../core/order.service';
import { SecurityService } from '../core/security.service';
import { SocketService } from '../core/socket.service';

import { Customer } from '../model/Customer';
import { Cart } from '../model/Cart';
import { CartPage } from '../model/CartPage';
import { CartStatus } from '../model/CartStatus';
import { CartFilter } from '../model/CartFilter';



@Component({
    selector: 'ticket-takeorder',
    templateUrl: './takeorder.component.html',
    styleUrls: ['./takeorder.component.css']
})
export class TakeOrderComponent implements OnInit, OnDestroy {

    customer: Customer;

    cartPage: CartPage = new CartPage();

    filter: CartFilter;

    size: number = 10;

    connection: any;

    private sub: any;

    constructor(
        private orderService: OrderService,
        private securityService: SecurityService,
        private socketService: SocketService,
        private slimLoader: SlimLoadingBarService) {

    }

    ngOnInit() {

        this.securityService.findCustomer().then(dbCustomer => {
            this.customer = dbCustomer;
            this.connectWebSocket();

            this.refresh();
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });

    }

    ngOnDestroy() {
        this.connection.unsubscribe();
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
        statuses.push(CartStatus.CONFIRMED);
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
                this.cartPage.content.unshift(cart);
            } else if (cart.status === CartStatus.DELIVERED) {
                 this.cartPage.content = this.cartPage.content.filter(c => c.id !== cart.id);
            }
        });
    }

    deliver(cart: Cart) {
        this.slimLoader.start();
        this.orderService.deliver(cart.id).then(value => {
            this.refresh();
            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });
    }

}