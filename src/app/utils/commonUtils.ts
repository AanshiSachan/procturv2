import * as moment from 'moment';
export default class CommonUtils{
public static validateDate(date:string): string {
    if (date== '' || date == null || date== undefined || date == 'Invalid date') {
      return '';
    }
    else {
      return moment(date).format("YYYY-MM-DD");
    }
  }
}
