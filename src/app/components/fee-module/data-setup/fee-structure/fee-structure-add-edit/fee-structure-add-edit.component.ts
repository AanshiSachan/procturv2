import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../../services/common-service';
import { FeeStrucService } from '../../../../../services/feeStruc.service';
import CommonUtils from '../../../../../utils/commonUtils';


@Component({
  selector: 'app-fee-structure-add-edit',
  templateUrl: './fee-structure-add-edit.component.html',
  styleUrls: ['./fee-structure-add-edit.component.scss']
})
export class FeeStructureAddEditComponent implements OnInit {
  dayOfmonth: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  months: any = ['Jan', 'Feb', 'Mar', 'Apr'];
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
  totalFeeAmount: number=0;
  currencySymbol:any="Rs ";
  constructor(private apiService: FeeStrucService,
    private route: Router,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory) {
    // this.createInstallmentGrid();
  }
  createInstallmentGrid() {
    this.newInstallment = {
      installment_no: 1,
      fee_type_id: this.defultFeeTypes,
      month: 'Jan',
      day: 1,
      fee_amount: 0,
      day_type: -1
    };
    this.feeInstalllmentArr.push(this.newInstallment);
  }

  ngOnInit(): void {
    this.schoolModel = this.auth.schoolModel.value;
    this.is_tax_enabled = sessionStorage.getItem("enable_tax_applicable_fee_installments") == '1' ? true : false;
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
    debugger
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      for (let data of this.countryDetails) {
        if (data.is_default == "Y") {
          this.defultCountryId = data.id;
          this.addNewTemplate.country_id = data.id;
          if(data.id==1){
          this.currencySymbol=data.currency_code
          }
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
      this.apiService.getMasterCourse().subscribe(
        res => {
          this.masterCourseList = res;
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }
  addInstallment(i) {
    this.newInstallment = {
      installment_no: i + 2,
      fee_type_id: this.feeInstalllmentArr[i].fee_type_id,
      month: this.feeInstalllmentArr[i].month,
      day: this.feeInstalllmentArr[i].day,
      fee_amount: this.feeInstalllmentArr[i].fee_amount,
      day_type: this.feeInstalllmentArr[i].day_type
    };
    this.totalFeeAmount=this.totalFeeAmount+Number(this.feeInstalllmentArr[i].fee_amount);
    this.feeInstalllmentArr.push(this.newInstallment);
  }
  deleteInstallment(index) {
    if (this.feeInstalllmentArr.length == 1) {
      this.commonService.showErrorMessage('info', '', "You can't delete!");
      return false;
    } else {
      this.totalFeeAmount=this.totalFeeAmount-Number(this.feeInstalllmentArr[index].fee_amount);
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

    debugger
    console.log(JSON.stringify(this.feeInstalllmentArr));
    console.log(JSON.stringify(this.addNewTemplate));
    if(this.validateFeeStructureData()){
      let data=this.preparedFeeStructureData();
    this.auth.showLoader();
    this.apiService.updateFeeTemplate(data).subscribe(
      res => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', 'Updated', 'Fee Structure created Successfully');
       // this.route.navigateByUrl('/view/fee/data-setup/fee-template/home');
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
      this.commonService.showErrorMessage('info', '', "Please enter valid template name!");
      return;
    }
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
    if (this.countryDetails.length > 1 && this.addNewTemplate.country_id < 0) {
      this.commonService.showErrorMessage('info', '', "Please select valid country!");
      return;
    }
    return this.validateFeeInstallments();
  }
  validateFeeInstallments() {
    if (this.feeInstalllmentArr.length == 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid template name!");
      return;
    }
    for (let data of this.feeInstalllmentArr) {
      if (this.validateEachInstallment(data)) {
        let installment: any = {
          day_type: this.schoolModel?4:data.day_type,
          days: data.day,
          fee_type: data.fee_type_id,
          fees_amount: data.fee_amount,
          initial_fee_amount: data.fee_amount,
          service_tax: this.is_tax_enabled?18 :0,
          service_tax_applicable: this.is_tax_enabled?"Y":"N",
        };
        this.feeInstallments.push(installment);
      } else {
        this.feeInstallments = [];
        return;
      }
    }
    return true;
  }
  validateEachInstallment(data: any) {
    if (data.installment_no < 0) {
      this.commonService.showErrorMessage('info', '', "Please enter valid installment No.");
      return;
    }
    if (data.fee_type_id < 0) {
      this.commonService.showErrorMessage('info', '', "Please select valid fee type!");
      return;
    }
    if (this.schoolModel) {
      if (data.day < 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee day!");
        return;
      }
      if (data.month < 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee month!");
        return;
      }
    }
    if (!this.schoolModel) {
      if (data.day_type < 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid trigger date!");
        return;
      }
      if (data.day < 0) {
        this.commonService.showErrorMessage('info', '', "Please select valid fee day!");
        return;
      }
    }
    return true;
  }
  preparedFeeStructureData():any {
    let data: any = {
      is_default: 0,
      country_id: this.addNewTemplate.country_id,
      customFeeSchedules: this.feeInstallments,
      studentwise_total_fees_amount: this.totalFeeAmount.toString(),
      studentwise_total_fees_discount: 0,
      studentwise_fees_tax_applicable: this.is_tax_enabled?"Y":"N",
      template_id: 0,
      template_name: this.addNewTemplate.template_name
    };
    if (this.isLangInstitute) {
      data.course_id = '-1';
      data.subject_id = this.addNewTemplate.course_id;
    } else if(this.schoolModel) {
      data.course_id = '-1';
      data.standard_id = this.addNewTemplate.master_course_name;
    }else{
      data.course_id = this.addNewTemplate.course_id;
    }
    return data;
  }
  getInstituteFeeTypes() {
    debugger
    this.auth.showLoader();
    this.apiService.getAllFeeType().subscribe(
      res => {
        this.auth.hideLoader();
        this.feeTypeList = res;
        for (let data of this.feeTypeList) {
          if (data.fee_type == "Tuition Fees") {
            this.defultFeeTypes = data.fee_type_id;
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
  changesValuesAsPerType(row) {
    this.showMonthDropDown = false;
    if (row == 1) {
      row.days = 0;
    } else if (row.day_type == 3) {
      this.showMonthDropDown = true;
    }
  }
}
