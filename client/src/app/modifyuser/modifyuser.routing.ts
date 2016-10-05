import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyUserComponent } from './modifyuser.component';

const routes: Routes = [
    { path: '', redirectTo: 'modifyuser', pathMatch: 'full' },
    { path: 'modifyuser', component: ModifyUserComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

