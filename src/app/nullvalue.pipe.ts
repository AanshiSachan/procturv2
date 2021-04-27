import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullvalue'
})
export class NullvaluePipe implements PipeTransform {

  
  transform(value: any, repleceText: string = '-'): any {
    if (typeof value === 'undefined' || value === null) {
      return repleceText;
    }

    return value;
  }

}
