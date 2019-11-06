import {  Pipe, PipeTransform } from '@angular/core';
/* Used to cconvert the input type id to text for user view purpose */
@Pipe({ name: 'checkBoxConverter' })
export class CheckBoxConverterPipe implements PipeTransform {
  transform(value: any, exponent: any): any {
    if (value == 1) {
      return 'textbox';
    }
    else if (value == 2) {
      return "checkbox";
    }
    else if (value == 3) {
      return "dropdown";
    }
    else if (value == 4) {
      return "multiselect";
    }
  }
}