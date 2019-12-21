import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "commaSeprator" })
export class CommaSeprationAmount implements PipeTransform {
  transform(value: number, currency: string = 'INR', lang: string = 'en-IN'): any {
    if (value != null && currency != null && lang != null) {
      let formatted = value.toLocaleString(lang, {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: currency
      });
    formatted = formatted.replace(/[\s a-zA-Z]/g, '');
    formatted = formatted.substr(0,formatted.indexOf(','));
      return formatted.replace(/[.]/g, '')
      // return formatted.replace(/[0-9 &\/\\#,+()$~%.'":*?<>{}\s]+/g,'') + ' ' + formatted.replace(/[&\/\\#,+()$~%.'":*?<>{}\s a-zA-Z]/g, '');
      //return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
      return lang + ' ' + value;
    }
  }
}

