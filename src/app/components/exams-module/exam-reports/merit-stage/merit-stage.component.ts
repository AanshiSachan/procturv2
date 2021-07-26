import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
declare var $;

@Component({
  selector: 'app-merit-stage',
  templateUrl: './merit-stage.component.html',
  styleUrls: ['./merit-stage.component.scss']
})
export class MeritStageComponent implements OnInit {
  ExamTypeData: any = [];
  standardData: any = [];
  courseList: any = [];
  reportDetails: any = {};
  instituteName: any = '';
  filterObj = {
    standard_id: '-1',
    exam_type: '-1',
    section_id: '-1'
  }

  constructor(
    private auth: AuthenticatorService,
    private _httpService: HttpService,
    private _msgService: MessageShowService
  ) { }

  ngOnInit(): void {
    this.instituteName = sessionStorage.getItem('institute_name');
    this.getStandard();
    this.getExamType();
  }

  getStandard() {
    let url = "/api/v1/courseMaster/standard-section-list/" + sessionStorage.getItem('institute_id');
    let keys;
    this.auth.showLoader();
    this._httpService.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        console.log(data);
        this.standardData = data.result;
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  updateCourseList(ev) {
    console.log(ev);
    this.courseList = [];
    this.filterObj.section_id = '-1';
    let master_course_obj = this.standardData.filter(
      (standard) => (ev == standard.standard_id)
    );
    this.courseList = master_course_obj[0].section_list;
  }

  getExamType() {
    this.ExamTypeData = [];
    let url = `/api/v1/courseExamSchedule/fetch-exam-type/${sessionStorage.getItem('institute_id')}`;
    this.auth.showLoader();
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        console.log(res);
        this.ExamTypeData = res.result;
      },
      err => {
        this.auth.hideLoader()
        console.log(err);
      }
    )
  }

  checkInputValidations() {
    if (this.filterObj.standard_id == '-1' || this.filterObj.exam_type == '-1' || this.filterObj.section_id == '-1') {
      this._msgService.showErrorMessage('error', '', 'Please select mandatory fields');
      return false;
    }
    return true;
  }

  getReport() {
    if (this.checkInputValidations()) {
      this.auth.showLoader();
      let obj = {
        course_id: this.filterObj.section_id,
        exam_type_id: this.filterObj.exam_type
      }
      let url = '/api/v1/StdCourseExam/fetch-student-merit-stage-report/' + sessionStorage.getItem('institute_id');
      this._httpService.postData(url, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.reportDetails = res.result;
          $('#myModal').modal('show');
        },
        (err: any) => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }

  }

  Print() {
    let printContents = document.getElementById('myModal').innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.close();
  }

}
