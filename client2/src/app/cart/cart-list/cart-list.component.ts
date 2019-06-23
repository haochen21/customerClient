import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StoreService } from '../../services/store.service';
import { MessageService } from "../../services/message.service";

import { DiscountType } from '../../model/DiscountType';
import { Cart } from '../../model/Cart';
import { CartItem } from '../../model/CartItem';

@Component({
    selector: 'app-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {

    carts: Array<Cart>;

    imagePreUrl: string = this.storeService.imagePreUrl;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private storeService: StoreService) {
    }

    ngOnInit() {
        this.carts = JSON.parse(localStorage.getItem('carts'));
    }

    changeItemCheck(item: CartItem, event) {
        item.isChecked = event.checked;
        this.saveCarts();
    }

    addQuality(item: CartItem) {
        if (item.quantity < 5) {
            item.quantity++;
            item.totalPrice = item.unitPrice * item.quantity;
            this.saveCarts();
        }
    }

    minusQuality(item: CartItem) {
        if (item.quantity > 1) {
            item.quantity--;
            item.totalPrice = item.unitPrice * item.quantity;
            this.saveCarts();
        }
    }

    removeItem(cart: Cart, item: CartItem) {
        cart.cartItems = cart.cartItems.filter(i => i.product.id !== item.product.id);
        if (cart.cartItems.length == 0) {
            this.carts = this.carts.filter(c => c.merchant.id !== cart.merchant.id);
        }
        this.saveCarts();
    }

    getTotalQuality(cart: Cart) {
        let total: number = 0;
        for (let item of cart.cartItems) {
            if (item.isChecked) {
                total = total + item.quantity;
            }
        }
        return total;
    }

    getTotalPirce(cart: Cart) {
        let total: number = 0;
        for (let item of cart.cartItems) {
            if (item.isChecked) {
                total = total + item.totalPrice;
            }
        }
        return total;
    }

    getPayPrice(cart: Cart) {
        let payPrice = this.getTotalPirce(cart);
        if (cart.merchant.discountType != null) {
            if (cart.merchant.discountType == DiscountType.PERCNET) {
                payPrice = payPrice * cart.merchant.discount;
            } else if (cart.merchant.discountType == DiscountType.AMOUNT) {
                let numberOfItem = 0;
                for (let item of cart.cartItems) {
                    numberOfItem = numberOfItem + item.quantity;
                }
                payPrice = payPrice - cart.merchant.amount * numberOfItem;
            }
        }
        return payPrice;
    }

    getItemDiscount(cart: Cart, item: CartItem) {
        let price = item.unitPrice;
        if (cart.merchant.discountType != null) {
            if (cart.merchant.discountType == DiscountType.PERCNET) {
                price = price * cart.merchant.discount;
            } else if (cart.merchant.discountType == DiscountType.AMOUNT) {
                price = price - cart.merchant.amount;
            }
        }
        return price;
    }

    purchase(cart: Cart) {
        cart.cartItems = cart.cartItems.filter(item => item.isChecked);
        this.saveCarts();
        this.router.navigate(['/cart', cart.merchant.id]);
    }

    saveCarts() {
        localStorage.setItem('carts', JSON.stringify(this.carts));
        this.messageService.changeMessage("add cart item");
    }

    isMinimumOrder(cart: Cart) {
        if (cart.merchant.minimumOrder != null) {
            let totalPrice = this.getPayPrice(cart);
            if (totalPrice >= cart.merchant.minimumOrder) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

    getLeftMinimumOrder(cart: Cart) {
        if (cart.merchant.minimumOrder != null) {
            let totalPrice = this.getPayPrice(cart);
            return cart.merchant.minimumOrder - totalPrice;
        }
        return 0;
    }
}

