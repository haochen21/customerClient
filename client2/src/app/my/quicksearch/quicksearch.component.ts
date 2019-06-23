import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SecurityService } from '../../services/security.service';
import { Merchant } from '../../model/Merchant';

const URL = 'http://shop.km086.com:8080/ticketServer/security/merchant/image/';

@Component({
    selector: 'quicksearch-portal',
    templateUrl: './quicksearch.component.html',
    styleUrls: ['./quicksearch.component.css']
})
export class QuickSearchComponent implements OnInit {

    merchants: Array<Merchant> = new Array<Merchant>();

    imagePreUrl: string = URL;

    showBtn: boolean = false;

    constructor(
        private router: Router,
        private securityService: SecurityService) {

    }

    ngOnInit() {
        this.securityService.findMechantsOfCustomer()
            .subscribe(result => {
                this.merchants = result;
                if (this.merchants.length === 1 && this.merchants[0].open) {
                    this.goToMerchant(this.merchants[0]);
                } else {
                    this.showBtn = true;
                }
            });
    }

    addMerchant(event) {
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/my/merchant']);
    }

    goToMerchant(merchant: Merchant) {
        if (merchant.open) {
            this.router.navigate(['/my/quicksearch', merchant.id]);
        }
    }
}