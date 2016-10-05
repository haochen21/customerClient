import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product.component';

const routes: Routes = [
    { path: '', redirectTo: 'product', pathMatch: 'full' },
    { path: 'product', component: ProductComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
