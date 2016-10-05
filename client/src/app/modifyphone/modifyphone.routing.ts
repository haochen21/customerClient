import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyPhoneComponent } from './modifyphone.component';

const routes: Routes = [
    { path: '', redirectTo: 'modifyuser', pathMatch: 'full' },
    { path: 'modifyuser', component: ModifyPhoneComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

