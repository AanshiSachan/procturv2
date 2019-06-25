import { Component, OnInit, ViewChild, ElementRef,ViewEncapsulation, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { WidgetService } from '../../../services/widget.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Pipe, PipeTransform } from '@angular/core';

import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of } from 'rxjs/observable/of';
import { TopicListingService } from '../../../services/course-services/topic-listing.service';
import { Observable } from 'rxjs/Observable';
import { TreeItemLookup } from '@progress/kendo-angular-treeview';


@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkAttendanceComponent implements OnInit {

  permissionArray = sessionStorage.getItem('permissions');
  public isProfessional: boolean = false;
  isRippleLoad: boolean = false;
  batch_info: any;
  settingInfo: any = [];

  absentStudentNames: any;
  homeWorkNotDoneStudentNames: any;
  absentPopUp: boolean = false;
  courseLevelExam: any[] = [];
  public classMarkedForAction: any;
  courseLevelStudentAtt: any = [];
  public studentAttList: any = [];
  public teacherListArr: any[] = [];
  public teacher_id: number = -1;
  public home_work_notifn: number = 0;
  public topics_covered_notifn: number = 0;
  public attendanceNote: string = "";
  public homework: string = "";
  studentList: any = [];
  absentCount: number = 0;
  presentCount: number = 0;
  leaveCount: number = 0;
  public AllPresent: boolean = true;
  attendanceCount: number = 50;
  homeworkCount: number = 50;

  // Topic listing variables
  topicBox: boolean = true;
  topicsName: any[] = [];
  selectAllTopics: boolean = false;
  selectedSubId: any;
  subject_id: '';
  public checkedKeys: any[] = [];
  topicUpdated: boolean = false;
  subjectListDataSource: any = [];
  presentSMSNotify: boolean = false;
  notifyAbsentStudent: boolean = true;

  public enableCheck = true;
  public checkChildren = true;
  public checkParents = true;
  public checkOnClick = true;
  public checkMode: any = 'multiple';

  public get checkableSettings(): CheckableSettings {
      return {
          checkChildren: this.checkChildren,
          checkParents: this.checkParents,
          enabled: this.enableCheck,
          mode: this.checkMode,
          checkOnClick: this.checkOnClick
      };
  }

  public topicsData: any;
  public children;
  public hasChildren;
  public isExpanded;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private appC: AppComponent,
    private widgetService: WidgetService,
    private auth: AuthenticatorService,
    private route: ActivatedRoute,
    private topicService: TopicListingService

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

    this.getAttendanceDetails();

  }

  fetchWidgetPrefill() {
    this.widgetService.getSettings().subscribe(
      res => {
        this.settingInfo = res;
      },
      err => {

      }
    )
    this.widgetService.getAllteachers().subscribe(
      res => {
        this.teacherListArr = res;
      },
      err => {

      }
    )
  }

  topicListing(){
    if (this.subject_id == '' || this.subject_id == null || this.subject_id == '-1'|| this.subject_id == undefined) {
      let obj = {
        type: 'error',
        title: 'Error',
        body: 'Please Select Subject'
      }
      this.appC.popToast(obj);
      return;
    }
    else {
      if(!this.topicUpdated){
        if(this.batch_info.topics_covered != null && this.batch_info.topics_covered != ''){
          let res = this.batch_info.topics_covered.split("|");
          for (var i = 0; i < res.length; i++) {
            this.checkedKeys.push(res[i]);
          }
          this.checkedKeys = this.checkedKeys.map(Number);
        }
      }
      this.isRippleLoad = true;
      this.topicService.getAllTopicsSubTopics(this.subject_id).subscribe(
        res => {
          let temp: any;
          temp = res;
          if(temp != null && temp.length != 0){
            this.topicBox = false;
            this.isRippleLoad = false;
            this.topicsData = res;

            let subjectName = "";
            this.subjectListDataSource.forEach(
              ele => {
                if (ele.subject_id == this.subject_id) {
                  subjectName = ele.subject_name;
                }
              }
            )
            document.getElementById("topicSubName").innerHTML = subjectName;
            document.getElementById("topicCount").innerHTML = this.topicsData.length;
            this.children = (dataItem: any) => of(dataItem.subTopic);
            this.hasChildren = (item: any) => item.subTopic && item.subTopic.length > 0;
          }
          else{
            this.isRippleLoad = false;
            let obj = {
              type: 'info',
              title: 'Error',
              body: 'No topics available to Link'
            }
            this.appC.popToast(obj);
          }

        },
        err => {
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: 'Error',
            body: err.error.message
          }
          this.appC.popToast(obj);
        }
      )
    }
  }

  saveTopic(){
    let temp = this.checkedKeys;
    this.topicsName = [];
    let join = temp.join("|");
    let tempTopicData = this.topicsData;
    this.checkedKeys.forEach(
      ele => {
        this.findNameInJSON(this.topicsData, ele);
      }
    )
    for (var i = 0; i < this.topicsName.length; i++) {
      if (this.topicsName[i] == undefined) {
          this.topicsName.splice(i, 1);
      }
    }
    this.topicUpdated = true;
    this.topicBox = true;
  }

  findNameInJSON(arr, nameVal) {
   for (var i = 0; i < arr.length; i++) {
       var item = arr[i];
       if (item.topicId.toString() == nameVal.toString()) {
           this.topicsName.push(item.topicName)
       }
       if (item.subTopic.length > 0) {
           this.findNameInJSON(item.subTopic, nameVal);
       }
     }
  }

  closeAlert(){
    this.topicBox = true;
  }

  getAttendanceDetails(){

    let encryptedData = sessionStorage.getItem('batch_info');
    let data = atob(encryptedData)
    this.batch_info = JSON.parse(data);

    this.subject_id = this.batch_info.subject_id;
    // this.checkedKeys = this.batch_info.topics_covered;

  // FOR SUBJECT WISE
    if(this.batch_info.forSubjectWise && !this.batch_info.isExam){
      this.isRippleLoad = true;
      if (!this.isProfessional) {
        let obj = {
          batch_id: this.batch_info.batch_id,
          type: 2,
          attendanceSchdId: this.batch_info.schd_id
        }
        this.widgetService.getAttendance(obj).subscribe(
          res => {
            // this.subject_id = res.
            console.log(res);
            res.forEach(e => {
              e.attendance_note = "";
              e.date = "";
              e.home_work_status = "Y";
              e.homework_assigned = "";
              e.isStatusModified = "N";
              e.is_home_work_status_changed = "N";
              e.isStatusModified = "N";
              if (e.dateLi[0].status == "L") {
                e.dateLi[0].serverStatus = "L";
              } else {
                e.dateLi[0].serverStatus = "";
              }
            })
            this.studentAttList = res;
            this.home_work_notifn = res[0].home_work_notifn;
            this.topics_covered_notifn = res[0].topics_covered_notifn;
            this.teacher_id = res[0].dateLi[0].teacher_id;
            this.isRippleLoad = false;
            this.attendanceNote = res[0].dateLi[0].attendance_note;
            this.homework = res[0].dateLi[0].homework_assigned;
            this.getCountOfAbsentPresentLeave(res);
          },
          err => {
            this.isRippleLoad = false;
            let obj = {
              type: 'info',
              title: 'No Student In Batch',
              body: ""
            }
            this.appC.popToast(obj);
          }
        )
      }
      else {
        let obj = {
          batch_id: this.batch_info.batch_id,
          type: 2,
          attendanceSchdId: this.batch_info.schd_id
        }
        this.widgetService.getAttendance(obj).subscribe(
          res => {
            res.forEach(e => {
              e.attendance_note = "";
              e.date = "";
              e.home_work_status = "Y";
              e.homework_assigned = "";
              e.isStatusModified = "N";
              e.is_home_work_status_changed = "N";
              e.isStatusModified = "N";
              if (e.dateLi[0].status == "L") {
                e.dateLi[0].serverStatus = "L";
              } else {
                e.dateLi[0].serverStatus = "";
              }
            })
            this.studentAttList = res;
            this.home_work_notifn = res[0].home_work_notifn;
            this.topics_covered_notifn = res[0].topics_covered_notifn;
            this.teacher_id = res[0].dateLi[0].teacher_id;;
            this.isRippleLoad = false;
            this.attendanceNote = res[0].dateLi[0].attendance_note;
            this.homework = res[0].dateLi[0].homework_assigned;
            this.getCountOfAbsentPresentLeave(res);
          },
          err => {
            this.isRippleLoad = false;
            let msg = {
              type: 'error',
              title: 'Error',
              body: err.error.message
            }
            this.appC.popToast(msg);
          }
        )
      }
    }
//   FOR COURSE WISE
    if(this.batch_info.forCourseWise && !this.batch_info.isExam){
      let obj = {
        course_id: this.batch_info.course_id,
        startdate: this.batch_info.startdate
      }

      if (this.batch_info.course_id != null && this.batch_info.course_id != undefined) {
        this.widgetService.fetchCourseAttendance(obj).subscribe(
          (res: any) => {
            // this.subject_id = res.
            res.forEach(e => {
              if (e.dateLi[0].status == "L") {
                e.dateLi[0].serverStatus = "L";
              } else {
                e.dateLi[0].serverStatus = "";
              }
            })
            this.courseLevelStudentAtt = res;
            this.studentAttList = res;
            this.getTotalCountForCourse(res);
          },
          err => {
            let msg = {
              type: 'error',
              title: 'Error',
              body: err.error.message
            }
            this.appC.popToast(msg);
          }
        );
      }
    }
    // FOR EXAM WISE
    if(this.batch_info.forCourseWise && this.batch_info.isExam){
      // this.generateCourseLevelExam();
      if(this.isProfessional){
        this.getExamStudentListForBatchModel(this.batch_info.schd_id, this.batch_info.batch_id);
      }
      else{
        this.getExamStudentList(this.batch_info.course_exam_schedule_id);
      }

    }


  }

  generateCourseLevelExam() {
    let obj = {
      start_date: moment(this.batch_info.schedDate).format('YYYY-MM-DD'),
      end_date: moment(this.batch_info.schedDate).format('YYYY-MM-DD')
    }
    this.widgetService.getCourseExamFromServer(obj).subscribe(
      (res: any) => {
        let dataArray: any = [];
        res.map(ele => {
          if (ele.batchExamSchdList != null) {
            if (ele.batchExamSchdList.length > 0) {
              ele['isExam'] = true;
              dataArray.push(ele);
            }
          }
        })

        this.courseLevelExam = dataArray;
      },
      err => {
        console.log(err);
      }
    )
  }

  getExamStudentList(id) {
      this.isRippleLoad = true;
      this.widgetService.getExamStudentsList(id).subscribe(
        res => {
          this.isRippleLoad = false;
          this.studentAttList = this.addKeys(res, false);
          this.getCountOfAbsentPresentLeaveForExam(res);
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

  getExamStudentListForBatchModel(schdId, batch_id){
      this.isRippleLoad = true;
      let obj = {
        attendanceSchdId: schdId,
        batch_id: batch_id
      }
      this.widgetService.fetchStudentList(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          this.studentAttList = res;
          this.getCountOfAbsentPresentLeave(res);
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

  getCountOfAbsentPresentLeaveForExam(data) {
    this.absentCount = 0;
    this.presentCount = 0;
    this.leaveCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].attendance == "P") {
        this.presentCount++;
      } else if (data[i].attendance == "A") {
        this.absentCount++;
      } else {
        this.leaveCount++;
      }
    }
    if (this.studentAttList.length == this.presentCount) {
      this.AllPresent = true;
    } else {
      this.AllPresent = false;
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



    getCountOfAbsentPresentLeave(data) {
      this.absentCount = 0;
      this.presentCount = 0;
      this.leaveCount = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].dateLi[0].status == "P") {
          this.presentCount++;
        } else if (data[i].dateLi[0].status == "A") {
          this.absentCount++;
        } else {
          this.leaveCount++;
        }
      }
      if (this.studentAttList.length == this.presentCount) {
        this.AllPresent = true;
      } else {
        this.AllPresent = false;
      }
    }

    backToHome(){
      sessionStorage.setItem('batch_info', '');
      this.router.navigate(['/view/home/admin']);
    }

    closeAttendance() {
      this.attendanceNote = "";
      this.homework = "";
      this.studentAttList.forEach(e => {
        e.dateLi[0].serverStatus = "P";
        e.dateLi[0].home_work_status = "N";
      })
      this.home_work_notifn = null;
      this.topics_covered_notifn = null;
      this.teacher_id = null;
      this.AllPresent = true;
      this.getCountOfAbsentPresentLeave(this.studentAttList);
    }

    updateHomework(e) {
      if (e.target.checked) {
        this.home_work_notifn = 1;
        this.studentAttList.forEach(e => {
          e.home_work_notifn = this.home_work_notifn;
        });
      }
      else {
        this.home_work_notifn = 0;
        this.studentAttList.forEach(e => {
          e.home_work_notifn = this.home_work_notifn;
        });
      }
    }

    updateTopicCovered(e) {
      if (e.target.checked) {
        this.topics_covered_notifn = 1;
        this.studentAttList.forEach(e => {
          e.topics_covered_notifn = this.topics_covered_notifn;
        });
      }
      else {
        this.topics_covered_notifn = 0;
        this.studentAttList.forEach(e => {
          e.topics_covered_notifn = this.topics_covered_notifn;
        });
      }
    }

    markAllPresent(e) {
      if (e.target.checked) {
        this.studentAttList.forEach(e => {
          if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
            //Do Nothing
          } else {

            e.dateLi[0].status = "P";
            e.dateLi[0].home_work_status = "Y"
            e.dateLi[0].isStatusModified = "Y"
          }
        });
      }
      else {
        this.studentAttList.forEach(e => {
          if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
            //Do Nothing
          } else {

            e.dateLi[0].status = "A";
            e.dateLi[0].home_work_status = "N"
            e.dateLi[0].isStatusModified = "Y"
          }
        });
      }
      this.getCountOfAbsentPresentLeave(this.studentAttList);
    }

    getAbsentStudentNames(data) {
      let arr = [];
      if(this.batch_info.forCourseWise && this.batch_info.isExam){
        if(this.isProfessional){
          for (let i = 0; i < data.length; i++) {
            if (data[i].dateLi[0].status == "A" && data[i].dateLi[0].isStatusModified == 'Y') {
              arr.push(data[i].student_name);
            }
          }
        }
        else{
          for (let i = 0; i < data.length; i++) {
            if (data[i].attendance == "A" && data[i].isAttendanceUpdated == 'Y') {
              arr.push(data[i].student_name)
            }
          }
        }
      }
      else{
        for (let i = 0; i < data.length; i++) {
          if (data[i].dateLi[0].status == "A" && data[i].dateLi[0].isStatusModified == 'Y') {
            arr.push(data[i].student_name);
          }
        }
      }

      return arr;
    }

    getHomeWorkNotDoneStudentNames(data){
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        if ((data[i].dateLi[0].home_work_status == "N" || data[i].dateLi[0].home_work_status == "NC")  && data[i].dateLi[0].is_home_work_status_changed == 'Y' && data[i].dateLi[0].status == "P") {
          arr.push(data[i].student_name)
        }
      }
      return arr;
    }

    checkIfStudentIsAbsent(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].dateLi[0].status == "A") {
          return true;
        }
      }
      return false;
    }

    updateAttendance() {

      if(this.batch_info.forCourseWise && !this.batch_info.isExam){
        this.updateCourseAttendance();
      }
      else if(this.batch_info.forCourseWise && this.batch_info.isExam){
        this.markAttCourseExam();
      }
      else{
        if (this.homework != null && this.homework != "") {
          if (this.validateSpecialCharacters(this.homework)) {
            // Do nothing
          } else {
            let obj = {
              type: 'error',
              title: 'Error',
              body: 'Special characters are not allowed in homework field'
            }
            this.appC.popToast(obj);
            return
          }
        }

        let check = this.checkIfStudentIsAbsent(this.studentAttList);
        if (this.settingInfo.sms_absent_notification != 0 && check) {
          let names = this.getAbsentStudentNames(this.studentAttList);
          let homework = this.getHomeWorkNotDoneStudentNames(this.studentAttList);
          if(names.length > 0 || homework.length > 0){
            this.absentPopUp = true;
            this.homeWorkNotDoneStudentNames = homework;
            this.absentStudentNames = names;
          }
          else{
            this.markAttendanceServerCall("N");
          }
        }
        else if(this.settingInfo.home_work_status_notification != 1){
          let names = this.getAbsentStudentNames(this.studentAttList);
          let homework = this.getHomeWorkNotDoneStudentNames(this.studentAttList);
          if(homework.length > 0){
            this.absentPopUp = true;
            this.absentStudentNames = names;
            this.homeWorkNotDoneStudentNames = homework;
          }
          else{
            this.markAttendanceServerCall("N");
          }
        }
        else {
          this.markAttendanceServerCall("N");
        }
      }

    }

    markAttendanceServerCall(sendSms) {

      this.isRippleLoad = true;
      let arr = [];
      this.studentAttList.forEach(e => {
        let arrDateLi = []; // as per v1 only single dateli array object will send --laxmi
        e.dateLi[0] = Object.assign({}, this.getCustomAttendanceObject(e.dateLi[0], e));
        arrDateLi.push(e.dateLi[0]);
        let tempKeys = this.checkedKeys;

        let presentStudentNotify = '';
        if(this.presentSMSNotify){
          presentStudentNotify = 'Y';
        }
        else{
          presentStudentNotify = 'N';
        }

        if(this.batch_info.forSubjectWise){
          let topic_covered_notification = 0;
          if(e.dateLi[0].status == 'A' && e.dateLi[0].isStatusModified == 'Y'){
            topic_covered_notification = 1;
          }
          let temp = {
            batch_id: this.batch_info.batch_id,
            dateLi: arrDateLi,
            home_work_notifn: e.home_work_notifn,
            isNotify: sendSms,
            is_home_work_enabled: e.is_home_work_enabled,
            student_id: e.student_id.toString(),
            topics_covered_notifn: topic_covered_notification,
            topics_covered: tempKeys.join("|"),
            isSMSNotificationToPresentStudents: presentStudentNotify
          };
          arr.push(temp);
        }
        else if(this.batch_info.forCourseWise && !this.batch_info.isExam){
          let temp = {
            batch_id: this.batch_info.batch_id,
            dateLi: arrDateLi,
            home_work_notifn: e.home_work_notifn,
            isNotify: sendSms,
            is_home_work_enabled: e.is_home_work_enabled,
            student_id: e.student_id.toString(),
            topics_covered_notifn: e.topics_covered_notifn,
            isSMSNotificationToPresentStudents: presentStudentNotify
          };
          arr.push(temp);
        }
      });
      this.isRippleLoad = true;
      this.widgetService.updateAttendance(arr).subscribe(
        res => {
          this.isRippleLoad = false;
          let msg = {
            type: 'success',
            title: 'Attendance Updated Successfully',
            body: res.message
          }
          this.appC.popToast(msg);
          this.backToHome();
          // this.closeAttendance();
          // this.fetchScheduleWidgetData();
        },
        err => {
          this.isRippleLoad = false;
          let msg = {
            type: 'error',
            title: 'Failed To Update Attendance',
            body: err.error.message
          }
          this.appC.popToast(msg);
        }
      )
    }

    getCustomAttendanceObject(d, detail): any {
      let obj: any = {
        attendance_note: this.attendanceNote,
        date: d.date,
        home_work_status: d.home_work_status,
        homework_assigned: this.homework,
        isStatusModified: d.isStatusModified,
        is_home_work_status_changed: d.is_home_work_status_changed,
        schId: d.schId,
        status: d.status,
        teacher_id: this.teacher_id,
      }
      if (d.schId) {
        obj['schId'] = d.schId.toString();
      }
      if (this.teacher_id) {
        obj['teacher_id'] = this.teacher_id.toString();
      }
      return obj;
    }

    getCustomCourseLevelAttendanceObject(d, detail): any {
      let obj = {
        date: moment(new Date()).format("YYYY-MM-DD"),
        home_work_status: detail.home_work_status,
        isStatusModified: "Y",
        is_home_work_status_changed: d.is_home_work_status_changed,
        status: d.status,
      }

      return obj;
    }

    updateCourseAttendance() {

      let isNotify = 'N';
      let checkAbsent = this.checkIfStudentIsAbsent(this.courseLevelStudentAtt);
      if (checkAbsent && this.settingInfo.sms_absent_notification != 0) {
        let names = this.getAbsentStudentNames(this.studentAttList);
        let homework = this.getHomeWorkNotDoneStudentNames(this.studentAttList);
        if(names.length > 0 || homework.length > 0){
          this.absentPopUp = true;
          this.absentStudentNames = names;
          this.homeWorkNotDoneStudentNames = homework;
        }
        // else if(homework.length > 0){
        //   this.absentPopUp = true;
        //   this.absentStudentNames = names;
        //   this.homeWorkNotDoneStudentNames = homework;
        // }
        else{
          this.makeServerCallForUpdateMarks('N');
        }
      }
      else if(this.settingInfo.home_work_status_notification != 1){
        let homework = this.getHomeWorkNotDoneStudentNames(this.studentAttList);
        let names = this.getAbsentStudentNames(this.studentAttList);
        if(homework.length > 0){
          this.absentPopUp = true;
            this.absentStudentNames = names;
          this.homeWorkNotDoneStudentNames = homework;
        }
        else{
          this.makeServerCallForUpdateMarks('N');
        }

      }
       else {
        this.makeServerCallForUpdateMarks(isNotify);
      }
    }

    makeServerCallForUpdateMarks(isNotify) {
      let arr = [];
      let presentStudentNotify = '';
      if(this.presentSMSNotify){
        presentStudentNotify = 'Y';
      }
      else{
        presentStudentNotify = 'N';
      }
      this.courseLevelStudentAtt.forEach(element => {
        let temp = {
          "student_id": element.student_id,
          "course_id": this.batch_info.course_id,
          "dateLi": [{
            "date": moment(this.batch_info.startdate).format("YYYY-MM-DD"),
            "status": element.dateLi[0].status,
            "isStatusModified": element.dateLi[0].isStatusModified,
            "home_work_status": element.dateLi[0].home_work_status,
            "is_home_work_status_changed": element.dateLi[0].is_home_work_status_changed
          }],
          "isSMSNotificationToPresentStudents": presentStudentNotify,
          "isNotify": isNotify,
          "is_home_work_enabled": element.is_home_work_enabled,
        }
        arr.push(temp);
      });
      this.isRippleLoad = true;
      this.widgetService.updateCourseAttendance(arr).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Attendance Updated',
            body: res.message
          }
          this.isRippleLoad = false;
          this.appC.popToast(msg);
          this.backToHome();
        },
        err => {
          let msg = {
            type: 'error',
            title: 'Failed To Update Attendance',
            body: err.message
          }
          this.isRippleLoad = false;
          this.appC.popToast(msg);
        }
      )
    }


    isHomeworkStatusChanged(i) {
      // this.studentAttList[i].dateLi[0].isStatusModified = "Y";
      this.studentAttList[i].dateLi[0].is_home_work_status_changed = "Y";
    }

    // showUploadCourseMarksSection() {
    //   this.examMerkMassUpload = true;
    // }

    markAttendaceBtnClick(event, rowData, index) {
      if (event.target.innerText == "L") {
        rowData.dateLi[0].status = "L";
        rowData.dateLi[0].home_work_status = "N";
      } else if (event.target.innerText == "A") {
        rowData.dateLi[0].status = "A";
        rowData.dateLi[0].home_work_status = "N";
      } else {
        rowData.dateLi[0].status = "P";
        rowData.dateLi[0].home_work_status = "Y";
      }
      rowData.dateLi[0].isStatusModified = "Y";
      this.getCountOfAbsentPresentLeave(this.studentAttList);
    }

    markAttendaceBtnClickCourse(event, rowData, index) {
      switch (event.target.innerText) {
        case "L": {
          this.courseLevelStudentAtt[index].dateLi[0].status = "L";
          this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "N";
          this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
          break;
        }
        case "A": {
          this.courseLevelStudentAtt[index].dateLi[0].status = "A";
          this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "N";
          this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
          break;
        }
        default: {
          this.courseLevelStudentAtt[index].dateLi[0].status = "P";
          this.courseLevelStudentAtt[index].dateLi[0].isStatusModified = "Y";
          this.courseLevelStudentAtt[index].dateLi[0].home_work_status = "Y";
        }
      }

      this.getTotalCountForCourse(this.courseLevelStudentAtt);
    }

    getTotalCountForCourse(data) {
      this.absentCount = 0;
      this.presentCount = 0;
      this.leaveCount = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].dateLi[0].status == "P") {
          this.presentCount++;
        } else if (data[i].dateLi[0].status == "A") {
          this.absentCount++;
        } else {
          this.leaveCount++;
        }
      }
    }

    getCourseHomeworkData(i): string {
      return this.courseLevelStudentAtt[i].dateLi[0].home_work_status;
    }

    isCourseHomeworkStatusChanged(ev, i) {
      this.courseLevelStudentAtt[i].dateLi[0].home_work_status = ev;
      this.courseLevelStudentAtt[i].dateLi[0].is_home_work_status_changed = "Y";
    }

    validateSpecialCharacters(str) {
      let regex = /[^ a-zA-Z0-9.,]/g;
      if (str.match(regex) == null) {
        return true;
      } else {
        return false;
      }
    }

    // FOR EXAM Attendance

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

    markAllCheckBoxClick(event) {
      this.studentAttList.forEach(element => {
        element.assigned = event.target.checked;
      });
    }

    markAttendaceExamCourse(event, rowData, index) {
      if (event.target.innerText == "L") {
        this.studentAttList[index].attendance = "L";
        this.studentAttList[index].isAttendanceUpdated = "Y";
      } else if (event.target.innerText == "A") {
        this.studentAttList[index].attendance = "A";
        this.studentAttList[index].isAttendanceUpdated = "Y";
      } else {
        this.studentAttList[index].attendance = "P";
        this.studentAttList[index].isAttendanceUpdated = "Y";
      }
      this.getCountOfAbsentPresentLeaveForExam(this.studentAttList);
    }

    markAttendaceExam(event, rowData, index) {
      if (event.target.innerText == "L") {
        this.studentAttList[index].dateLi[0].status = "L";
        this.studentAttList[index].dateLi[0].isStatusModified = "Y";
      } else if (event.target.innerText == "A") {
        this.studentAttList[index].dateLi[0].status = "A";
        this.studentAttList[index].dateLi[0].isStatusModified = "Y";
      } else {
        this.studentAttList[index].dateLi[0].status = "P";
        this.studentAttList[index].dateLi[0].isStatusModified = "Y";
      }
      this.getTotalCountForCourse(this.studentAttList);
    }

    markAttCourseExam() {

      let absectCount = 0;
      if(this.isProfessional){
        this.studentAttList.forEach(element => {
          element.dateLi.forEach(obj => {
            if (obj.status == "A") {
              absectCount++;
            }
          });
        });
      }

      else{
        this.studentAttList.forEach(element => {
          if (element.attendance == "A") {
            absectCount++;
          }
        });
      }

      if (this.settingInfo.sms_absent_notification != 0 && absectCount != 0) {
        let names = this.getAbsentStudentNames(this.studentAttList);
        if(names.length > 0){
          this.absentPopUp = true;
          this.absentStudentNames = names;
        }
        else{
          this.makeServerCallForExamUpdate('N');
        }
      }
      else {
        this.makeServerCallForExamUpdate('N');
      }
    }

    makeServerCallForExamUpdate(notify) {
      let data;
      if(this.isProfessional){
        data = this.makeJsonForAttendceMark(notify);
      }
      else{
        data = this.constructJsonForAttendance(notify);
      }

      if (data.length == 0) {
        let msg = {
          type: 'error',
          title: 'Error',
          body: 'Please select student from student list'
        }
        this.appC.popToast(msg);
        return;
      }
      // console.log(data)
      if(this.isProfessional){
        this.isRippleLoad = true;
        this.widgetService.markAttendance(data).subscribe(
          res => {
            this.isRippleLoad = false;
            let msg = {
              type: 'success',
              title: 'Marked',
              body:'Attendance Marked Successfully'
            }
            this.appC.popToast(msg);
            this.backToHome();
          },
          err => {
            this.isRippleLoad = false;
            let msg = {
              type: 'error',
              title: 'Error',
              body: err.error.message
            }
            this.appC.popToast(msg);
          }
        )
      }
      else{
        this.isRippleLoad = true;
        this.widgetService.markStudentAttendance(data).subscribe(
          res => {
            this.isRippleLoad = false;
            let msg = {
              type: 'success',
              title: 'Marked',
              body:'Attendance Marked Successfully'
            }
            this.appC.popToast(msg);
            this.backToHome();
          },
          err => {
            this.isRippleLoad = false;
            let msg = {
              type: 'error',
              title: 'Error',
              body: err.error.message
            }
            this.appC.popToast(msg);
          }
        )
      }

    }

    constructJsonForAttendance(absentKey) {
      let arr = [];
      for (let i = 0; i < this.studentAttList.length; i++) {
        let obj: any = {};
        obj.course_exam_schedule_id = this.studentAttList[i].course_exam_schedule_id;
        // if (this.tempData.course_marks_update_level == '0') {
        //   obj.course_marks_update_level = '3';
        // } else {
        //   obj.course_marks_update_level = this.tempData.course_marks_update_level;
        // }
        obj.course_marks_update_level = '3';
        obj.isStudentExamSMS = absentKey;
        if(this.isProfessional){
          obj.batchExamMarksLi = this.makeDataJSON(this.studentAttList[i].dateLi);
        }
        else{
          obj.batchExamMarksLi = this.makeDataJSON(this.studentAttList[i].batchExamMarksLi);
        }
        obj.student_course_exam_id = this.studentAttList[i].student_course_exam_id;
        obj.student_id = this.studentAttList[i].student_id;
        obj.isOnlineTestUpdate = this.studentAttList[i].isOnlineTestUpdate;
        obj.attendance = this.studentAttList[i].attendance;
        obj.isAttendanceUpdated = this.studentAttList[i].isAttendanceUpdated;
        obj.course_exam_marks_obtained = this.studentAttList[i].course_exam_marks_obtained;
        if (this.studentAttList[i].assigned) {
          obj.isUpdated = 'Y';
        } else {
          obj.isUpdated = 'N';
        }

        if(this.presentSMSNotify){
          obj.isSMSNotificationToPresentStudents = 'Y'
        }
        else{
          obj.isSMSNotificationToPresentStudents = 'N'
        }
        arr.push(obj);
      }
      return arr;
    }

    makeJsonForAttendceMark(notify) {
      let obj: any = [];
      for (let i = 0; i < this.studentAttList.length; i++) {
        let test: any = {};
        test.batch_id = this.batch_info.batch_id;
        test.isNotify = notify;
        test.student_id = this.studentAttList[i].student_id;
        if(this.presentSMSNotify){
          test.isSMSNotificationToPresentStudents = 'Y';
        }
        else{
          test.isSMSNotificationToPresentStudents = 'N';
        }
        test.dateLi = [{
          date: this.studentAttList[i].dateLi[0].date,
          status: this.studentAttList[i].dateLi[0].status,
          isStatusModified: this.studentAttList[i].dateLi[0].isStatusModified,
          attendance_note: this.attendanceNote,
          schId: this.studentAttList[i].dateLi[0].schId.toString()
        }]
        obj.push(test);
      }
      return obj;
    }

    makeDataJSON(data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let obj: any = {};
        obj.schd_id = data[i].schd_id;
        obj.student_exam_det_id = data[i].student_exam_det_id;
        obj.marks_obtained = data[i].marks_obtained;
        obj.previous_marks_obtained = data[i].previous_marks_obtained;
        arr.push(obj);
      }
      return arr;
    }

    // closeAttendance(){
    //   this.router.navigate(['/view/home/admin']);
    // }

    countAttendanceLimit(){
      this.attendanceCount = 50 - this.attendanceNote.length;
    }

    countHomeworkLimit(){
      this.homeworkCount = 50 - this.homework.length;
    }

    closeAbsentPopUp(){
      this.absentStudentNames = "";
      this.homeWorkNotDoneStudentNames = "";
      this.absentPopUp = false;
    }


    updateMarks(){
      if(this.notifyAbsentStudent){
        this.makeServerCallForUpdateMarks('Y');
      }
      else{
        this.makeServerCallForUpdateMarks('N');
      }

    }

    examUpdate(){
      if(this.notifyAbsentStudent){
        this.makeServerCallForExamUpdate('Y');
      }
      else{
        this.makeServerCallForExamUpdate('N');
      }

    }

    markAttendance(){
      if(this.notifyAbsentStudent){
        this.markAttendanceServerCall('Y');
      }
      else{
        this.markAttendanceServerCall('N');
      }

    }

    closePopUp(){
      this.absentPopUp = false;
    }


}
