import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Toast, ToasterService, ToasterConfig } from 'angular2-toaster';


@Injectable()

export class CommonServiceFactory {


    constructor(private toasterService: ToasterService) {

    }
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
        if (value == null || value == undefined || value.trim() == '') {
            return true;
        }
        return false;

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

    checkValueType(value: any) {
        if (value == null || value == "" || value == "-1") {
            return true;
        }
        if (value instanceof Date) {///^\d{2}([-])[a-zA-Z]{3}([-])\d{4}/.test(value)) { //date
            return false;
        }
        if ((!this.validatePhone(value))) {  //int
            return false;
        }

        return false;
    }
    // validate  phone number 
    validatePhone(value) {
        if (value.match(/^\d{10}$/)) {  //int
            return true;
        }
        else
            return false;

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


}