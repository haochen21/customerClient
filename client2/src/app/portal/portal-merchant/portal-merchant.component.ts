import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { SecurityService } from '../../services/security.service';

import { Merchant } from '../../model/Merchant';

const URL = 'http://shop.km086.com/merchant/';

@Component({
    selector: 'app-portal-merchant',
    templateUrl: './portal-merchant.component.html',
    styleUrls: ['./portal-merchant.component.css']
})
export class PortalMerchantComponent implements OnInit {

    faSearch = faSearch;
    
    merchants: Merchant[] = new Array<Merchant>();

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
            this.router.navigate(['/portal/category', merchant.id]);
        }
    }


}