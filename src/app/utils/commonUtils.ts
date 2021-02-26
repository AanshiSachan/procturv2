import * as moment from 'moment';
export default class CommonUtils {
  private static emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,9})+$/;

  public static validateDate(date: string): string {
    //if (date== '' || date == null || date== undefined || date == 'Invalid date') {
    if (date == '' || date == 'Invalid date') {
      return '';
    }
    else {
      return moment(date).format("YYYY-MM-DD");
    }
  }
  public static isNotEmpty(val: string): boolean {
    if (val && val.trim() != '') {
      return true;
    }
    return false;
  }
  public static isEmpty(val: string): boolean {
    return this.isNotEmpty(val) ? false : true;
  }
  public static isOptionalValidEmailId(email: string): boolean {
    if (this.isEmpty(email) || this.emailRegExp.test(email.trim())) {
      return false;
    }
    return true;
  }
  public static isMandatoryValidEmailId(email: string): boolean {
    if (this.isNotEmpty(email) && this.emailRegExp.test(email.trim())) {
      return false;
    }
    return true;
  }
}
