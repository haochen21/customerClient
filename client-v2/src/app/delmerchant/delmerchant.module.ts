import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { MaterialModule } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { NavbarModule } from '../navbar/navbar.module';

import { DelMerchantComponent } from './delmerchant.component';
import { DelMerchantRoutingModule } from './delmerchant.routing';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        MaterialModule,
        SlimLoadingBarModule.forRoot(),
        NavbarModule,
        DelMerchantRoutingModule
    ],
    declarations: [DelMerchantComponent]
})
export class DelMerchantModule { }