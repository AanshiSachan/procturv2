import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { FeeStrucService } from '../../../services/feeStruc.service';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';

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
    tax: 0,
    taxAmount: 0,
  }
  additionalInstallment = {
    days: 0,
    day_type: 1,
    fee_type: -1,
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
  totalAmountCal: number = 0;
  templateName: any = "";

  PageIndex: number = 0;
  displayBatchSize: number = 10;
  tabkeList: any = [];
  searchDataFlag: boolean = false;
  searchedData: any = [];
  totalRow: number = 0;
  searchText: string = '';
  addTemplatePopUp: boolean = false;
  studentList: any[] = [];

  constructor(
    private router: Router,
    private fetchService: FeeStrucService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.enableTax = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.fetchPrefill();
  }


  fetchPrefill() {
    this.getFeeStructures();
  }


  getFeeStructures() {
    this.isRippleLoad = true;
    this.PageIndex = 1;
    this.fetchService.fetchFeeStruc().subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        this.totalRow = res.length;
        this.source = res;
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  editFee(fee) {
    this.templateName = fee.template_name;
    this.selectedTemplate = fee;
    this.feeStructure = [];
    this.isEditFee = true;
    this.isRippleLoad = true;
    this.fetchService.fetchFeeDetail(fee.template_id).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        this.feeStructure = res;
        if (res.is_default == "1") {
          this.feeStructure.is_default = true;
        } else {
          this.feeStructure.is_default = false;
        }
        this.fillFeeType(res.feeTypeMap);
        this.fillDataInYTable(res.customFeeSchedules);
        if (res.studentwise_fees_tax_applicable == "Y") {
          if (this.enableTax == "1") {
            document.getElementById('checkBoxtaxes').checked = true;
            this.showTaxFields();
          }
        }
        this.totalAmountCal = res.studentwise_total_fees_amount;
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  showTaxFields() {
    this.installmentList.forEach(element => {
      if (element.service_tax_applicable == "Y") {
        element.taxAmount = element.fees_amount - element.initial_fee_amount;
        element.tax = element.taxAmount;
      }
    });
  }

  fillFeeType(data) {
    this.otherFeetype = [];
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
    this.templateName = "";
  }

  updateFeeTemplate() {
    let taxApplicable = document.getElementById('checkBoxtaxes').checked;
    if (taxApplicable == true) {
      taxApplicable = "Y";
    } else {
      taxApplicable = "N";
    }
    if (this.feeStructure.is_default == '1' || this.feeStructure.is_default == true) {
      this.feeStructure.is_default = '1';
    } else {
      this.feeStructure.is_default = '0';
    }
    let data: any = {
      is_default: this.feeStructure.is_default,
      customFeeSchedules: this.makeJSONForCustomFee(),
      studentwise_total_fees_amount: this.totalAmount.toString(),
      studentwise_total_fees_discount: this.discountAmount,
      studentwise_fees_tax_applicable: taxApplicable,
      template_id: this.selectedTemplate.template_id.toString(),
      template_name: this.selectedTemplate.template_name
    };
    this.isRippleLoad = true;
    this.fetchService.updateFeeTemplate(data).subscribe(
      res => {
        this.isRippleLoad = false;
        this.commonService.showErrorMessage('success', 'Update Successfully', 'Fee Structure Updated Successfully');
        this.closeFeeEditor();
      },
      err => {
        this.isRippleLoad = false;
        this.commonService.showErrorMessage('error', 'Error', err.error.message);

      }
    )
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
      test.days = Number(this.installmentList[t].days).toString();
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
      test.days = Number(this.otherInstList[t].days).toString();
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
      this.commonService.showErrorMessage('error', 'Fee Template Name is Mandatory', 'Please enter a valid fee template name');
    }
  }


  onApplyTaxChechbox(event) {
    if (this.enableTax == "0") {
      this.commonService.showErrorMessage('error', 'Error', 'Please define Tax (%age) in Institute Settings');
      event.target.checked = false;
      return;
    }
    if (event.target.checked) {
      this.installmentList.forEach(element => {
        if (element.service_tax_applicable == "Y" && element.hasOwnProperty('taxAmount')) {
          element.fees_amount = Number(element.fees_amount) + Number(element.taxAmount);
          element.tax = element.taxAmount;
        } else {
          element.tax = Number(element.service_tax) * 0.01 * Number(element.initial_fee_amount);
          element.taxAmount = element.tax;
          element.fees_amount = element.initial_fee_amount + element.taxAmount;
        }
        element.service_tax_applicable = "Y";
      });
    } else {
      this.installmentList.forEach(element => {
        element.fees_amount = Number(element.fees_amount) - Number(element.taxAmount);
        element.tax = 0;
        element.service_tax_applicable = "N";
      });
    }
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let totalAmount = 0;
    this.installmentList.forEach(element => {
      totalAmount += Number(element.fees_amount);
    });
    this.otherInstList.forEach(element => {
      totalAmount += Number(element.fees_amount);
    });
    this.totalAmountCal = totalAmount;
  }


  // calculateTotalAmount() {
  //   if (document.getElementById('checkBoxtaxes').checked == true) {
  //     let otherAmount = 0;
  //     if (this.otherInstList.length > 0) {
  //       otherAmount = this.otherInstList.map(fee => fee.fees_amount).reduce((acc, val) => val + acc)
  //     } else {
  //       otherAmount = 0;
  //     }
  //     return Math.floor(this.onApplyTaxChechbox() + otherAmount);
  //   } else {
  //     let installAmount = 0;
  //     let otherAmount = 0;
  //     if (this.installmentList.length > 0) {
  //       installAmount = this.installmentList.map(fee => fee.initial_fee_amount).reduce((acc, val) => val + acc);
  //     }
  //     if (this.otherInstList.length > 0) {
  //       otherAmount = this.otherInstList.map(fee => fee.fees_amount).reduce((acc, val) => val + acc);
  //     }
  //     return Math.floor(installAmount + otherAmount);
  //   }
  // }

  // onApplyTaxChechbox() {
  //   let taxPercent = this.feeStructure.registeredServiceTax;
  //   if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
  //     if (this.installmentList.length > 0) {
  //       this.addTaxInInstallmentTable();
  //       return (this.totalAmountCal);
  //     } else {
  //       return 0;
  //     }
  //   } else {
  //     let msg = {
  //       type: 'error',
  //       title: 'Error',
  //       body: "Please define Tax (%age) in Institute Settings"
  //     }
  //     this.appC.popToast(msg);
  //     document.getElementById('checkBoxtaxes').checked == false;
  //     this.calculateTotalAmount();
  //   }
  // }

  // addTaxInInstallmentTable() {
  //   this.totalAmountCal = 0;
  //   if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
  //     let taxPercent = this.feeStructure.registeredServiceTax;
  //     if (document.getElementById('checkBoxtaxes').checked == true) {
  //       if (taxPercent > 0) {
  //         this.installmentList.map(
  //           fee => {
  //             if (fee.service_tax_applicable == "Y") {
  //               fee.tax = Math.floor(fee.fees_amount - fee.initial_fee_amount)
  //               this.totalAmountCal = this.totalAmountCal + fee.fee_amount;
  //             } else {
  //               fee.tax = Math.floor(fee.fees_amount * 0.01 * taxPercent);
  //               fee.initial_fee_amount = fee.fees_amount - fee.tax;
  //               fee.service_tax_applicable = "Y";
  //               this.totalAmountCal = this.totalAmountCal + fee.fees_amount;
  //             }
  //           }
  //         )
  //       }
  //     } else {
  //       this.installmentList.map(
  //         fee => {
  //           if (fee.service_tax_applicable == "Y") {
  //             fee.initial_fee_amount = fee.fee_amount - fee.tax;
  //             fee.tax = 0;
  //             fee.fees_amount = fee.tax + fee.initial_fee_amount;
  //             fee.service_tax_applicable = "N";
  //           } else {
  //             fee.tax = 0;
  //             fee.fees_amount = fee.initial_fee_amount;
  //           }
  //           this.totalAmountCal = this.totalAmountCal + fee.fees_amount;
  //         }
  //       )
  //     }
  //     if (this.otherInstList.length > 0) {
  //       this.totalAmountCal = this.totalAmountCal + this.otherInstList.map(fee => fee.fees_amount).reduce((acc, val) => val + acc);
  //     }
  //   }
  // }

  deleteRow(row, i) {
    this.installmentList.splice(i, 1);
    this.calculateTotalAmount();
  }

  deleteAdditionalRow(row, i) {
    this.otherInstList.splice(i, 1);
    this.calculateTotalAmount();
  }


  addInstallmentInTable() {
    if (Number(this.AddInstallment.initial_fee_amount) > 0 && this.AddInstallment.days != null) {
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.AddInstallment.service_tax = Number(this.feeStructure.registeredServiceTax);
        if (document.getElementById('checkBoxtaxes').checked) {
          this.AddInstallment.service_tax_applicable = "Y";
          this.AddInstallment.tax = Math.floor(this.AddInstallment.initial_fee_amount * Number(this.feeStructure.registeredServiceTax) * 0.01);
          this.AddInstallment.taxAmount = Number(this.AddInstallment.tax);
          this.AddInstallment.fees_amount = Number(this.AddInstallment.initial_fee_amount + this.AddInstallment.tax);
        } else {
          this.AddInstallment.service_tax_applicable = "N";
          this.AddInstallment.fees_amount = this.AddInstallment.initial_fee_amount;
          this.AddInstallment.tax = 0;
        }
      } else {
        this.AddInstallment.tax = 0;
        this.AddInstallment.fees_amount = this.AddInstallment.initial_fee_amount;
      }
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
        tax: 0,
        taxAmount: 0,
      }
    } else {
      if (this.AddInstallment.initial_fee_amount == null || this.AddInstallment.initial_fee_amount == 0) {
        this.commonService.showErrorMessage('error', 'Error', 'Please provide Amount');
        return;
      }
      if (this.AddInstallment.days == null) {
        this.commonService.showErrorMessage('error', 'Error', 'Please provide days/month');
        return;
      }
    }
    this.calculateTotalAmount();
  }


  addAdditionalInst() {
    if (this.additionalInstallment.fee_type == -1) {
      this.commonService.showErrorMessage('error', 'Error', 'Please provide fee type');
      return;
    }
    if (Number(this.additionalInstallment.initial_fee_amount) > 0 && this.additionalInstallment.days != null) {
      // this.additionalInstallment.fees_amount = this.additionalInstallment.initial_fee_amount;
      if (this.additionalInstallment.fees_amount == 0) {
        if (this.additionalInstallment.service_tax == 0) {
          this.additionalInstallment.fees_amount = this.additionalInstallment.initial_fee_amount;
        }
      } else {
        if (this.additionalInstallment.service_tax == 0) {
          this.additionalInstallment.fees_amount = this.additionalInstallment.initial_fee_amount;
        } else {
          this.additionalInstallment.fees_amount = Math.round(Number(this.additionalInstallment.initial_fee_amount) + Number((this.additionalInstallment.initial_fee_amount * this.additionalInstallment.service_tax) / 100));
        }
      }
      this.otherInstList.push(this.additionalInstallment);
      this.additionalInstallment = {
        days: 0,
        day_type: 1,
        fee_type: -1,
        fees_amount: 0,
        initial_fee_amount: 0,
        is_referenced: 'N',
        schedule_id: 0,
        service_tax: 0,
        service_tax_applicable: 'N',
        fee_type_name: ''
      }
    } else {
      if (this.additionalInstallment.initial_fee_amount == 0 || this.additionalInstallment.initial_fee_amount == null) {
        this.commonService.showErrorMessage('error', 'Error', 'Please provide Amount');
        return;
      }
      if (this.additionalInstallment.days == null) {
        this.commonService.showErrorMessage('error', 'Error', 'Please provide days');
        return;
      }
    }
    this.calculateTotalAmount();
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
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }

  editTemplateName() {
    this.isHeaderEdit = true;
  }

  cancelTemplateName() {
    this.isHeaderEdit = false;
    this.selectedTemplate.template_name = this.templateName;
  }

  feeTypesAmountChnge(data) {
    if (data.service_tax == 0) {
      data.initial_fee_amount = Math.floor(Number(data.fees_amount));
    } else {
      data.initial_fee_amount = Math.floor(Number(data.fees_amount)) - Math.floor(Number(data.fees_amount) - Number((data.fees_amount * 100) / (100 + data.service_tax)));
      data.initial_fee_amount = Math.floor(data.initial_fee_amount);
    }
    this.calculateTotalAmount();
  }

  feeInstallmentChnge(data) {
    if (data.service_tax_applicable == "N") {
      data.initial_fee_amount = data.fees_amount;
    } else {
      data.tax = data.fees_amount - Math.floor(Number(data.fees_amount) * 100 / (100 + data.service_tax));
      data.taxAmount = data.tax;
      data.initial_fee_amount = data.fees_amount - data.tax;
    }
    this.calculateTotalAmount();
  }


  // pagination functions

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.tabkeList = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let data = [];
    if (this.searchDataFlag == true) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.source.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
  }

  searchInList() {
    if (this.searchText.trim() != "" && this.searchText.trim() != null) {
      let searchData = this.source.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchedData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.source.length;
    }
  }

  ////Delete Fee Structure

  deleteFeeStructure(fee) {
    let is_archived = "N";
    if (confirm('Are you sure, you want to delete Fee Structure?')) {
      this.isRippleLoad = true;
      this.fetchService.deleteFeeStructure(fee.template_id, is_archived).subscribe(
        res => {
          this.isRippleLoad = false;
          this.commonService.showErrorMessage('success', 'Deleted', 'Fee Structure Deleted Successfully');
          this.getFeeStructures();
          this.searchText = "";
          this.searchDataFlag = false;
        },
        err => {
          this.isRippleLoad = false;

          if(err.error.message.includes("Fee template(s) are assigned to student(s).")){
            if (confirm('Fee template(s) are assigned to student(s). Do you wish to delete it ?')) {
              is_archived = "Y";
              this.isRippleLoad = true;
              this.fetchService.deleteFeeStructure(fee.template_id, is_archived).subscribe(
                res => {
                  this.isRippleLoad = false;
                  this.commonService.showErrorMessage('success', 'Deleted', 'Fee Structure Deleted Successfully');
                  this.getFeeStructures();
                },
                  err => {
                    this.isRippleLoad = false;
                    this.commonService.showErrorMessage('error', 'Error', err.error.message);
                  }
              )
            }
          }
          else{
            this.commonService.showErrorMessage('error', 'Error', err.error.message);
          }
        }
      )
    }
  }

  // for showing students assigned to the particular fee template

  studentsAssigned(fee) {
    if (fee.studentList != null) {
      this.addTemplatePopUp = true;
      this.studentList = fee.studentList;
    }
    else {
      this.commonService.showErrorMessage("info", "", "No data found");
      this.addTemplatePopUp = false;
    }
  }

  closeTemplatePopup() {
    this.addTemplatePopUp = false;
  }

}
