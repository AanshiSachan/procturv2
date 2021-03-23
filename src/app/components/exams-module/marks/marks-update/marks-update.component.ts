import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageShowService } from '../../../../services/message-show.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-marks-update',
  templateUrl: './marks-update.component.html',
  styleUrls: ['./marks-update.component.scss']
})
export class MarksUpdateComponent implements OnInit, OnDestroy {
  selectedScheduleId: any = '';
  marks_dist_list: any = [];
  studentList: any = {};

  constructor(
    private routeParam: ActivatedRoute,
    private _httpService: HttpService,
    private auth: AuthenticatorService,
    private _msgService: MessageShowService,
    private router: Router
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedScheduleId = params['batch_exam_schedule_id'];
    });
  }

  ngOnInit(): void {
    this.getStudentDetails();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('fromAdminComponent');
  }

  getStudentDetails() {
    this.auth.showLoader();
    this._httpService.getData('/api/v1/StdCourseExam/fetch-student-exam-marks/' + sessionStorage.getItem('institute_id') + '/' + this.selectedScheduleId).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.studentList = res.result;
        if (this.studentList.student_list && this.studentList.student_list.length) {
          this.marks_dist_list = this.studentList.student_list[0].marks_dist_list;
        }
      },
      (err: any) => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  checkInputValidation() {
    let tempMsg = '';
    for (let i = 0; i < this.studentList.student_list.length; i++) {
      for (let j = 0; j < this.studentList.student_list[i].marks_dist_list.length; j++) {
        if (this.studentList.student_list[i].marks_dist_list[j].marks_value != 0 && this.studentList.student_list[i].marks_dist_list[j].marks_value != null) {
          if (this.studentList.student_list[i].marks_dist_list[j].marks_value > this.studentList.student_list[i].marks_dist_list[j].marks_max_value) {
            tempMsg = tempMsg + 'Please select marks of ' + this.studentList.student_list[i].marks_dist_list[j].marks_distribution_name + ' upto ' + this.studentList.student_list[i].marks_dist_list[j].marks_max_value + ' for student ' + this.studentList.student_list[i].student_name + '. ';
          }
        }
      }
    }
    if (tempMsg != '') {
      this._msgService.showErrorMessage('error', '', tempMsg);
      return false;
    }
    return true;
  }

  saveMarksData() {
    if (this.checkInputValidation()) {
      this.auth.showLoader();
      this._httpService.postData('/api/v1/StdCourseExam/student-marks-update', this.studentList).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('success', '', 'Marks Updated successfully');
          this.backToHome();
        },
        (err: any) => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  backToHome() {
    if(sessionStorage.getItem('fromAdminComponent') == 'true') {
      this.router.navigate(['/view/dashboard/admin']);
    } else {
      this.router.navigateByUrl('/view/exams/marks/schedule-list');
    }
  }

}
