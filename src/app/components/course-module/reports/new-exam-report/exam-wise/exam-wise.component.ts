import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MessageShowService } from '../../../../../services/message-show.service';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { CourseListService } from '../../../../../services/course-services/course-list.service';
import { ExamService } from '../../../../../services/report-services/exam.service';


@Component({
  selector: 'app-exam-wise',
  templateUrl: './exam-wise.component.html',
  styleUrls: ['./exam-wise.component.scss']
})
export class ExamWiseComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    type:'batch'
  };

  exam_schd_id: string;
  exam_wise_data: any;
  subjectWiseData: any;
  studentWiseData: any = [];
  examSchdlType: boolean = false;
  is_exam_grad_feature: string;

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
          this.jsonFlag.type='batch';
        } else {
          this.jsonFlag.isProfessional = false;
          this.jsonFlag.type='course';
        }
      }
    )
    let examschd = sessionStorage.getItem('examSchdType');
    if(examschd){
      this.examSchdlType = JSON.parse(examschd);
    }
    this.exam_schd_id = this.route.snapshot.paramMap.get('id');
    this.getExamWiseReport();
  }

  getExamWiseReport(){
    this.jsonFlag.isRippleLoad = true;
    this.examdata.getExamWiseReport(this.exam_schd_id, this.examSchdlType).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        let reports: any = res;
        this.exam_wise_data = reports.courseWise;
        this.subjectWiseData = reports.courseWise.subjectWise_marks;
        this.is_exam_grad_feature = reports.courseWise.is_exam_grad_feature;
        if(reports.courseWise.studentWise_report != null){
          this.studentWiseData = reports.courseWise.studentWise_report;
        }
        sessionStorage.setItem('examSchdType', "");
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
        sessionStorage.setItem('examSchdType', "");
      }
    );
  }

  convertBase64ToArray(val) {
    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  downloadReportCard() {
    this.examdata.downloadExamReport(this.exam_schd_id,this.examSchdlType).subscribe(
      (res:any) => {
        console.log(res);
        if(res){
          // let resp = res.response;
          if(res.document!=""){
            let byteArr = this.convertBase64ToArray(res.document);
            let fileName = 'report.pdf'; //res.docTitle;
            let file = new Blob([byteArr], { type: 'application/pdf;charset=utf-8;' });
            let url = URL.createObjectURL(file);
            let dwldLink = document.getElementById('downloadFileClick');
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", fileName);
            document.body.appendChild(dwldLink);
            dwldLink.click();          
          }
          else{
            this.msgService.showErrorMessage('info', 'Info', "Document does not have any data.");
          }
        }else{
          this.msgService.showErrorMessage('info', 'Info', "Document does not have any data.");
        }
      },
      err => {
        // info type msg will be displayed as it will be displayed if no. of subjects are more than 5 
        this.msgService.showErrorMessage('info', '', err.error.message);
      }
    )

   }
}
