import {
    Http, CookieXSRFStrategy, XSRFStrategy, RequestOptions, BaseRequestOptions,
    ResponseOptions, BaseResponseOptions, XHRBackend, BrowserXhr, Response
} from '@angular/http';
import { ReflectiveInjector, Injectable, OpaqueToken, Injector } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import 'rxjs/add/operator/toPromise';

export class ValidationService {

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': '字段必填',
            'invalidLoginName': '用户名已存在',
            'invalidDeviceNo': '设备编号不存在',
            'invalidCardNo': '卡编号已存在',
            'invalidCreditCard': '信用卡卡号不正确',
            'invalidEmailAddress': '邮箱地址格式不正确',
            'invalidPassword': '密码长度最少6个字符，必需包含至少一个数字',
            'invalidPasswordConfirm': '两次密码输入不一致',
            'invalidPhone': '手机号码格式不正确',
            'invalidCurrency': '价格格式不正确',
            'invalidNumber': '数量格式不正确',
            'invalidTime': '时间格式不正确',
            'existPhone': '手机号码已存在',
            'minlength': `最小长度 ${validatorValue.requiredLength}`,
            'maxlength': `最大长度 ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }

    static loginNameExists(control: FormControl) {
        // Manually inject Http
        let http = ValidationService.getHttp();
        return new Promise(resolve => {
            http.get('api/loginNameExists/' + control.value)
                .toPromise()
                .then(response => {
                    console.log(response.json());
                    let result = response.json();
                    if (result.exist) {
                        resolve({ 'invalidLoginName': true });
                    } else {
                        resolve(null);
                    }
                }).catch(error => {
                    console.log(error);
                    return null;
                });
        });
    }
    
    static phoneExists(control: FormControl) {
        // Manually inject Http
        let http = ValidationService.getHttp();
        if (control.value === '') {
            return new Promise(resolve => {
                resolve({ 'required': true });
            });
        } else {
            return new Promise(resolve => {
                http.get('api/phoneExists/' + control.value)
                    .toPromise()
                    .then(response => {
                        console.log(response.json());
                        let result = response.json();
                        if (result.exist) {
                            resolve({ 'existPhone': true });
                        } else {
                            resolve(null);
                        }
                    }).catch(error => {
                        console.log(error);
                        return null;
                    });
            });
        }
    }

    static cardExists(control: FormControl) {
        // Manually inject Http
        let http = ValidationService.getHttp();
        if (control.value === '') {
            return new Promise(resolve => {
                resolve({ 'required': true });
            });
        } else {
            return new Promise(resolve => {
                http.get('api/cardExists/' + control.value)
                    .toPromise()
                    .then(response => {
                        console.log(response.json());
                        let result = response.json();
                        if (result.exist) {
                            resolve({ 'invalidCardNo': true });
                        } else {
                            resolve(null);
                        }
                    }).catch(error => {
                        console.log(error);
                        return null;
                    });
            });
        }
    }

    static matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            let passwordInput = group.controls[passwordKey];
            let passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({ 'invalidPasswordConfirm': true });
            } else {
                return null;
            }
        }
    }

    static creditCardValidator(control: FormControl) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static emailValidator(control: FormControl) {
        // RFC 2822 compliant regex
        if (control.value === null || control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static currencyValidator(control: FormControl) {
        // RFC 2822 compliant regex
        if (typeof control.value !== "function") {
            return null;
        } else if (control.value.match(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)) {
            return null;
        } else {
            return { 'invalidCurrency': true };
        }
    }

    static numberValidator(control: FormControl) {
        if (typeof control.value !== "function") {
            return null;
        } else if (control.value.match(/^([1-9]\d*|[0]{1,1})$/)) {
            return null;
        } else {
            return { 'invalidNumber': true };
        }
    }

    static timeValidator(control: FormControl) {
        if (typeof control.value !== "function") {
            return null;
        } else if (control.value.match(/^([1-9]\d*)$/)) {
            return null;
        } else {
            return { 'invalidTime': true };
        }
    }

    static phoneValidator(control: FormControl) {
        if (typeof control.value === "function") {
            return null;
        } else if (control.value.match(/^1\d{10}$/)) {
            return null;
        } else {
            return { 'invalidPhone': true };
        }
    }

    static passwordValidator(control: FormControl) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static getHttp(): Http {
        let providers = [
            {
                provide: Http, useFactory: (backend: XHRBackend, options: RequestOptions) => {
                    return new Http(backend, options);
                },
                deps: [XHRBackend, RequestOptions]
            },
            BrowserXhr,
            { provide: RequestOptions, useClass: BaseRequestOptions },
            { provide: ResponseOptions, useClass: BaseResponseOptions },
            XHRBackend,
            { provide: XSRFStrategy, useValue: new NoopCookieXSRFStrategy() },
        ];
        return ReflectiveInjector.resolveAndCreate(providers).get(Http);
    }
}

class NoopCookieXSRFStrategy extends CookieXSRFStrategy {
    configureRequest(request) {
        // noop
    }
}