import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SecurityService } from '../core/security.service';

import { Customer } from '../model/Customer';
import { Merchant } from '../model/Merchant';

@Component({
    selector: 'ticket-merchant',
    templateUrl: './merchant.component.html',
    styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit, OnDestroy {

    choosedMerchants: Array<Merchant> = new Array<Merchant>();

    merchants: Array<Merchant> = new Array<Merchant>();

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private securityService: SecurityService) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
        });
        this.securityService.findMechantsOfCustomer().then(result => {
            this.choosedMerchants = result;
            console.log(this.choosedMerchants);
        }).catch(error => {
            console.log(error);
        });
    }

    ngOnDestroy() {

    }

    onSubmit() {
        let name = this.form.value.name;
        this.securityService.findMechantByName(name).then(result => {
            this.merchants = result;           
            for (let m of this.merchants) {
                m.concern = false;
                for (let cm of this.choosedMerchants) {
                    if (m.id === cm.id) {
                        m.concern = true;
                        break;
                    }
                }
            }
            console.log(this.merchants);
        }).catch(error => {
            console.log(error)
        });
    }

    addConcern(merchant: Merchant) {        
        let merchantIds: Array<number> = new Array();
        merchantIds.push(merchant.id);
        for (let cm of this.choosedMerchants) {
            merchantIds.push(cm.id);
        }
        this.securityService.saveMerchantsOfCustomer(merchantIds).then(result => {
            this.choosedMerchants = result;
            for (let m of this.merchants) {
                m.concern = false;
                for (let cm of this.choosedMerchants) {
                    if (m.id === cm.id) {
                        m.concern = true;
                        break;
                    }
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    back() {
        window.history.back();
    }

}