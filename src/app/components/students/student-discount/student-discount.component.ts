import { Component, OnInit, OnChanges, Output, Input, ElementRef, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { StudentFeeService } from '../student_fee.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { AuthenticatorService } from '../../../services/authenticator.service';


@Component({
    selector: 'student-discount',
    templateUrl: './student-discount.component.html',
    styleUrls: ['./student-discount.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDiscountComponent implements OnInit, OnChanges {


    taxEnabled: any = 0;
    masterCourseName: any = [];
    courseName: any = [];
    installmentArray: any = [];
    discountPopUpForm: any = {
        masterCourseName: '-1',
        coursename: '-1',
        type: 'amount',
        value: 0,
        reason: "-1",
        equalInAllInstall: false,
        tableHead: false,
        discountAmount: 0
    };
    discountReason: any = [];
    clonedInstallmentArray: any = [];
    totalFeesAmount: number = 0;
    isRippleLoad: boolean = false;
    showTab: string = 'addDiscountTab';
    discountHistory: any = [];
    isProfessional: boolean = true;
    filterForModel = {
        course_id: "course_id",
        course_subject_name: "course_subject_name",
        master_course_name: 'master_course_name'
    };

    @Input() feeObject: any = [];
    @Input() totalDiscountApplied: number = 0;
    @Input() initialAmountWithoutTax: number = 0;
    @Input() student_id: any;

    @Output() closePopup = new EventEmitter<any>();

    @ViewChild('btnApplyDiscount') btnApplyDiscount: ElementRef;
    @ViewChild('btnRemoveDiscount') btnRemoveDiscount: ElementRef;
    @ViewChild('addDiscountTab') addDiscountTab: ElementRef;
    @ViewChild('removeDiscountTab') removeDiscountTab: ElementRef;
    @ViewChild('discountHistoryTab') discountHistoryTab: ElementRef;

    constructor(
        private cd: ChangeDetectorRef,
        private feeService: StudentFeeService,
        private commonService: CommonServiceFactory,
        private auth: AuthenticatorService
    ) {

    }

    ngOnInit() {
        this.getDiscountReasons();
        this.taxEnabled = sessionStorage.getItem('enable_tax_applicable_fee_installments');
        this.auth.institute_type.subscribe(
            res => {
                if (res == 'LANG') {
                    this.isProfessional = true;
                    this.filterForModel.course_id = "standard_id";
                    this.filterForModel.course_subject_name = "course_subject_name";
                    this.filterForModel.master_course_name = 'standard_name';
                } else {
                    this.isProfessional = false;
                }
            }
        )
    }

    ngOnChanges() {
        this.cd.markForCheck();
        this.feeObject;
        this.totalDiscountApplied;
        this.initialAmountWithoutTax;
        this.feeObject = this.commonService.keepCloning(this.feeObject);
        this.masterCourseName = this.feeService.getMasterCourseName(this.feeObject.customFeeSchedules);
        this.installmentArray = Array.from(this.feeService.getUnpaidInstallment(this.feeObject));
        this.installmentArray = this.commonService.changeUiSelectedKeyValue(this.installmentArray, 'uiSelected', false);
        this.clonedInstallmentArray = Array.from(this.commonService.keepCloning(this.installmentArray));
        this.totalFeesAmount = this.feeService.getSumOfAmountBeforeTaxOfInstallment(this.installmentArray, this.feeObject.registeredServiceTax);
    }

    getDiscountReasons() {
        this.feeService.getReasonsForDiscount().subscribe(
            res => {
                this.discountReason = res;
            },
            err => {
                this.commonService.showErrorMessage('error', 'Error', err.error.message);
            }
        )
    }

    switchActiveView(id) {
        this.cd.markForCheck();
        this.addDiscountTab.nativeElement.classList.remove('active');
        this.removeDiscountTab.nativeElement.classList.remove('active');
        this.discountHistoryTab.nativeElement.classList.remove('active');
        this[id].nativeElement.classList.add('active');
        this.showTab = id;
        this.flushDataOnTabChange();
        if (id == "addDiscountTab") {
            this.installmentArray = Array.from(this.feeService.getUnpaidInstallment(this.feeObject));
        } else if (id == "removeDiscountTab") {
            this.installmentArray = Array.from(this.feeService.getRemoveDiscountInstallment(this.feeObject.customFeeSchedules));
        } else {
            this.getDiscountHistoryDetails();
            return;
        }
        this.installmentArray = this.commonService.changeUiSelectedKeyValue(this.installmentArray, 'uiSelected', false);
        this.clonedInstallmentArray = Array.from(this.commonService.keepCloning(this.installmentArray));
    }

    masterCourseChange(event) {
        this.discountPopUpForm.tableHead = false;
        if (event == '-1') {
            this.installmentArray = this.clonedInstallmentArray;
            this.discountPopUpForm.coursename = '-1';
            this.courseName = [];
        } else {
            this.installmentArray = this.clonedInstallmentArray.filter(el => el[this.filterForModel.master_course_name] == event);
            this.courseName = this.getCourseNameFromMasterCourse(this.feeObject.customFeeSchedules, event);
        }
    }

    getCourseNameFromMasterCourse(installment, masterCourseName) {
        let courseNameArray = {};
        let arrayList = [];
        for (let i = 0; i < installment.length; i++) {
            if (installment[i][this.filterForModel.master_course_name] == masterCourseName) {
                if (courseNameArray.hasOwnProperty(installment[i][this.filterForModel.course_id])) {

                } else {
                    courseNameArray[installment[i][this.filterForModel.course_id]] = { 'course_subject_name': installment[i][this.filterForModel.course_subject_name] };
                }
            }
        }
        for (let data in courseNameArray) {
            let obj = {
                course_id: data,
                course_subject_name: courseNameArray[data].course_subject_name
            }
            arrayList.push(obj);
        }
        return arrayList;
    }

    onCourseChange(event) {
        if (event != '-1') {
            this.installmentArray = this.clonedInstallmentArray.filter(
                el => el[this.filterForModel.course_id] == event
            );
        } else {
            this.installmentArray = this.clonedInstallmentArray;
        }
        this.discountPopUpForm.tableHead = false;
    }


    onDiscountTypeChange(event) {
        if (event == "amount") {
            this.discountPopUpForm.value = 0;
            this.discountPopUpForm.discountAmount = 0;
        } else {
            this.discountPopUpForm.value = 0;
            this.discountPopUpForm.discountAmount = 0;
        }
    }

    onDiscountAmountChange(event) {
        event = Number(event)
        if (event < 0) {
            this.commonService.showErrorMessage('error', 'Invalid Discount', 'Please provide valid discount');
            this.discountPopUpForm.value = 0;
            this.discountPopUpForm.discountAmount = 0;
            return
        }
        if (this.discountPopUpForm.type == "percentage") {
            if (event >= 100) {
                this.commonService.showErrorMessage('error', 'Invalid Discount Percentage', 'Please provide valid discount percentage');
                this.discountPopUpForm.value = 0;
                this.discountPopUpForm.discountAmount = 0;
                return;
            }
            this.discountPopUpForm.discountAmount = Math.floor(Number((this.totalFeesAmount * event) / 100));
        } else {
            this.discountPopUpForm.discountAmount = Number(this.discountPopUpForm.value);
        }
    }

    onCheckboxApplyInAllClick(event) {
        this.discountPopUpForm.masterCourseName = '-1';
        this.discountPopUpForm.coursename = '-1';
        this.installmentArray = this.clonedInstallmentArray;
        this.onTableHeaderCheckbox(event);
    }

    onTableHeaderCheckbox(event) {
        if (event) {
            this.discountPopUpForm.tableHead = true;
        } else {
            this.discountPopUpForm.tableHead = false;
        }
        this.installmentArray.forEach(el => {
            el.uiSelected = event;
        })
    }

    onRowCheckBoXClick() {
        let count: number = this.installmentArray.filter(el => el.uiSelected).length;
        if (count == this.installmentArray.length) {
            this.discountPopUpForm.tableHead = true;
        } else {
            this.discountPopUpForm.tableHead = false;
        }

    }

    applyAction() {
        // common validation on the bais of amount and reason id
        let unpaidAmount = this.feeService.getUnPaidAmount(this.feeObject.customFeeSchedules, this.feeObject.registeredServiceTax);
        let validationCheck: boolean = this.feeService.checkDiscountValidations(this.discountPopUpForm, unpaidAmount, 'add');
        if (!validationCheck) {
            return false;
        }

        // check whether selected installment can take discount or not

        let installMentLevelCheck: boolean = this.feeService.checkDiscountCanBeAppliedOnInstallment(this.installmentArray, this.discountPopUpForm.discountAmount, this.feeObject.registeredServiceTax);
        if (!installMentLevelCheck) {
            return false;
        }

        // Condition For discount satisfy now apply discount
        let jsonToSend: any = {
            student_id: Number(this.student_id),
            discountInstllmentList: this.feeService.makeDiscountingJSON(this.installmentArray, this.discountPopUpForm, this.feeObject.registeredServiceTax)
        }

        if (jsonToSend.discountInstllmentList == 0) {
            return false;
        }

        this.btnApplyDiscount.nativeElement.disabled = true;
        this.feeService.addDiscountToStudent(jsonToSend).subscribe(
            res => {
                this.btnApplyDiscount.nativeElement.disabled = false;
                this.commonService.showErrorMessage('success', 'Discount Applied', 'Discount applied successfully');
                this.closePopups();
            },
            err => {
                this.btnApplyDiscount.nativeElement.disabled = false;
                this.commonService.showErrorMessage('error', 'Error', err.error.message);
            }
        )

    }

    removeDiscountAction() {

        if (this.discountPopUpForm.discountAmount > this.totalDiscountApplied) {
            this.commonService.showErrorMessage('error', 'Error', 'Discount Amount is greater then discount given to student');
            return false;
        }

        let selectedInstallment: any = this.installmentArray.filter(el => el.uiSelected == true);
        if (selectedInstallment.length == 0) {
            this.commonService.showErrorMessage('error', 'Installment not selected', 'Please select installment');
            return false;
        }

        let unpaidAmount = this.feeService.getUnPaidAmount(selectedInstallment, this.feeObject.registeredServiceTax);
        let check: boolean = this.feeService.checkDiscountValidations(this.discountPopUpForm, unpaidAmount, 'remove');
        if (!check) {
            return;
        }

        let installmentList = this.feeService.makeRemoveDiscountJson(selectedInstallment, this.discountPopUpForm, this.feeObject.registeredServiceTax);
        if (installmentList == false) {
            return;
        }

        let jsonToSend: any = {
            student_id: Number(this.student_id),
            discountInstllmentList: installmentList
        };

        this.btnRemoveDiscount.nativeElement.disabled = true;
        this.feeService.addDiscountToStudent(jsonToSend).subscribe(
            res => {
                this.btnRemoveDiscount.nativeElement.disabled = false;
                this.commonService.showErrorMessage('success', 'Discount Removed', 'Discount removed successfully');
                this.closePopups();
            },
            err => {
                this.btnRemoveDiscount.nativeElement.disabled = false;
                this.commonService.showErrorMessage('error', 'Error', err.error.message);
            }
        )
    }


    getDiscountHistoryDetails() {
        this.feeService.getDiscountHistory(this.student_id).subscribe(
            (res: any) => {
                this.cd.detectChanges();
                this.discountHistory = res.discountInstllmentList;
                this.cd.markForCheck();
            },
            err => {
                this.commonService.showErrorMessage('error', 'Error', err.error.message);
            }
        )
    }


    closePopups() {
        this.closePopup.emit(null);
        this.taxEnabled = 0;
        this.courseName = [];
        this.installmentArray = [];
        this.discountPopUpForm = {
            masterCourseName: '-1',
            coursename: "-1",
            type: 'amount',
            value: 0,
            reason: "-1",
            equalInAllInstall: false,
            tableHead: false,
            discountAmount: 0
        };
        this.discountReason = [];
        this.clonedInstallmentArray = [];
        this.totalFeesAmount = 0;
        this.discountHistory = [];
    }

    flushDataOnTabChange() {
        this.installmentArray = [];
        this.discountPopUpForm = {
            masterCourseName: '-1',
            coursename: "-1",
            type: 'amount',
            value: 0,
            reason: "-1",
            equalInAllInstall: false,
            tableHead: false,
            discountAmount: 0
        };
        this.clonedInstallmentArray = [];
    }

}