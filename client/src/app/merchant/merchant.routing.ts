import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';

const routes: Routes = [
    { path: '', redirectTo: 'merchant', pathMatch: 'full' },
    { path: 'merchant', component: MerchantComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);