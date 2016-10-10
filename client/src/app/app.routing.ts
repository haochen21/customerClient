import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContent } from './core/no-content';

export const routes: Routes = [
  { path: '', redirectTo: 'portal', pathMatch: 'full' },  
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule' },
  { path: 'register', loadChildren: 'app/register/register.module#RegisterModule' },
  { path: 'order', loadChildren: 'app/order/order.module#OrderModule' },
  { path: 'product', loadChildren: 'app/product/product.module#ProductModule' },
  { path: 'cart', loadChildren: 'app/cart/cart.module#CartModule' },
  { path: 'category', loadChildren: 'app/category/category.module#CategoryModule' },
  { path: 'merchant', loadChildren: 'app/merchant/merchant.module#MerchantModule' },
  { path: 'my', loadChildren: 'app/my/my.module#MyModule' },
  { path: 'modifyuser', loadChildren: 'app/modifyuser/modifyuser.module#ModifyUserModule' },
  { path: 'modifyphone', loadChildren: 'app/modifyphone/modifyphone.module#ModifyPhoneModule' },  
  { path: '**', component: NoContent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });

