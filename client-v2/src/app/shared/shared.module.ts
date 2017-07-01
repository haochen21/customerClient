import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CartStatusFormatPipe } from './CartStatus.pipe';
import { DateFormatPipe } from './DateFormat.pipe';
import { MapToIterable } from './MapToIterable.pipe';
import { NumberFormatPipe } from './NumberFormat.pipe';
import { OrderByPipe } from './Sort.pipe';
import { OpenRangePipe } from './OpenRange.pipe';

import { ControlMessages } from './control-messages.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        CartStatusFormatPipe,
        DateFormatPipe,
        MapToIterable,
        NumberFormatPipe,
        OrderByPipe,
        OpenRangePipe,
        ControlMessages
    ],
    exports: [
        CartStatusFormatPipe,
        DateFormatPipe,
        MapToIterable,
        NumberFormatPipe,
        OrderByPipe,
        OpenRangePipe,
        ControlMessages,
        CommonModule,
        FormsModule,
        HttpModule
    ]
})
export class SharedModule { }
