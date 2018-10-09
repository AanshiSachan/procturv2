import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../../services/authenticator.service';
import { Observable } from 'rxjs';
import { CommonServiceFactory } from '../../services/common-service';
import * as moment from 'moment';

export interface FeeModel {
    feeTypeMap?: any;
    customFeeSchedules?: CustomFeeSchedule[];
    registeredServiceTax?: any;
    toCreate?: boolean;
    studentArray?: any;
    studentwise_total_fees_amount?: any;
    studentwise_total_fees_balance_amount?: any;
    studentwise_total_fees_amount_paid?: any;
    studentwise_total_fees_discount?: any;
    studentwise_fees_tax_applicable?: string;
    no_of_installments?: any;
    discount_fee_reason?: string;
    template_name?: any;
    template_id?: any;
    template_effective_date?: string;
    is_fee_schedule_created?: string;
    is_fee_tx_done?: string;
    is_undo?: string;
    is_fee_other_inst_created?: string;
    is_delete_other_fee_types?: number;
    chequeDetailsJson?: any;
    payment_mode?: string;
    remarks?: string;
    paid_date?: string;
    is_cheque_details_required?: string;
    reference_no?: string;
    invoice_no?: any;
    course_id?: any;
    subject_id?: any;
    standard_id?: any;
    master_course?: any;
    course_subject_name?: any;
    student_create_screen?: boolean;
    master_course_standard_name?: string;
    is_default?: any;
    template_total_initial_amount?: any;
    fee_discount_reason_id?: any;
    fee_discount_amount_id?: any;
    enable_fee_discount_installment_wise?: boolean;
    uiSelected?: boolean;
}

export interface CustomFeeSchedule {
    student_id?: number;
    batch_id?: number;
    schedule_id?: number;
    fee_type?: any;
    due_date?: string;
    initial_fee_amount?: any;
    service_tax?: number;
    fees_amount?: number;
    tax?: number;
    installment_no?: number;
    service_tax_applicable?: string;
    created_by?: string;
    created_date?: number;
    updated_by?: string;
    update_date?: number;
    is_referenced?: string;
    fee_type_name?: string;
    feeTypes?: any;
    scheduleType?: any;
    amount_paid?: number;
    paid_full?: string;
    fine_type?: any;
    fineAmount?: number;
    fee_date?: any;
    reference_no?: any;
    invoice_no?: number;
    paymentMode?: any;
    balance_amount?: number;
    payment_reference_id?: number;
    paid_date?: string;
    remarks?: any;
    latest_due_date?: string;
    student_name?: any;
    student_disp_id?: any;
    paymentModeAmountMap?: any;
    amount_paid_inRs?: any;
    student_phone?: string;
    days?: number;
    day_type?: number;
    is_paid?: number;
    is_fee_receipt_generate?: number;
    payment_creation_date?: any;
    payment_tx_id?: number;
    payment_status?: number;
    fee_payment_edit_history?: any;
    paymentDate?: any;
    fee_type_tax_configured?: number;
    enquiry_id?: number;
    enquiry_counsellor_name?: string;
    onlinePaymentJson?: any;
    installment_nos?: string;
    pdc_cheque_id?: number;
    is_partially_paid?: number;
    student_fee_template_mapping_id?: any;
    course_subject_name?: string;
    financial_year?: any;
    display_invoice_no?: any;
    totalGst?: number;
    display_receipt_no?: string;
    fee_template_id?: number;
    initial_fee_amount_before_disocunt_before_tax?: number;
    discount?: number;
    student_category?: string;
    cgst?: number;
    sgst?: number;
}

@Injectable()

export class StudentFeeService {


    authorization: string;
    institute_id: number;
    headers: any;
    baseUrl: string = '';
    isProfessional: boolean = false;
    filterForModel: any = {
        course_id_filter: '',
        master_course_name: ''
    };


    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
        private commonService: CommonServiceFactory
    ) {
        this.auth.currentAuthKey.subscribe(key => {
            this.authorization = key;
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth.getBaseUrl();
        this.auth.institute_type.subscribe(
            res => {
                if (res == 'LANG') {
                    this.isProfessional = true;
                    this.filterForModel.course_id_filter = "subject_id";
                    this.filterForModel.master_course_name = 'standard_name';
                } else {
                    this.isProfessional = false;
                    this.filterForModel.course_id_filter = "course_id";
                    this.filterForModel.master_course_name = 'master_course_name';
                }
            }
        )
    }


    public fetchStudentFeeSchedule(id): Observable<FeeModel> {
        let url = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            (res: FeeModel) => {
                return res;
            },
            err => {
                return err
            }
        );
    }

    getReasonsForDiscount() {
        let url = this.baseUrl + "/api/v1/discount/reason/master/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }

    public uniqueConvertFeeJson(res: CustomFeeSchedule[]): CustomFeeSchedule[] {
        let unique = {};
        let distinct = [];
        for (let i in res) {
            if (typeof (unique[res[i].schedule_id]) == "undefined") {
                distinct.push(res[i]);
            }
            unique[res[i].schedule_id] = 0;
        }
        return distinct;
    }

    categoriseCourseWise(data) {
        let subjectWiseSchduleArray = [];
        let uniqueCourseName = Array.from(new Set(data.map(el => el[this.filterForModel.course_id_filter])));
        uniqueCourseName.forEach((courseId: any) => {
            let obj: any = {};
            let feeAmountIncludingTax: number = 0;
            let paidAmount: number = 0;
            let discount: number = 0;
            let initailAmountWithoutTax: number = 0;
            let master_course_name = "";
            let courseName = "";
            let installment = data.filter(el => el[this.filterForModel.course_id_filter] == courseId);
            installment.map((instal: any) => {
                feeAmountIncludingTax = feeAmountIncludingTax + Number(instal.fees_amount);
                paidAmount = paidAmount + Number(instal.amount_paid);
                discount = discount + Number(instal.discount);
                if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                    initailAmountWithoutTax = initailAmountWithoutTax + Number(instal.initial_fee_amount_before_disocunt_before_tax);
                } else {
                    initailAmountWithoutTax = initailAmountWithoutTax + Number(instal.fees_amount);
                }
                instal.uiSelected = false;
                master_course_name = instal[this.filterForModel.master_course_name];
                courseName = instal.course_subject_name;
            })
            obj.uiSelected = false;
            obj.feeType = "course_level";
            obj.course_id = courseId;
            obj.courseName = courseName;
            obj.master_course_name = master_course_name;
            obj.installmentArray = installment;
            obj.feeAmountIncludingTax = feeAmountIncludingTax;
            obj.paidAmount = paidAmount;
            obj.initialAmountWithoutTax = initailAmountWithoutTax;
            obj.discount = discount;
            obj.taxAmount = obj.feeAmountIncludingTax - obj.initialAmountWithoutTax;
            obj.dueAmount = obj.feeAmountIncludingTax - obj.paidAmount;
            if (obj.feeAmountIncludingTax == obj.paidAmount) {
                obj.paid_Full_Installment_CourseWise = "Paid";
            } else if (obj.paidAmount > 0) {
                obj.paid_Full_Installment_CourseWise = "Partially Paid";
            }
            else {
                obj.paid_Full_Installment_CourseWise = "Due";
            }
            subjectWiseSchduleArray.push(obj);
        })
        return subjectWiseSchduleArray;
    }

    makeCardLayoutJson(data) {
        let obj: any = {
            feeAmountInclTax: 0,
            feeAmountExclTax: 0,
            taxAmount: 0,
            discountAmount: 0,
            amountPaid: 0,
            amountDue: 0
        }

        data.forEach(
            installment => {
                obj.feeAmountInclTax = obj.feeAmountInclTax + Number(installment.feeAmountIncludingTax);
                obj.feeAmountExclTax = obj.feeAmountExclTax + Number(installment.initialAmountWithoutTax);
                obj.taxAmount = obj.taxAmount + Number(installment.taxAmount);
                obj.discountAmount = obj.discountAmount + Number(installment.discount);
                obj.amountPaid = obj.amountPaid + Number(installment.paidAmount);
                obj.amountDue = obj.feeAmountInclTax - obj.amountPaid;
            }
        );

        return obj;
    }

    uiSelectionForCourse(data, key, value) {
        data.forEach(element => {
            let selected: number = 0;
            element.installmentArray.forEach(installment => {
                if (installment.paid_full == "N") {
                    element.uiSelected = value;
                    selected++;
                }
            });
            if (selected == element.installmentArray.length) {
                element.uiSelected = true;
            } else {
                element.uiSelected = false;
            }
        });
        return data;
    }

    checkHeaderTableSelection(data) {
        let selected: boolean = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].uiSelected) {
                // course wise all installment is selected
                selected = true;
            } else {
                for (let j = 0; j < data[i].installmentArray.length; j++) {
                    if (data[i].installmentArray[j].paid_full == 'N') {
                        if (data[i].installmentArray[j].uiSelected == false) {
                            selected = false;
                            break;
                        } else {
                            selected = true;
                        }
                    }
                }
                if (selected == false) {
                    return selected;
                }
            }
        }
        return selected;
    }

    changeUiSelectedKeyValue(data, key, value) {
        data.forEach(element => {
            if (element.paid_full != 'Y') {
                element[key] = value;
            }
        });
        return data;
    }

    getTotalAmount(data) {
        let totalAmountToPay: number = 0;
        data.forEach(courseWise => {
            let uiSelected: number = 0;
            let unPaidInstallment = 0;
            courseWise.installmentArray.forEach(element => {
                if (element.uiSelected && element.paid_full == 'N') {
                    uiSelected++;

                    if (element.balance_amount == 0 && element.amount_paid == 0) {
                        // No Amount Paid Yet
                        totalAmountToPay += Number(element.fees_amount);
                    }

                    if (element.balance_amount != 0) {
                        // Partial Payment is done
                        totalAmountToPay += Number(element.balance_amount);
                    }

                }
                if (element.paid_full == 'N') {
                    unPaidInstallment++;
                }
            });
            if (uiSelected == unPaidInstallment) {
                courseWise.uiSelected = true;
            } else {
                courseWise.uiSelected = false;
            }
        });
        return Number(totalAmountToPay);
    }

    validatePaymentDetails(data) {
        if (data.paid_date == null || data.paid_date == "") {
            this.commonService.showErrorMessage('error', 'Mandatory Details', 'Please provide payment date');
            return false;
        }
        if (data.payment_mode == "" || data.payment_mode == null) {
            this.commonService.showErrorMessage('Error', 'Mandatory Details', 'Please provide payment date');
            return false;
        }
        if (data.payingAmount > data.immutableAmount) {
            this.commonService.showErrorMessage('Error', '', 'Please provide paying amount less than total amount to pay.');
            return false;
        }
        if (data.selectedPdcId == "") {
            return true;
        } else {
            return this.validateChequePDCJSon(data.pdcSelectedForm);
        }
    }

    validateChequePDCJSon(data) {
        if (data.bank_name.trim() == '') {
            this.commonService.showErrorMessage('Error', 'Mandatory Details', 'Please provide Bank Name');
            return false;
        }

        if (data.cheque_date == null || data.cheque_date == "") {
            this.commonService.showErrorMessage('Error', 'Mandatory Details', 'Please provide Cheque Date');
            return false;
        }

        if (data.cheque_no.trim() == "") {
            this.commonService.showErrorMessage('Error', 'Mandatory Details', 'Please provide a Cheque Number');
            return false;
        }

        if (data.cheque_no.trim().length != 6) {
            this.commonService.showErrorMessage('Error', 'Mandatory Details', 'Please provide a valid Cheque Number');
            return false;
        }

        return true;
    }

    checkForLastYearInstallmentPayment(courseWiseArray) {
        let acadYearFoundConfirmation: boolean = false;
        for (let i = 0; i < courseWiseArray.length; i++) {
            for (let t = 0; t < courseWiseArray[i].installmentArray.length; t++) {
                let installment = courseWiseArray[i].installmentArray[t];
                if (installment.uiSelected) {
                    if (moment(installment.due_date).format('YYYY-MM-DD') <= moment('2018-03-31').format('YYYY-MM-DD')) {
                        acadYearFoundConfirmation = true;
                        break;
                    }
                }
            }
            if (acadYearFoundConfirmation) {
                break;
            }
        }
        return acadYearFoundConfirmation;
    }

    makePaymentFinalJson(courseWiseArray, paymentPopUpJson) {
        let seletectedInstallment: any = [];
        courseWiseArray.map(
            courseWiseInstallment => {
                courseWiseInstallment.installmentArray.map(
                    installment => {
                        if (installment.uiSelected) {
                            seletectedInstallment.push(installment);
                        }
                    }
                )
            });
        if (seletectedInstallment.length == 0) {
            return;
        }

        let obj = {
            chequeDetailsJson: {},
            paid_date: "",
            paymentMode: "",
            reference_no: "",
            remarks: "",
            studentFeeReportJsonList: [],
            student_id: '',
        };

        if (paymentPopUpJson.payment_mode == "Cheque/PDC/DD No." && paymentPopUpJson.pdcSelectedForm != '') {
            paymentPopUpJson.pdcSelectedForm.cheque_date = moment(paymentPopUpJson.pdcSelectedForm.cheque_date).format('YYYY-MM-DD');
            obj.chequeDetailsJson = paymentPopUpJson.pdcSelectedForm;
        } else {
            obj.chequeDetailsJson = {};
        }
        obj.paid_date = moment(paymentPopUpJson.paid_date).format('YYYY-MM-DD');
        obj.paymentMode = paymentPopUpJson.payment_mode;
        obj.reference_no = paymentPopUpJson.reference_no;
        obj.remarks = obj.remarks;
        obj.studentFeeReportJsonList = this.makePaymentInstallList(seletectedInstallment, paymentPopUpJson.payingAmount);
        return obj;
    }

    makePaymentInstallList(installmentArray, payingAmount) {
        let install: any = [];

        installmentArray = installmentArray.sort((first, second) => {
            return first.installment_no - second.installment_no
        })

        installmentArray.forEach(element => {
            if (element.uiSelected && element.paid_full == 'N' && payingAmount > 0) {

                let obj: any = {
                    due_date: '',
                    fee_schedule_id: '',
                    paid_full: 'N',
                    previous_balance_amt: 0,
                    total_amt_paid: 0,
                };

                // Two Cases is there 
                // 1. Fully Unpaid 
                // 2. Partial Payment

                if (element.balance_amount != 0) {
                    // Partial Payment

                    if (element.balance_amount < payingAmount) {
                        obj.previous_balance_amt = element.balance_amount;
                        obj.total_amt_paid = element.balance_amount;
                        obj.paid_full = 'Y';
                        payingAmount = payingAmount - element.balance_amount;
                    }

                    else if (element.balance_amount > payingAmount) {
                        obj.previous_balance_amt = element.balance_amount;
                        obj.total_amt_paid = payingAmount;
                        obj.paid_full = "N";
                        payingAmount = 0;
                    }

                    else if (element.balance_amount == payingAmount) {
                        obj.previous_balance_amt = element.balance_amount;
                        obj.total_amt_paid = payingAmount;
                        obj.paid_full = 'Y';
                        payingAmount = 0;
                    }

                } else {

                    // UnPaid Installments

                    if (element.fees_amount < payingAmount) {
                        obj.previous_balance_amt = element.fees_amount;
                        obj.total_amt_paid = element.fees_amount;
                        obj.paid_full = "Y";
                        payingAmount = payingAmount - element.fees_amount;
                    }

                    else if (element.fees_amount > payingAmount) {
                        obj.previous_balance_amt = element.fees_amount;
                        obj.total_amt_paid = payingAmount;
                        obj.paid_full = "N";
                        payingAmount = 0;
                    }

                    else if (element.fees_amount == payingAmount) {
                        obj.previous_balance_amt = element.fees_amount;
                        obj.total_amt_paid = payingAmount;
                        obj.paid_full = "Y";
                        payingAmount = 0;
                    }


                }
                obj.due_date = moment(element.due_date).format('YYYY-MM-DD');
                obj.fee_schedule_id = element.schedule_id;
                install.push(obj);
            }
        });
        console.log(install);
        return install;
    }

    getMasterCourseName(data) {
        let uniqueMasterCourseName = Array.from(new Set(data.map(el => el[this.filterForModel.master_course_name])));
        return uniqueMasterCourseName;
    }

    getUnpaidInstallment(data: FeeModel) {
        let unpaidInstallment: any = [];
        data.customFeeSchedules.forEach(
            ele => {
                if (ele.paid_full == "N" && ele.fee_type_name == "INSTALLMENT") {
                    unpaidInstallment.push(ele);
                }
            }
        );
        return Array.from(unpaidInstallment);
    }

    // Discounting Functions

    getUnPaidAmount(data) {
        let unpaid: number = 0
        data.forEach(element => {
            if (element.paid_full == "N") {
                if (element.balance_amount == 0) {
                    unpaid = unpaid + element.fees_amount;
                } else {
                    unpaid = unpaid + element.balance_amount;
                }
            }
        });
        return unpaid;
    }

    checkDiscountValidations(discountJson, unpaidAmount, condition) {

        if (Number(discountJson.discountAmount) <= 0) {
            this.commonService.showErrorMessage('error', 'Invalid Discount Amount', 'Please provide valid discount amount');
            return false;
        }

        if (discountJson.discountAmount > unpaidAmount) {
            this.commonService.showErrorMessage('error', 'Invalid Discount Amount', 'Please provide discount amount less then due amount');
            return false;
        }

        if (condition == "add") {
            if (discountJson.discountAmount == unpaidAmount) {
                this.commonService.showErrorMessage('error', 'Invalid Discount Amount', 'Please provide discount amount less then due amount');
                return false;
            }
        }

        if (discountJson.reason == '-1') {
            this.commonService.showErrorMessage('error', 'Discount Reason', 'Please provide discount reason');
            return false;
        }

        return true;
    }

    checkDiscountCanBeAppliedOnInstallment(data, discount) {
        let selectedInstallment: any = data.filter(el => el.uiSelected == true);
        if (selectedInstallment.length == 0) {
            this.commonService.showErrorMessage('error', 'No installment selcected', 'Please select installment');
            return false;
        }
        let unpaidAmount = this.getUnPaidAmount(selectedInstallment);
        if (discount > unpaidAmount) {
            this.commonService.showErrorMessage('error', 'Invalid Discount Amount', 'Discount is greater then due amount of selected installment');
            return false;
        }
        return true;
    }

    makeDiscountingJSON(installmentArray, popUpFormObj) {
        let discountArray: any = [];
        let mutableDiscount: number = popUpFormObj.discountAmount;
        let selectedInstallment = installmentArray.filter(el => el.uiSelected == true);
        let perInstallmentDiscount = Math.floor(Number(popUpFormObj.discountAmount / selectedInstallment.length));


        for (let i = 0; i < selectedInstallment.length; i++) {
            let element: any = selectedInstallment[i];
            let obj: any = {
                fee_schedule_id: 0,
                installment_no: 0,
                reason_id: 0,
                discount_date: "",
                discount_amount: 0,
                balance_amount: 0,
                final_amount: 0,
                discount_status: 1,
                total_discount_amount: 0,
                total_discount_percent: 0,
                fee_template_mapping_id: 0
            }

            if (element.paid_full == "N" && element.uiSelected) {
                obj.fee_schedule_id = Number(element.schedule_id);
                obj.installment_no = Number(element.installment_no);
                obj.reason_id = Number(popUpFormObj.reason);
                obj.discount_date = moment().format('YYYY-MM-DD');

                if (i == selectedInstallment.length - 1) {
                    // last Installment 
                    if (element.balance_amount == 0) {
                        obj.discount_amount = Math.floor(mutableDiscount);
                        obj.final_amount = Math.floor(element.fees_amount - mutableDiscount);
                        obj.balance_amount = 0;
                    } else {
                        obj.discount_amount = Math.floor(mutableDiscount);
                        obj.final_amount = 0;
                        obj.balance_amount = Math.floor(element.balance_amount - mutableDiscount);
                    }

                    mutableDiscount = mutableDiscount - Math.floor(mutableDiscount);

                } else {
                    if (element.balance_amount == 0) {
                        obj.discount_amount = perInstallmentDiscount;
                        obj.final_amount = element.fees_amount - perInstallmentDiscount;
                        obj.balance_amount = 0;
                    } else {
                        obj.discount_amount = perInstallmentDiscount;
                        obj.final_amount = 0;
                        obj.balance_amount = element.balance_amount - perInstallmentDiscount;
                    }
                    mutableDiscount = mutableDiscount - perInstallmentDiscount;
                }

                console.log(Math.floor(mutableDiscount));

                obj.discount_status = 1;
                if (popUpFormObj.type == "percentage") {
                    obj.total_discount_amount = Number(popUpFormObj.discountAmount);
                    obj.total_discount_percent = Number(popUpFormObj.value);
                } else {
                    obj.total_discount_amount = Number(popUpFormObj.discountAmount);
                    obj.total_discount_percent = 0;
                }

                obj.fee_template_mapping_id = element.fee_template_id;

                discountArray.push(obj);
            }
        }

        return discountArray;
    }

    addDiscountToStudent(jsonObject) {
        jsonObject.institute_id = Number(this.institute_id);
        let url = this.baseUrl + "/api/v1/discount";
        return this.http.post(url, jsonObject, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }


    makeRemoveDiscountJson(installment, popUpFormObj) {
        let discountArray: any = [];
        let mutableDiscount: number = popUpFormObj.discountAmount;
        let perInstallmentDiscount = Math.floor(Number(popUpFormObj.discountAmount / installment.length));


        for (let i = 0; i < installment.length; i++) {
            let element: any = installment[i];
            let obj: any = {
                fee_schedule_id: 0,
                installment_no: 0,
                reason_id: 0,
                discount_date: "",
                discount_amount: 0,
                balance_amount: 0,
                final_amount: 0,
                discount_status: 1,
                total_discount_amount: 0,
                total_discount_percent: 0,
                fee_template_mapping_id: 0
            }

            if (element.paid_full == "N" && element.uiSelected) {
                obj.fee_schedule_id = Number(element.schedule_id);
                obj.installment_no = Number(element.installment_no);
                obj.reason_id = Number(popUpFormObj.reason);
                obj.discount_date = moment().format('YYYY-MM-DD');

                if (i == installment.length - 1) {
                    // last Installment

                    if (element.balance_amount == 0) {
                        obj.discount_amount = Math.floor(mutableDiscount);
                        obj.final_amount = element.fees_amount + Math.floor(mutableDiscount);
                        obj.balance_amount = 0;
                    } else {
                        obj.discount_amount = Math.floor(mutableDiscount);
                        obj.final_amount = 0;
                        obj.balance_amount = element.balance_amount + Math.floor(mutableDiscount);
                    }

                    mutableDiscount = mutableDiscount - perInstallmentDiscount;

                } else {

                    if (element.balance_amount == 0) {
                        obj.discount_amount = perInstallmentDiscount;
                        obj.final_amount = element.fees_amount + perInstallmentDiscount;
                        obj.balance_amount = 0;
                    } else {
                        obj.discount_amount = perInstallmentDiscount;
                        obj.final_amount = 0;
                        obj.balance_amount = element.balance_amount + perInstallmentDiscount;
                    }

                    mutableDiscount = mutableDiscount - perInstallmentDiscount;
                }

                obj.discount_status = 2;
                if (popUpFormObj.type == "percentage") {
                    obj.total_discount_amount = Number(popUpFormObj.discountAmount);
                    obj.total_discount_percent = Number(popUpFormObj.value);
                } else {
                    obj.total_discount_amount = Number(popUpFormObj.discountAmount);
                    obj.total_discount_percent = 0;
                }

                obj.fee_template_mapping_id = element.fee_template_id;

                discountArray.push(obj);
            }
        }

        return discountArray;
    }

    getDiscountHistory(id) {
        let url = this.baseUrl + "/api/v1/discount/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    getFeeDetailsById(i): Observable<any> {
        let urlFeebyId = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + i + "/details";
        return this.http.get(urlFeebyId, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            });
    }

    allocateStudentFees(obj) {
        if (obj.hasOwnProperty('paid_date')) {
            obj.paid_date = moment(obj.paid_date).format("YYYY-MM-DD");
        }
        let urlFeeUpdate = this.baseUrl + "/api/v1/studentWise/fee/schedule/students/save/" + this.institute_id;
        return this.http.post(urlFeeUpdate, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            });
    }

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

}