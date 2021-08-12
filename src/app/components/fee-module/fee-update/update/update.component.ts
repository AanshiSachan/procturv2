
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import * as moment from 'moment';
declare var $;

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  schoolModel: boolean = false;
  isProfessional: boolean = false;
  institute_id: string;
  academicYrList: any = [];
  standardList: any = [];
  standardSectionMap: any = [];
  sectionList: any[];
  masterCourseList: any = [];
  courseList: any;
  model = {
    master_course: '',
    course_id: -1,
    standard_id: -1,
    academic_yr_id: -1,
    batch_id: -1,
    country_id: -1,
    fee_assigned: 1
  }
  requestPayload: any = {
    institute_id: sessionStorage.getItem("institute_id")
  }
  studentList: any = [];
  countryDetails: any = [];
  currencySymbol: String;
  masterSelected: boolean = false;
  feeStructureList: any = [];
  feeStructureDataList: any = {};
  is_tax_enabled: boolean = false;
  template_id: number = -1;
  totalFeeAmount: number = 0;
  totalTax: number = 0;
  feeTypeList: any = [];
  feeInstalllmentArr: any[];
  studentIdArr: any = [];
  feeInstmentArr: any = [];
  batchList: any = [];
  student_id: number = -1;
  isTemplateNotLinkWithCourseAndStandard: boolean = false;
  searchElement: any;
  tempStudentList: any=[];

  constructor(private auth: AuthenticatorService,
    private http: HttpService,
    private commonService: CommonServiceFactory,
  ) {
    this.schoolModel = this.auth.schoolModel.value;
    this.institute_id = sessionStorage.getItem("institute_id");
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.isTemplateNotLinkWithCourseAndStandard = sessionStorage.getItem("is_fee_struct_linked")=='true'?false:true;
    this.fetchFilterData();

  }
  ngOnInit(): void {
    this.getCountryDetails();
    this.is_tax_enabled = sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1';
  }
  fetchFilterData() {
    this.fetchAcademicYearList();
    if (this.schoolModel) {
      this.fetchStandardAndSection();
    } else if (!this.isProfessional) {
      this.fetchMCAndCourse();
    } else {
      this.fetchStandard();
    }
  }
  fetchStandard() {
    let url = "/api/v1/standards/standard-subject-list/" + this.institute_id + '?is_active=Y';
    this.auth.showLoader();
    this.http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.standardList = data.result;
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }
  fetchBatch(standard_id) {
    let url = "/api/v1/batches/" + this.institute_id + "/standard/" + standard_id;
    this.auth.showLoader();
    this.http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.batchList = data.result;
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
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
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
        this.auth.hideLoader();
      }
    );
  }

  fetchCoursesList(master_course) {
    for (let data of this.masterCourseList) {
      if (data.master_course == master_course) {
        this.courseList = data.coursesList;
        return;
      }
    }
  }
  fetchStandardAndSection() {
    let url = "/api/v1/courseMaster/standard-section-list/" + this.institute_id;
    this.auth.showLoader();
    this.http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.standardSectionMap = data.result;
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
      }
    )
  }
  fetchSectionList(standard_id) {
    this.sectionList = [];
    for (let data of this.standardSectionMap) {
      if (data.standard_id == standard_id) {
        this.sectionList = data.section_list;
        break;
      }
    }
  }
  fetchAcademicYearList() {
    this.auth.showLoader();
    let url = "/api/v1/academicYear/all/" + this.institute_id;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.academicYrList = res;
        this.fetchDefaultAY();
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )
  }
  fetchDefaultAY() {
    if (this.academicYrList != null) {
      for (let data of this.academicYrList) {
        if (data.default_academic_year == 1) {
          this.model.academic_yr_id = data.inst_acad_year_id;
          break;
        }
      }
    }
  }
  fetchStudentList() {
    if (this.validateUserInput()) {
      this.auth.showLoader();
      let url = "/api/v1//studentWise/fee/fetch/students";
      this.http.postData(url, this.requestPayload).subscribe(
        (res: any) => {
          this.studentList = res.result;
          this.tempStudentList=res.result;
          this.checkUncheckAll()
          this.auth.hideLoader();
        },
        (error: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', error.error.message);
        }
      )
    }
  }
  validateUserInput() {
    if (this.schoolModel) {
      if (this.model.standard_id <= 0) {
        this.commonService.showErrorMessage('info', '', 'Select Standard!');
        return;
      }
      this.requestPayload.standard_id = this.model.standard_id;
      this.requestPayload.course_id = this.model.course_id;

    } else if (!this.isProfessional) {
      if (this.model.master_course == '') {
        this.commonService.showErrorMessage('info', '', 'Select Master Course!');
        return;
      }
      if (this.model.course_id <= 0) {
        this.commonService.showErrorMessage('info', '', 'Select Course!');
        return;
      }
      this.requestPayload.course_id = this.model.course_id;
    } else {
      if (this.model.standard_id <= 0) {
        this.commonService.showErrorMessage('info', '', 'Select Master Course!');
        return;
      }
      if (this.model.batch_id <= 0) {
        this.commonService.showErrorMessage('info', '', 'Select Batch!');
        return;
      }
      this.requestPayload.batch_id = this.model.batch_id;
    }
    if (this.model.academic_yr_id <= 0) {
      this.commonService.showErrorMessage('info', '', 'Select Academic Yr!');
      return;
    }
    this.requestPayload.academic_yr_id = this.model.academic_yr_id;
    this.requestPayload.country_id = this.model.country_id;
    this.requestPayload.fee_assigned = this.model.fee_assigned
    return true;
  }
  fetchFeeStructure(isAssignedToSingleStudent) {
    if (isAssignedToSingleStudent) {
      this.student_id = -1;
    }
    if (!this.validateStudentData()) {
      return;
    }
    // if (this.feeStructureList.length > 0) {
    //   $('#assignFeeModel').modal('show');
    //   return
    // }
    $('#assignFeeModel').modal('show');
    this.auth.showLoader();
    let queryParam = "";
    if (!this.isTemplateNotLinkWithCourseAndStandard && false)  {
      if (this.schoolModel) {
        queryParam = "?standard_id=" + this.model.standard_id;
      } else if (!this.isProfessional) {
        queryParam = "?course_id=" + this.model.course_id;
      } else {
        queryParam = "?batch_id=" + this.model.batch_id;
      }
      queryParam += "&country_id=" + this.model.country_id;
    } else {
      queryParam += "?country_id=" + this.model.country_id;
    }
    const url = "/api/v1/student_wise/feeStructure/" + this.institute_id + queryParam;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.feeStructureList = res.result;
        if (this.feeStructureList.length > 0) {
          for (let data of this.feeStructureList) {
            if (data.is_default = 1) {
              this.template_id = data.template_id;
              break;
            }
          }
          if (this.template_id > 0) {
            this.fetchFeeStructureData(this.template_id);
          }
        }
        this.auth.hideLoader();
      },
      err => {
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
        this.auth.hideLoader();
      }
    );
  }

  validateStudentData() {
    if (this.student_id < 0) {
      for (let data of this.studentList) {
        if (data.isSelected) {
          return true;
        }
      }
      this.commonService.showErrorMessage('info', '', 'Select at least one student');
      return false;
    } else {
      return true;
    }
  }
  getCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      for (let data of this.countryDetails) {
        if (data.is_default == "Y") {
          this.model.country_id = data.id;
          this.currencySymbol = data.currency_code
          break;
        }
      }
    }
  }
  assignfeeToStudent(isAssignedToSingleStudent) {
    if(this.validateAssignFeeData()){
    let requestPayload: any = {
      student_ids: this.studentIdArr,
      template_id: this.template_id,
      academic_yr_id: this.model.academic_yr_id,
      institute_id: this.institute_id,
      fee_details: this.feeInstmentArr,
    }
    if (this.schoolModel) {
      requestPayload.standard_id = this.model.standard_id;
    } else if (!this.isProfessional) {
      requestPayload.course_id = this.model.course_id;
    } else {
      requestPayload.batch_id = this.model.batch_id;
    }
    let url = "/api/v1//studentWise/fee/assign";
    this.http.postData(url, requestPayload).subscribe(
      (res: any) => {
        $('#assignFeeModel').modal('hide');
        this.commonService.showErrorMessage('success', '', 'Success!');
        this.fetchStudentList();
        this.auth.hideLoader();
      },
      err => {
        this.commonService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
      }
    );
  }
}
  validateAssignFeeData() {
    this.studentIdArr = [];
    this.feeInstmentArr = [];
    if (this.student_id < 0) {
      for (let data of this.studentList) {
        if (data.isSelected) {
          this.studentIdArr.push(data.student_id);
        }
      }
    } else {
      this.studentIdArr.push(this.student_id);
    }
    for (let data of this.feeInstalllmentArr) {
      if (data.day_type == 3 && data.days > 12) {
        this.commonService.showErrorMessage('info', '', "Please enter valid month!");
        return;
      }
      let obj = {
        template_data_id: data.schedule_id,
        installment_date: moment(data.installment_date).format("YYYY-MM-DD"),
        date_type: data.day_type,
        days: data.days

      }
      this.feeInstmentArr.push(obj);
    }
    return true;
  }
  viewFeeDetails(data) {

  }
  assignFeeToSingleStudent(data) {
    this.student_id = data.student_id;
    this.fetchFeeStructure(false);
  }
  checkUncheckAll() {
    for (var i = 0; i < this.studentList.length; i++) {
      this.studentList[i].isSelected = this.masterSelected;
    }
  }
  fetchFeeStructureData(template_id) {
    const url = "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + template_id;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.feeStructureDataList = res;
        this.preparedFeeStructureData(this.feeStructureDataList)
        this.auth.hideLoader();
      },
      err => {
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
        this.auth.hideLoader();
      }
    );
  }
  preparedFeeStructureData(feeStructureData) {
    this.totalTax = 0;
    this.feeInstalllmentArr = [];
    this.totalFeeAmount = feeStructureData.studentwise_total_fees_amount;
    if (feeStructureData.customFeeSchedules != null) {
      for (let data of feeStructureData.customFeeSchedules) {
        let installmentData: any = {
          fee_type: data.fee_type,
          month: data.month,
          days: data.days,
          fees_amount: data.fees_amount,
          day_type: data.day_type,
          schedule_id: data.schedule_id,
          fee_type_name: data.fee_type_name,
          installment_date: data.installment_date

        }
        if (this.is_tax_enabled) {
          this.totalTax += (Number(data.fees_amount) - Number(data.initial_fee_amount));
        }
        this.feeInstalllmentArr.push(installmentData);
        this.getCurrencyData(feeStructureData.country_id);
      }
    }

  }
 
  getCurrencyData(id) {
    for (let data of this.countryDetails) {
      if (data.id == id) {
        this.currencySymbol = data.currency_code
        break;
      }
    }
  }
  closePopUp() {
    $('#assignFeeModel').modal('hide');
    this.student_id = -1;
  }
  localSearch() {
    if (this.searchElement) {
      let searchData = this.studentList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchElement.toLowerCase()))
      );
      this.studentList = searchData;
    }else {
      this.studentList=this.tempStudentList;
    }
  }

  setAcadYear() {
    sessionStorage.setItem('selected_acad_yr', String(this.model.academic_yr_id));
  }

}
