import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    document.body.style.background = 'url(assets/images/bg-login.jpg) center top no-repeat';
    document.body.style.backgroundSize = '100%';
  }

  ngOnDestroy() {
    document.body.style.background = '';
  }

}
