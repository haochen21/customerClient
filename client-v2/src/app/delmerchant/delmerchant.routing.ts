import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelMerchantComponent } from './delmerchant.component';

const routes: Routes = [
    { path: '', redirectTo: 'delmerchant', pathMatch: 'full' },
    { path: 'delmerchant', component: DelMerchantComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DelMerchantRoutingModule { }