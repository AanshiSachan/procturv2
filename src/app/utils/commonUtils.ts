import * as moment from 'moment';
import { isNumeric } from 'rxjs/util/isNumeric';
export default class CommonUtils {
 // private static emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,9})+$/;
  private static emailRegExp= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

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
    if (this.isEmpty(email) || this.emailRegExp.test(email)) {
      return false;
    }
    return true;
  }
  public static isMandatoryValidEmailId(email: string): boolean {
    //test(myForm.emailAddr.value)
    if (this.isNotEmpty(email) && this.emailRegExp.test(email)) {
      return false;
    }
    return true;
  }
  // check numeric type data
  public static isNumeric(data:number):boolean{
   return isNumeric(data)?false:true;
  }
  //check positive or negative
  public static isPositive(data:number){
    // if (data > 0) {
    //   // Positive
    // }
   //for the calculation
   //return Math.sign(data)>0?'-1':'1';
   return Math.sign(data)>0?false:true;
  }
  // two date difference in days ,time ,years

  
public static getDifferenceInDays(date1,date2){
// moment(dateOne).format("YYYY-MM-DD");
// moment(dateTwo).format("YYYY-MM-DD");
const diffInMs = Math.abs(date1 - date2);
return diffInMs / (1000 * 60 * 60 * 24)  + " " + "Days" ;
//Difference in number of days
//return moment.duration(date1.diff(date2)).asDays();
}

public static getDifferenceInHours(date1,date2){
  if (date1 == '' || date1 == 'Invalid date'||date2 == '' || date2 == 'Invalid date') {
    return '';
  }
  moment(date1).format("YYYY-MM-DD");
  moment(date2).format("YYYY-MM-DD");
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60) + " " + "Hours" ;
  }

  public static getDifferenceInMinutes(date1, date2) {
    if (date1 == '' || date1 == 'Invalid date'||date2 == '' || date2 == 'Invalid date') {
      return '';
    }
    moment(date1).format("YYYY-MM-DD");
    moment(date2).format("YYYY-MM-DD");
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60) + " " + "Minutes";
  }

  public static getDifferenceInSeconds(date1, date2) {
    if (date1 == '' || date1 == 'Invalid date'||date2 == '' || date2 == 'Invalid date') {
      return '';
    }
    moment(date1).format("YYYY-MM-DD");
    moment(date2).format("YYYY-MM-DD");
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / 1000 + " " + "Seconds";
  }
  public static validateFutureDate(date) {
    if (date == '' || date == 'Invalid date') {
      return '';
    }
  let today = moment(new Date);
   let selectedDate = moment(date);
   let diff = moment(selectedDate.diff(today))['_i'];
   if (diff > 0) {
     return  moment(new Date).format('YYYY-MM-DD');
   }
 }
 //limit restriction min and max
 public static stringlength(inputtxt, minlength, maxlength){ 
var field = inputtxt; 
var mnlen = minlength;
var mxlen = maxlength;
if(this.isEmpty(field) ||field.length<mnlen || field.length> mxlen)  { 
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

  public static validateSpecialCharacters(str) {
    return true;
    // let regex = /[^ a-zA-Z0-9_.,-]/g;
    // if (str.match(regex) == null) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
  
}
