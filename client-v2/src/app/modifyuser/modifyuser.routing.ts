import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyUserComponent } from './modifyuser.component';

const routes: Routes = [
    { path: '', redirectTo: 'modifyuser', pathMatch: 'full' },
    { path: 'modifyuser', component: ModifyUserComponent }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ModifyUserRoutingModule { }