import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form.component';
import { routing } from './login.routing';

@NgModule({
  imports: [SharedModule, routing],
  declarations: [LoginComponent, LoginFormComponent]
})
export class LoginModule { }