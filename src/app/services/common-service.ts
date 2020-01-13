import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Toast, ToasterService, ToasterConfig } from 'angular2-toaster';


@Injectable()

export class CommonServiceFactory {

    currency_default_symbol:any='Rs';

    constructor(private toasterService: ToasterService) { }

    // Check User Is Admin Or not return boolean
    checkUserIsAdmin(): boolean {
        let p = sessionStorage.getItem('permissions');
        let user = sessionStorage.getItem('userType')
        if (user == "0") {
            if (p == null || p == undefined || p == '') {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Break time in to hour and minute
    breakTimeInToHrAndMin(time) {
        let obj: any = {
            hour: '',
            minute: ''
        };
        obj.hour = time.split(':')[0] + " " + time.split(':')[1].split(' ')[1];
        obj.minute = time.split(':')[1].split(' ')[0];
        return obj;
    }

    // Check If user had permission accepts permission id and return true and false
    checkUserHadPermission(id): boolean {
        let isAdmin = this.checkUserIsAdmin();
        if (isAdmin) {
            return true;
        } else {
            let permissions = sessionStorage.getItem('permissions');
            if (permissions.indexOf(id) != -1) {
                return true;
            } else {
                return false;
            }
        }
    }

    valueCheck(value) {
        if (typeof value == "number") {
            if (value == null || value == undefined || value == -1 || value == 0) {
                return true;
            }
            return false;
        } else if (typeof value == "string") {
            if (value == null || value == undefined || value.trim() == '' || value == '-1') {
                return true;
            }
            return false;
        }
    }

    // Get Current Time and minute will be multiple of 5
    getCurrentTImeForDropDown(): any {
        let hour: any = parseInt(moment(new Date()).format('hh'));
        let min: any = moment(new Date()).format('mm');
        let mer: any = moment(new Date()).format('A');

        if (parseInt(min) % 5 != 0) {
            min = Math.ceil(parseInt(min) / 5) * 5;
            if (min >= 60) {
                min = '00';
                if (hour == 12) {
                    hour = '1';
                    if (mer == 'AM') {
                        mer = 'PM';
                    }
                    else {
                        mer = 'AM';
                    }
                }
                else {
                    hour += 1;
                    let formattedNumber = (hour).slice(-2);
                    hour = formattedNumber.toString();
                }
            }
        }

        return (hour + ":" + min + " " + mer);
    }

    // Validate that both hour and minute is empty or given
    validateTimeAndMinute(obj: any) {
        if (obj.hasOwnProperty('hour') && obj.hasOwnProperty('minute')) {
            if ((obj.hour == "" && obj.minute == "") || (obj.hour == null && obj.minute) || (obj.hour != '' && obj.minute != '')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Change FavIcon
    changeFavICon(str) {
        let link = <HTMLLinkElement>document.getElementById('favIconLink');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = str;
    }

    // Create a deep copy of object
    keepCloning(objectpassed) {
        if (objectpassed === null || typeof objectpassed !== 'object') {
            return objectpassed;
        }
        let temporaryStorage = objectpassed.constructor();
        for (var key in objectpassed) {
            temporaryStorage[key] = this.keepCloning(objectpassed[key]);
        }
        return temporaryStorage;
    }


    /// validation functions 

    validateName(value): boolean {
        let regex = /^[a-zA-Z. ]*$/;
        if (value.match(regex) == null || this.sourceValueCheck(value)) {
            return true;
        }
        else {
            return false;
        }
    }

    sourceValueCheck(value) {
        if (value == null || value == "" || value == "-1") {
            return true;
        }
    }

    checkValueType(value: any) {
        if (value instanceof Date) {///^\d{2}([-])[a-zA-Z]{3}([-])\d{4}/.test(value)) { //date
            return false;
        }
        return true;
    }

    // validate  phone number
    validatePhone(value, maxlength) {
        console.log(maxlength);
        if (isNaN(value) || value.trim() == '') {  //int
            return 'noNumber';
        }
        else if (value.length != maxlength) {
            return 'lessThanTen';
        }
        return false;
    }


    phonenumberCheck(inputtxt, maxlength, country_id) {
        if (country_id == 1) {
            if (inputtxt.length == maxlength) {
                return true;
            } 
            else if(inputtxt.length==0){
                return 'noNumber';
            } 
            else {
                return false;
            }
        }
        else {
            if(inputtxt.length==0){
                return 'noNumber';
            } else {
            return true;
            }
        }
    }
    // toast function 
    showErrorMessage(objType, massage, body) {
        var toast: Toast = {
            type: objType,
            title: massage,
            body: body
        };
        this.toasterService.pop(toast);

    }

    // Remove Selection From SideNav 

    removeSelectionFromSideNav() {
        let array =['lione','litwo','lithree','lifour','lifive','lisix','liseven','lieight','linine','lizero'];
        array.forEach((object)=>{
            document.getElementById(object) &&  document.getElementById(object).classList.remove('active');
        })
    }

    SortArray(key, array: any[]) {
        // Regular expression to separate the digit string from the non-digit strings.
        let reParts = /\d+|\D+/g;
        // Regular expression to test if the string has a digit.
        let reDigit = /\d/;
        let sortedArray = array.sort((obj1, obj2) => {
            let a = obj1[key.primaryKey];
            let b = obj2[key.primaryKey];
            // for case insensitive compare 
            if ((typeof obj1[key.primaryKey] === "string") && (obj1[key.primaryKey] != null && obj2[key.primaryKey] != null)) {
                a = obj1[key.primaryKey].toLowerCase();
                b = obj2[key.primaryKey].toLowerCase();
            }
            let aParts = a.match(reParts);
            let bParts = b.match(reParts);
            let isDigitPart;

            if (aParts && bParts && (isDigitPart = reDigit.test(aParts[0])) == reDigit.test(bParts[0])) {
                // Loop through each substring part to compare the overall strings.
                let len = Math.min(aParts.length, bParts.length);
                for (var i = 0; i < len; i++) {
                    let aPart: any = aParts[i];
                    let bPart: any = bParts[i];

                    // If comparing digits, convert them to numbers (assuming base 10).
                    if (isDigitPart) {
                        aPart = parseInt(aPart, 10);
                        bPart = parseInt(bPart, 10);
                    }
                    // If the substrings aren't equal, return either -1 or 1.
                    if (aPart != bPart) {
                        return aPart < bPart ? -1 : 1;
                    }
                    // Toggle the value of isDigitPart since the parts will alternate.
                    isDigitPart = !isDigitPart;
                }
            }
            // Use normal comparison.
            return Number((a <= b)) - Number((a >= b));
        });
        return sortedArray;
    }


    /// Ui Selction Iteration

    changeUiSelectedKeyValue(data, key, value) {
        data.forEach(element => {
            element[key] = value;
        });
        return Array.from(data);
    }

/* Converts base64 string into a byte[] */
    convertBase64ToArray(val) {
        var binary_string = window.atob(val);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
      }

       setDefaultCurrencySymbol(symbol){
           this.currency_default_symbol=symbol;
       }

        // contact no pattern change if mobile no role is not present (for other users) ---> created by anushka
        contactNoPatternChange(list) {
            if(sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin') { // if user is admin
            if(sessionStorage.getItem('permissions') != null && sessionStorage.getItem('permissions') != ''){
                var permissions = JSON.parse(sessionStorage.getItem('permissions'));
                if(!permissions.includes('726')){
                    list.forEach(el =>{
                    var countryCode = el.phone.split('-')[0];
                    var phnNo = el.phone.split('-')[1];
                    if(phnNo.length > 4){
                    var result = phnNo.replace(/\d{4}$/, 'XXXX');
                    }
                    else {
                    var result = phnNo.replace(/\d{1}$/, 'X');
                    }
                    el.phone = countryCode + '-' + result;
                })
                }
            }
            }
        }


}