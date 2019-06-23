import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyHomeComponent } from './my-home/my-home.component';
import { MyCenterComponent } from './my-center/my-center.component';
import { ModifyUserComponent } from './modifyuser/modifyuser.component';
import { MerchantComponent } from './merchant/merchant.component';
import { DelMerchantComponent } from './delmerchant/delmerchant.component';
import { TakeOrderComponent } from './takeorder/takeorder.component';
import { QuickSearchComponent } from './quicksearch/quicksearch.component';
import { ProductSearchComponent } from './quicksearch/productsearch.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
    {
        path: '',
        component: MyCenterComponent,
        children: [
            {
                path: '',
                component: MyHomeComponent
            },
            {
                path: 'modifyuser',
                component: ModifyUserComponent
            },
            {
                path: 'merchant',
                component: MerchantComponent
            },
            {
                path: 'delmerchant',
                component: DelMerchantComponent
            },
            {
                path: 'takeorder',
                component: TakeOrderComponent
            },
            {
                path: 'quicksearch',
                component: QuickSearchComponent
            },
            {
                path: 'quicksearch/:merchantId',
                component: ProductSearchComponent
            },
            {
                path: 'orderlist',
                component: OrderListComponent
            },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MyRoutingModule { }