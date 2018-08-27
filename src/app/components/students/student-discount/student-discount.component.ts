import {
    Component, OnInit, OnChanges, Output, Input, ViewChild, ElementRef,
    HostListener, EventEmitter, ChangeDetectorRef, Renderer2, ChangeDetectionStrategy
} from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';


@Component({
    selector: 'student-discount',
    templateUrl: './student-discount.component.html',
    styleUrls: ['./student-discount.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDiscountComponent implements OnInit, OnChanges {

    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */

    @Output() closePopup = new EventEmitter<any>();
    @Output() apply = new EventEmitter<any>();

    @Input() installmentData: any[] = [];
    @Input() additionalData: any[] = [];
    @Input() feeTemplateData: any;
    @Input() totalAmountDue: any;
    @Input() discountReason: any;

    private taxEnableCheck: any = '1';
    service_tax: number = 0;

    discountApplyForm: any = {
        type: 'amount',
        value: null,
        reason: '',
        state: 'all'
    }



    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */
    /* ============================================================================================== */
    constructor(private rd: Renderer2, private cd: ChangeDetectorRef, private eRef: ElementRef, private appC: AppComponent, private studentPrefillService: AddStudentPrefillService, ) { }

    ngOnInit() {
        this.taxEnableCheck = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    }

    ngOnChanges() {
        this.installmentData;
        this.feeTemplateData;
        this.additionalData;
        this.totalAmountDue;
        this.discountReason;
        this.service_tax = this.feeTemplateData.registeredServiceTax;

    }


    closePopups() {
        this.closePopup.emit(null);
        this.discountApplyForm = {
            type: 'amount',
            value: null,
            reason: '',
            state: 'all'
        }
    }

    applyAction() {

        //this.deselectAllSelectedCheckbox();
        /* ============================================================================================== */
        /* ============================================================================================== */
        /* Form is correctly filled */
        if (this.discountApplyForm.type != '' && this.discountApplyForm.value > 0 && this.discountApplyForm.reason != '' && this.discountApplyForm.reason != ' ') {
            /* ============================================================================================== */
            /* ============================================================================================== */
            /* ================================= Amount Type Selected ======================================= */
            /* ============================================================================================== */
            /* discount in form of amount */
            if (this.discountApplyForm.type === 'amount') {
                /* invalid discount amount provided */
                if (this.discountApplyForm.value > this.totalAmountDue) {
                    let msg = {
                        type: 'error',
                        title: 'Invalid Discount Amount',
                        body: 'Cannot provide discount more than the total amount due'
                    }
                    this.appC.popToast(msg);
                }
                /* valid total discount amount < total due */
                else {
                    /* ============================================================================================== */
                    /* ============================================================================================== */
                    /* apply discount to all */
                    if (this.discountApplyForm.state === 'all') {
                        /* Stores the index of all unpaid installments */
                        let installmentPaidArr: any[] = this.calculateLengthPaid(this.installmentData);

                        /* json for storing data for unpaid installments */
                        let unPaidArr: any[] = installmentPaidArr.map(e => this.installmentData[e]);

                        if (unPaidArr.length != 0) {
                            let discount = this.precisionRound((this.discountApplyForm.value / installmentPaidArr.length), -1);
                            /* ============================================================================================== */
                            /* ============================================================================================== */
                            /* discount is applicable to all installments, then proceed else alert */
                            if (unPaidArr.every(e => e.fees_amount > discount)) {
                                installmentPaidArr.forEach(i => {
                                    this.installmentData[i].fees_amount = this.precisionRound((this.installmentData[i].fees_amount - discount), -1);
                                    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                                        this.installmentData[i].initial_fee_amount = this.precisionRound(((this.installmentData[i].fees_amount * 100) / (this.service_tax + 100)), -1);
                                    }
                                    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                                        this.installmentData[i].initial_fee_amount = this.precisionRound(((this.installmentData[i].fees_amount * 100) / (100)), -1);
                                    }
                                });

                                this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason : moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason;

                                let obj = {
                                    reason: this.discountReason,
                                    value: this.discountApplyForm.value,
                                    installment: this.installmentData
                                }
                                this.apply.emit(obj);

                                /* this.isDiscountApplied = true;
                                this.applyDiscountCustomFeeSchedule();
                                this.totalDicountAmount = this.totalDicountAmount + this.discountApplyForm.value;
                                this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
                                this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
                                this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;
                                this.updateDiscount(); */
                                //console.log(this.discountApplyForm);
                            }
                            /* ============================================================================================== */
                            /* ============================================================================================== */
                            /* discount is not applicable to any one condition or multiple */
                            else {
                                let msg = {
                                    type: 'error',
                                    title: 'Discount Not Applicable',
                                    body: 'Discount cannot be applied evenly to all installment'
                                }
                                this.appC.popToast(msg);
                            }
                        }
                        else {
                            let msg = {
                                type: 'error',
                                title: 'Discount Not Applicable',
                                body: 'Discount cannot be applied to any installment'
                            }
                            this.appC.popToast(msg);
                        }
                    }
                    /* ============================================================================================== */
                    /* ============================================================================================== */
                    /* apply to Last installment */
                    else {
                        /* Stores the index of all unpaid installments */
                        let installmentPaidArr: any[] = this.calculateLengthPaid(this.installmentData);
                        /* json for storing data for unpaid installments */
                        if (installmentPaidArr.length != 0) {
                            let lastUnPaid: any = this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]];
                            if (lastUnPaid.fees_amount > this.discountApplyForm.value) {
                                this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount = this.precisionRound((this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount - this.discountApplyForm.value), -1);
                                if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                                    this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (this.service_tax + 100))), -1);
                                }
                                else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                                    this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (100))), -1);
                                }

                                this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason : moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason;

                                let obj = {
                                    reason: this.discountReason,
                                    value: this.discountApplyForm.value,
                                    installment: this.installmentData
                                }
                                this.apply.emit(obj);

                                /* this.isDiscountApplied = true;
                                this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
                                this.applyDiscountCustomFeeSchedule();
                                this.totalDicountAmount = this.totalDicountAmount + this.discountApplyForm.value;
                                this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
                                this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
                                this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;
                                this.updateDiscount(); */
                            }
                            /*  */
                            else {
                                let msg = {
                                    type: 'error',
                                    title: 'Unable To Process Request',
                                    body: 'The discount amount exceed the last installment amount'
                                }
                                this.appC.popToast(msg);
                            }
                        }
                        else {
                            let obj = {
                                type: 'error',
                                title: 'Error Processing Discount',
                                body: 'No applicable installment found to apply discount'
                            }
                            this.appC.popToast(obj);
                        }

                    }
                }
            }
            /* ============================================================================================== */
            /* ============================================================================================== */
            /* =================================== Percentage Type ========================================== */
            /* ============================================================================================== */
            /* discount in form of percentage */
            else {
                let discountValue = this.precisionRound(((this.discountApplyForm.value / 100) * this.totalAmountDue), -1);
                /* invalid discount amount provided */
                if (discountValue > this.totalAmountDue) {
                    let msg = {
                        type: 'error',
                        title: 'Invalid Discount Amount',
                        body: 'Cannot provide discount more than the total amount due'
                    }
                    this.appC.popToast(msg);
                }/* valid total discount amount < total due */
                else {
                    /* ============================================================================================== */
                    /* ============================================================================================== */
                    /* apply discount to all */
                    if (this.discountApplyForm.state === 'all') {
                        /* Stores the index of all unpaid installments */
                        let installmentPaidArr: any[] = this.calculateLengthPaid(this.installmentData);
                        /* json for storing data for unpaid installments */
                        let unPaidArr: any[] = [];
                        installmentPaidArr.forEach(e => { unPaidArr.push(this.installmentData[e]) });
                        //console.log(unPaidArr);
                        let discount = this.precisionRound((discountValue / installmentPaidArr.length), -1);
                        /* discount is applicable to all installments, then proceed else alert */
                        if (unPaidArr.length != 0) {
                            if (unPaidArr.every(e => e.fees_amount > discount)) {
                                installmentPaidArr.forEach(i => {
                                    this.installmentData[i].fees_amount = this.precisionRound((this.installmentData[i].fees_amount - discount), -1);
                                    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                                        this.installmentData[i].initial_fee_amount = this.precisionRound((((this.installmentData[i].fees_amount * 100) / (this.service_tax + 100))), -1);
                                    }
                                    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                                        this.installmentData[i].initial_fee_amount = this.precisionRound((((this.installmentData[i].fees_amount * 100) / (100))), -1);
                                    }
                                });

                                this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + discountValue + "#" + this.discountApplyForm.reason : moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + discountValue + "#" + this.discountApplyForm.reason;

                                let obj = {
                                    reason: this.discountReason,
                                    value: discountValue,
                                    installment: this.installmentData
                                }
                                this.apply.emit(obj);

                                /* 

                                */
                            }
                            /* discount is not applicable to any one condition or multiple */
                            else {
                                //console.log(this.installmentData);
                                let msg = {
                                    type: 'error',
                                    title: 'Discount Not Applicable',
                                    body: 'Discount cannot be applied evenly to all installment'
                                }
                                this.appC.popToast(msg);
                            }

                        }
                        else {
                            let obj = {
                                type: 'error',
                                title: "Error Provecessing Discount",
                                body: "Discount cannot be applied to any installment"
                            }
                            this.appC.popToast(obj);
                        }
                    }
                    /* ============================================================================================== */
                    /* ============================================================================================== */
                    /* apply to Last installment */
                    else {
                        /* Stores the index of all unpaid installments */
                        let installmentPaidArr: any[] = this.calculateLengthPaid(this.installmentData);

                        if (installmentPaidArr.length != 0) {
                            /* json for storing data for unpaid installments */
                            let lastUnPaid: any = this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]];
                            /* discount applicable proceed, else throw error */
                            if (lastUnPaid.fees_amount > discountValue) {
                                this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount = this.precisionRound((this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount - discountValue), -1);

                                if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                                    this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (this.service_tax + 100))), -1);
                                }
                                else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                                    this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.installmentData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (100))), -1);
                                }

                                this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + discountValue + "#" + this.discountApplyForm.reason : moment().format('DD-MMM-YYYY hh:mm:ss') + "#" + discountValue + "#" + this.discountApplyForm.reason;

                                let obj = {
                                    reason: this.discountReason,
                                    value: discountValue,
                                    installment: this.installmentData
                                }
                                this.apply.emit(obj);

                                /* this.isDiscountApplied = true;
                                this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
                                this.applyDiscountCustomFeeSchedule();
                                this.totalDicountAmount = this.totalDicountAmount + discountValue;
                                this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
                                this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
                                this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;
                                this.updateDiscount(); */
                            }
                            /* error */
                            else {
                                let msg = {
                                    type: 'error',
                                    title: 'Unable To Process Request',
                                    body: 'The discount amount exceed the last installment amount'
                                }
                                this.appC.popToast(msg);
                            }
                        }
                        else {
                            let obj = {
                                type: 'error',
                                title: "Error Provecessing Discount",
                                body: "Discount cannot be applied to any installment"
                            }
                            this.appC.popToast(obj);
                        }

                    }
                }
            }
        }
        /* Incomplete form data detected */
        else {
            let msg = {
                type: 'error',
                title: 'Incomplete Form',
                body: 'Please fill all the required fields indicated'
            }
            this.appC.popToast(msg);
        }
    }

    /* ============================================================================================================================ */
    /* ============================================================================================================================ */
    precisionRound(number, precision) {
        let o = number.toFixed(1);
        let num = parseInt(o.toString().split('.')[0]);
        let deci = parseInt(o.toString().split('.')[1]);
        //console.log("number = " +num +" And Decimal = " +deci);
        if (deci == 0) {
            return num;
        }
        else if (deci != 0) {
            /* increment by 1 */
            if (deci >= 5) {
                return num + 1;
            }
            /* return the same count */
            else {
                return num;
            }
        }
        /* var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor; */
    }

    /* ============================================================================================================================ */
    /* ============================================================================================================================ */
    getTotalDiscountAmount(): number {
        if (this.discountApplyForm.value == 0 || this.discountApplyForm.value == '') {
            return 0;
        }
        else {
            if (this.discountApplyForm.type === 'amount') {
                return this.discountApplyForm.value;
            }
            else if (this.discountApplyForm.type === 'percentage') {
                return this.precisionRound(((this.discountApplyForm.value / 100) * this.totalAmountDue), -1);
            }
        }
    }

    /* ============================================================================================================================ */
    /* ============================================================================================================================ */
    calculateLengthPaid(arr: any[]): any[] {
        let temp: any[] = [];
        for (var i = 0; i < this.installmentData.length; i++) {
            if (this.installmentData[i].is_referenced == "N") {
                temp.push(i);
            }
        }

        return temp;
    }



}