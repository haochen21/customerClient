import { Component, OnInit } from '@angular/core';

import { OrderService } from '../../services/order.service';
import { SecurityService } from '../../services/security.service';

import { Customer } from '../../model/Customer';
import { Cart } from '../../model/Cart';
import { CartPage } from '../../model/CartPage';
import { CartStatus } from '../../model/CartStatus';
import { CartFilter } from '../../model/CartFilter';



@Component({
    selector: 'ticket-takeorder',
    templateUrl: './takeorder.component.html',
    styleUrls: ['./takeorder.component.css']
})
export class TakeOrderComponent implements OnInit {

    customer: Customer;

    cartPage: CartPage = new CartPage();

    filter: CartFilter;

    size: number = 10;

    constructor(
        private orderService: OrderService,
        private securityService: SecurityService) {

    }

    ngOnInit() {
        this.securityService.findCustomer()
            .subscribe(dbCustomer => {
                this.customer = dbCustomer;
                this.refresh();
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
        statuses.push(CartStatus.CONFIRMED);
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

    deliver(cart: Cart) {
        this.orderService.deliver(cart.id)
            .subscribe(value => {
                this.refresh();
            });
    }

}