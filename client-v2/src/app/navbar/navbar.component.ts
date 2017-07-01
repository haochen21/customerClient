import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { SecurityService } from '../core/security.service';
import { CartService } from '../core/cart.service';

import { Cart } from '../model/Cart';

@Component({
    selector: 'ticket-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    isPortal: boolean;
    isCart: boolean;
    isOrder: boolean;
    isMy: boolean;

    totalItem: number = 0;

    subscription: Subscription;

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private cartService: CartService) {
    }

    ngOnInit() {
        this.isPortal = false;
        this.isCart = false;
        this.isOrder = false;
        this.isMy = false;

        this.getMenuNameActive();

        this.getTotalItem(JSON.parse(localStorage.getItem('carts')));

        this.subscription = this.cartService.pucharsingCart$.subscribe(
            carts => {
                console.log('menu cart: ' + carts);
                this.getTotalItem(carts);
            }
        );
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this.subscription.unsubscribe();
    }

    menuClick(menuName: string) {
        this.securityService.setMenuName(menuName);
        if (this.securityService.getMenuName() === 'portal') {
             this.router.navigate(['/portal']);
        } else if (this.securityService.getMenuName() === 'cart') {
           this.router.navigate(['/cart']);
        } else if (this.securityService.getMenuName() === 'order') {
            this.router.navigate(['/order',1]);
        } else if (this.securityService.getMenuName() === 'my') {
            this.router.navigate(['/my']);
        }
    }

    getMenuNameActive() {
        this.isPortal = false;
        this.isCart = false;
        this.isOrder = false;
        this.isMy = false;
        if (this.securityService.getMenuName() === 'portal') {
            this.isPortal = true;
        } else if (this.securityService.getMenuName() === 'cart') {
            this.isCart = true;
        } else if (this.securityService.getMenuName() === 'order') {
            this.isOrder = true;
        } else if (this.securityService.getMenuName() === 'my') {
            this.isMy = true;
        }
    }

    getTotalItem(carts: Array<any>) {
        this.totalItem = 0;
        if (carts && carts.length > 0) {
            for (let cart of carts) {
                for (let item of cart.cartItems) {
                    if (item.isChecked) {
                        this.totalItem = this.totalItem + item.quantity;
                    }
                }
            }
        }
    }
}