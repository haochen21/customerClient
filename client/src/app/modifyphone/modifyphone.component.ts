import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidationService } from '../core/validation.service';
import { SecurityService } from '../core/security.service';

import { Customer } from '../model/Customer';


@Component({
  selector: 'ticket-phone',
  templateUrl: './modifyphone.component.html',
  styleUrls: ['./modifyphone.component.css']
})
export class ModifyPhoneComponent implements OnInit {

  form: FormGroup;

  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router) {

    this.form = formBuilder.group({
      'phone': ['', [Validators.required, ValidationService.phoneValidator], ]
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    this.securityService.modifyCustomerPhone(this.form.value.phone).then(result => {
      if (result.operate) {
        this.router.navigate(['/portal']);
      } else {
        this.error = '手机号码已存在,请重新输入';
      }
    }).catch(error => {
      console.log(error);
    });
  }
}

