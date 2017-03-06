import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@angular/material';
import { ToastyModule } from 'ng2-toasty';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { SharedModule } from '../shared/shared.module';


import { NavbarModule } from '../navbar/navbar.module';

import { CartComponent } from './cart.component';
import { CartBillComponent } from './cart-bill.component';
import { CartRoutingModule } from './cart.routing';


@NgModule({
    imports: [
        ReactiveFormsModule,
        SharedModule,
        RouterModule,
        ToastyModule.forRoot(),
        SlimLoadingBarModule.forRoot(),
        MaterialModule,
        NavbarModule,
        CartRoutingModule
    ],
    declarations: [CartComponent,CartBillComponent]
})
export class CartModule { }