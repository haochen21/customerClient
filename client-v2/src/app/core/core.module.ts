import {
    ModuleWithProviders, NgModule,
    Optional, SkipSelf
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { NoContent } from './no-content';

import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { SecurityService } from './security.service';
import { SocketService } from './socket.service';
import { StoreService } from './store.service';
import { WeixinService } from './weixin.service';

@NgModule({
    imports: [CommonModule, HttpModule],
    declarations: [NoContent],
    exports: [NoContent],
    providers: [CartService,OrderService,SecurityService, SocketService, StoreService, WeixinService]
})
export class CoreModule {

    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}