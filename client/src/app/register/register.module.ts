import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NavbarModule } from '../navbar/navbar.module';
import { RegisterComponent } from './register.component';
import { routing } from './register.routing';

@NgModule({
    imports: [SharedModule, ReactiveFormsModule, RouterModule, NavbarModule,routing],
    declarations: [RegisterComponent]
})
export class RegisterModule { }