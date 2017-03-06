import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { NavbarModule } from '../navbar/navbar.module';
import { MaterialModule } from '@angular/material';

import { MyComponent } from './my.component';
import { MyRoutingModule } from './my.routing';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        MaterialModule,
        SlimLoadingBarModule.forRoot(),
        NavbarModule,
        MyRoutingModule
    ],
    declarations: [MyComponent]
})
export class MyModule { }