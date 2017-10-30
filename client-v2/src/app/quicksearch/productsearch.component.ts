import { Component, ApplicationRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StoreService } from '../core/store.service';
import { SecurityService } from '../core/security.service';
import { CartService } from '../core/cart.service';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { Customer } from '../model/Customer';
import { Product } from '../model/Product';
import { Merchant } from '../model/Merchant';
import { DiscountType } from '../model/DiscountType';
import { Cart } from '../model/Cart';
import { CartItem } from '../model/CartItem';

@Component({
    selector: 'productsearch-portal',
    templateUrl: './productsearch.component.html',
    styleUrls: ['./productsearch.component.css']
})
export class ProductSearchComponent implements OnInit, OnDestroy {

    customer: Customer;

    merchant: Merchant = new Merchant();

    products: Array<Product> = new Array<Product>();

    form: FormGroup;

    imagePreUrl: string = this.storeService.imagePreUrl;

    sub: any;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private storeService: StoreService,
        private securityService: SecurityService,
        private cartService: CartService,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private slimLoader: SlimLoadingBarService) {

        this.toastyConfig.theme = 'material';
    }

    ngOnInit() {
        this.slimLoader.start();
        this.securityService.findCustomer().then(dbCustomer => {
            this.customer = dbCustomer;

            this.sub = this.route.params.subscribe(params => {
                let merchantId = +params['merchantId'];
                this.securityService.findMerchantById(merchantId).then(dbMerchant => {
                    this.merchant = dbMerchant;
                }).catch(error => {
                    console.log(error);
                    this.slimLoader.complete();
                });
            });

            this.slimLoader.complete();
        }).catch(error => {
            console.log(error);
            this.slimLoader.complete();
        });

        this.form = this.formBuilder.group({
            'remark': ['', [Validators.minLength(0), Validators.maxLength(255)]],
            'code': ['', [Validators.minLength(1), Validators.maxLength(10)]]
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    valuechange(newValue) {
        if (newValue === '') {
            this.products = [];
        } else if (newValue.length >= 1) {
            this.storeService.quickSearch(this.merchant.id, newValue).then(result => {
                this.products = result;
            }).catch(error => {
                console.log(error);
            });
        }

    }

    addCart(event, product: Product) {
        let carts: Array<Cart> = JSON.parse(localStorage.getItem('carts'));
        if (!carts) {
            carts = new Array<Cart>();
        }
        let cart: Cart = null;
        for (let c of carts) {
            if (c.merchant.id === this.merchant.id) {
                cart = c;
                break;
            }
        }
        if (!cart) {
            cart = new Cart();
            cart.merchant = this.merchant;
            cart.customer = this.customer;
            cart.cartItems = new Array<CartItem>();

            carts.push(cart);
        }
        let cartItem: CartItem;
        for (let item of cart.cartItems) {
            if (item.product.id === product.id) {
                cartItem = item;
                break;
            }
        }
        if (!cartItem) {
            cartItem = new CartItem();
            cartItem.isChecked = true;
            cartItem.product = product;
            cartItem.name = product.name;
            cartItem.unitPrice = product.unitPrice;
            cartItem.quantity = 1;
            cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;
            cart.cartItems.push(cartItem);
        }
        cart.remark = this.form.value.remark;

        this.addToast("操作成功", product.name + " 加入购物车");
        console.log(carts);
        localStorage.setItem('carts', JSON.stringify(carts));
        this.cartService.changeCarts(carts);

        (<FormControl>this.form.controls['code']).setValue('');
        event.stopPropagation();
        event.preventDefault();
    }


    getProductDiscount(product: Product) {
        let price = product.unitPrice;
        if (this.merchant.discountType != null) {
            if (this.merchant.discountType == DiscountType.PERCNET) {
                price = price * this.merchant.discount;
            } else if (this.merchant.discountType == DiscountType.AMOUNT) {
                price = price - this.merchant.amount;
            }
        }
        return price;
    }

    addToast(title: string, msg: string) {
        var toastOptions: ToastOptions = {
            title: title,
            msg: msg,
            showClose: true,
            timeout: 1000,
            theme: "material",
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function (toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
        this.toastyService.success(toastOptions);
    }
}