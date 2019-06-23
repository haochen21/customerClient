import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { flatMap } from 'rxjs/operators';
import { ToastService } from 'ng-zorro-antd-mobile';

import { StoreService } from '../../services/store.service';
import { SecurityService } from '../../services/security.service';

import { Customer } from '../../model/Customer';
import { Product } from '../../model/Product';
import { Merchant } from '../../model/Merchant';
import { DiscountType } from '../../model/DiscountType';
import { Cart } from '../../model/Cart';
import { CartItem } from '../../model/CartItem';
import { SelectProductProperty } from 'src/app/model/SelectProductProperty';

@Component({
    selector: 'productsearch-portal',
    templateUrl: './productsearch.component.html',
    styleUrls: ['./productsearch.component.css']
})
export class ProductSearchComponent implements OnInit {

    faPlus = faPlus;

    customer: Customer;

    merchant: Merchant = new Merchant();

    products: Array<Product> = new Array<Product>();

    form: FormGroup;

    imagePreUrl: string = this.storeService.imagePreUrl;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private storeService: StoreService,
        private securityService: SecurityService,
        private _toast: ToastService) {
    }

    ngOnInit() {
        let merchantId = +this.route.snapshot.params.merchantId;

        this.securityService.findCustomer()
            .pipe(flatMap(dbCustomer => {
                this.customer = dbCustomer;
                return this.securityService.findMerchantById(merchantId);
            }))
            .subscribe(dbMerchant => {
                this.merchant = dbMerchant;
            });

        this.form = this.formBuilder.group({
            'remark': ['', [Validators.minLength(0), Validators.maxLength(255)]],
            'code': ['', [Validators.minLength(1), Validators.maxLength(10)]]
        });
    }

    valuechange(newValue) {
        if (newValue === '') {
            this.products = [];
        } else if (newValue.length >= 1) {
            this.storeService.quickSearch(this.merchant.id, newValue)
                .subscribe(result => {
                    this.products = result;
                });
        }
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
        cart.remark = this.form.value.remark;

        console.log(carts);
        localStorage.setItem('carts', JSON.stringify(carts));

        const toast = ToastService.info('加入购物车', 1500, null, false, 'middle');

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

    getFormControl(name) {
        return this.form.get(name);
    }
}