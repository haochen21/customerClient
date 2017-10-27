import { Pipe, PipeTransform } from '@angular/core';
import { OpenRange } from '../model/OpenRange';
import { OpenRangeType } from '../model/OpenRangeType';

@Pipe({
    name: 'openRangeTypePipe'
})
export class OpenRangeTypePipe implements PipeTransform {
    transform(openRanges: Array<OpenRange>, type: OpenRangeType): Array<any> {
        return openRanges.filter(openRange => openRange.type === type);
    }
}