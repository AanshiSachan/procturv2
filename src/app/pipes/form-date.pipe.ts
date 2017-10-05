import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formDate'
})
export class FormDatePipe implements PipeTransform {

  transform(value: any): any {
    return moment(value).format('YYYY-MM-DD');
  }

}
