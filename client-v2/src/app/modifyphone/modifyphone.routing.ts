import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyPhoneComponent } from './modifyphone.component';

const routes: Routes = [
    { path: '', redirectTo: 'modifyuser', pathMatch: 'full' },
    { path: 'modifyuser', component: ModifyPhoneComponent }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ModifyPhoneRoutingModule { }