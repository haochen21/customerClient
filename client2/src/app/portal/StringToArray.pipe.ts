import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'stringToArrayPipe' })
export class StringToArrayPipe implements PipeTransform {

    transform(value: string, args: string[]): string[] {
        let splitted: string[] = value.split(args[0]); 
        return splitted;
    }

}