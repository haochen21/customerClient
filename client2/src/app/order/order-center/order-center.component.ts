import { Component, OnInit } from '@angular/core';

import { faHome, faCartArrowDown, faYenSign, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { Router } from '@angular/router';

@Component({
  selector: 'app-order-center',
  templateUrl: './order-center.component.html',
  styleUrls: ['./order-center.component.css']
})
export class OrderCenterComponent implements OnInit {

  faHome = faHome;
  faCartArrowDown = faCartArrowDown;
  faYenSign = faYenSign;
  faUserCircle = faUserCircle;

  tabbarStyle: object = {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0
  };

  totalItem: number = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    this.getTotalItem(JSON.parse(localStorage.getItem('carts')));
  }

  tabBarTabOnPress(pressParam: any) {
    console.log('onPress Params: ', pressParam);
    if (pressParam.key === 'portal') {
      this.router.navigate(['/portal']);
    } else if (pressParam.key === 'cart') {
      this.router.navigate(['/cart']);
    } else if (pressParam.key === 'order') {
      this.router.navigate(['order']);
    } else if (pressParam.key === 'my') {
      this.router.navigate(['/my']);
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
