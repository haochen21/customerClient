import {Pipe, PipeTransform} from '@angular/core';
import {CartStatus} from '../model/CartStatus';

@Pipe({ name: 'cartStatusFormatPipe' })
export class CartStatusFormatPipe implements PipeTransform {

    transform(value: CartStatus, args: string[]): any {
        if (value === CartStatus.CONFIRMED) {
            return "订单确认";
        } else if (value === CartStatus.DELIVERED) {
            return "订单交付";
        } else if (value === CartStatus.CANCELLED) {
            return "订单取消";
        } else if (value === CartStatus.DENIED) {
            return "订单拒绝";
        } else if (value === CartStatus.PURCHASED) {
            return "订单提交";
        } else {
            return "";
        }
    }

}