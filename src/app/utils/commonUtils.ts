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
  /**
   * 
   * @param val Check for null Object
   */
  public static isObject(val) {
    if (val === null) {
      return false;
    }
    return ((typeof val === 'function') || (typeof val === 'object'));
  }

  /**
   * Parse JSON string
   */
  public static parseJSON(data) {
    data = data || "";
    return JSON.parse(data);
  }

  /**
   * Check empty object
   */
  public static checkEmptyObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /**
   * Check if the string is empty or null
   */
  public static checkNotNullAndNotEmpty(data) {
    if (data !== null && data !== '') {
      return true;
    }
    return false;
  }

  /**
    * Check if the variable is undefined
    */
  public static isUndefined(data) {

    if (data === "undefined") {
      return true;
    }
    return false;
  }


  /**
    * Searches for a given substring
    */
  public static contains(str, substring, fromIndex) {
    return str.indexOf(substring, fromIndex) !== -1;
  }

  /**
    * "Safer" String.toLowerCase()
    */
  public static lowerCase(str) {
    return str.toLowerCase();
  }

  /**
   * "Safer" String.toUpperCase()
   */
  public static upperCase(str) {
    return str.toUpperCase();
  }

  /**
   * UPPERCASE first char of each word.
   */
  public static properCase(str) {
    return this.lowerCase(str).replace(/^\w|\s\w/g, this.upperCase);
  }

  /**
   * UPPERCASE first char of each sentence and lowercase other chars.
   */
  public static sentenceCase(str) {
    // Replace first char of each sentence (new line or after '.\s+') to
    // UPPERCASE
    return this.lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, this.upperCase);
  }
  
}
