import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

// under systemjs, moment is actually exported as the default export, so we account for that
const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({ name: 'dateFormatPipe' })
export class DateFormatPipe implements PipeTransform {

    transform(value: Date, args: string[]): any {       
        return momentConstructor(value).format(args.toString());
    }

}