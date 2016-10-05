import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyComponent } from './my.component';

const routes: Routes = [
  { path: '', redirectTo: 'my', pathMatch: 'full' },
  { path: 'my', component: MyComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

