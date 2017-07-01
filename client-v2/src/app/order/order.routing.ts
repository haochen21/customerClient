import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';

const routes: Routes = [
    { path: '', redirectTo: ':needPay', pathMatch: 'full' },
    { path: ':needPay', component: OrderComponent }
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