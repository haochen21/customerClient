import { Pipe, PipeTransform } from '@angular/core';

import { OpenRange } from '../model/OpenRange';

@Pipe({ name: 'openRangePipe' })
export class OpenRangePipe {
    transform(items: any[], nextDay: boolean): any {
        if (!items) return [];
        return items.filter(openRange => openRange.nextDay == nextDay);
    }
}