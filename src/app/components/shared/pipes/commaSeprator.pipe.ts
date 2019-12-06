import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "commaSeprator" })
export class CommaSeprationAmount implements PipeTransform {
  transform(value: number,currency:string='INR',lang:string='en-IN'): any {
    if (value != null) {
      let formatted = value.toLocaleString(lang, {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: currency
      }).slice(0, -3);

      return formatted;
      //return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
}

