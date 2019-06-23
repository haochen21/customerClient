import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SecurityService } from '../../services/security.service';

import { Merchant } from '../../model/Merchant';

@Component({
    selector: 'ticket-merchant',
    templateUrl: './merchant.component.html',
    styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {

    choosedMerchants: Array<Merchant> = new Array<Merchant>();

    merchants: Array<Merchant> = new Array<Merchant>();

    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private securityService: SecurityService) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
        });
        this.securityService.findMechantsOfCustomer()
            .subscribe(result => {
                this.choosedMerchants = result;
                console.log(this.choosedMerchants);
            });
    }

    getFormControl(name) {
        return this.form.get(name);
    }

    valuechange(newValue) {
        if (newValue === '') {
            this.merchants = [];
        } else if (newValue.length >= 2) {
            this.securityService.findMechantByName(newValue)
                .subscribe(result => {
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
                });
        }

    }

    addConcern(merchant: Merchant) {
        let merchantIds: Array<number> = new Array();
        merchantIds.push(merchant.id);
        for (let cm of this.choosedMerchants) {
            merchantIds.push(cm.id);
        }
        this.securityService.saveMerchantsOfCustomer(merchantIds)
            .subscribe(result => {
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
            });
    }

    back() {
        window.history.back();
    }

}