import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { NavbarComponent } from './navbar.component';


@NgModule({
    imports: [SharedModule, RouterModule],
    declarations: [NavbarComponent],
    exports: [NavbarComponent]
})
export class NavbarModule { }