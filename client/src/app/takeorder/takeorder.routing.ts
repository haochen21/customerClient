import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TakeOrderComponent } from './takeorder.component';

const routes: Routes = [
    { path: '', redirectTo: 'takeorder', pathMatch: 'full' },
    { path: 'takeorder', component: TakeOrderComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

