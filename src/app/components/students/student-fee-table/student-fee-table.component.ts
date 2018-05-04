import {
  Component, OnInit, OnChanges, Output, Input, ViewChild, ElementRef,
  HostListener, EventEmitter, ChangeDetectorRef, Renderer2, ChangeDetectionStrategy
} from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';


@Component({
  selector: 'student-fee-table',
  templateUrl: './student-fee-table.component.html',
  styleUrls: ['./student-fee-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentFeeTableComponent implements OnInit, OnChanges {
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

  addFeeInstallment: any = {
    amount_paid: '',
    amount_paid_inRs: null,
    balance_amount: 0,
    batch_id: 0,
    created_by: null,
    created_date: null,
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
    tax: 0,
    update_date: null,
    updated_by: null
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
    updated_by: null
  }
  otherFeeType: any[] = [];
  private taxEnableCheck: any = '1';
  service_tax: number = 0;

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
    this.additionalData;
    this.feeTemplateData;

    this.updateTableAndFields();

  }
  /* ============================================================================================== */
  /* ============================================================================================== */
  /* ============================================================================================== */
  /* ============================================================================================== */
  /* ============================================================================================== */
  /* ============================================================================================== */

  @HostListener("document:click", ['$event'])
  onWindowClick(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      if (!event.target.classList.contains('search-item')) {
      }
    }
  }
  /* ============================================================================================== */
  /* ============================================================================================== */

  closePopups($event) {
    this.closePopup.emit(false);
  }
  /* ============================================================================================== */
  /* ============================================================================================== */


  applyAction() {

    this.installmentData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
    for (var i = 0; i < this.installmentData.length; i++) {
      this.installmentData[i].installment_no = i + 1;
    }
    for (var i = 0; i < this.additionalData.length; i++) {
      this.additionalData[i].installment_no = this.installmentData.length + i + 1;
    }

    let customFees = this.installmentData.concat(this.additionalData);

    if(customFees.length != 0){
      this.apply.emit(customFees);
    }
    else{
      let obj = {
        type: "error",
        title: "Invalid Fee Structure",
        body: ""
      }
      this.appC.popToast(obj);
    }



  }
  /* ============================================================================================== */
  /* ============================================================================================== */

  updateTableAndFields() {
    this.service_tax = this.feeTemplateData.registeredServiceTax;
  }
  /* ============================================================================================== */
  /* ============================================================================================== */

  addNewInstallmentFee() {
    if (this.addFeeInstallment.due_date == "" || this.addFeeInstallment.due_date == null || isNaN(this.addFeeInstallment.initial_fee_amount) || this.addFeeInstallment.initial_fee_amount == "" || this.addFeeInstallment.initial_fee_amount <= 0) {
      if (this.addFeeInstallment.due_date == "" || this.addFeeInstallment.due_date == null) {
        let msg = {
          type: 'error',
          title: 'Invalid Date',
          body: 'Please select a due date'
        }
        this.appC.popToast(msg);
      }
      else if (isNaN(this.addFeeInstallment.initial_fee_amount) || this.addFeeInstallment.initial_fee_amount == "" || this.addFeeInstallment.initial_fee_amount <= 0) {
        let msg = {
          type: 'error',
          title: 'Invalid Amount',
          body: 'Please select valid installment amount'
        }
        this.appC.popToast(msg);
      }
    }
    else if (this.addFeeInstallment.due_date != "" && !isNaN(this.addFeeInstallment.initial_fee_amount)) {
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.addFeeInstallment.service_tax = this.feeTemplateData.registeredServiceTax;
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.addFeeInstallment.service_tax = 0;
      }
      this.addFeeInstallment.due_date = moment(this.addFeeInstallment.due_date).format("YYYY-MM-DD");
      this.addFeeInstallment.fee_date = moment(this.addFeeInstallment.due_date).format("YYYY-MM-DD");
      this.addFeeInstallment.fee_type = 0;
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
        tax: 0,
        update_date: null,
        updated_by: null
      }
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

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

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  getOtherFeesArray(): any[] {
    if (this.otherFeeType.length == 0) {
      let tempArr: any[] = [];
      let object = this.feeTemplateData.feeTypeMap;
      for (var key in object) {
        let obj = {
          id: '',
          value: ''
        }
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

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  addNewOtherFee() {
    let otherFeesArr: any[] = this.additionalData;
    this.addFeeOther.due_date = moment(this.addFeeOther.due_date).format('YYYY-MM-DD');
    if (this.addFeeOther.fee_type == '' || this.addFeeOther.fee_type == null || this.addFeeOther.fee_type == undefined ||
      this.addFeeOther.due_date == '' || this.addFeeOther.due_date == null || this.addFeeOther.due_date == undefined || this.addFeeOther.due_date == 'invalid date' ||
      this.addFeeOther.initial_fee_amount == '' || this.addFeeOther.initial_fee_amount == null || this.addFeeOther.initial_fee_amount == 0) {
      if (this.addFeeOther.fee_type == '' || this.addFeeOther.fee_type == null || this.addFeeOther.fee_type == undefined) {
        let msg = {
          type: 'error',
          title: 'Invalid fee type',
          body: 'Please select a valid fee type'
        }
        this.appC.popToast(msg);
      }
      else if (this.addFeeOther.due_date == '' || this.addFeeOther.due_date == null || this.addFeeOther.due_date == undefined || this.addFeeOther.due_date == 'invalid date') {
        let msg = {
          type: 'error',
          title: 'Invalid Due Date',
          body: 'Please valid Date'
        }
        this.appC.popToast(msg);
      }
      else if (this.addFeeOther.initial_fee_amount == '' || this.addFeeOther.initial_fee_amount == null || this.addFeeOther.initial_fee_amount == 0) {
        let msg = {
          type: 'error',
          title: 'Invalid Amount',
          body: 'Please enter a valid fee amount'
        }
        this.appC.popToast(msg);
      }
      else {
      }
    }
    else {
      this.addFeeOther.due_date = moment(this.addFeeOther.due_date).format("YYYY-MM-DD");
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.addFeeOther.fees_amount = parseInt(this.addFeeOther.initial_fee_amount) + (this.precisionRound(((this.addFeeOther.service_tax / 100) * parseInt(this.addFeeOther.initial_fee_amount)), -1));
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.addFeeOther.service_tax = 0;
        this.addFeeOther.fees_amount = parseInt(this.addFeeOther.initial_fee_amount) + (this.precisionRound(((this.addFeeOther.service_tax / 100) * parseInt(this.addFeeOther.initial_fee_amount)), -1));
      }
      otherFeesArr.push(this.addFeeOther);
      this.clearOtherFees(otherFeesArr);
    }
  }

  /* ============================================================================================== */
  /* ============================================================================================== */

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
      updated_by: null
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  updateOtherFeeData(e) {
    this.studentPrefillService.getFeeDetailsById(e).subscribe(
      el => {
        this.addFeeOther.initial_fee_amount = el.fee_amount;
        this.addFeeOther.fee_type_name = el.fee_type;
        this.addFeeOther.service_tax = el.fee_type_tax;
      },
      err => {
        let msg = err.error.message;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    )
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deleteInstallment(i) {
    //console.log(i);
    this.installmentData.splice(i, 1);
    this.updateTableInstallment();
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateTableInstallment() {
    this.installmentData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deleteOtherFee(i) {
    this.additionalData.splice(i, 1);
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */



}
