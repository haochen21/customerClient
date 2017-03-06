import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidationService } from '../core/validation.service';
import { SecurityService } from '../core/security.service';

import { Customer } from '../model/Customer';


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

    this.form = formBuilder.group({
      'loginName': ['', ,],
      'name': ['', Validators.required],
      'cardNo': ['', ,],
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'email': ['', [ValidationService.emailValidator]],
      'address': ['', ,]
    });
  }

  ngOnInit() {
    this.securityService.findCustomer().then(user => {
      this.customer = <Customer>user;
      console.log(user);
      (<FormControl>this.form.controls['loginName']).setValue(this.customer.loginName);
      (<FormControl>this.form.controls['name']).setValue(this.customer.name);
      (<FormControl>this.form.controls['cardNo']).setValue(this.customer.cardNo);
      (<FormControl>this.form.controls['phone']).setValue(this.customer.phone);
      (<FormControl>this.form.controls['email']).setValue(this.customer.mail);
      (<FormControl>this.form.controls['address']).setValue(this.customer.address);
    }).catch(error => {
      console.log(error);
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

    this.securityService.modifyCustomer(customer).then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/my']);
    }).catch(error => {
      console.log(error);
    });
  }
}

