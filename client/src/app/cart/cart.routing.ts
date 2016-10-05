import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartComponent } from './cart.component';
import { CartBillComponent } from './cart-bill.component';

const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: CartComponent },
    { path: ':merchantId', component: CartBillComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

