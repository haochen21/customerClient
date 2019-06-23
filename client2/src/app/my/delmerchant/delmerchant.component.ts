import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { SecurityService } from '../../services/security.service';

import { Merchant } from '../../model/Merchant';

const URL = 'http://shop.km086.com:8080/ticketServer/security/merchant/image/';

@Component({
    selector: 'ticket-delmerchant',
    templateUrl: './delmerchant.component.html',
    styleUrls: ['./delmerchant.component.css']
})
export class DelMerchantComponent implements OnInit {

    faTrash = faTrash;

    merchants: Array<Merchant> = new Array<Merchant>();

    imagePreUrl: string = URL;

    constructor(
        private router: Router,
        private securityService: SecurityService) {

    }

    ngOnInit() {
        this.securityService.findMechantsOfCustomer()
            .subscribe(result => {
                this.merchants = result;
            });
    }

    cancelConcern(event, merchant: Merchant) {
        let merchantIds: Array<number> = this.merchants.filter(m => m.id !== merchant.id).map(m => m.id);
        this.securityService.saveMerchantsOfCustomer(merchantIds)
            .subscribe(result => {
                this.merchants = result;
            });
        event.stopPropagation();
        event.preventDefault();
    }
}