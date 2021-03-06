import { NgModule } from '@angular/core';

import { MaterialModule } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { SharedModule } from '../shared/shared.module';


import { NavbarModule } from '../navbar/navbar.module';

import { TakeOrderComponent } from './takeorder.component';
import { TakeOrderRoutingModule } from './takeorder.routing';


@NgModule({
    imports: [
        SharedModule,
        SlimLoadingBarModule.forRoot(),
        MaterialModule,
        NavbarModule,
        TakeOrderRoutingModule
    ],
    declarations: [TakeOrderComponent]
})
export class TakeOrderModule { }