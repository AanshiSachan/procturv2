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
    day_type: '',
    days: '',
    initial_fee_amount: '',
    fees_amount: '',
  }
  additionalInstallment = {
    fee_type_name: '',
    day_type: '',
    days: '',
    initial_fee_amount: '',
    fee_tax: '',
    fees_amount: ''
  }
  customJson: any = [];
  totalAmount: any = '';
  discountAmount: any = '';

  constructor(private router: Router, private appC: AppComponent, private login: LoginService, private fetchService: FeeStrucService) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.fetchPrefill();
  }


  fetchPrefill() {
    this.getFeeStructures();
  }


  getFeeStructures() {
    this.fetchService.fetchFeeStruc().subscribe(
      res => {
        this.source = res;
      },
      err => {

      }
    )
  }

  editFee(fee) {
    console.log(fee);
    this.selectedTemplate = fee;
    this.fetchService.fetchFeeDetail(fee.template_id).subscribe(
      res => {
        this.feeStructure = res;
        console.log(res);
        this.isEditFee = true;
        this.fillFeeType(res.feeTypeMap);
        this.fillDataInYTable(res.customFeeSchedules);
      },
      err => { }
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
    let data: any = {
      customFeeSchedules: this.makeJSONForCustomFee(),
      studentwise_total_fees_amount: this.totalAmount,
      studentwise_total_fees_discount: this.discountAmount,
      studentwise_fees_tax_applicable: this.feeStructure.studentwise_fees_tax_applicable,
      template_id: this.feeStructure.template_id,
      template_name: this.feeStructure.template_name
    };
    this.fetchService.updateFeeTemplate(data).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  makeJSONForCustomFee() {
    debugger
    this.customJson = [];
    this.totalAmount = 0;
    this.discountAmount = 0;
    let data: any = [];
    for (let t = 0; t < this.installmentList.length; t++) {
      let test: any = {};
      test.fee_type = '0';
      test.initial_fee_amount = this.installmentList[t].initial_fee_amount;
      test.service_tax = this.installmentList[t].service_tax;
      test.fees_amount = this.installmentList[t].fees_amount;
      test.service_tax_applicable = this.installmentList[t].service_tax_applicable;
      test.schedule_id = this.installmentList[t].schedule_id;
      test.is_referenced = this.installmentList[t].is_referenced;
      test.day_type = this.installmentList[t].day_type;
      test.days = this.installmentList[t].days;
      this.totalAmount = this.totalAmount + this.installmentList[t].fees_amount;
      this.discountAmount = this.discountAmount + this.installmentList[t].fees_amount - this.installmentList[t].initial_fee_amount;
      data.push(test);
    }
    for (let t = 0; t < this.otherInstList.length; t++) {
      let test: any = {};
      test.fee_type = this.otherInstList[t].fee_type;
      test.initial_fee_amount = this.otherInstList[t].initial_fee_amount;
      test.service_tax = this.otherInstList[t].service_tax;
      test.fees_amount = this.otherInstList[t].fees_amount;
      test.service_tax_applicable = this.otherInstList[t].service_tax_applicable;
      test.schedule_id = this.otherInstList[t].schedule_id;
      test.is_referenced = this.otherInstList[t].is_referenced;
      test.day_type = this.otherInstList[t].day_type;
      test.days = this.otherInstList[t].days;
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
    return row.fees_amount - row.initial_fee_amount;
  }

  calculateTotalAmount() {
    return 0;
  }

  onApplyTaxChechbox() {

  }

  deleteRow(row, i) {
    this.installmentList.splice(i, 1);
  }

  deleteAdditionalRow(row, i) {
    this.otherInstList.splice(i, 1);
  }


  addInstallmentInTable() {
    if (Number(this.AddInstallment.initial_fee_amount) > 0) {
      this.installmentList.fees_amount = this.AddInstallment.initial_fee_amount;
      this.installmentList.push(this.AddInstallment);
      this.AddInstallment = {
        day_type: '',
        days: '',
        initial_fee_amount: '',
        fees_amount: '',
      }
    } else {
      console.log('error');
    }
  }


  addAdditionalInst() {
    if (Number(this.additionalInstallment.initial_fee_amount) > 0) {
      this.additionalInstallment.fees_amount = this.additionalInstallment.initial_fee_amount;
      this.otherInstList.push(this.additionalInstallment);
      this.additionalInstallment = {
        fee_type_name: '',
        day_type: '',
        days: '',
        initial_fee_amount: '',
        fee_tax: '',
        fees_amount: ''
      }
    }
  }

}



