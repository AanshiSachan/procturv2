import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import CommonUtils from '../../../../utils/commonUtils';

@Component({
  selector: 'app-course-course-list-v2',
  templateUrl: './course-course-list-v2.component.html',
  styleUrls: ['./course-course-list-v2.component.scss']
})
export class CourseCourseListV2Component implements OnInit {
  institute_id: any = sessionStorage.getItem('institute_id');
  master_course_id: any = '-1';
  masterCourseData: any = [];
  courseData: any = [];
  standardList: any = [];
  editMasterC: boolean = false;
  createMasterCourseModel: any = {
    "master_course_name": "",
    "institute_id": this.institute_id,
    "is_active": "Y",
    "standard_id": '-1',
    "standard_name":''
  }


  constructor(
    private _httpService: HttpService,
    private _auth: AuthenticatorService,
    private _msgService: MessageShowService
  ) { }

  ngOnInit(): void {
    this.getMasterCourseData();
    this.fetchStandard();
  }

  getMasterCourseData() {
    this._auth.showLoader();
    this._httpService.getData('/api/v1/master-course/fetch-master-course/' + this.institute_id + '?is_active=Y').subscribe(
      (res: any) => {
        this._auth.hideLoader();
        this.masterCourseData = res.result;
      },
      (err: any) => {
        this._auth.hideLoader();
        console.log(err);
      }
    )
  }

  fetchCourseDetails(obj) {
    if (this.master_course_id != '-1') {
      this._auth.showLoader();
      let url = `/api/v1/courseMaster/fetch-all-course/${this.institute_id}/${this.master_course_id}?is_active=Y`;
      this._httpService.getData(url).subscribe(
        (res: any) => {
          this._auth.hideLoader();
          let stdObj = this.masterCourseData.filter(mc => (mc.master_course_id == this.master_course_id));
          this.createMasterCourseModel = stdObj[0];
          this.courseData = res.result;
        },
        (err: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  fetchStandard() {
    let url = "/api/v1/standards/standard-subject-list/" + this.institute_id + '?is_active=Y';
    this._auth.showLoader();
    this._httpService.getData(url).subscribe(
      (data: any) => {
        this._auth.hideLoader();
        this.standardList = data.result;
      },
      (error: any) => {
        this._auth.hideLoader();
        console.log(error);
      }
    )
  }

  saveMasterC() {
    this.editMasterC ? this.updateMasterCourse() : this.createMasterCourse();
  }

  checkMasterCourseVal() {
    if (CommonUtils.isEmpty(this.createMasterCourseModel.master_course_name) || this.createMasterCourseModel.standard_id == '-1') {
      this._msgService.showErrorMessage('error', '', 'Please fill all mandatory fields');
      return false;
    }
    return true;
  }

  createMasterCourse() {
    if (this.checkMasterCourseVal()) {
      this._auth.showLoader();
      this._httpService.postData('/api/v1/master-course/create', this.createMasterCourseModel).subscribe(
        (res: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('success', '', 'Master course added successfully');
        },
        (err: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  updateMasterCourse() {
    if (this.checkMasterCourseVal()) {
      let obj = {
        "master_course_name": this.createMasterCourseModel.master_course_name,
        "institute_id": this.createMasterCourseModel.institute_id,
        "is_active": "Y",
        "standard_id": this.createMasterCourseModel.standard_id,
        "master_course_id": this.createMasterCourseModel.master_course_id
      }
      this._auth.showLoader();
      this._httpService.putData('/api/v1/master-course/update', obj).subscribe(
        (res: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('success', '', 'Master course updated successfully');
        },
        (err: any) => {
          this._auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

}
