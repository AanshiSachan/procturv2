import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';

@Pipe({ name: 'typeFormatter' })
export class CustomizingPipe implements PipeTransform {
    transform(value: any, isSymbol: boolean = false, decPointer: string, isPrefix: boolean = true, typeHead: string ): string {

        if (typeHead != '') {
            /* date detected converting to format DD-MMM-YYYY using moment and returning data */
            if (typeHead.toLowerCase().includes('date')) {
                if (value != '' && value != null && value != undefined) {
                    return moment(value).format("DD-MMM-YYYY");
                }
                else {
                    return value;
                }
            }

            /* Amount detected separate between date and currency */
            else if (typeHead.toLowerCase().includes('amount')) {
                /* Check for date here */
                if (this.detectDate(typeHead.toLowerCase())) {
                    if (value != '' && value != null && value != undefined) {
                        return moment(value).format("DD-MMM-YYYY");
                    }
                    else {
                        return value;
                    }
                }
                else {
                    let InitialResult = value.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR'
                    }).slice(0, -3);
        
                    return InitialResult;
                }
            }

            /* Due detected separate between date and currency */
            else if (typeHead.toLowerCase().includes('due')) {
                /* Check for date here */
                if (this.detectDate(typeHead.toLowerCase())) {
                    if (value != '' && value != null && value != undefined) {
                        return moment(value).format("DD-MMM-YYYY");
                    }
                    else {
                        return value;
                    }
                }
                else {
                    let InitialResult = value.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR'
                    }).slice(0, -3);
        
                    return InitialResult;
                }
            }

            else if (typeHead.toLowerCase().includes('fee')) {
                /* Check for date here */
                if (this.detectDate(typeHead.toLowerCase())) {
                    if (value != '' && value != null && value != undefined) {
                        return moment(value).format("DD-MMM-YYYY");
                    }
                    else {
                        return value;
                    }
                }
                else {
                    let InitialResult = value.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR'
                    }).slice(0, -3);
        
                    return InitialResult;
                }
            }
            else{
                return value;
            }

        }
        else {
            return value;
        }
    }

    detectDate(o: string): boolean {
        if (o.toLowerCase().includes('date')) {
            return true;
        }
        else {
            return false;
        }
    }
}