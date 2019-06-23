import { Component, OnInit } from '@angular/core';

import { MessageService } from "../../services/message.service";

import { faHome, faCartArrowDown, faYenSign, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { Router } from '@angular/router';

@Component({
  selector: 'app-portal-center',
  templateUrl: './portal-center.component.html',
  styleUrls: ['./portal-center.component.css']
})
export class PortalCenterComponent implements OnInit {

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

  constructor(
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTotalItem(JSON.parse(localStorage.getItem('carts')));
    this.messageService.currentMessage.subscribe(message => this.getTotalItem(JSON.parse(localStorage.getItem('carts'))));
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
