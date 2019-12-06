import { Component, OnInit, Output, Input, ElementRef, HostListener, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { ActivatedRoute } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { StudentFeeService } from '../student_fee.service';

@Component({
  selector: 'student-fee-table',
  templateUrl: './student-fee-table.component.html',
  styleUrls: ['./student-fee-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentFeeTableComponent implements OnInit {

  @Input() feeTemplateData: any;
  @Input() courseDropdown: any = null;
  @Input() studentName: string = "";
  @Input() student_id: any;
  @Input() resultForUnAssigned: boolean;
  @Input() academicListData: any = [];
  @Input() countryDetails: any;
  @Output() closePopup = new EventEmitter<boolean>();
  otherFeeType: any[] = [];
  installmentData: any = [];
  additionalData: any = [];
  isRippleLoad: boolean = false;
  isProfessional: boolean = false;
  service_tax: number = 0;
  taxEnableCheck: any = '1';

  addFeeInstallment: any = {
    amount_paid: '',
    amount_paid_inRs: null,
    balance_amount: 0,
    batch_id: 0,
    created_by: null,
    created_date: null,
    course_subject_name: null,
    day_type: 0,
    days: 0,
    discount: 0,
    due_date: '',
    enquiry_counsellor_name: "",
    enquiry_id: 0,
    feeTypes: null,
    fee_date: null,
    fee_payment_edit_history: null,
    fee_type: null,
    fee_type_name: "INSTALLMENT",
    fee_type_tax_configured: 0,
    fees_amount: null,
    fineAmount: 0,
    fine_type: null,
    initial_fee_amount: 0,
    installment_no: null,
    installment_nos: "",
    invoice_no: 0,
    is_fee_receipt_generate: 0,
    is_paid: 0,
    is_referenced: "N",
    latest_due_date: "",
    onlinePaymentJson: null,
    paid_date: null,
    paid_full: "N",
    paymentDate: null,
    paymentMode: null,
    paymentModeAmountMap: null,
    payment_creation_date: null,
    payment_reference_id: 0,
    payment_status: 0,
    payment_tx_id: 0,
    pdc_cheque_id: -1,
    reference_no: null,
    remarks: null,
    scheduleType: null,
    schedule_id: 0,
    service_tax: 0,
    service_tax_applicable: "",
    student_category: "",
    student_disp_id: null,
    student_id: 0,
    student_name: null,
    student_phone: "",
    student_fee_template_mapping_id: '-1',
    tax: 0,
    update_date: null,
    updated_by: null,
    initial_fee_amount_before_disocunt_before_tax: 0,
    academic_year_id: '-1'
  }

  addFeeOther: any = {
    amount_paid: '',
    amount_paid_inRs: null,
    balance_amount: 0,
    batch_id: 0,
    created_by: null,
    created_date: null,
    day_type: 0,
    days: 0,
    discount: 0,
    due_date: moment().format("YYYY-MM-DD"),
    enquiry_counsellor_name: "",
    enquiry_id: 0,
    feeTypes: null,
    fee_date: null,
    fee_payment_edit_history: null,
    fee_type: null,
    fee_type_name: "",
    fee_type_tax_configured: 0,
    fees_amount: null,
    fineAmount: 0,
    fine_type: null,
    initial_fee_amount: 0,
    installment_no: null,
    installment_nos: "",
    invoice_no: 0,
    is_fee_receipt_generate: 0,
    is_paid: 0,
    is_referenced: "N",
    latest_due_date: "",
    onlinePaymentJson: null,
    paid_date: null,
    paid_full: "N",
    paymentDate: null,
    paymentMode: null,
    paymentModeAmountMap: null,
    payment_creation_date: null,
    payment_reference_id: 0,
    payment_status: 0,
    payment_tx_id: 0,
    pdc_cheque_id: -1,
    reference_no: null,
    remarks: null,
    scheduleType: null,
    schedule_id: 0,
    service_tax: null,
    service_tax_applicable: "",
    student_category: "",
    student_disp_id: null,
    student_id: 0,
    student_name: null,
    student_phone: "",
    tax: 0,
    update_date: null,
    updated_by: null,
    initial_fee_amount_before_disocunt_before_tax: 0,
    academic_year_id: '-1'
  }

  constructor(
    private cd: ChangeDetectorRef,
    private eRef: ElementRef,
    private msgToast: MessageShowService,
    private feeService: StudentFeeService,
    private actRoute: ActivatedRoute,
    private auth: AuthenticatorService,
  ) { }

  ngOnInit() {
    this.taxEnableCheck = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.getInstType();
    console.log(this.resultForUnAssigned);
  }

  getInstType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') { // batch
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
  }

  ngOnChanges() {
    this.student_id;
    this.cd.markForCheck()
    this.feeTemplateData;
    this.courseDropdown;
    this.academicListData;
    this.service_tax = this.feeTemplateData.registeredServiceTax;
    this.splitCustomizedFee();
  }

  changeAcademicyear($event) {
    this.addFeeInstallment.academic_year_id = '-1';
    this.courseDropdown.forEach(object => {
      if (object.template_mapping_idWithCourseOrSubjectName == $event) {
        this.addFeeInstallment.academic_year_id = object.academic_year_id;
      }
    });
  }


  splitCustomizedFee() {
    this.feeTemplateData.customFeeSchedules.forEach(el => {
      el.due_date = new Date(el.due_date);
      if (el.fee_type_name === "INSTALLMENT") {
        this.installmentData.push(el);
      }
      else if (el.fee_type_name != "INSTALLMENT") {
        this.additionalData.push(el);
      }
    });
  }

  @HostListener("document:click", ['$event'])
  onWindowClick(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      if (!event.target.classList.contains('search-item')) {
      }
    }
  }

  closePopups($event) {
    this.closePopup.emit(false);
  }

  applyAction() {
    this.installmentData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
    this.installmentData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
    for (var i = 1; i < this.installmentData.length; i++) {
      this.installmentData[i].installment_no = i;
    }
    for (var i = Number(this.installmentData.length) + 1; i < this.additionalData.length; i++) {
      this.additionalData[i].installment_no = i;
    }

    let customFees = this.installmentData.concat(this.additionalData);
    customFees.forEach(object => {
      if (object.fee_type_name == "INSTALLMENT") {
        if (object.student_id == 0 && sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
          object.service_tax = this.service_tax;
          object.service_tax_applicable = 'Y';
        }
        else if (object.student_id == 0 && sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
          object.service_tax = 0;
          object.service_tax_applicable = 'N';
        }
      } else {
        if (object.student_id == 0 && object.service_tax > 0 && sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
          object.service_tax = object.service_tax;
          object.service_tax_applicable = 'Y';
        }
        else if (object.student_id == 0 && object.service_tax == 0 && sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
          object.service_tax = 0;
          object.service_tax_applicable = 'N';
        }
      }
    });

    if (sessionStorage.getItem('permissions')) {
      let permissions = JSON.parse(sessionStorage.getItem('permissions'));

      if ((!permissions.includes('707')) || (!permissions.includes('714'))) {
        let isError = false;
        for (let i = 0; i < customFees.length; i++) {
          if (customFees[i].temp_due_date) {
            if (!(new Date(customFees[i].due_date).valueOf() >= new Date(customFees[i].temp_due_date).valueOf())) {
              this.msgToast.showErrorMessage('error', '', 'you are not allowed to select past payment date ');
              isError = true;
              break;
            }
          }
        }
        if (isError) {
          return false;
        }
      }
    }
    if (customFees.length != 0) {
      // this.apply.emit(customFees);
      this.makeServerCallToSave(customFees);
    }
    else {
      this.msgToast.showErrorMessage('error', '', 'Invalid Fee Structure');
    }
  }

  makeServerCallToSave(feeSch) {
    let totalAmountDue = this.getTotalAmountDue(feeSch);
    let temp = "N";
    if (!this.resultForUnAssigned) {
      temp = "Y";
    }

    let obj = {
      customFeeSchedules: feeSch,
      discount_fee_reason: "",
      is_delete_other_fee_types: 0,
      is_undo: this.feeTemplateData.is_undo,
      is_archived: temp,
      studentArray: [],
      studentwise_fees_tax_applicable: "",
      studentwise_total_fees_amount: "",
      studentwise_total_fees_discount: 0,
      template_effective_date: "",
      template_id: ""
    };
    obj.customFeeSchedules = this.getFeeStructure(feeSch);
    obj.discount_fee_reason = this.feeTemplateData.discount_fee_reason;
    obj.studentArray.push(this.student_id);
    obj.studentwise_fees_tax_applicable = this.feeTemplateData.studentwise_fees_tax_applicable;
    obj.studentwise_total_fees_amount = totalAmountDue.toString();
    obj.studentwise_total_fees_discount = this.feeTemplateData.studentwise_total_fees_discount;
    obj.template_effective_date = moment(this.feeTemplateData.template_effective_date).format("YYYY-MM-DD");
    obj.template_id = this.feeTemplateData.template_id;

    this.feeService.allocateStudentFees(obj).subscribe(
      res => {
        this.msgToast.showErrorMessage('success', '', 'Applied Successfully');
        this.closePopup.emit(true);
      },
      err => {
        this.msgToast.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  getTotalAmountDue(data) {
    let totalAmountDue: number = 0;
    data.forEach(
      el => {
        if (el.paid_full == "N") {
          if (el.balance_amount == 0) {
            totalAmountDue = totalAmountDue + Number(el.fees_amount);
          } else {
            totalAmountDue = totalAmountDue + Number(el.balance_amount);
          }
        }
      }
    )
    return totalAmountDue;
  }

  getFeeStructure(fee: any[]): any[] {
    let temp: any[] = [];

    fee.forEach(el => {
      if (el.due_date == null) {
        el.due_date = moment().format("YYYY-MM-DD");
      }
      el.student_fee_template_mapping_id = el.student_id == 0 && el.course_subject_name == null ? -1 : el.student_fee_template_mapping_id;
      let obj = {
        fee_date: moment(el.due_date).format("YYYY-MM-DD"),
        fee_type: el.fee_type_name === "INSTALLMENT" ? 0 : el.fee_type,
        fees_amount: el.fees_amount,
        initial_fee_amount: el.initial_fee_amount,
        is_paid: this.getPaidStatus(el),
        is_referenced: el.is_referenced,
        schedule_id: el.schedule_id,
        service_tax: el.service_tax,
        service_tax_applicable: el.service_tax_applicable,
        student_fee_template_mapping_id: el.student_fee_template_mapping_id,
        initial_fee_amount_before_disocunt_before_tax: el.initial_fee_amount,
        academic_year_id: el.academic_year_id
      }
      temp.push(obj);
    });
    //console.log(temp);
    return temp;
  }

  getPaidStatus(el): any {
    if (el.is_referenced == 'Y') {
      return 0;
    }
    else if (el.is_referenced == 'N' && el.is_paid == 1) {
      return 1;
    }
    else if (el.is_referenced == 'N' && el.is_paid == 0) {
      return 0;
    }
  }

  addNewInstallmentFee() {
    if (this.addFeeInstallment.due_date == "" || this.addFeeInstallment.due_date == null || isNaN(this.addFeeInstallment.initial_fee_amount) || this.addFeeInstallment.initial_fee_amount == "" || this.addFeeInstallment.initial_fee_amount <= 0) {
      if (this.addFeeInstallment.due_date == "" || this.addFeeInstallment.due_date == null) {
        this.msgToast.showErrorMessage('error', 'Invalid Date', 'Please select a due date');
      }
      else if (isNaN(this.addFeeInstallment.initial_fee_amount) || this.addFeeInstallment.initial_fee_amount == "" || this.addFeeInstallment.initial_fee_amount <= 0) {
        this.msgToast.showErrorMessage('error', 'Invalid Amount', 'Please select valid installment amount');
      }
    }
    else if (this.addFeeInstallment.due_date != "" && !isNaN(this.addFeeInstallment.initial_fee_amount)) {

      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.addFeeInstallment.service_tax = this.feeTemplateData.registeredServiceTax;
        this.addFeeInstallment.service_tax_applicable = 'Y';
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.addFeeInstallment.service_tax = 0;
        this.addFeeInstallment.service_tax_applicable = 'N';
      }

      this.addFeeInstallment.due_date = moment(this.addFeeInstallment.due_date).format("YYYY-MM-DD");
      this.addFeeInstallment.fee_date = moment(this.addFeeInstallment.due_date).format("YYYY-MM-DD");
      this.addFeeInstallment.fee_type = 0;

      if (this.addFeeInstallment.student_fee_template_mapping_id != '-1') {
        let id = this.addFeeInstallment.student_fee_template_mapping_id.split(',')[0];
        let name = this.addFeeInstallment.student_fee_template_mapping_id.split(',')[1];
        this.addFeeInstallment.student_fee_template_mapping_id = id;
        this.addFeeInstallment.course_subject_name = name;
      }

      this.addFeeInstallment.initial_fee_amount_before_disocunt_before_tax = this.addFeeInstallment.initial_fee_amount;
      this.addFeeInstallment.fees_amount = parseInt(this.addFeeInstallment.initial_fee_amount) + (this.precisionRound(((this.addFeeInstallment.service_tax / 100) * parseInt(this.addFeeInstallment.initial_fee_amount)), -1));
      this.addFeeInstallment.amount_paid = 0;
      this.addFeeInstallment.balance_amount = 0;
      this.installmentData.push(this.addFeeInstallment);
      this.addFeeInstallment = {
        amount_paid: '',
        amount_paid_inRs: null,
        balance_amount: 0,
        batch_id: 0,
        created_by: null,
        created_date: null,
        day_type: 0,
        days: 0,
        discount: 0,
        due_date: moment().format("YYYY-MM-DD"),
        enquiry_counsellor_name: "",
        enquiry_id: 0,
        feeTypes: null,
        fee_date: null,
        fee_payment_edit_history: null,
        fee_type: null,
        fee_type_name: "",
        fee_type_tax_configured: 0,
        fees_amount: 0,
        fineAmount: 0,
        fine_type: null,
        initial_fee_amount: null,
        installment_no: null,
        installment_nos: "",
        invoice_no: 0,
        is_fee_receipt_generate: 0,
        is_paid: 0,
        is_referenced: "N",
        latest_due_date: "",
        onlinePaymentJson: null,
        paid_date: null,
        paid_full: "N",
        paymentDate: null,
        paymentMode: null,
        paymentModeAmountMap: null,
        payment_creation_date: null,
        payment_reference_id: 0,
        payment_status: 0,
        payment_tx_id: 0,
        pdc_cheque_id: -1,
        reference_no: null,
        remarks: null,
        scheduleType: null,
        schedule_id: 0,
        service_tax: null,
        service_tax_applicable: "",
        student_category: "",
        student_disp_id: null,
        student_id: 0,
        student_name: null,
        student_phone: "",
        student_fee_template_mapping_id: '-1',
        tax: 0,
        update_date: null,
        updated_by: null,
        initial_fee_amount_before_disocunt_before_tax: 0
      }
    }
  }

  precisionRound(number, precision) {
    let o = number.toFixed(1);
    let num = parseInt(o.toString().split('.')[0]);
    let deci = parseInt(o.toString().split('.')[1]);
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
  }


  getOtherFeesArray(): any[] {
    if (this.otherFeeType.length == 0) {
      let tempArr: any[] = [];
      let object = this.feeTemplateData.feeTypeMap;
      for (var key in object) {
        let obj = { id: '', value: '' };
        if (object.hasOwnProperty(key)) {
          obj.id = key;
          obj.value = object[key];
          tempArr.push(obj);
        }
      }
      this.otherFeeType = tempArr;
      return tempArr;
    }
    else {
      return this.otherFeeType;
    }
  }


  addNewOtherFee() {
    let otherFeesArr: any[] = this.additionalData;
    this.addFeeOther.due_date = moment(this.addFeeOther.due_date).format('YYYY-MM-DD');
    if (this.addFeeOther.fee_type == '' || this.addFeeOther.fee_type == null || this.addFeeOther.fee_type == undefined ||
      this.addFeeOther.due_date == '' || this.addFeeOther.due_date == null || this.addFeeOther.due_date == undefined ||
      this.addFeeOther.due_date == 'invalid date' ||
      this.addFeeOther.initial_fee_amount == '' || this.addFeeOther.initial_fee_amount == null || this.addFeeOther.initial_fee_amount == 0) {
      if (this.addFeeOther.fee_type == '' || this.addFeeOther.fee_type == null || this.addFeeOther.fee_type == undefined) {
        this.msgToast.showErrorMessage('error', 'Invalid fee type', 'Please select a valid fee type');
      }
      else if (this.addFeeOther.due_date == '' || this.addFeeOther.due_date == null || this.addFeeOther.due_date == undefined || this.addFeeOther.due_date == 'invalid date') {
        this.msgToast.showErrorMessage('error', 'Invalid Due Date', 'Please valid Date');
      }
      else if (this.addFeeOther.initial_fee_amount == '' || this.addFeeOther.initial_fee_amount == null || this.addFeeOther.initial_fee_amount == 0) {
        this.msgToast.showErrorMessage('error', 'Invalid Amount', 'Please enter a valid fee amount');
      }
    }
    else {
      this.addFeeOther.due_date = moment(this.addFeeOther.due_date).format("YYYY-MM-DD");
      if (this.addFeeOther.service_tax > 0 && this.addFeeOther.fee_type_name != "INSTALLMENT") {
        this.addFeeInstallment.service_tax_applicable = 'Y';
        this.addFeeInstallment.service_tax = this.feeTemplateData.registeredServiceTax;
        this.addFeeOther.fees_amount = parseInt(this.addFeeOther.initial_fee_amount) + (this.precisionRound(((this.addFeeOther.service_tax / 100) * parseInt(this.addFeeOther.initial_fee_amount)), -1));
      }
      else {
        this.addFeeOther.service_tax = 0;
        this.addFeeOther.service_tax_applicable = 'N';
        this.addFeeOther.fees_amount = parseInt(this.addFeeOther.initial_fee_amount) + (this.precisionRound(((this.addFeeOther.service_tax / 100) * parseInt(this.addFeeOther.initial_fee_amount)), -1));
      }

      this.addFeeOther.initial_fee_amount_before_disocunt_before_tax = this.addFeeOther.initial_fee_amount;
      otherFeesArr.push(this.addFeeOther);
      this.clearOtherFees(otherFeesArr);
    }
  }


  clearOtherFees(arr: any[]) {
    this.additionalData = arr;
    this.addFeeOther = {
      amount_paid: '',
      amount_paid_inRs: null,
      balance_amount: 0,
      batch_id: 0,
      created_by: null,
      created_date: null,
      day_type: 0,
      days: 0,
      discount: 0,
      due_date: moment().format("YYYY-MM-DD"),
      enquiry_counsellor_name: "",
      enquiry_id: 0,
      feeTypes: null,
      fee_date: null,
      fee_payment_edit_history: null,
      fee_type: null,
      fee_type_name: "",
      fee_type_tax_configured: 0,
      fees_amount: 0,
      fineAmount: 0,
      fine_type: null,
      initial_fee_amount: 0,
      installment_no: null,
      installment_nos: "",
      invoice_no: 0,
      is_fee_receipt_generate: 0,
      is_paid: 0,
      is_referenced: "N",
      latest_due_date: "",
      onlinePaymentJson: null,
      paid_date: null,
      paid_full: "N",
      paymentDate: null,
      paymentMode: null,
      paymentModeAmountMap: null,
      payment_creation_date: null,
      payment_reference_id: 0,
      payment_status: 0,
      payment_tx_id: 0,
      pdc_cheque_id: -1,
      reference_no: null,
      remarks: null,
      scheduleType: null,
      schedule_id: 0,
      service_tax: null,
      service_tax_applicable: "N",
      student_category: "",
      student_disp_id: null,
      student_id: 0,
      student_name: null,
      student_phone: "",
      tax: 0,
      update_date: null,
      updated_by: null,
      initial_fee_amount_before_disocunt_before_tax: 0,
      academic_year_id: '-1'
    }
  }

  updateOtherFeeData(e) {
    this.cd.markForCheck();
    this.feeService.getFeeDetailsById(e).subscribe(
      el => {
        this.cd.markForCheck();
        this.addFeeOther.initial_fee_amount = el.fee_amount;
        this.addFeeOther.fee_type_name = el.fee_type;
        this.addFeeOther.service_tax = el.fee_type_tax;
      },
      err => {
        this.msgToast.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  // calculate tax
  getTaxedAmount(amt, stat, i): number {
    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      let tax: number = 0;
      tax = this.precisionRound(((this.service_tax / 100) * amt), -1);
      this.installmentData[i].tax = tax;
      return tax;
    }
    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
      return 0;
    }
  }

  updateInitialAmount(amt, i) {

    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      let value: number = 0;
      value = this.precisionRound((amt / ((this.service_tax / 100) + 1)), -1);
      this.installmentData[i].initial_fee_amount = value;
      return value;
    }
    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
      this.installmentData[i].initial_fee_amount = parseInt(amt);
      return amt;
    }

  }


  deleteInstallment(i) {
    //console.log(i);
    this.installmentData.splice(i, 1);
    this.updateTableInstallment();
  }

  updateTableInstallment() {
    this.installmentData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
  }

  // used in ui calculate taxes
  getOtherTaxes(amt, stat, i): number {
    if (this.additionalData.length > 0) {
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        let tax: number = 0;
        tax = this.precisionRound(((stat / 100) * amt), -1);
        this.additionalData[i].tax = tax;
        return Math.floor(tax);
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        let tax: number = 0;
        this.additionalData[i].tax = tax;
        return Math.floor(tax);
      }
    }
  }

  // used in ui 
  updateAdditionalInitialAmount(amount, tax, index) {
    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      let value: number = 0;
      value = this.precisionRound((amount / ((tax / 100) + 1)), -1);
      this.additionalData[index].initial_fee_amount = value;
      return value;
    }
    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
      this.additionalData[index].initial_fee_amount = parseInt(amount);
      return amount;
    }
  }

  deleteOtherFee(i) {
    this.additionalData.splice(i, 1);// remove additional fee
  }
}
