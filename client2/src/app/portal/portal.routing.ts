import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalCenterComponent } from './portal-center/portal-center.component';
import { PortalMerchantComponent } from './portal-merchant/portal-merchant.component';
import { PortalCategoryComponent } from './portal-category/portal-category.component';
import { PortalProductComponent } from './portal-product/portal-product.component';

const routes: Routes = [
    {
        path: '',
        component: PortalCenterComponent,
        children: [
            {
                path: '',
                component: PortalMerchantComponent
            },
            {
                path: 'category/:merchantId',
                component: PortalCategoryComponent
            },
            {
                path: 'product',
                component: PortalProductComponent
            }
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
export class PortalRoutingModule { }