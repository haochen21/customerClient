import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'numberFormatPipe' })
export class NumberFormatPipe {
    transform(value: number): any {
         return value.toFixed(2);
    }
}