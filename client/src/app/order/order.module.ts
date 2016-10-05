import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { SharedModule } from '../shared/shared.module';


import { NavbarModule } from '../navbar/navbar.module';

import { OrderComponent } from './order.component';
import { routing } from './order.routing';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        SlimLoadingBarModule.forRoot(),
        MaterialModule.forRoot(),
        NavbarModule,
        routing
    ],
    declarations: [OrderComponent]
})
export class OrderModule { }