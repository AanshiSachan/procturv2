import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ExamService } from '../../../../../services/report-services/exam.service';
import { CourseListService } from '../../../../../services/course-services/course-list.service';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { MessageShowService } from '../../../../../services/message-show.service';
@Component({
  selector: 'app-teacher-performance',
  templateUrl: './teacher-performance.component.html',
  styleUrls: ['./teacher-performance.component.scss']
})
export class TeacherPerformanceComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    type:'batch'
  };

  subject_id: string;
  teacherData: any;
  subjectData: any;
  teachersReport: any[] = [];
  subjectsReport: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private examdata: ExamService,
    private courseList: CourseListService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
          this.jsonFlag.type='batch';
        } else {
          this.jsonFlag.isProfessional = false;
          this.jsonFlag.type='course';
        }
      }
    )
    this.subject_id = this.route.snapshot.paramMap.get('id');
    this.getSubjectWiseReport();
  }

  getSubjectWiseReport(){
    this.jsonFlag.isRippleLoad = true;
    this.examdata.getSubjectWiseReport(this.subject_id).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        let result: any = res;
        this.teacherData = result.teacherPerformanceReport;
        this.subjectData = result.subjectWisePerformance;

        for(let i = 0; i < this.teacherData.length; i++){
          let teacherName = this.teacherData[i].teacher_name;
          let teacherId = this.teacherData[i].teacher_id;
            for(let l = 0; l < this.teacherData[i].performanceList.length; l++){
              this.teacherData[i].performanceList[l].teacher_id = teacherId;
              this.teacherData[i].performanceList[l].teacher_name = teacherName;
              this.teachersReport.push(this.teacherData[i].performanceList[l]);
            }
        }

        for(let i = 0; i < this.subjectData.length; i++){
          let teacherName = this.subjectData[i].teacher_name;
          let teacherId = this.subjectData[i].teacher_id;
            for(let l = 0; l < this.subjectData[i].performanceList.length; l++){
              this.subjectData[i].performanceList[l].teacher_id = teacherId;
              this.subjectData[i].performanceList[l].teacher_name = teacherName;
              this.subjectsReport.push(this.subjectData[i].performanceList[l]);
            }
        }
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

  routeTo(exam_schd_id){
    sessionStorage.setItem('examSchdType', "true");
    this.router.navigate(['/view/'+this.jsonFlag.type+'/reports/new-exam/examWise/'+exam_schd_id]);
  }

}
