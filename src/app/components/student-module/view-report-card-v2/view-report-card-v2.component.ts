import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { StudentReportService } from '../../../services/report-services/student-report-service/student-report.service';
@Component({
  selector: 'app-view-report-card-v2',
  templateUrl: './view-report-card-v2.component.html',
  styleUrls: ['./view-report-card-v2.component.scss']
})
export class ViewReportCardV2Component implements OnInit {

  constructor( private route: Router,
    private actRoute: ActivatedRoute,
    private apiService: StudentReportService,
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private toastCtrl: AppComponent,
   ) { }
parentProfileDocData:any=[];
studentCommanData:any=[];
assignedCourses:any=[];
studentId: any = -1;
optionalSubjects:any=[];
studentFile:any=[];
schoolModel:boolean;
isLangInstitue: boolean = false;
institute_id=sessionStorage.getItem('institute_id');
  ngOnInit(): void {
    //check for school model
    this.schoolModel= this.auth.schoolModel.getValue();
    this.auth.institute_type.subscribe(
      res => {
         //batch module
         //isLangInstitue = true;
          //isProfessional==true
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          //course module
           //isLangInstitue = false;
          //isProfessional==false
          this.isLangInstitue = false;
        }
      }
    )
 
    this.actRoute.params.subscribe(
      (res: any) => {
        this.studentId = res.id;
      }
    )
    // this.timetablePayLoad.student_id = this.studentId;
    // this.viewAttendancePayload.student_id = this.studentId;
    // this.getStudentInfo();
    this.getParentProfileDoc();
  }
  //For tab active 
  isActiveTab ='profile';

openTab(param){ 
  this.isActiveTab =param;
}
//function to get parent,profile ,document, data
getParentProfileDoc() {
  this.auth.showLoader();
  this.httpService.getData('/api/v1/students/get-student-detail/' +this.institute_id +'/' + this.studentId ).subscribe(
    (res: any) => {
      this.parentProfileDocData =res.result;
      this.studentCommanData =res.result;
      let course = this.studentCommanData.assignedCourses.split();
      this.assignedCourses =course;
     this.studentFile =this.studentCommanData.studentFile ;
     //console.log(this.studentFile)
      let optionalSubject =this.studentCommanData.optionalSubjects;
      if(this.studentCommanData.optionalSubjects!=null){
         optionalSubject =this.studentCommanData.optionalSubjects.split();
      }
     this.optionalSubjects= optionalSubject;
      this.auth.hideLoader();
    },
    err => {
      this.auth.hideLoader();
    }
  );
}
}
