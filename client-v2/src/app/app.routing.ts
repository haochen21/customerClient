import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoContent } from './core/no-content';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'portal', pathMatch: 'full' },  
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterModule' },
  { path: 'order', loadChildren: './order/order.module#OrderModule' },
  { path: 'takeorder', loadChildren: './takeorder/takeorder.module#TakeOrderModule' },
  { path: 'product', loadChildren: './product/product.module#ProductModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartModule' },
  { path: 'category', loadChildren: './category/category.module#CategoryModule' },
  { path: 'merchant', loadChildren: './merchant/merchant.module#MerchantModule' },
  { path: 'delmerchant', loadChildren: './delmerchant/delmerchant.module#DelMerchantModule' },
  { path: 'my', loadChildren: './my/my.module#MyModule' },
  { path: 'modifyuser', loadChildren: './modifyuser/modifyuser.module#ModifyUserModule' },
  { path: 'modifyphone', loadChildren: './modifyphone/modifyphone.module#ModifyPhoneModule' }, 
  { path: 'quicksearch', loadChildren: './quicksearch/quicksearch.module#QuickSearchModule' }, 
  { path: '**', component: NoContent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes,{ useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }