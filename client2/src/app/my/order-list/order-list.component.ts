import { Component, OnInit } from '@angular/core';

import { faCheck, faYenSign } from '@fortawesome/free-solid-svg-icons';

import { OrderService } from '../../services/order.service';
import { SecurityService } from '../../services/security.service';

import { Customer } from '../../model/Customer';
import { Cart } from '../../model/Cart';
import { CartPage } from '../../model/CartPage';
import { CartStatus } from '../../model/CartStatus';
import { CartFilter } from '../../model/CartFilter';


@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

    faCheck = faCheck;
    faYenSign = faYenSign;
    
    customer: Customer;

    cartPage: CartPage = new CartPage();

    filter: CartFilter;

    size: number = 10;

    selectedTab: number = 0;

    tabs = [
        { label: '待提货' },
        { label: '已完成' }
    ];

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
            statuses.push(CartStatus.CONFIRMED);
        } else if (this.selectedTab === 1) {
            statuses.push(CartStatus.DELIVERED);
        }
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

}