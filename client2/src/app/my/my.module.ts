import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { MomentModule } from 'ngx-moment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

import { OrderByPipe } from './Sort.pipe';
import { CartStatusFormatPipe } from './CartStatus.pipe';

import { MyRoutingModule } from './my.routing';
import { MyHomeComponent } from './my-home/my-home.component';
import { MyCenterComponent } from './my-center/my-center.component';
import { ModifyUserComponent } from './modifyuser/modifyuser.component';
import { MerchantComponent } from './merchant/merchant.component';
import { DelMerchantComponent } from './delmerchant/delmerchant.component';
import { TakeOrderComponent } from './takeorder/takeorder.component';
import { QuickSearchComponent } from './quicksearch/quicksearch.component';
import { ProductSearchComponent } from './quicksearch/productsearch.component';
import { OrderListComponent } from './order-list/order-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdMobileModule,
    FontAwesomeModule,
    MomentModule,
    MatButtonModule,
    MatTabsModule,
    MyRoutingModule
  ],
  declarations: [
    OrderByPipe,
    CartStatusFormatPipe,
    MyHomeComponent,
    MyCenterComponent,
    ModifyUserComponent,
    MerchantComponent,
    DelMerchantComponent,
    TakeOrderComponent,
    QuickSearchComponent,
    ProductSearchComponent,
    OrderListComponent
  ]
})
export class MyModule { }