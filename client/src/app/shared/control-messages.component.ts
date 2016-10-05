import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../core/validation.service';

@Component({
    selector: 'control-messages',
    template: `
      <div class="input-tip" *ngIf="errorMessage !== null">
        <span>
          <i class="fa fa-lg fa-minus-circle txt-color-red"></i>
          {{errorMessage}}
        </span>  
      </div>`,
    styleUrls: ['./control-messages.component.css'] 
})
export class ControlMessages {
    @Input() control: FormControl;

    constructor() { }

    get errorMessage() {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
            }
        }

        return null;
    }
}