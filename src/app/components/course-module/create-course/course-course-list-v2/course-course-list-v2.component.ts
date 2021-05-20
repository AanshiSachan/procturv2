import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';

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
  createMasterCourseModel={
    "master_course_name": "",
    "institute_id": this.institute_id,
    "is_active": "Y",
    "standard_id":'-1'
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
    this._httpService.getData('/api/v1/master-course/fetch/' + this.institute_id + '?is_active=Y').subscribe(
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
    this._auth.showLoader();
    let url = `/api/v1/fetch-all-course/${this.institute_id}/${this.master_course_id}?is_active=Y`;
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this._auth.hideLoader();
        this.courseData = res.result;
      },
      (err: any) => {
        this._auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    )
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

  createMasterCourse() {
    this._auth.showLoader();
    this._httpService.postData('/api/v1/master-course/create', this.createMasterCourseModel).subscribe(
      (res:any)=>{
        this._auth.hideLoader();
        this._msgService.showErrorMessage('success','','Master course added successfully');
      },
      (err:any)=>{
        this._auth.hideLoader();
        this._msgService.showErrorMessage('error','',err.error.message);
      }
    )
  }

}
