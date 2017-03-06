import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { MaterialModule } from '@angular/material';

import { ModifyPhoneComponent } from './modifyphone.component';
import { ModifyPhoneRoutingModule } from './modifyphone.routing';

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        ModifyPhoneRoutingModule
    ],
    declarations: [ModifyPhoneComponent]
})
export class ModifyPhoneModule { }