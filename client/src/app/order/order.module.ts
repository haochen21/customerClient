import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { SharedModule } from '../shared/shared.module';


import { NavbarModule } from '../navbar/navbar.module';

import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order.routing';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        SlimLoadingBarModule.forRoot(),
        MaterialModule,
        NavbarModule,
        OrderRoutingModule
    ],
    declarations: [OrderComponent]
})
export class OrderModule { }