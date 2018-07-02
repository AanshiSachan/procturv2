import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: "procturDate" })
export class ProcturDate implements PipeTransform {
  transform(value: string): any {
    if (value != null) {
      let formatted = moment(value).format("DD MMM YYYY");
      if(formatted != "Invalid date"){
        return formatted;
      }
      else{
          return "";
      }
    }
  }
}

