import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { OrderService } from '../core/order.service';
import { SecurityService } from '../core/security.service';

import { Customer } from '../model/Customer';
import { Cart } from '../model/Cart';
import { CartPage } from '../model/CartPage';
import { CartItem } from '../model/CartItem';
import { CartStatus } from '../model/CartStatus';
import { CartFilter } from '../model/CartFilter';

import { DateFormatPipe } from '../shared/DateFormat.pipe';

@Component({
  selector: 'ticket-my', 
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.css']
})
export class MyComponent implements OnInit, OnDestroy {

  customer: Customer = new Customer();

  cartNumber: number = 0;

  merchantNumber: number = 0;

  earning: number = 0;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private securityService: SecurityService,
    private slimLoader: SlimLoadingBarService) { }

  ngOnInit() {
    this.slimLoader.start();

    document.body.style.backgroundColor = '#f5f5f5';

    this.securityService.findCustomer().then(dbCustomer => {
      this.customer = dbCustomer;
      this.statCartNumber();
      this.statMerchantNumber();
      this.slimLoader.complete();
    }).catch(error => {
      console.log(error);
      this.slimLoader.complete();
    });
  }

  ngOnDestroy() {
    document.body.style.backgroundColor = '#fff';
  }

  statCartNumber() {
    let filter: CartFilter = new CartFilter();

    let customerIds = new Array<number>();
    customerIds.push(this.customer.id);
    filter.customerIds = customerIds;

    let beginDate: moment.Moment = moment(new Date());
    beginDate.hours(0).minutes(0).seconds(0).milliseconds(0);
    let createTimeAfter: Date = beginDate.toDate();
    filter.createTimeAfter = createTimeAfter;

    let endDate: moment.Moment = moment(new Date());
    endDate.hours(23).minutes(59).seconds(59).milliseconds(999);
    let createTimeBefore: Date = endDate.toDate();
    filter.createTimeBefore = createTimeBefore;

    let statuses: Array<CartStatus> = new Array<CartStatus>();
    statuses.push(CartStatus.CONFIRMED);
    statuses.push(CartStatus.DELIVERED);
    filter.statuses = statuses;

    this.orderService.statCartNumberByStatus(filter).then(value => {
      console.log(value);
      this.cartNumber = value.number;
    }).catch(error => {
      Promise.reject("error");
    });
  }

  statMerchantNumber() {
    this.securityService.countMechantsOfCustomer().then(value => {
      console.log(value);
      this.merchantNumber = value;
    }).catch(error => {
      Promise.reject("error");
    });
  }

  logout() {
    this.securityService.logout().then(value => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.log("error");
    });
  }
}