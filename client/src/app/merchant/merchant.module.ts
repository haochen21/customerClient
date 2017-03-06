import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';

import { MerchantComponent } from './merchant.component';
import { MerchantRoutingModule } from './merchant.routing';

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        MaterialModule,
        NavbarModule,
        MerchantRoutingModule
    ],
    declarations: [MerchantComponent]
})
export class MerchantModule { }