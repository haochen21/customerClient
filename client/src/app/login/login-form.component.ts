import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { SecurityService } from '../core/security.service';

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

    error: any;

    loginNameError: boolean;

    passwordError: boolean;

    constructor(
        private router: Router,
        private securityService: SecurityService) {

        this.loginNameError = false;
        this.passwordError = false;
    }

    model = {
        loginName: '',
        password: ''
    };

    onSubmit() {
        console.log(JSON.stringify(this.model));
        this.securityService
            .login(this.model.loginName, this.model.password)
            .then(loginResult => {
                console.log(loginResult);
                if (loginResult.result === 'AUTHORIZED') {
                    this.loginNameError = false;
                    this.passwordError = false;
                    localStorage.setItem('customer', JSON.stringify(loginResult.user));
                    this.router.navigate(['/portal']);
                } else if (loginResult.result === 'LOGINNAMEERROR') {
                    this.loginNameError = true;
                    this.passwordError = false;
                } else if (loginResult.result === 'PASSWORDERROR') {
                    this.loginNameError = false;
                    this.passwordError = true;
                }
            })
            .catch(error => this.error = error);
    }

    ngOnInit() {
        try {
            let customer: any = JSON.parse(localStorage.getItem('customer'));
            if (customer) {
                this.model.loginName = customer.loginName;
            }
        } catch (ex) {

        }

    }
}
