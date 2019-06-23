import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SecurityService } from '../../services/security.service';

import { Customer } from '../../model/Customer';

@Component({
  selector: 'ticket-register',
  templateUrl: './modifyuser.component.html',
  styleUrls: ['./modifyuser.component.css']
})
export class ModifyUserComponent implements OnInit {

  customer: Customer;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = this.formBuilder.group({
      'loginName': ['', ,],
      'name': ['', Validators.required],
      'cardNo': ['', ,],
      'phone': ['', [Validators.required, this.phoneValidator.bind(this)]],
      'email': ['', [this.emailValidator.bind(this)]],
      'address': ['', ,]
    });
  }

  ngOnInit() {
    this.securityService.findCustomer()
      .subscribe(user => {
        this.customer = <Customer>user;
        console.log(user);
        (<FormControl>this.form.controls['loginName']).setValue(this.customer.loginName);
        (<FormControl>this.form.controls['name']).setValue(this.customer.name);
        (<FormControl>this.form.controls['cardNo']).setValue(this.customer.cardNo);
        (<FormControl>this.form.controls['phone']).setValue(this.customer.phone);
        (<FormControl>this.form.controls['email']).setValue(this.customer.mail);
        (<FormControl>this.form.controls['address']).setValue(this.customer.address);
      });
  }

  onSubmit() {
    let customer: Customer = new Customer();
    customer.id = this.customer.id;
    customer.version = this.customer.version;

    customer.loginName = this.form.value.loginName;
    customer.password = this.form.value.password;
    customer.name = this.form.value.name;
    customer.phone = this.form.value.phone;
    customer.mail = this.form.value.email;
    customer.cardNo = this.form.value.cardNo;
    customer.address = this.form.value.address;

    this.securityService.modifyCustomer(customer)
      .subscribe(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/my']);
      });
  }

  emailValidator(control: FormControl) {
    // RFC 2822 compliant regex
    if (control.value === null || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  phoneValidator(control: FormControl) {
    if (typeof control.value === "function") {
      return null;
    } else if (control.value.match(/^1\d{10}$/)) {
      return null;
    } else {
      return { 'invalidPhone': true };
    }
  }

  getFormControl(name) {
    return this.form.get(name);
  }
}

