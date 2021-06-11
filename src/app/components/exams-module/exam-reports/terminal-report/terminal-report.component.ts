import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
declare var $;

@Component({
  selector: 'app-terminal-report',
  templateUrl: './terminal-report.component.html',
  styleUrls: ['./terminal-report.component.scss']
})
export class TerminalReportComponent implements OnInit {
  ExamTypeData: any = [];
  standardData: any = [];
  courseList: any = [];
  reportDetails: any = {};
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
      let url = '/api/v1/StdCourseExam/fetch-student-terminal-report/' + sessionStorage.getItem('institute_id');
      this._httpService.postData(url, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.reportDetails = res.result;
          $('#myModal').modal('show');
        },
        (err: any) => {
          this.reportDetails = {
            "student_id": 19564,
            "student_name": "Saurav",
            "roll_no": null,
            "registration_no": "jhgdsafj2321",
            "class_position": 1,
            "total_average_marks": 77,
            "mandatory_subject": null,
            "optional_subject": null,
            "group": "",
            "standard_id": 2263,
            "standard_name": "STD 7",
            "exam_type_id": 38,
            "exam_type": "Term 1",
            "section_name": "A",
            "academic_years": "2021-22",
            "subject_list": [
              {
                "subject_id": 7208,
                "subject_name": "Biology",
                "marks_dist_list": [
                  {
                    "marks_distribution_id": 12,
                    "marks_distribution_name": "Practical",
                    "marks_max_value": 0,
                    "marks_value": 11
                  },
                  {
                    "marks_distribution_id": 14,
                    "marks_distribution_name": "written",
                    "marks_max_value": 0,
                    "marks_value": 44
                  },
                  {
                    "marks_distribution_id": 48,
                    "marks_distribution_name": "Practical 2",
                    "marks_max_value": 0,
                    "marks_value": 22
                  }
                ],
                "total_marks": 77,
                "grade": "E",
                "grade_points": 7,
                "rank": 1,
                "attendance": "P",
                "_optional": false
              }
            ],
            "dist_wise_total_marks_map": {
              "Practical": 11,
              "written": 44,
              "Practical 2": 22,
              "Total": 77
            },
            "class_average": 0,
            "interpretation_of_grades": "91-100=9[E++], 81-90=8[E+], 71-80=7[E], 61-70=6[A++], 51-60=5[A+]",
            "student_thumbnail_url": null
          };
          if (this.reportDetails.subject_list && this.reportDetails.subject_list.length) {
            this.reportDetails.new_marks_dist_list = this.reportDetails.subject_list[0].marks_dist_list;
          }
          $('#myModal').modal('show');
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }

  }
}
