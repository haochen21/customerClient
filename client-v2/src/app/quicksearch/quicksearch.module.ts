import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ToastyModule } from 'ng2-toasty';

import { MaterialModule } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { NavbarModule } from '../navbar/navbar.module';

import { QuickSearchComponent } from './quicksearch.component';
import { ProductSearchComponent } from './productsearch.component';

import { QuickSearchRoutingModule } from './quicksearch.routing';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
        ToastyModule.forRoot(),
        SlimLoadingBarModule.forRoot(),
        NavbarModule,
        QuickSearchRoutingModule,
    ],
    declarations: [
        QuickSearchComponent,
        ProductSearchComponent
    ]
})
export class QuickSearchModule { }