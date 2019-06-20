import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { WidgetService } from '../../../services/widget.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-exam-mark-update',
  templateUrl: './exam-mark-update.component.html',
  styleUrls: ['./exam-mark-update.component.scss']
})
export class ExamMarkUpdateComponent implements OnInit {

  permissionArray = sessionStorage.getItem('permissions');
  public isProfessional: boolean = false;
  isRippleLoad: boolean = false;
  exam_info: any;
  subjectList: any = [];
  totalExamMarks: number = 0;
  examMarksLevel: string = "0";
  gradesList: any = [];
  tempData: any = [];
  studentAttList: any[] = [];
  examGradeFeature: any;

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

    this.fetchWidgetPrefill();
  }

  fetchWidgetPrefill() {
    let data = this.route.snapshot.queryParamMap.get('exam_info');
    this.exam_info = JSON.parse(data);
    let data1 = this.exam_info.data;
    this.examMarksUpdateCourse(data1);
  }

  // fetchData(){
  //   let data = this.route.snapshot.queryParamMap.get('exam_info');
  //   this.exam_info = JSON.parse(data);
  //   this.fetchStudentDetails(this.exam_info.data);
  //   if (this.examGradeFeature == 1) {
  //     this.getAllExamGrades();
  //   }
  // }

  fetchStudentDetails(data) {
    this.widgetService.fetchStudentExamDetails(data.batch_id, data.schd_id).subscribe(
      (res: any) => {
        // this.examData = res;
        this.studentAttList = this.addKeys(res.studLi, false);
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  checkForMArks() {
    let check = false;
    for (let i = 0; i < this.studentAttList.length; i++) {
      if (this.studentAttList[i].assigned == true) {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    return check;
  }

  examMarksUpdateCourse(data) {
    this.examMarksLevel = data.course_marks_update_level.toString();
    this.subjectList = [];
    this.totalExamMarks = 0;
    this.tempData = data;
    // this.examGradeFeature = data.is_exam_grad_feature;
    this.getExamstudentAttList(data.course_exam_schedule_id);
    if (data.is_exam_grad_feature == 1) {
      this.getAllExamGrades();
    }
  }

  getExamstudentAttList(id) {
    this.isRippleLoad = true;
    this.widgetService.getExamStudentsList(id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.studentAttList = this.addKeys(res, false);
        this.makeTableHeader();
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
        let msg = {
          type: 'error',
          title: 'Error',
          body: err.error.message
        }
        this.appC.popToast(msg);
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

  makeTableHeader() {
    if (this.studentAttList.length > 0) {
      this.subjectList = this.studentAttList[0].batchExamMarksLi;
      this.totalExamMarks = this.studentAttList[0].cours_exam_total_marks;
    } else {
      this.subjectList = [];
      this.totalExamMarks = 0;
    }
  }

  updateMarksOnServerCourse(type) {
    if (this.examMarksLevel == "0" || Number(this.examMarksLevel) == 3) {
      this.messageNotifier('error', 'Error', 'Please provide marks updation level');
      return;
    }
    let data: any;
    if (type == 'single') {
      data = this.makeJsonForMarksUpdate();
    } else {
      data = this.fetchAllStudentJson();
    }
    if (data.length == 0) {
      this.messageNotifier('error', 'Error', 'Please select student from student list');
      return;
    }
    if (data == false) {
      return;
    }
    this.isRippleLoad = true;
    this.widgetService.markStudentMarks(data).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Successfully Saved', 'Marks Saved Successfully');
        this.backToHome();
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  makeJsonForMarksUpdate() {
    let arr = [];
    let notassignCount = 0;
    for (let i = 0; i < this.studentAttList.length; i++) {
      let obj: any = {};
      obj.course_exam_schedule_id = this.studentAttList[i].course_exam_schedule_id;
      obj.course_marks_update_level = this.examMarksLevel;
      obj.isStudentExamSMS = 'N'
      obj.batchExamMarksLi = this.makeMarksDataJSON(this.studentAttList[i].attendance, this.studentAttList[i].batchExamMarksLi);
      if (obj.batchExamMarksLi == false) {
        return false;
      }
      obj.student_course_exam_id = this.studentAttList[i].student_course_exam_id;
      obj.student_id = this.studentAttList[i].student_id;
      if (this.studentAttList[i].assigned) {
        obj.isUpdated = 'Y';
      } else {
        obj.isUpdated = 'N';
        notassignCount++;
      }
      // obj.isUpdated = this.studentAttList[i].isUpdated;
      obj.isOnlineTestUpdate = this.studentAttList[i].isOnlineTestUpdate;
      obj.attendance = this.studentAttList[i].attendance;
      obj.isAttendanceUpdated = this.studentAttList[i].isAttendanceUpdated;
      obj.cours_exam_total_marks = this.studentAttList[i].cours_exam_total_marks;
      if (this.tempData.is_exam_grad_feature == 0) {
        obj.course_exam_marks_obtained = this.studentAttList[i].course_exam_marks_obtained;
      } else {
        // if (this.studentAttList[i].grade_id == '-1') {
        //   this.messageNotifier('error', 'Error', 'Please provide total grades');
        //   return false;
        // }
        obj.grade_id = this.studentAttList[i].grade_id;
      }
      arr.push(obj);
    }
    if (notassignCount == this.studentAttList.length) {
      arr = [];
    }
    return arr;
  }

  fetchAllStudentJson() {
    let arr = [];
    let notassignCount = 0;
    for (let i = 0; i < this.studentAttList.length; i++) {
      let obj: any = {};
      obj.course_exam_schedule_id = this.studentAttList[i].course_exam_schedule_id;
      obj.course_marks_update_level = this.examMarksLevel;
      obj.isStudentExamSMS = 'Y';
      obj.batchExamMarksLi = this.makeMarksDataJSON(this.studentAttList[i].attendance, this.studentAttList[i].batchExamMarksLi);
      if (obj.batchExamMarksLi == false) {
        return false;
      }
      obj.student_course_exam_id = this.studentAttList[i].student_course_exam_id;
      obj.student_id = this.studentAttList[i].student_id;
      obj.cours_exam_total_marks = this.studentAttList[i].cours_exam_total_marks;
      if (this.studentAttList[i].assigned) {
        obj.isUpdated = 'Y';
      } else {
        obj.isUpdated = 'N';
        notassignCount++;
      }
      obj.isOnlineTestUpdate = this.studentAttList[i].isOnlineTestUpdate;
      obj.attendance = this.studentAttList[i].attendance;
      obj.isAttendanceUpdated = this.studentAttList[i].isAttendanceUpdated;
      if (this.tempData.is_exam_grad_feature == 0) {
        obj.course_exam_marks_obtained = this.studentAttList[i].course_exam_marks_obtained;
      } else {
        // if (this.studentAttList[i].grade_id == '-1') {
        //   this.messageNotifier('error', 'Error', 'Please provide total grades');
        //   return false;
        // }
        obj.grade_id = this.studentAttList[i].grade_id;
      }
      if (!this.studentAttList[i].assigned) {
        notassignCount++;
      }
      arr.push(obj);
    }
    if (notassignCount == this.studentAttList.length) {
      arr = [];
    }
    return arr;
  }

  makeMarksDataJSON(attendance, data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let obj: any = {};
      obj.schd_id = data[i].schd_id;
      obj.student_exam_det_id = data[i].student_exam_det_id;
      if (this.tempData.is_exam_grad_feature == 0) {
        obj.marks_obtained = data[i].marks_obtained;
        obj.previous_marks_obtained = data[i].previous_marks_obtained;
      } else {
        obj.grade_id = data[i].grade_id;
        if (obj.grade_id == "-1" && this.examMarksLevel == "1" && attendance == 'P') {
          this.messageNotifier('error', 'Error', 'Please provide grades of subject');
          return false;
        }
      }
      arr.push(obj);
    }
    return arr;
  }

  checkSubjectMarks(student, data, event) {
    let total: number = 0;
    let number = Number(data.marks_obtained);
    if (data.total_marks < number) {
      this.messageNotifier('error', 'Error', 'Please provide mark less than subject total marks');
      data.marks_obtained = 0;
    } else {
      for (let i = 0; i < student.batchExamMarksLi.length; i++) {
        total = Number(student.batchExamMarksLi[i].marks_obtained) + total;
      }
      student.course_exam_marks_obtained = total;
      student.isUpdated = "Y";
    }
  }

  checkTotalMarks(data, event) {
    let number = Number(data.course_exam_marks_obtained);
    if (data.cours_exam_total_marks < number) {
      this.messageNotifier('error', 'Error', 'Please provide mark less than total marks');
      data.course_exam_marks_obtained = 0;
    }
    data.isUpdated = "Y";
  }

  onRadioButtonSelction() {
    if (this.examMarksLevel == "2") {
      if (this.tempData.is_exam_grad_feature == 1) {
        this.studentAttList.forEach(element => {
          element.batchExamMarksLi.forEach(ele => {
            ele.grade_id = '-1';
          });
          element.isUpdated = "Y";
        });
      }
    }
  }

  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }

  markAllCheckBoxClick(event) {
    this.studentAttList.forEach(element => {
      element.assigned = event.target.checked;
    });
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
