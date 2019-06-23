import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartCenterComponent } from './cart-center/cart-center.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { CartBillComponent } from './cart-bill/cart-bill.component';
const routes: Routes = [
    {
        path: '',
        component: CartCenterComponent,
        children: [
            {
                path: '',
                component: CartListComponent
            },
            {
                path: ':merchantId',
                component: CartBillComponent
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
export class CartRoutingModule { }