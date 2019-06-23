import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { MomentModule } from 'ngx-moment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { CartCenterComponent } from './cart-center/cart-center.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { CartBillComponent } from './cart-bill/cart-bill.component';
import { CartRoutingModule } from './cart.routing';
import { OpenRangePipe } from './OpenRange.pipe';
import { OpenRangeTypePipe } from './OpenRangeType.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgZorroAntdMobileModule,
        FontAwesomeModule,
        MomentModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonModule,
        CartRoutingModule
    ],
    declarations: [
        OpenRangePipe,
        OpenRangeTypePipe,
        CartCenterComponent,
        CartListComponent,
        CartBillComponent
    ]
})
export class CartModule { }