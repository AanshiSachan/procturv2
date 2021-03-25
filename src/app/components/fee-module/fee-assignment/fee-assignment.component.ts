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
  getAllAcademic: any = [];
  standardList: any = [];
  standardSectionMap: any = [];
  sectionList: any[];
  masterCourseList: any = [];
  courseList: any;
  inputElements: any;
  constructor(private auth: AuthenticatorService,
    private http: HttpService
    , private commonService: CommonServiceFactory) {
    this.schoolModel = this.auth.schoolModel.value;
    //this.getAcademicYear();
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
  fetchFilterData() {
    if (this.schoolModel) {
      this.fetchStandardAndSection();
      this.getAcademicYearList();
    } else if (!this.isProfessional) {
      this.fetchMCAndCourse();
    } else {
      this.fetchBatch();
    }
  }
  fetchBatch() {
    throw new Error('Method not implemented.');
  }
  fetchMCAndCourse() {
    this.auth.showLoader();
    const url = "/api/v1/courseMaster/fetch/" + this + this.institute_id + "/all?isActiveNotExpire=Y";
    this.http.getData(url).subscribe(
      res => {
        this.masterCourseList = res;
        this.auth.hideLoader();
      },
      err => {
        this.commonService.showErrorMessage('error', 'Update Successfully', 'Fee Structure Updated Successfully');
        this.auth.hideLoader();
      }
    );
  }
 
  getCoursesList() {
    for (var i = 0; i < this.masterCourseList.length; i++) {
      if (this.masterCourseList[i].master_course == this.inputElements.masterCourse) {
        this.courseList = this.masterCourseList[i].coursesList;
        return;
      }
    }
  }
  fetchStandardAndSection() {
    let url = "/api/v1/courseMaster/master-course-list/" + this.institute_id + "?is_standard_wise=true&sorted_by=course_name";
    let keys;
    this.auth.showLoader();
    this.http.getData(url).subscribe(
      (data: any) => {
        this.standardList = [];
        this.auth.hideLoader();
        this.standardSectionMap = data.result;
        keys = Object.keys(data.result);
        for (let i = 0; i < keys.length; i++) {
          this.standardList.push(keys[i]);
        }
      },
      (error: any) => {
        this.auth.hideLoader();
      }
    )
  }

  getSectionList(standard_name) {
    this.sectionList = [];
    let temp = this.standardSectionMap[standard_name];
    for (let i = 0; i < temp.length; i++) {
      this.sectionList.push(temp[i]);
    }
  }
  ngOnInit(): void {
  }
  getAcademicYearList() {
    let url = "/api/v1/academicYear/all/" + this.institute_id;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.getAllAcademic = res;
      },
      (error: any) => {
        this.commonService.showErrorMessage('error', 'Update Successfully', 'Fee Structure Updated Successfully');

      }
    )
  }
}
