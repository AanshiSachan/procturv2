import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "commaSeprator" })
export class CommaSeprationAmount implements PipeTransform {
  transform(value: number, exponent: string): any {
    if (value != null) {
      let formatted = value.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
      }).slice(0, -3);

      return formatted;
      //return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
}

