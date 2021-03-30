import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
declare var $;

@Component({
  selector: 'app-fee-assignment',
  templateUrl: './fee-assignment.component.html',
  styleUrls: ['./fee-assignment.component.scss']
})
export class FeeAssignmentComponent implements OnInit {
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
    country_id: -1
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
  studentIdArr: any = [];
  feeInstmentArr: any = [];

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
    this.fetchFilterData();
  }
  ngOnInit(): void {
    this.getCountryDetails();
    this.is_tax_enabled = sessionStorage.getItem('enable_tax_applicable_fee_installments') == 'true';
  }
  fetchFilterData() {
    if (this.schoolModel) {
      this.fetchStandardAndSection();
      this.fetchAcademicYearList();
    } else if (!this.isProfessional) {
      this.fetchMCAndCourse();
      this.fetchAcademicYearList();
    } else {
      this.fetchBatch();
    }
  }
  fetchBatch() {
    throw new Error('Method not implemented.');
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
    for(let data of this.academicYrList){
      if(data.default_academic_year==1){
        this.model.academic_yr_id=data.inst_acad_year_id;
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
          this.checkUncheckAll()
          this.auth.hideLoader();
        },
        (error: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
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

    }
    this.requestPayload.academic_yr_id = this.model.academic_yr_id;
    this.requestPayload.country_id = this.model.country_id;
    return true;
  }
  fetchFeeStructure() {
    if (this.validateStudentData()) {
      $('#assignFeeModel').modal('show');
      this.auth.showLoader();
      let queryParam = "";
      if (this.schoolModel) {
        queryParam = "?standard_id=" + this.model.standard_id;
      } else if (!this.isProfessional) {
        queryParam = "?course_id=" + this.model.course_id;
      } else {
        queryParam = "?batch_id=" + this.model.batch_id;
      }
      if (queryParam == '') {
        queryParam += "?country_id=" + this.model.country_id;
      } else {
        queryParam += "&country_id=" + this.model.country_id;
      }
      const url = "/api/v1/student_wise/feeStructure/" + this.institute_id + queryParam;
      this.http.getData(url).subscribe(
        (res: any) => {
          this.feeStructureList = res.result;
          if (this.feeStructureList.length > 0) {
            this.template_id = this.feeStructureList[0].template_id;
            this.fetchFeeStructureData(this.template_id);
          }
          this.auth.hideLoader();
        },
        err => {
          this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
          this.auth.hideLoader();
        }
      );
    }
  }
  validateStudentData() {
    for (let data of this.studentList) {
      if (data.isSelected) {
        return true;
      }
    }
    this.commonService.showErrorMessage('info', '', 'Select at least one student');
    return false;
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
  assignfeeToStudent() {
    debugger
    this.validateAssignFeeData()
    let requestPayload: any = {
      student_ids: this.studentIdArr,
      template_id: this.template_id,
      academic_yr_id: this.model.academic_yr_id,
      institute_id: this.institute_id,
      fee_details: this.feeInstmentArr,
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
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
        this.auth.hideLoader();
      }
    );
  }
  validateAssignFeeData() {
    this.studentIdArr = [];
    this.feeInstmentArr = [];
    for (let data of this.studentList) {
      if (data.isSelected) {
        this.studentIdArr.push(data.student_id);
      }
    }
    for (let data of this.feeInstalllmentArr) {
      let obj = {
        template_data_id: data.schedule_id,
        installment_date: data.installment_date
      }
      this.feeInstmentArr.push(obj);
    }
  }
  viewFeeDetails(data) {

  }
  assignFeeToSingleStudent(data) {

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
    if (this.feeTypeList.length == 0) {
      this.getInstituteFeeTypes();
    }
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
          fee_type_name: data.fee_type_name
        }
        if (this.is_tax_enabled) {
          this.totalTax += (Number(data.fees_amount) - Number(data.initial_fee_amount));
        }
        this.feeInstalllmentArr.push(installmentData);
        this.getCurrencyData(feeStructureData.country_id);
      }
    }

  }
  getInstituteFeeTypes() {
    this.auth.showLoader();
    let url = "/api/v1/batchFeeSched/feeType/" + this.institute_id;
    this.http.getData(url).subscribe(
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
  getCurrencyData(id) {
    for (let data of this.countryDetails) {
      if (data.id == id) {
        this.currencySymbol = data.currency_code
        break;
      }
    }
  }
  closePopUp(){
    $('#assignFeeModel').modal('hide');
  }
}
