import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidationService } from '../core/validation.service';
import { SecurityService } from '../core/security.service';

import { Customer } from '../model/Customer';

@Component({
  selector: 'customer-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'loginName': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)], ValidationService.loginNameExists],
      'password': ['', [Validators.required, ValidationService.passwordValidator]],
      'passwordConfirm': ['', Validators.required],
      'name': ['', Validators.required],
      'cardNo': ['', [Validators.nullValidator], ValidationService.cardExists],
      'phone': ['', [Validators.required, ValidationService.phoneValidator, Validators.minLength(11), Validators.maxLength(11)], [ValidationService.phoneExists]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
    }, { validator: ValidationService.matchingPasswords('password', 'passwordConfirm') });
  }

  onSubmit() {
    let customer: Customer = new Customer();
    customer.loginName = this.form.value.loginName;
    customer.password = this.form.value.password;
    customer.name = this.form.value.name;
    customer.phone = this.form.value.phone;
    customer.mail = this.form.value.email;
    customer.cardNo = this.form.value.cardNo;

    this.securityService.registerCustomer(customer).then(value => {
      localStorage.setItem('customer', JSON.stringify(value));
      this.router.navigate(['/login']);
    }).catch(error => {
      console.log(error);
    });
  }
}

