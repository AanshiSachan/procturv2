import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';

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
  feeStructureList: any=[];
  constructor(private auth: AuthenticatorService,
    private http: HttpService,
    private commonService: CommonServiceFactory) {
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
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )
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
    this.auth.showLoader();
    let queryParam = "";
    if (this.schoolModel) {
      queryParam = "?standard_id=" + this.model.standard_id;
    } else if (!this.isProfessional) {
      queryParam = "?course_id=" + this.model.course_id;
    } else {
      queryParam = "?batch_id=" + this.model.batch_id;
    }
    if(queryParam==''){
      queryParam += "?country_id=" + this.model.country_id;
    }else{
      queryParam += "&country_id=" + this.model.country_id;
    }
    const url = "/api/v1/student_wise/feeStructure/" + this.institute_id  + queryParam;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.feeStructureList = res.result;
        this.auth.hideLoader();
      },
      err => {
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
        this.auth.hideLoader();
      }
    );
  }
  fetchBatchModelFeeStructure() {
    throw new Error('Method not implemented.');
  }
  fetchCourseModelFeeStructure() {
    throw new Error('Method not implemented.');
  }
  fetchSchoolModelFeeStructure() {
    throw new Error('Method not implemented.');
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

  }
  viewFeeDetails(data) {

  }
  assignFeeToSingleStudent(data) {

  }
  checkUncheckAll() {
    alert(this.masterSelected);
    debugger
    for (var i = 0; i < this.studentList.length; i++) {
      this.studentList[i].isSelected = this.masterSelected;
    }
  }
}
