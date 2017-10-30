import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickSearchComponent } from './quicksearch.component';
import { ProductSearchComponent } from './productsearch.component';

const routes: Routes = [
    { path: '', redirectTo: 'quicksearch', pathMatch: 'full' },
    { path: 'quicksearch', component: QuickSearchComponent },
    { path: ':merchantId', component: ProductSearchComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class QuickSearchRoutingModule { }