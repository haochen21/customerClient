import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantComponent } from './merchant.component';

const routes: Routes = [
    { path: '', redirectTo: 'merchant', pathMatch: 'full' },
    { path: 'merchant', component: MerchantComponent }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MerchantRoutingModule { }