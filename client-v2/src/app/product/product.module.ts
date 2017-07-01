import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { MaterialModule } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product.routing';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,       
        SlimLoadingBarModule.forRoot(),
        MaterialModule,
        NavbarModule,
        ProductRoutingModule
    ],
    declarations: [ProductComponent]
})
export class ProductModule { }