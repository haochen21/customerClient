import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatRadioModule } from '@angular/material/radio';

import { OrderByPipe } from './Sort.pipe';
import { OpenRangePipe } from './OpenRange.pipe';
import { StringToArrayPipe } from './StringToArray.pipe';
import { PortalCenterComponent } from './portal-center/portal-center.component';
import { PortalMerchantComponent } from './portal-merchant/portal-merchant.component';
import { PortalCategoryComponent } from './portal-category/portal-category.component';
import { PortalProductComponent } from './portal-product/portal-product.component';
import { PortalRoutingModule } from './portal.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgZorroAntdMobileModule,
        FontAwesomeModule,
        MatRadioModule,
        PortalRoutingModule
    ],
    declarations: [
        OrderByPipe,
        OpenRangePipe,
        StringToArrayPipe,
        PortalCenterComponent,
        PortalMerchantComponent,
        PortalCategoryComponent,
        PortalProductComponent
    ]
})
export class PortalModule { }