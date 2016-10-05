import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryComponent } from './category.component';

const routes: Routes = [
    { path: '', redirectTo: ':merchantId', pathMatch: 'full' },
    { path: ':merchantId', component: CategoryComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

