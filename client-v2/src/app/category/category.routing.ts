import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';

const routes: Routes = [
    { path: '', redirectTo: ':merchantId', pathMatch: 'full' },
    { path: ':merchantId', component: CategoryComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CategoryRoutingModule { }