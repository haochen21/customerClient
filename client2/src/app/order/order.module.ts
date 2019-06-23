import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentModule } from 'ngx-moment';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

import { OrderCenterComponent } from './order-center/order-center.component';
import { OrderPayingComponent } from './order-paying/order-paying.component';
import { OrderRoutingModule } from './order.routing';
import { CartStatusFormatPipe } from './CartStatus.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgZorroAntdMobileModule,
        FontAwesomeModule,
        MomentModule,
        MatTabsModule,
        MatButtonModule,
        OrderRoutingModule
    ],
    declarations: [
        CartStatusFormatPipe,
        OrderCenterComponent,
        OrderPayingComponent
    ]
})
export class OrderModule { }