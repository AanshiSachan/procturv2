import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { debuglog } from 'util';
import { AuthenticatorService } from '../../../../..//services/authenticator.service';
import { CommonServiceFactory } from '../../../../../services/common-service';
import { FeeStrucService } from '../../../../../services/feeStruc.service';
declare var $;
@Component({
  selector: 'app-fee-structure-home',
  templateUrl: './fee-structure-home.component.html',
  styleUrls: ['./fee-structure-home.component.scss']
})
export class FeeStructureHomeComponent implements OnInit {
  isLangInstitute: boolean = false;
  feeInstalllmentArr: Array<any> = [];
  countryAdditioalFeeTypes: any = {};
  source: any[] = [];
  selectedTemplate: any;
  isHeaderEdit: boolean = false;
  isEditFee: boolean = false;
  selectedCountry: any;
  feeStructure: any;
  installmentList: any = [];
  otherInstList: any = [];
  otherFeetype: any = [];
  countryDetails: any = [];
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
  feeTyeDetails: any = [];
  tabkeList: any = [];
  searchedData: any = [];
  studentList: any[] = [];
  enableTax: any;
  totalAmountCal: number = 0;
  templateName: any = "";
  PageIndex: number = 0;
  displayBatchSize: number = 20;
  moduleState: any;
  totalRow: number = 0;
  searchText: string = '';
  addTemplatePopUp: boolean = false;
  searchDataFlag: boolean = false;
  tax_type_without_percentage: String;
  is_tax_enabled: boolean = false;
  schoolModel: boolean = false;
  feeTypeList: any = [];
  dayOfmonth: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  months = [{
    id: 1,
    value: 'Jan'
  }, {
    id: 2,
    value: 'Feb'
  }, {
    id: 3,
    value: 'Mar'
  }, {
    id: 4,
    value: 'Apr'
  }, {
    id: 5,
    value: 'May'
  }, {
    id: 6,
    value: 'Jun'
  }, {
    id: 7,
    value: 'Jul'
  }, {
    id: 8,
    value: 'Aug'
  }, {
    id: 9,
    value: 'Sep'
  }, {
    id: 10,
    value: 'Oct'
  }, {
    id: 11,
    value: 'Nov'
  }, {
    id: 12,
    value: 'Dec'
  }]
  monthValue: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  totalFeeAmount: any;
  feeInstallments: any;
  totalTax: number = 0;
  currencySymbol: string = "";
  isTemplateNotLinkWithCourseAndStandard: boolean = false;
  is_default:boolean=false;
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
    this.tax_type_without_percentage = sessionStorage.getItem("tax_type_without_percentage");
    this.is_tax_enabled = this.enableTax == "1" ? true : false;
    this.isTemplateNotLinkWithCourseAndStandard = sessionStorage.getItem("is_fee_struct_linked")=='true'?false:true;
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isLangInstitute = true;
          this.moduleState = 'Batch';
        } else {
          this.isLangInstitute = false;
          this.moduleState = 'Course';
        }
      }
    )
    // changes by Nalini - to handle school model conditions
    this.schoolModel = this.auth.schoolModel.value;
    this.fetchPrefill();
  }


  fetchPrefill() {
    this.getFeeStructures();
    this.fetchDataForCountryDetails();
  }

  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
    }
  }

  getFeeStructures() {
    this.auth.showLoader();
    this.PageIndex = 1;
    this.fetchService.fetchFeeStruc().subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.totalRow = res.length;
        this.source = res;
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }


  editFee(fee) {
    this.templateName = fee.template_name;
    this.is_default=fee.is_default==1;
    this.selectedTemplate = fee;
    this.feeStructure = [];
    this.isEditFee = true;
    this.auth.showLoader();
    this.fetchService.fetchFeeDetail(fee.template_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.feeStructure = res;
        if (res.is_default == "1") {
          this.feeStructure.is_default = true;
        } else {
          this.feeStructure.is_default = false;
        }
        this.fillFeeType(this.countryAdditioalFeeTypes[this.selectedTemplate.country_id]);
        let encryptedData = sessionStorage.getItem('country_data');
        let data = JSON.parse(encryptedData);
        if (data.length > 0) {
          data.forEach((country) => {
            if (this.selectedTemplate.country_id == country.id) {
              this.selectedCountry = country;
            }
          })
        }
        this.fillDataInYTable(res.customFeeSchedules);
        // if (res.studentwise_fees_tax_applicable == "Y") {
        if (this.enableTax == "1" &&
          document.getElementById('checkBoxtaxes')) {
          (document.getElementById('checkBoxtaxes') as HTMLInputElement).checked = true;
          this.showTaxFields();
        }

        this.totalAmountCal = res.studentwise_total_fees_amount;
      },
      err => {
        this.auth.hideLoader();
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
    data.forEach(object => {
      let keys = Object.keys(object);
      let test: any = {};
      test.id = keys[0];
      test.value = object[keys[0]];
      this.otherFeetype.push(test);
    });

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

  updateFeeStructure() {
    if (this.validateFeeInstallments()) {
      let data: any = {
        is_default: this.is_default?1:0,
        country_id: this.selectedTemplate.country_id,
        customFeeSchedules: this.feeInstalllmentArr,
        studentwise_total_fees_amount: this.totalFeeAmount.toString(),
        studentwise_total_fees_discount: 0,
        studentwise_fees_tax_applicable: this.is_tax_enabled ? "Y" : "N",
        template_id: this.selectedTemplate.template_id.toString(),
        template_name: this.templateName
      };
      this.auth.showLoader();
      this.fetchService.updateFeeTemplate(data).subscribe(
        res => {
          this.auth.hideLoader();
          $("#editFeeStructureModel").hide();
          this.commonService.showErrorMessage('success', 'Update Successfully', 'Fee Structure Updated Successfully');
          this.getFeeStructures()
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);

        }
      )
    }
  } ß

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
      this.commonService.showErrorMessage('error', '', 'Please enter a valid fee structure name');
    }
  }


  onApplyTaxChechbox(event) {
    if (this.enableTax == "0") {
      this.commonService.showErrorMessage('error', '', 'Please define Tax (%age) in Institute Settings');
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
        if ((document.getElementById('checkBoxtaxes') as HTMLInputElement).checked) {
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
        this.commonService.showErrorMessage('error', '', 'Please enter Amount');
        return;
      }
      if (this.AddInstallment.days == null) {
        this.commonService.showErrorMessage('error', '', 'Please enter days/month');
        return;
      }
    }
    this.calculateTotalAmount();
  }


  addAdditionalInst() {
    if (this.additionalInstallment.fee_type == -1) {
      this.commonService.showErrorMessage('error', '', 'Please enter fee type');
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
        this.commonService.showErrorMessage('error', '', 'Please enter Amount');
        return;
      }
      if (this.additionalInstallment.days == null) {
        this.commonService.showErrorMessage('error', '', 'Please enter days');
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
        this.commonService.showErrorMessage('error', '', err.error.message);
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

  deleteFeeStructure(fee) {
    let is_archived = "N";
    if (confirm('Are you sure, you want to delete Fee Structure?')) {
      this.auth.showLoader();
      this.fetchService.deleteFeeStructure(fee.template_id, is_archived).subscribe(
        res => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', 'Deleted', 'Fee Structure Deleted Successfully');
          this.getFeeStructures();
          this.searchText = "";
          this.searchDataFlag = false;
        },
        err => {
          this.auth.hideLoader();

          if (err.error.message.includes("Fee template(s) are assigned to student(s).")) {
            if (confirm('Fee template(s) are assigned to student(s). Do you wish to delete it ?')) {
              is_archived = "Y";
              this.auth.showLoader();
              this.fetchService.deleteFeeStructure(fee.template_id, is_archived).subscribe(
                res => {
                  this.auth.hideLoader();
                  this.commonService.showErrorMessage('success', 'Deleted', 'Fee Structure Deleted Successfully');
                  this.getFeeStructures();
                },
                err => {
                  this.auth.hideLoader();
                  this.commonService.showErrorMessage('error', '', err.error.message);
                }
              )
            }
          }
          else {
            this.commonService.showErrorMessage('error', '', err.error.message);
          }
        }
      )
    }
  }
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
  editFeeStructure(fee) {
    $("#editFeeStructureModel").show();
    this.totalTax=0;
    if (this.feeTypeList.length == 0) {
      this.getInstituteFeeTypes();
    }
    this.templateName = fee.template_name;
    this.selectedTemplate = fee;
    this.feeStructure = [];
    this.feeInstalllmentArr = [];
    this.auth.showLoader();
    this.fetchService.fetchFeeDetail(fee.template_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.feeStructure = res;
        this.is_default=this.feeStructure.is_default==1;
        this.totalFeeAmount = this.feeStructure.studentwise_total_fees_amount;
        if (this.feeStructure.customFeeSchedules != null) {
          for (let data of this.feeStructure.customFeeSchedules) {
            let installmentData: any = {
              fee_type: data.fee_type,
              month: data.month,
              year: data.year,
              days: data.days,
              fees_amount: data.fees_amount,
              day_type: data.day_type,
              initial_fee_amount: data.initial_fee_amount.toString(),
              service_tax: data.service_tax,
              service_tax_applicable: data.service_tax_applicable,
              schedule_id: data.schedule_id.toString(),
              is_referenced: data.is_referenced
            }
            if (this.is_tax_enabled) {
              this.totalTax += (Number(data.fees_amount) - Number(data.initial_fee_amount));
            }
            this.feeInstalllmentArr.push(installmentData);
          }
          this.getCurrencyData(this.selectedTemplate.country_id);
        }
      })
  }
  getInstituteFeeTypes() {
    this.auth.showLoader();
    this.fetchService.getAllFeeType().subscribe(
      res => {
        this.auth.hideLoader();
        this.feeTypeList = res;
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }
  closePopUp() {
    $("#editFeeStructureModel").hide();
  }
  addInstallment(i) {
    let newInstallment = {
      installment_no: i + 2,
      fee_type: this.feeInstalllmentArr[i].fee_type,
      month: this.feeInstalllmentArr[i].month,
      days: this.feeInstalllmentArr[i].days,
      year: this.feeInstalllmentArr[i].year,
      fees_amount: this.feeInstalllmentArr[i].fees_amount,
      initial_fee_amount: this.feeInstalllmentArr[i].initial_fee_amount,
      day_type: this.feeInstalllmentArr[i].day_type,
      schedule_id: 0,
      is_referenced: "N",
      service_tax: this.feeInstalllmentArr[i].fee_type,
      service_tax_applicable: this.is_tax_enabled ? "Y" : "N",
    };
    this.totalFeeAmount = this.totalFeeAmount + Number(this.feeInstalllmentArr[i].fees_amount);
    this.totalTax = this.totalTax + this.calculateTax(this.feeInstalllmentArr[i].fees_amount, this.feeInstalllmentArr[i].fee_type)
    this.feeInstalllmentArr.push(newInstallment);
  }
  deleteInstallment(index) {
    if (this.feeInstalllmentArr.length == 1) {
      this.commonService.showErrorMessage('info', '', "You can't delete!");
      return false;
    } else {
      this.totalFeeAmount = this.totalFeeAmount - Number(this.feeInstalllmentArr[index].fees_amount);
      this.feeInstalllmentArr.splice(index, 1);
      return true;
    }
  }

  validateFeeInstallments() {
    if (this.templateName && this.templateName.trim()=='') {
      this.commonService.showErrorMessage('info', '', "Please enter valid fee structure name!");
      return;
    }
    if (this.feeInstalllmentArr.length == 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid fee structure details!");
      return;
    }
    for(let data of this.feeInstalllmentArr){
     if(!this.validateEachInstallment(data)){
       return ;
     }
    }
    return true;
  }
  validateEachInstallment(data: any) {
    if (data.installment_no <= 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid installment No.");
      return false;
    }
    if (data.fee_type<= 0) {
      this.commonService.showErrorMessage('info', '', "Please select valid fee type!");
      return false;
    }
    if (this.schoolModel || this.isTemplateNotLinkWithCourseAndStandard) {
      if (data.days <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee day!");
        return false;
      }
      if (data.month <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee month!");
        return false;
      }
      if (data.year <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee year!");
        return false;
      }
    }
    if (!this.schoolModel) {
      if (data.day_type <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid trigger date!");
        return false;
      }
      if (data.days < 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee day!");
        return false;
      }
    }
    if (data.fees_amount <= 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid fee amount!");
      return false;
    }
    return true;
  }
  changesValuesAsPerType(row, i) {
    if (row == 1) {
      this.feeInstalllmentArr[i].days = 0;
    }
  }
  calculateTotalFee() {
    let totalFee: number = 0;
    let totalTax: number = 0;
    let i = 0;
    for (let data of this.feeInstalllmentArr) {
      totalFee += Number(data.fees_amount);
      let tax = this.calculateTax(data.fees_amount, data.fee_type);
      if (this.is_tax_enabled) {
        this.feeInstalllmentArr[i].service_tax = tax;
        this.feeInstalllmentArr[i].initial_fee_amount = Number(data.fees_amount) - Number(tax);
        i++;
      }
      totalTax += tax;
    }
    this.totalFeeAmount = totalFee;
    this.totalTax = totalTax;
  }
  getCurrencyData(id) {
    for (let data of this.countryDetails) {
      if (data.id == id) {
        this.currencySymbol = data.currency_code
        break;
      }
    }
  }
  calFeeAmountWithoutTax(feeAmount, tax): number {
    if (this.is_tax_enabled) {
      return Math.floor((Number(feeAmount) * 100) / (100 + Number(tax)));
    } else {
      return Number(feeAmount);
    }
  }
  calculateTax(feeAmount, fee_type_id): number {
    if (this.is_tax_enabled) {
      let tax = this.getFeeTypeTax(fee_type_id);
      return Number(feeAmount) - this.calFeeAmountWithoutTax(feeAmount, tax);
    } else {
      return 0;
    }
  }
  getFeeTypeTax(fee_type_id): number {
    if (this.is_tax_enabled) {
      for (let data of this.feeTypeList) {
        if (fee_type_id == data.fee_type_id) {
          return Number(data.fee_type_tax);
        }
      }
    }
    return 0;
  }
}
