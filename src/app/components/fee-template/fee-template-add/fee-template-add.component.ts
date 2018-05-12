import { Component, OnInit } from '@angular/core';
import { FeeStrucService } from '../../../services/feeStruc.service';
import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-template-add',
  templateUrl: './fee-template-add.component.html',
  styleUrls: ['./fee-template-add.component.scss']
})
export class FeeTemplateAddComponent implements OnInit {

  masterCourseList: any = [];
  CourseList: any = [];
  addNewTemplate = {
    template_name: '',
    fee_amount: "",
    master_course_name: '',
    course_id: -1,
    tax_type: "inclusive",
    apply_tax: false,
    tax_amount: 0,
    total_fee: 0,
    installmentCount: '',
    is_default_template: false
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
  feeStructure: any = [];
  installMentTable: any = [];
  otherInstList: any = [];
  otherFeetype: any = [];
  totalAmount: any = 0;
  discountAmount: any = 0
  showDetails: boolean = false;
  enableTaxOptions: any = 0;
  isLangInstitute: boolean = false;

  constructor(
    private apiService: FeeStrucService,
    private appC: AppComponent,
    private login: LoginService,
    private route: Router
  ) {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  ngOnInit() {
    this.checkInstituteType();
    this.enableTaxOptions = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.getAllMasterCourseList();
    this.getDetailOfFeeStructur()
  }

  getDetailOfFeeStructur() {
    this.apiService.fetchFeeDetail(0).subscribe(
      res => {
        this.feeStructure = res;
        this.fillFeeType(res.feeTypeMap);
      },
      err => {
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.appC.popToast(msg);

      }
    )
  }

  getAllMasterCourseList() {
    if (this.isLangInstitute) {
      this.apiService.getAllStandard().subscribe(
        res => {
          this.masterCourseList = res;
        },
        err => {
          //console.log(err);
        }
      )
    } else {
      this.apiService.getMasterCourse().subscribe(
        res => {
          this.masterCourseList = res;
        },
        err => {
          let msg = {
            type: "error",
            title: "",
            body: "An Error Occured"
          }
          this.appC.popToast(msg);
        }
      )
    }
  }

  onMasterCourseSelection() {
    this.CourseList = [];
    if (this.addNewTemplate.master_course_name != "-1") {

      if (this.isLangInstitute) {
        this.apiService.getCoursesOfStandard(this.addNewTemplate.master_course_name).subscribe(
          res => {
            this.CourseList = res;
          },
          err => {
            //console.log(err);
          }
        )
      } else {
        this.apiService.getCourse(this.addNewTemplate.master_course_name).subscribe(
          res => {
            this.CourseList = res;
          },
          err => {
            let msg = {
              type: "error",
              title: "",
              body: "An Error Occured"
            }
            this.appC.popToast(msg);
          }
        )
      }
    }
  }

  onAmountKeyUp() {
    if (this.addNewTemplate.tax_type == "inclusive") {
      this.calculateAmount(true);
    } else {
      this.calculateAmount(false);
    }
  }

  onTaxTypeChanges() {
    if (this.addNewTemplate.tax_type == "inclusive") {
      this.addNewTemplate.apply_tax = true;
      this.calculateAmount(true);
    } else {
      this.addNewTemplate.apply_tax = true;
      this.calculateAmount(false);
    }
  }

  calculateAmount(taxInclusive) {
    this.addNewTemplate.tax_amount = Math.floor(Number(this.addNewTemplate.fee_amount)) - Math.floor(Number(this.addNewTemplate.fee_amount) * 100 / (100 + this.feeStructure.registeredServiceTax));
    if (taxInclusive == true) {
      this.addNewTemplate.total_fee = Number(this.addNewTemplate.fee_amount);
    } else {
      this.addNewTemplate.total_fee = Number(this.addNewTemplate.fee_amount + this.addNewTemplate.tax_amount);
    }
  }

  createInstallment() {
    this.onTaxTypeChanges();
    let check = this.validateAllFields();
    if (!check) {
      this.showDetails = false;
      return
    }
    this.showDetails = true;
    this.createInstallmentTable();
  }

  createInstallmentTable() {
    let amount: any = Math.floor(Number(this.addNewTemplate.fee_amount) / Number(this.addNewTemplate.installmentCount));
    let tax_amount = Math.floor(this.addNewTemplate.tax_amount / Number(this.addNewTemplate.installmentCount));
    let totalAmount: number = 0;
    let taxAmount: number = 0;
    let obj = [];
    for (let i = 0; i < Number(this.addNewTemplate.installmentCount); i++) {
      let test: any = {};
      test.day_type = 1;
      test.days = 0;
      if (this.enableTaxOptions == "1") {
        if (this.addNewTemplate.tax_type == "inclusive") {
          test.initial_fee_amount = amount - tax_amount;
          test.tax = tax_amount;
        } else {
          test.initial_fee_amount = amount;
          test.tax = tax_amount;
        }
        test.service_tax_applicable = "Y";
      } else {
        test.initial_fee_amount = amount;
        test.tax = 0;
      }
      test.totalAmount = test.tax + test.initial_fee_amount;
      taxAmount = taxAmount + test.tax;
      totalAmount = totalAmount + test.totalAmount;
      obj.push(test);
    }
    if (Number(this.addNewTemplate.total_fee) != totalAmount) {
      let length = obj.length;
      obj[length - 1].totalAmount = obj[length - 1].totalAmount + Number(this.addNewTemplate.total_fee) - totalAmount;
    }
    if (Number(this.addNewTemplate.tax_amount) != taxAmount) {
      let length = obj.length;
      obj[length - 1].tax = obj[length - 1].tax + Number(this.addNewTemplate.tax_amount) - taxAmount;
    }
    this.installMentTable = obj;
  }

  onAdditionalFeeSelection(event) {
    let id = event;
    this.apiService.getAdditionalFeeDeatails(event).subscribe(
      (res: any) => {
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
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.appC.popToast(msg);
      }
    )
  }

  validateAllFields() {
    if (this.addNewTemplate.template_name == "" || null) {
      this.messageNotifier('error', 'Error', 'Template name can not be null');
      return false;
    }
    if (this.addNewTemplate.fee_amount == "" || 0) {
      this.messageNotifier('error', 'Error', 'Please enter valid amount');
      return false;
    }
    if (this.addNewTemplate.installmentCount == "" || 0) {
      this.messageNotifier('error', 'Error', 'Installment Count can not be zero');
      return false;
    }
    if (this.addNewTemplate.is_default_template) {
      if (this.addNewTemplate.master_course_name == "" || this.addNewTemplate.course_id == -1) {
        this.messageNotifier('error', 'Error', 'Please provide Master Course and Course to use is default template.');
        return false;
      }
    }
    return true;
  }

  addAdditionalInst() {
    if (this.additionalInstallment.fee_type == -1) {
      this.messageNotifier('error', 'Error', 'Please Select Fee Type');
      return;
    }
    if (Number(this.additionalInstallment.initial_fee_amount) > 0) {
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
    }
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

  messageNotifier(type, title, message) {
    let msg = {
      type: type,
      title: title,
      body: message
    }
    this.appC.popToast(msg);
  }

  createFeeTemplate() {
    let tax: any;
    let defaultValue: any;
    if (this.addNewTemplate.is_default_template) {
      defaultValue = '1';
    } else {
      defaultValue = '0';
    }
    if (this.addNewTemplate.apply_tax) {
      tax = "Y";
    } else {
      tax = "N";
    }
    let feeSch: any = this.makeJSONForCustomFee();
    if (feeSch == false) {
      return;
    }
    let data: any = {
      is_default: defaultValue,
      customFeeSchedules: feeSch,
      studentwise_total_fees_amount: this.totalAmount.toString(),
      studentwise_total_fees_discount: 0,
      studentwise_fees_tax_applicable: tax,
      template_id: 0,
      template_name: this.addNewTemplate.template_name
    };
    if (this.isLangInstitute) {
      data.course_id = '-1';
      data.subject_id = this.addNewTemplate.course_id;
    } else {
      data.course_id = this.addNewTemplate.course_id;
    }
    this.apiService.updateFeeTemplate(data).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Updated',
          body: "Fee Structure created Successfully"
        }
        this.appC.popToast(msg);
        this.route.navigateByUrl('/fee');
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Error',
          body: err.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  makeJSONForCustomFee() {
    this.totalAmount = 0;
    let data: any = [];
    for (let t = 0; t < this.installMentTable.length; t++) {
      let test: any = {};
      test.fee_type = 0;
      test.initial_fee_amount = this.installMentTable[t].initial_fee_amount.toString();
      test.service_tax = this.feeStructure.registeredServiceTax;
      test.fees_amount = this.installMentTable[t].totalAmount;
      test.service_tax_applicable = this.installMentTable[t].service_tax_applicable;
      test.day_type = this.installMentTable[t].day_type.toString();
      test.days = this.installMentTable[t].days.toString();
      this.totalAmount = this.totalAmount + Number(test.fees_amount);
      data.push(test);
    }
    if (this.totalAmount != this.addNewTemplate.total_fee) {
      this.messageNotifier('error', 'Error', 'Amount provided in installments doesnot match with total Amount');
      return false;
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
      data.push(test);
    }
    return data;
  }


  userChangedInitialAmount(data, event) {
    if (data.service_tax_applicable == "Y") {
      data.tax = data.initial_fee_amount * 0.01 * this.feeStructure.registeredServiceTax;
    } else {
      data.tax = 0;
    }
  }

  userChangedAmountTotalAmount(data, event) {
    if (data.service_tax_applicable == "Y") {
      data.tax = Math.floor(data.totalAmount - Math.floor(Number(data.totalAmount) * 100 / (100 + this.feeStructure.registeredServiceTax)));
      data.initial_fee_amount = Math.floor(Number(data.totalAmount - data.tax));
    } else {
      data.initial_fee_amount = Math.floor(Number(data.totalAmount));
      data.tax = 0;
    }
  }

  userChangeAdditionalFeeAmount(data, event) {
    let input = Math.floor(Number(event.currentTarget.value))
    if (data.service_tax > 0) {
      let tax = Math.floor(input * 0.01 * data.service_tax);
      data.initial_fee_amount = Math.floor(input - tax);
      if (Number(data.initial_fee_amount + tax) != input) {
        data.initial_fee_amount = Math.floor(data.initial_fee_amount + input - Number(data.initial_fee_amount + tax));
      }
    } else {
      data.initial_fee_amount = input;
      data.tax = 0;
    }
  }

  deleteAdditionalRow(row, index) {
    this.otherInstList.splice(index, 1);
  }

  checkInstituteType() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == "LANG") {
      this.isLangInstitute = true;
    } else {
      this.isLangInstitute = false;
    }
  }

}
