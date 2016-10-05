import { ModuleWithProviders } from '@angular/core';
import { RouterModule }        from '@angular/router';

import { PortalComponent } from './portal.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'portal', component: PortalComponent}
]);
