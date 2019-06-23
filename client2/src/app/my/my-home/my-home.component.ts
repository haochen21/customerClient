import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { faInfo, faTrash, faObjectGroup, faPencilAlt, faBolt, faCartPlus } from '@fortawesome/free-solid-svg-icons';

import { OrderService } from '../../services/order.service';
import { SecurityService } from '../../services/security.service';

import { Customer } from '../../model/Customer';
import { CartStatus } from '../../model/CartStatus';
import { CartFilter } from '../../model/CartFilter';

@Component({
  selector: 'app-my',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css']
})
export class MyHomeComponent implements OnInit {

  faInfo = faInfo;
  faTrash= faTrash;
  faObjectGroup = faObjectGroup;
  faPencilAlt = faPencilAlt;
  faBolt = faBolt;
  faCartPlus = faCartPlus;
  
  customer: Customer = new Customer();

  cartNumber: number = 0;

  merchantNumber: number = 0;

  earning: number = 0;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private securityService: SecurityService) { }

  ngOnInit() {
    this.securityService.findCustomer()
      .subscribe(dbCustomer => {
        this.customer = dbCustomer;
        this.statCartNumber();
        this.statMerchantNumber();
      });
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

    this.orderService.statCartNumberByStatus(filter)
      .subscribe(value => {
        console.log(value);
        this.cartNumber = value.number;
      });
  }

  statMerchantNumber() {
    this.securityService.countMechantsOfCustomer()
      .subscribe(value => {
        console.log(value);
        this.merchantNumber = value;
      });
  }

  logout() {
    this.securityService.logout().subscribe(value => {
      this.router.navigate(['/login']);
    });
  }
}