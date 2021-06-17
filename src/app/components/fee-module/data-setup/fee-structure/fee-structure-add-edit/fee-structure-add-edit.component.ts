import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../../../services/http.service';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../../services/common-service';
import { FeeStrucService } from '../../../../../services/feeStruc.service';
//import CommonUtils from '../../../../../utils/commonUtils';


@Component({
  selector: 'app-fee-structure-add-edit',
  templateUrl: './fee-structure-add-edit.component.html',
  styleUrls: ['./fee-structure-add-edit.component.scss']
})
export class FeeStructureAddEditComponent implements OnInit {
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
  feeInstalllmentArr: Array<any> = [];
  newInstallment: any = {};
  schoolModel: boolean = false;
  is_tax_enabled: boolean = false;
  countryDetails: any = [];
  masterCourseList: any = [];
  CourseList: any = [];
  isLangInstitute: boolean;
  moduleState: string;
  addNewTemplate = {
    template_name: '',
    fee_amount: "",
    master_course_name: '-1',
    course_id: -1,
    tax_type: "inclusive",
    apply_tax: false,
    tax_amount: 0,
    total_fee: 0,
    installmentCount: '',
    is_default_template: false,
    country_id: -1
  }
  feeInstallments: any = [];
  feeTypeList: any = [];
  defultFeeTypes: number = -1;
  showMonthDropDown: boolean = false;
  defultCountryId: number = -1;
  totalFeeAmount: number = 0;
  currencySymbol: any = "";
  totalTax: number = 0;
  taxPrecent: number = 0;
  isTemplateNotLinkWithCourseAndStandard: boolean = false;
  institute_id: string;
  constructor(private apiService: FeeStrucService,
    private route: Router,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private http : HttpService) {
  }
  createInstallmentGrid() {
    this.newInstallment = {
      installment_no: 1,
      fee_type_id: this.defultFeeTypes,
      month: (this.schoolModel || this.isTemplateNotLinkWithCourseAndStandard )? 1 : 0,
      day: (this.schoolModel || this.isTemplateNotLinkWithCourseAndStandard ) ? 1 : 0,
      fee_amount: 0,
      day_type: (this.schoolModel || this.isTemplateNotLinkWithCourseAndStandard ) ? 4 : 1,
      year: (this.schoolModel || this.isTemplateNotLinkWithCourseAndStandard )? 2021 : 0,
    };
    this.feeInstalllmentArr.push(this.newInstallment);
  }

  ngOnInit(): void {
    this.schoolModel = this.auth.schoolModel.value;
    this.institute_id = sessionStorage.getItem("institute_id");
    this.is_tax_enabled = sessionStorage.getItem("enable_tax_applicable_fee_installments") == '1' ? true : false;
    this.isTemplateNotLinkWithCourseAndStandard = sessionStorage.getItem("is_fee_struct_linked")=='true'?false:true;
    this.checkModel();
    this.getCountryDetails();
    this.getAllMasterCourseList();
    this.getInstituteFeeTypes();
  }
  checkModel() {
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
  }
  getCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      for (let data of this.countryDetails) {
        if (data.is_default == "Y") {
          this.defultCountryId = data.id;
          this.addNewTemplate.country_id = data.id;
            this.currencySymbol = data.currency_code
          break;
        }
      }
    }
  }
  getAllMasterCourseList() {
    this.auth.showLoader();
    if (this.isLangInstitute || this.schoolModel) {
      this.apiService.getAllStandard().subscribe(
        res => {
          this.masterCourseList = res;
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    } else {
      this.fetchMCAndCourse();
    }
  }
  fetchMCAndCourse() {
    this.auth.showLoader();
    const url = "/api/v1/courseMaster/fetch/" + this.institute_id + "/all?isActiveNotExpire=Y";
    this.http.getData(url).subscribe(
      res => {
        this.masterCourseList = res;
        this.auth.hideLoader();
      },
      err => {
        this.commonService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
      }
    );
  }
  addInstallment(i) {
    this.newInstallment = {
      installment_no: i + 2,
      fee_type_id: this.feeInstalllmentArr[i].fee_type_id,
      month: this.feeInstalllmentArr[i].month,
      day: this.feeInstalllmentArr[i].day,
      fee_amount: this.feeInstalllmentArr[i].fee_amount,
      day_type: this.feeInstalllmentArr[i].day_type,
      year: this.feeInstalllmentArr[i].year,
    };
    this.totalFeeAmount = this.totalFeeAmount + Number(this.feeInstalllmentArr[i].fee_amount);
    this.totalTax = this.totalTax + this.calculateTax(this.feeInstalllmentArr[i].fee_amount, this.feeInstalllmentArr[i].fee_type_id)
    this.feeInstalllmentArr.push(this.newInstallment);
  }
  deleteInstallment(index) {
    if (this.feeInstalllmentArr.length == 1) {
      this.commonService.showErrorMessage('info', '', "You can't delete!");
      return false;
    } else {
      this.totalFeeAmount = this.totalFeeAmount - Number(this.feeInstalllmentArr[index].fee_amount);
      this.totalTax = this.totalTax - this.calculateTax(this.feeInstalllmentArr[index].fee_amount, this.feeInstalllmentArr[index].fee_type_id)
      this.feeInstalllmentArr.splice(index, 1);
      return true;
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
          }
        )
      } else {
        this.apiService.getCourse(this.addNewTemplate.master_course_name).subscribe(
          res => {
            this.CourseList = res;
          },
          err => {
            this.commonService.showErrorMessage('error', '', err.error.message);
          }
        )
      }
    }
  }
  createFeeStructure() {
    if (this.validateFeeStructureData()) {
      this.auth.showLoader();
      let data = this.preparedFeeStructureData();
      this.apiService.updateFeeTemplate(data).subscribe(
        res => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', 'Updated', 'Fee Structure created Successfully');
          this.route.navigateByUrl('/view/fee/data-setup/fee-structure/home');
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }
  validateFeeStructureData() {
    if (this.addNewTemplate.template_name == '') {
      this.commonService.showErrorMessage('info', '', "Please enter valid Fee Structure name!");
      return;
    }
    if (!this.isTemplateNotLinkWithCourseAndStandard) {
      if (this.schoolModel && Number(this.addNewTemplate.master_course_name) < 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid standard!");
        return;
      } else if (!this.isLangInstitute && !this.schoolModel) {
        if (this.addNewTemplate.master_course_name == '-1') {
          this.commonService.showErrorMessage('info', '', "Please select valid Maser Course!");
          return;
        }
        if (Number(this.addNewTemplate.course_id) < 0) {
          this.commonService.showErrorMessage('info', '', "Please select valid Course!");
          return;
        }
      }
      if (this.isLangInstitute) {
        if (Number(this.addNewTemplate.master_course_name) < 0) {
          this.commonService.showErrorMessage('info', '', "Please select valid Maser Course!");
          return;
        } if (Number(this.addNewTemplate.course_id) < 0) {
          this.commonService.showErrorMessage('info', '', "Please select valid Course!");
          return;
        }
      }
    }
    if (this.countryDetails.length > 1 && this.addNewTemplate.country_id < 0) {
      this.commonService.showErrorMessage('info', '', "Please select valid country!");
      return;
    }
    return this.validateFeeInstallments();
  }
  validateFeeInstallments() {
    if (this.feeInstalllmentArr.length == 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid fee installments!");
      return;
    }
    for (let data of this.feeInstalllmentArr) {
      if (this.validateEachInstallment(data)) {
        let installment: any = {
          day_type: (this.schoolModel || this.isTemplateNotLinkWithCourseAndStandard ) ? 4 : data.day_type,
          days: data.day,
          fee_type: data.fee_type_id,
          fees_amount: data.fee_amount,
          service_tax: this.getFeeTypeTax(data.fee_type_id),
          service_tax_applicable: this.is_tax_enabled ? "Y" : "N",
          month: data.month,
          year: data.year
        };
        installment.initial_fee_amount = this.calFeeAmountWithoutTax(data.fee_amount, installment.service_tax),
          this.feeInstallments.push(installment);
      } else {
        this.feeInstallments = [];
        return;
      }
    }
    return true;
  }
  validateEachInstallment(data: any) {
    if (data.installment_no <= 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid installment No.");
      return;
    }
    if (data.fee_type_id <= 0) {
      this.commonService.showErrorMessage('info', '', "Please select valid fee type!");
      return;
    }
    if (this.schoolModel || this.isTemplateNotLinkWithCourseAndStandard) {
      if (data.day <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee day!");
        return;
      }
      if (data.month <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee month!");
        return;
      }
      if (data.year <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee year!");
        return;
      }
    }
    if (!this.schoolModel) {
      if (data.day_type <= 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid trigger date!");
        return;
      }
      if (data.day < 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee day!");
        return;
      }
    }
    if (data.fee_amount <= 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid fee amount!");
      return;
    }
    return true;
  }
  preparedFeeStructureData(): any {
    let data: any = {
      is_default: 0,
      country_id: this.addNewTemplate.country_id,
      customFeeSchedules: this.feeInstallments,
      studentwise_total_fees_amount: this.totalFeeAmount.toString(),
      studentwise_total_fees_discount: 0,
      studentwise_fees_tax_applicable: this.is_tax_enabled ? "Y" : "N",
      template_id: 0,
      template_name: this.addNewTemplate.template_name
    };
    if (!this.isTemplateNotLinkWithCourseAndStandard) {
      if (this.isLangInstitute) {
        data.course_id = '-1';
        data.subject_id = this.addNewTemplate.course_id;
      } else if (this.schoolModel) {
        data.course_id = '-1';
        data.standard_id = this.addNewTemplate.master_course_name;
      } else {
        data.course_id = this.addNewTemplate.course_id;
      }
    }
    return data;
  }
  getInstituteFeeTypes() {
    this.auth.showLoader();
    this.apiService.getAllFeeType().subscribe(
      res => {
        this.auth.hideLoader();
        this.feeTypeList = res;
        for (let data of this.feeTypeList) {
          if (data.fee_type == "INSTALLMENT") {
            this.defultFeeTypes = data.fee_type_id;
            if (this.is_tax_enabled) {
              this.taxPrecent = data.service_tax;
            }
            break;
          }
        }
        this.createInstallmentGrid();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }
  changesValuesAsPerType(row, i) {
    if (row == 1) {
      this.feeInstalllmentArr[i].day = 0;
    }
  }
  calculateTotalFee() {
    let totalFee: number = 0;
    let totalTax: number = 0;
    for (let data of this.feeInstalllmentArr) {
      totalFee += Number(data.fee_amount);
      totalTax += this.calculateTax(data.fee_amount, data.fee_type_id);
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
