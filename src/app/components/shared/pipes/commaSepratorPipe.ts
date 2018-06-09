import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "commaSeprator" })
export class CommaSeprationAmount implements PipeTransform {
  transform(value: number, exponent: string): any {
    if (value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
}

