import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { flatMap } from 'rxjs/operators';
import { StoreService } from '../../services/store.service';
import { SecurityService } from '../../services/security.service';
import { MessageService } from "../../services/message.service";

import { ToastService } from 'ng-zorro-antd-mobile';

import { Customer } from '../../model/Customer';
import { Merchant } from '../../model/Merchant';
import { DiscountType } from '../../model/DiscountType';
import { Category } from '../../model/Category';
import { Cart } from '../../model/Cart';
import { CartItem } from '../../model/CartItem';
import { Product } from '../../model/Product';
import { SelectProductProperty } from 'src/app/model/SelectProductProperty';

const URL = 'http://shop.km086.com/';

@Component({
    selector: 'app-portal-category',
    templateUrl: './portal-category.component.html',
    styleUrls: ['./portal-category.component.css']
})
export class PortalCategoryComponent implements OnInit {

    faPlus = faPlus;

    customer: Customer;

    merchant: Merchant;

    categorys: Array<Category>;

    products: Array<Product>;

    imagePreUrl: string = URL;    

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private storeService: StoreService,
        private securityService: SecurityService,
        private messageService: MessageService,
        private _toast: ToastService
    ) { }

    ngOnInit() {
        let merchantId = +this.route.snapshot.params.merchantId;
        this.securityService.findCustomer()
            .pipe(flatMap(dbCustomer => {
                this.customer = dbCustomer;
                return this.securityService.findMerchantByIdWithIntro(merchantId);
            }))
            .pipe(flatMap(dbMerchant => {
                this.merchant = dbMerchant;
                return this.storeService.findCategoryByMerchantId(this.merchant.id)
            }))
            .pipe(flatMap(value => {
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

                if (this.merchant.showIntroduce && this.merchant.introduce) {
                    let introduce: Category = new Category();
                    introduce.name = '简介';
                    introduce.id = -100;
                    this.categorys.unshift(introduce);
                }

                console.log(value);
                return this.storeService.findProductByMerchantId(this.merchant.id);
            }))
            .subscribe(value => {
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
                    category.products.sort(function (a, b) {
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
                }
                console.log(value);
            });

    }

    addCart(event, product: Product) {
        if (product.productProperties && product.productProperties.length > 0) {
            product.showProperties = true;
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        this.addCartWithProperty(event, product)
    }

    addCartWithProperty(event, product: Product) {
        product.showProperties = false;
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
            for (let productPropety of product.productProperties) {
                let selectProductProperty = new SelectProductProperty();
                selectProductProperty.sequence = productPropety.sequence;
                selectProductProperty.name = productPropety.name;
                if (productPropety.selectedValue === undefined || productPropety.selectedValue === '') {
                    selectProductProperty.value = productPropety.defaultValue;
                }else {
                    selectProductProperty.value = productPropety.selectedValue[0];
                }

                cartItem.selectProductProperties.push(selectProductProperty);
            }
            cart.cartItems.push(cartItem);
        }
        console.log(carts);
        localStorage.setItem('carts', JSON.stringify(carts));

        this.messageService.changeMessage("add cart item");

        const toast = ToastService.info('加入购物车', 1500, null, false, 'middle');

        event.stopPropagation();
        event.preventDefault();
    }

    detail(product: Product) {
        this.router.navigate(['/portal/product', { merchantId: this.merchant.id, id: product.id }]);
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

    showToast() {
        const toast = ToastService.show('This is a toast tips !!!', 0);
        setTimeout(() => {
            ToastService.hide();
        }, 3000);
    }

    goToCart() {
        this.router.navigate(['/cart']);
    }    
}