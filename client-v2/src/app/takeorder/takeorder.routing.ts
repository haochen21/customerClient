import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TakeOrderComponent } from './takeorder.component';

const routes: Routes = [
    { path: '', redirectTo: 'takeorder', pathMatch: 'full' },
    { path: 'takeorder', component: TakeOrderComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class TakeOrderRoutingModule { }