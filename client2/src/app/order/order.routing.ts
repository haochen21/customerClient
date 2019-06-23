import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCenterComponent } from './order-center/order-center.component';
import { OrderPayingComponent } from './order-paying/order-paying.component';

const routes: Routes = [
    {
        path: '',
        component: OrderCenterComponent,
        children: [
            {
                path: 'paying',
                component: OrderPayingComponent
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
export class OrderRoutingModule { }