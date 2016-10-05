import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { ModifyUserComponent } from './modifyuser.component';
import { routing } from './modifyuser.routing';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule, RouterModule, routing],
  declarations: [ModifyUserComponent]
})
export class ModifyUserModule { }