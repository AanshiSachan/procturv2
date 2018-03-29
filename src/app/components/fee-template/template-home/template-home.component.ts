import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { FeeStrucService } from '../../../services/feeStruc.service';
import 'rxjs/Rx';

@Component({
  selector: 'app-template-home',
  templateUrl: './template-home.component.html',
  styleUrls: ['./template-home.component.scss']
})
export class TemplateHomeComponent implements OnInit {

  isProfessional: boolean = false;
  source: any[] = [];
  selectedTemplate: any;
  isHeaderEdit: boolean = false;
  isEditFee: boolean = false;
  feeStructure: any;
  installmentList: any = [];
  otherInstList: any = [];
  otherFeetype: any = [];
  AddInstallment = {
    days: 0,
    day_type: 1,
    fee_type: 0,
    fees_amount: 0,
    initial_fee_amount: 0,
    is_referenced: 'N',
    schedule_id: 0,
    service_tax: 0,
    service_tax_applicable: "N",
    tax: 0
  }
  additionalInstallment = {
    days: 0,
    day_type: 1,
    fee_type: 0,
    fees_amount: 0,
    initial_fee_amount: 0,
    is_referenced: 'N',
    schedule_id: 0,
    service_tax: 0,
    service_tax_applicable: 'N',
    fee_type_name: ''
  }
  customJson: any = [];
  totalAmount: any = '';
  discountAmount: any = '';
  isRippleLoad: boolean = false;
  feeTyeDetails: any = [];
  enableTax: any;

  constructor(private router: Router, private appC: AppComponent, private login: LoginService, private fetchService: FeeStrucService) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.enableTax = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.fetchPrefill();
  }


  fetchPrefill() {
    this.getFeeStructures();
  }


  getFeeStructures() {
    this.isRippleLoad = true;
    this.fetchService.fetchFeeStruc().subscribe(
      res => {
        this.isRippleLoad = false;
        this.source = res;
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  editFee(fee) {
    this.selectedTemplate = fee;
    this.feeStructure = [];
    this.isEditFee = true;
    this.isRippleLoad = true;
    this.fetchService.fetchFeeDetail(fee.template_id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.feeStructure = res;
        this.fillFeeType(res.feeTypeMap);
        this.fillDataInYTable(res.customFeeSchedules);
        if (res.studentwise_fees_tax_applicable == "Y") {
          if (this.enableTax == "1") {
            document.getElementById('checkBoxtaxes').checked = true;
            this.onApplyTaxChechbox();
          }
        }
        this.totalAmountCal = res.studentwise_total_fees_amount;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  fillFeeType(data) {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let test: any = {};
      test.id = keys[i];
      test.value = data[keys[i]];
      this.otherFeetype.push(test);
    }
  }

  fillDataInYTable(data) {
    this.installmentList = [];
    this.otherInstList = [];
    for (let t = 0; t < data.length; t++) {
      if (data[t].fee_type_name == "INSTALLMENT") {
        this.installmentList.push(data[t]);
      } else {
        this.otherInstList.push(data[t]);
      }
    }
  }

  closeFeeEditor() {
    this.getFeeStructures();
    this.isHeaderEdit = false;
    this.isEditFee = false;
  }

  updateFeeTemplate() {
    let taxApplicable = document.getElementById('checkBoxtaxes').checked;
    if (taxApplicable == true) {
      taxApplicable = "Y";
    } else {
      taxApplicable = "N";
    }
    let data: any = {
      customFeeSchedules: this.makeJSONForCustomFee(),
      studentwise_total_fees_amount: this.totalAmount.toString(),
      studentwise_total_fees_discount: this.discountAmount,
      studentwise_fees_tax_applicable: taxApplicable,
      template_id: this.selectedTemplate.template_id.toString(),
      template_name: this.feeStructure.template_name
    };
    // this.isRippleLoad = true;
    // this.fetchService.updateFeeTemplate(data).subscribe(
    //   res => {
    //     this.isRippleLoad = false;
    //     let msg = {
    //       type: 'success',
    //       title: 'Updated',
    //       body: "Fee Structure Updated Successfully"
    //     }
    //     this.appC.popToast(msg);
    //     this.closeFeeEditor();
    //   },
    //   err => {
    //     this.isRippleLoad = false;
    //     console.log(err);
    //     let msg = {
    //       type: 'error',
    //       title: 'Error',
    //       body: err.error.message
    //     }
    //     this.appC.popToast(msg);
    //   }
    // )
  }

  makeJSONForCustomFee() {
    this.customJson = [];
    this.totalAmount = 0;
    this.discountAmount = 0;
    let data: any = [];
    for (let t = 0; t < this.installmentList.length; t++) {
      let test: any = {};
      test.fee_type = 0;
      test.initial_fee_amount = this.installmentList[t].initial_fee_amount.toString();
      test.service_tax = this.installmentList[t].service_tax.toString();
      test.fees_amount = this.installmentList[t].fees_amount.toString();
      test.service_tax_applicable = this.installmentList[t].service_tax_applicable;
      test.schedule_id = this.installmentList[t].schedule_id.toString();
      test.is_referenced = this.installmentList[t].is_referenced;
      test.day_type = this.installmentList[t].day_type.toString();
      test.days = this.installmentList[t].days.toString();
      this.totalAmount = this.totalAmount + this.installmentList[t].fees_amount;
      this.discountAmount = this.discountAmount + this.installmentList[t].fees_amount - this.installmentList[t].initial_fee_amount;
      data.push(test);
    }
    for (let t = 0; t < this.otherInstList.length; t++) {
      let test: any = {};
      test.fee_type = this.otherInstList[t].fee_type;
      test.initial_fee_amount = this.otherInstList[t].initial_fee_amount.toString();
      test.service_tax = this.otherInstList[t].service_tax.toString();
      test.fees_amount = this.otherInstList[t].fees_amount.toString();
      test.service_tax_applicable = this.otherInstList[t].service_tax_applicable;
      test.schedule_id = this.otherInstList[t].schedule_id.toString();
      test.is_referenced = this.otherInstList[t].is_referenced;
      test.day_type = this.otherInstList[t].day_type.toString();
      test.days = this.otherInstList[t].days.toString();
      this.totalAmount = this.totalAmount + this.otherInstList[t].fees_amount;
      this.discountAmount = this.discountAmount + this.otherInstList[t].fees_amount - this.otherInstList[t].initial_fee_amount;
      data.push(test);
    }
    this.customJson = data;
    return data;
  }


  updateTemplateName() {
    if (this.selectedTemplate.template_name.trim() != '') {
      this.isHeaderEdit = false
    }
    else {
      let msg = {
        type: 'error',
        title: 'Fee Template Name is Mandatory',
        body: 'Please enter a valid fee template name'
      }
      this.appC.popToast(msg);
    }
  }


  calculateTaxAmout(row) {
    if (document.getElementById('checkBoxtaxes').checked == true) {
      return row.fees_amount - row.initial_fee_amount;
    }
  }


  calculateTotalAmount() {
    if (document.getElementById('checkBoxtaxes').checked == true) {
      let otherAmount = 0;
      if (this.otherInstList.length > 0) {
        otherAmount = this.otherInstList.map(fee => fee.fees_amount).reduce((acc, val) => val + acc)
      } else {
        otherAmount = 0;
      }
      return Math.floor(this.onApplyTaxChechbox() + otherAmount);
    } else {
      let installAmount = 0;
      let otherAmount = 0;
      if (this.installmentList.length > 0) {
        installAmount = this.installmentList.map(fee => fee.initial_fee_amount).reduce((acc, val) => val + acc);
      }
      if (this.otherInstList.length > 0) {
        otherAmount = this.otherInstList.map(fee => fee.fees_amount).reduce((acc, val) => val + acc);
      }
      return Math.floor(installAmount + otherAmount);
    }
  }

  onApplyTaxChechbox() {
    let taxPercent = this.feeStructure.registeredServiceTax;
    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      if (this.installmentList.length > 0) {
        this.addTaxInInstallmentTable();
        return (this.totalAmountCal);
      } else {
        return 0;
      }
    } else {
      let msg = {
        type: 'error',
        title: 'Error',
        body: "Please define Tax (%age) in Institute Settings"
      }
      this.appC.popToast(msg);
      document.getElementById('checkBoxtaxes').checked == false;
      this.calculateTotalAmount();
    }
  }

  totalAmountCal: number = 0
  addTaxInInstallmentTable() {
    this.totalAmountCal = 0;
    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      let taxPercent = this.feeStructure.registeredServiceTax;
      if (document.getElementById('checkBoxtaxes').checked == true) {
        if (taxPercent > 0) {
          this.installmentList.map(
            fee => {
              if (fee.service_tax_applicable == "Y") {
                fee.tax = Math.floor(fee.fees_amount - fee.initial_fee_amount)
                this.totalAmountCal = this.totalAmountCal + fee.fee_amount;
              } else {
                fee.tax = Math.floor(fee.fees_amount * 0.01 * taxPercent);
                fee.initial_fee_amount = fee.fees_amount - fee.tax;
                fee.service_tax_applicable = "Y";
                this.totalAmountCal = this.totalAmountCal + fee.fees_amount;
              }
            }
          )
        }
      } else {
        this.installmentList.map(
          fee => {
            if (fee.service_tax_applicable == "Y") {
              fee.initial_fee_amount = fee.fee_amount - fee.tax;
              fee.tax = 0;
              fee.fees_amount = fee.tax + fee.initial_fee_amount;
              fee.service_tax_applicable = "N";
            } else {
              fee.tax = 0;
              fee.fees_amount = fee.initial_fee_amount;
            }
            this.totalAmountCal = this.totalAmountCal + fee.fees_amount;
          }
        )
      }
      if (this.otherInstList.length > 0) {
        this.totalAmountCal = this.totalAmountCal + this.otherInstList.map(fee => fee.fees_amount).reduce((acc, val) => val + acc);
      }
    }
  }

  deleteRow(row, i) {
    this.installmentList.splice(i, 1);
  }

  deleteAdditionalRow(row, i) {
    this.otherInstList.splice(i, 1);
  }


  addInstallmentInTable() {
    if (Number(this.AddInstallment.initial_fee_amount) > 0 && this.AddInstallment.days != null) {
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.AddInstallment.service_tax = Number(this.feeStructure.registeredServiceTax);
        if (document.getElementById('checkBoxtaxes').checked) {
          this.AddInstallment.service_tax_applicable = "Y";
          this.AddInstallment.tax = Math.floor(this.AddInstallment.initial_fee_amount * Number(this.feeStructure.registeredServiceTax) * 0.01);
        } else {
          this.AddInstallment.service_tax_applicable = "N";
        }
      } else {
        this.AddInstallment.fees_amount = this.AddInstallment.initial_fee_amount;
      }
      this.AddInstallment.fees_amount = this.AddInstallment.initial_fee_amount + this.AddInstallment.tax;
      this.installmentList.push(this.AddInstallment);
      this.AddInstallment = {
        days: 0,
        day_type: 1,
        fee_type: 0,
        fees_amount: 0,
        initial_fee_amount: 0,
        is_referenced: 'N',
        schedule_id: 0,
        service_tax: 0,
        service_tax_applicable: 'N',
        tax: 0
      }
    } else {
      let msg = {
        type: 'error',
        title: 'Error',
        body: ""
      }
      if (this.AddInstallment.initial_fee_amount == null || this.AddInstallment.initial_fee_amount == 0) {
        msg.body = "Please provide Amount";
        this.appC.popToast(msg);
        return;
      }
      if (this.AddInstallment.days == null) {
        msg.body = "Please provide days/month.";
        this.appC.popToast(msg);
        return;
      }
    }
  }


  addAdditionalInst() {
    if (Number(this.additionalInstallment.initial_fee_amount) > 0 && this.additionalInstallment.days != null) {
      this.additionalInstallment.fees_amount = this.additionalInstallment.initial_fee_amount;
      this.otherInstList.push(this.additionalInstallment);
      this.additionalInstallment = {
        days: 0,
        day_type: 1,
        fee_type: 0,
        fees_amount: 0,
        initial_fee_amount: 0,
        is_referenced: 'N',
        schedule_id: 0,
        service_tax: 0,
        service_tax_applicable: 'N',
        fee_type_name: ''
      }
    } else {
      let msg = {
        type: 'error',
        title: 'Error',
        body: ""
      }
      if (this.additionalInstallment.initial_fee_amount == 0 || this.additionalInstallment.initial_fee_amount == null) {
        msg.body = "Please provide Amount";
        this.appC.popToast(msg);
        return;
      }
      if (this.additionalInstallment.days == null) {
        msg.body = "Please provide days";
        this.appC.popToast(msg);
        return;
      }
    }
  }

  onAdditionalFeeSelection(event) {
    let id = event;
    this.feeTyeDetails = [];
    this.fetchService.getAdditionalFeeDeatails(event).subscribe(
      (res: any) => {
        this.feeTyeDetails = res;
        this.additionalInstallment.initial_fee_amount = res.fee_amount;
        this.additionalInstallment.service_tax = res.fee_type_tax;
        this.additionalInstallment.fee_type = res.fee_type_id;
        if (res.fee_type_tax > 0) {
          this.additionalInstallment.service_tax_applicable = "Y";
        }
        this.additionalInstallment.fee_type = id;
        this.additionalInstallment.fees_amount = res.fee_amount + (res.fee_amount * res.fee_type_tax * 0.01);
        this.additionalInstallment.fee_type_name = res.fee_type;
      },
      err => {
        console.log(err);
      }
    )
  }


}



