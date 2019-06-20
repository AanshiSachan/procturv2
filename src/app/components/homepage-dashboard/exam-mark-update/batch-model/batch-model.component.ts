import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { WidgetService } from '../../../../services/widget.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-batch-model',
  templateUrl: './batch-model.component.html',
  styleUrls: ['./batch-model.component.scss']
})
export class BatchModelComponent implements OnInit {

  permissionArray = sessionStorage.getItem('permissions');
  public isProfessional: boolean = false;
  isRippleLoad: boolean = false;
  exam_info: any;
  subjectList: any = [];
  examGradeFeature: any;
  studentList: any = [];
  examData: any = "";
  gradesList: any = [];

  constructor(
    private router: Router,
    private appC: AppComponent,
    private widgetService: WidgetService,
    private auth: AuthenticatorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.examGradeFeature = sessionStorage.getItem('is_exam_grad_feature');

    this.fetchData();
  }

  fetchData(){
    let data = this.route.snapshot.queryParamMap.get('exam_info');
    this.exam_info = JSON.parse(data);
    this.fetchStudentDetails(this.exam_info.data);
    if (this.examGradeFeature == 1) {
      this.getAllExamGrades();
    }
  }

  fetchStudentDetails(data) {
    this.widgetService.fetchStudentExamDetails(data.batch_id, data.schd_id).subscribe(
      (res: any) => {
        this.examData = res;
        this.studentList = this.addKeys(res.studLi, false);
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  getAllExamGrades() {
    this.isRippleLoad = true;
    this.widgetService.getExamGrades().subscribe(
      res => {
        this.isRippleLoad = false;
        this.gradesList = res;
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
      }
    )
  }

  checkForMArks() {
    let check = false;
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].assigned == true) {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    return check;
  }

  markAllCheckBoxClick(event) {
    this.studentList.forEach(element => {
      if(element.attendance == 'P'){
        element.assigned = event.target.checked;
      }
    });
  }

  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }


  updateMarksOnServer(sendSms) {
    let dataToSend = this.makeJsonForMarks(sendSms);
    if (dataToSend.studLi.length == 0) {
      this.messageNotifier('error', 'Error', 'Please Select Student');
      return;
    }
    if (dataToSend == false) {
      return;
    }
    this.widgetService.updateAttendanceDetails(dataToSend).subscribe(
      res => {
        this.messageNotifier('success', "Marks Updated", 'Marks Updated Successfully');
        this.closeAttendance();
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  makeJsonForMarks(sendSms) {
    let arr: any = {};
    arr.schd_id = this.examData.schd_id;
    arr.batch_id = this.examData.batch_id;
    arr.isStudentExamSMS = sendSms;
    arr.studLi = [];
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].assigned) {
        let student: any = {};
        student.student_id = this.studentList[i].student_id;
        student.marks_obtained = this.studentList[i].marks_obtained;
        student.student_exam_det_id = this.studentList[i].student_exam_det_id;
        student.previous_marks_obtained = this.studentList[i].previous_marks_obtained;
        if (sendSms == "Y") {
          student.isUpdated = "Y";
        } else {
          student.isUpdated = this.studentList[i].isUpdated;
        }
        student.attendance = this.studentList[i].attendance;
        student.isAttendanceUpdated = this.studentList[i].isAttendanceUpdated;
        student.grade_id = this.studentList[i].grade_id;
        if (this.examData.is_exam_grad_feature == 0) {
          if (student.marks_obtained > this.examData.total_marks) {
            this.messageNotifier('error', 'Error', 'Please check marks you have provided');
            return false;
          } else {
            if (this.studentList[i].attendance == 'P') {
              student.marks_obtained = this.studentList[i].marks_obtained;
            } else {
              student.marks_obtained = '0';
            }
          }
        }
        arr.studLi.push(student);
      }
    }
    return arr;
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.appC.popToast(data);
  }

  closeAttendance(){
    this.router.navigate(['/view/home/admin']);
  }

  backToHome(){
    this.router.navigate(['/view/home/admin']);
  }

}
