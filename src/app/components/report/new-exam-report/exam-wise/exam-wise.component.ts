import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExamService } from '../../../../services/report-services/exam.service';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-exam-wise',
  templateUrl: './exam-wise.component.html',
  styleUrls: ['./exam-wise.component.scss']
})
export class ExamWiseComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false
  };

  exam_schd_id: string;
  exam_wise_data: any;
  subjectWiseData: any;
  studentWiseData: any = [];
  examSchdlType: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private examdata: ExamService,
    private courseList: CourseListService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
  ) {}

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )
    let examschd = sessionStorage.getItem('examSchdType');
    if(examschd){
      this.examSchdlType = JSON.parse(examschd);
    }
    this.exam_schd_id = this.route.snapshot.paramMap.get('id');
    this.getExamWiseReport()
  }

  getExamWiseReport(){
    this.jsonFlag.isRippleLoad = true;
    this.examdata.getExamWiseReport(this.exam_schd_id, this.examSchdlType).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        let reports: any = res;
        this.exam_wise_data = reports.courseWise;
        this.subjectWiseData = reports.courseWise.subjectWise_marks;
        if(reports.courseWise.studentWise_report != null){
          this.studentWiseData = reports.courseWise.studentWise_report;
        }
        sessionStorage.setItem('examSchdType', "");
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

}
