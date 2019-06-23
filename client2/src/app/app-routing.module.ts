import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'portal', loadChildren: './portal/portal.module#PortalModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartModule' },
  { path: 'order', loadChildren: './order/order.module#OrderModule' },
  { path: 'my', loadChildren: './my/my.module#MyModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: '', redirectTo: '/portal', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
