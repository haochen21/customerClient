import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { StoreService } from '../core/store.service';
import { SecurityService } from '../core/security.service';
import { CartService } from '../core/cart.service';

import { Customer } from '../model/Customer';
import { Merchant } from '../model/Merchant';
import { DiscountType } from '../model/DiscountType';
import { Category } from '../model/Category';
import { Cart } from '../model/Cart';
import { CartItem } from '../model/CartItem';
import { Product } from '../model/Product';
import { ProductStatus } from '../model/ProductStatus';

@Component({
    selector: 'ticket-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

    customer: Customer;

    merchant: Merchant;

    categorys: Array<Category>;

    products: Array<Product>;

    private sub: any;

    imagePreUrl: string = this.storeService.imagePreUrl;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private storeService: StoreService,
        private securityService: SecurityService,
        private cartService: CartService,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private slimLoader: SlimLoadingBarService
    ) {
        this.toastyConfig.theme = 'material';
    }

    ngOnInit() {
        this.slimLoader.start();

        this.securityService.findCustomer().then(dbCustomer => {
            this.customer = dbCustomer;

            this.sub = this.route.params.subscribe(params => {
                let merchantId: number = +params['merchantId'];
                this.securityService.findMerchantById(merchantId).then(dbMerchant => {
                    this.merchant = dbMerchant;

                    this.storeService.findCategoryByMerchantId(this.merchant.id).then(value => {
                        this.categorys = value;
                        this.categorys.sort(function (a, b) {
                            if (a.sequence == null) {
                                return 1;
                            }
                            if (b.sequence == null) {
                                return -1;
                            }
                            if (a.sequence > b.sequence) {
                                return 1;
                            }
                            if (a.sequence < b.sequence) {
                                return -1;
                            }
                            return 0;
                        });
                        //add other for product which has not a category
                        let other: Category = new Category();
                        other.id = -1;
                        other.name = '其它';
                        this.categorys.push(other);
                        console.log(value);
                        return this.storeService.findProductByMerchantId(this.merchant.id);
                    }).then(value => {
                        this.products = value;
                        for (let category of this.categorys) {
                            let productOfCategory = this.products.filter(p => {
                                if (category.id === -1 && !p.category) {
                                    return true;
                                } else if (p.category && p.category.id == category.id) {
                                    return true;
                                }
                            });
                            category.products = productOfCategory;
                        }
                        console.log(value);
                    }).catch(error => {
                        console.log(error);
                        this.slimLoader.complete();
                    });
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
        this.addToast("操作成功", product.name + " 加入购物车");
        console.log(carts);
        localStorage.setItem('carts', JSON.stringify(carts));
        this.cartService.changeCarts(carts);

        event.stopPropagation();
        event.preventDefault();
    }

    detail(product: Product) {
        this.router.navigate(['/product', { merchantId: this.merchant.id, id: product.id }]);
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

    ngOnDestroy() {
        this.sub.unsubscribe();
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