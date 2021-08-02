import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { WidgetService } from '../../../services/widget.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { role } from '../../../model/role_features';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  public schedDate: any[] = [];
  mark_attendance_subject_wise: boolean = false;
  schoolModel: boolean = false;
  public isProfessional: boolean = false;
  public selectedRow: number = null;
  isSubjectView: boolean = false;
  courseLevelSchedule: any = [];
  courseLevelSchedDate: any = new Date();
  public schedStat: any = {};
  classScheduleCount: number = 0;
  role_feature = role.features;
  public classMarkedForAction: any;
  classAttendance: any = false;
  exam_marks: any = false;

  constructor(
    private widgetService: WidgetService,
    private auth: AuthenticatorService,
    private router: Router
  ) {
    this.schedDate[0] = new Date();
    this.schedDate[1] = new Date();
  }

  ngOnInit(): void {
    this.classAttendance = (window.location.href.includes('class-attendance'));
    this.mark_attendance_subject_wise = (sessionStorage.getItem('mark_attendance_subject_wise') == 'true') ? true : false;
    this.exam_marks = (window.location.href.includes('exam-marks'));
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.schedDate[0] = moment(this.schedDate[0]).format('YYYY-MM-DD');
    let opt = this.classAttendance ? 'subject' : 'course';
    this.onChanged(opt);
    this.checkForSubjectWiseView();
    this.fetchScheduleWidgetData();
  }

  onChanged(e) {
    this.selectedRow = null;
    if (e == 'course') {
      // this.isSubjectView = false;
      sessionStorage.setItem('isSubjectView', String('false'));
      this.generateCourseLevelWidget();
    }
    if (sessionStorage.getItem('isSubjectView') == 'false') {
      this.isSubjectView = false;
      this.generateCourseLevelWidget();
    } else {
      this.isSubjectView = true;
    }
    sessionStorage.removeItem('isSubjectView');
  }

  getSchedStartDate() {
    return this.schedDate[0];
  }

  getSchedDateForCourse() {
    let date = this.courseLevelSchedDate;
    return date;
  }

  hideVisibilty() {
    let d = moment(this.courseLevelSchedDate).format("YYYY-MM-DD");
    if (d >= moment(new Date()).format("YYYY-MM-DD")) {
      return true;
    }
    else {
      return false;
    }
  }

  initiateMarkAttendance(i, selected, subject_id, topics_covered) {
    let obj = {
      batch_id: selected.batch_id,
      schd_id: selected.schd_id,
      batch_name: selected.batch_name,
      subject_id: subject_id,
      topics_covered: topics_covered,
      course_name: selected.course_name,
      master_course_name: selected.master_course_name,
      forCourseWise: false,
      forSubjectWise: true,
      isExam: false,
      is_attendance_marked: selected.is_attendance_marked
    }
    let batch_info = JSON.stringify(obj);
    sessionStorage.setItem('fromClassAttendace', 'true');
    sessionStorage.setItem('classAttendance', this.classAttendance);
    sessionStorage.setItem('exam_marks',this.exam_marks);
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if (this.isSubjectView || this.isProfessional) {
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else {
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/dashboard/mark-attendance']);


  }

  examMarksUpdateCourse(data) {
    let obj = {
      data: data
    }
    let exam_info = JSON.stringify(obj);
    sessionStorage.setItem('exam_info', btoa(exam_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    sessionStorage.setItem('fromClassAttendace', 'true');
    sessionStorage.setItem('classAttendance', this.classAttendance);
    sessionStorage.setItem('exam_marks',this.exam_marks);
    if (this.isSubjectView || this.isProfessional) {
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else {
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/dashboard/exam-marks']);

  }

  markAttendanceExamCourse(exam) {
    let obj = {
      course_exam_schedule_id: exam.course_exam_schedule_id,
      course_name: exam.course_name,
      master_course_name: exam.master_course,
      batch_name: exam.course_name,
      forCourseWise: true,
      forSubjectWise: false,
      isExam: true,
      schedDate: moment(this.courseLevelSchedDate).format('YYYY-MM-DD'),
      is_attendance_marked: exam.is_attendance_marked
    }
    let batch_info = JSON.stringify(obj);
    sessionStorage.setItem('fromClassAttendace', 'true');
    sessionStorage.setItem('classAttendance', this.classAttendance);
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if (this.isSubjectView || this.isProfessional) {
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else {
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/dashboard/mark-attendance']);

  }

  initiateCourseMarkAttendance(i, selected) {

    let obj = {
      course_id: selected.course_ids,
      startdate: moment(this.courseLevelSchedDate).format("YYYY-MM-DD"),
      batch_name: selected.coursee_names,
      forCourseWise: true,
      forSubjectWise: false,
      course_name: selected.coursee_names,
      master_course_name: selected.master_course,
      isExam: false,
      is_attendance_marked: selected.is_attendance_marked
    }
    let batch_info = JSON.stringify(obj);
    sessionStorage.setItem('fromClassAttendace', 'true');
    sessionStorage.setItem('classAttendance', this.classAttendance);
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if (this.isSubjectView || this.isProfessional) {
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else {
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/dashboard/mark-attendance']);



  }

  getClassListDetails() {
    if (this.schedStat.otherSchd != null && this.schedStat.otherSchd != undefined) {
      return this.schedStat.otherSchd;
    }
    else {
      return [];
    }
  }

  getVisibility(c): boolean {
    let d = moment(c.class_date).format("YYYY-MM-DD");
    if (d >= moment(new Date()).format("YYYY-MM-DD")) {
      return true;
    }
    else {
      return false;
    }
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  updateCourseLevelSched(e) {
    this.generateCourseLevelWidget();
  }

  updateschedByDate(e) {
    let obj = {
      from_date: moment(e).format('YYYY-MM-DD'),
      to_date: moment(e).format('YYYY-MM-DD')
    }
    this.schedDate[0] = moment(e).format('DD MMM YYYY');
    this.schedDate[1] = moment(e).format('DD MMM YYYY');
    this.getAllExamsAndClass(obj);
  }

  markAttendaceHide(row, time) {
    if (!time) {
      time = '';
    }
    row = moment(row).format('YYYY-MM-DD');
    if (moment(row + ' ' + time) > moment(new Date)) {
      return "hide";
    } else {
      return "";
    }
  }

  userScheduleSelected(i, selected) {
    this.selectedRow = i;
    this.classMarkedForAction = selected
  }
  generateCourseLevelWidget() {
    this.courseLevelSchedule = [];
    let obj = {
      inst_id: sessionStorage.getItem('institute_id'),
      requested_date: moment(this.courseLevelSchedDate).format("YYYY-MM-DD")
    }
    if (this.classAttendance) {
      this.auth.showLoader();
      this.widgetService.fetchCourseLevelWidgetData(obj).subscribe(
        res => {
          this.auth.hideLoader();
          let tempArr: any[] = [];
          for (let o in res) {
            let temp = res[o].course_ids.split(',');
            if (temp.length > 1) {
              let length = temp.length;
              let nameArr = res[o].coursee_names.split(',');
              let idArr = res[o].course_ids.split(',');
              let is_attendance_marked = res[o].is_attendance_marked.split(',');
              for (let i = 0; i < length; i++) {
                let tobj = {
                  cancel_reason: res[o].cancel_reason,
                  course_id: res[o].course_id,
                  is_attendance_marked: '',
                  course_ids: "",
                  coursee_names: "",
                  coursesList: res[o].coursesList,
                  end_date: res[o].end_date,
                  inst_id: res[o].inst_id,
                  is_cancel_notify: res[o].is_cancel_notify,
                  master_course: res[o].master_course,
                  course_name: res[o].coursee_names,
                  requested_date: res[o].requested_date,
                  standard_id: res[o].standard_id,
                  standard_name: res[o].standard_name,
                  start_date: res[o].start_date,
                  isExam: false
                }
                tobj.is_attendance_marked = is_attendance_marked[i];
                tobj.course_ids = idArr[i];
                tobj.coursee_names = nameArr[i];
                tempArr.push(tobj);
              }
            }
            else {
              tempArr.push(res[o]);
            }
          }
          this.courseLevelSchedule = [];
          if (tempArr.length > 0) {
            this.courseLevelSchedule = tempArr;
          }
        },
        err => {
          this.auth.hideLoader();
          console.log(err);
        }
      );
    }
    if (!this.classAttendance) {
      this.generateCourseLevelExam();
    }
  }

  generateCourseLevelExam() {
    let obj = {
      start_date: moment(this.courseLevelSchedDate).format('YYYY-MM-DD'),
      end_date: moment(this.courseLevelSchedDate).format('YYYY-MM-DD')
    }
    this.auth.showLoader();
    this.widgetService.getCourseExamFromServer(obj).subscribe(
      (res: any) => {
        this.courseLevelSchedule = [];
        this.auth.hideLoader();
        let dataArray: any = [];
        res.map(ele => {
          if (ele.batchExamSchdList != null) {
            if (ele.batchExamSchdList.length > 0) {
              ele['isExam'] = true;
              dataArray.push(ele);
            }
          }
        })
        let result = this.courseLevelSchedule.concat(dataArray);
        this.courseLevelSchedule = result;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  checkForSubjectWiseView() {
    let subjectView = sessionStorage.getItem('isSubjectView');
    let scheduleDate = sessionStorage.getItem('scheduleDate');   // For schedule date from session storage
    if (subjectView == 'true') {
      this.onChanged('subject');
      this.schedDate[0] = new Date(scheduleDate);
      this.schedDate[1] = new Date(scheduleDate);
    }
    else if (subjectView == 'false') {
      if (this.isProfessional) {
        this.schedDate[0] = new Date(scheduleDate);
        this.schedDate[1] = new Date(scheduleDate);
      }
      else {
        this.courseLevelSchedDate = new Date(scheduleDate);
      }
    }
    sessionStorage.setItem('isSubjectView', '');
    sessionStorage.setItem('scheduleDate', '');
  }

  fetchScheduleWidgetData() {
    let obj = {
      from_date: moment(this.schedDate[0]).format('YYYY-MM-DD'),
      to_date: moment(this.schedDate[0]).format('YYYY-MM-DD')
    }
    this.getAllExamsAndClass(obj);
    if (this.classAttendance) {
      this.widgetService.fetchSchedWidgetData(obj).subscribe(
        res => {
          this.schedStat = res;
        },
        err => {
          // this.grid.refreshItems().layout();
        });
    }
  }

  getAllExamsAndClass(obj) {
    this.schedStat = [];
    if (this.classAttendance) {
      this.auth.showLoader();
      this.widgetService.fetchSchedWidgetData(obj).subscribe(data => {
        this.auth.hideLoader();
        this.schedStat = data;
        this.classScheduleCount = this.schedStat.otherSchd.length;
      }, err => {
        this.auth.hideLoader();
        this.classScheduleCount = 0;
        console.log(err);
      });
    }
    if (this.isProfessional && !this.classAttendance) {
      this.getExamSchedule(obj);
      this.addKeyInData(this.schedStat.otherSchd, "isExam", false);
    }
  }

  getExamSchedule(obj) {
    this.auth.showLoader();
    this.schedStat.otherSchd = [];
    this.widgetService.getExamSchedule(obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.addKeyInData(res.otherSchd, "isExam", true);
        console.log(res);
        let result = this.schedStat.otherSchd.concat(res.otherSchd);
        this.schedStat.otherSchd = this.sortDataByDateTime(result);
        this.classScheduleCount = this.schedStat.otherSchd.length;
      },
      err => {
        this.auth.hideLoader();
        // console.log(err);
      }
    )
  }

  markExamAttendance(i, selected, subject_id, topics_covered) {
    let obj = {
      batch_id: selected.batch_id,
      schd_id: selected.schd_id,
      batch_name: selected.batch_name,
      topics_covered: topics_covered,
      course_name: selected.standard_name,
      master_course_name: selected.batch_name,
      subject_id: subject_id,
      forCourseWise: true,
      forSubjectWise: false,
      isExam: true,
      is_attendance_marked: selected.is_attendance_marked
    }
    let batch_info = JSON.stringify(obj);
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('fromClassAttendace', 'true');
    sessionStorage.setItem('classAttendance', this.classAttendance);
    sessionStorage.setItem('exam_marks',this.exam_marks);
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if (this.isSubjectView || this.isProfessional) {
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else {
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/dashboard/mark-attendance']);
  }

  examMarksUpdate(data) {
    let obj = {
      data: data
    }
    let exam_info = JSON.stringify(obj)
    sessionStorage.setItem('exam_info', btoa(exam_info));
    sessionStorage.setItem('fromClassAttendace', 'true');
    sessionStorage.setItem('classAttendance', this.classAttendance);
    sessionStorage.setItem('exam_marks',this.exam_marks);
    sessionStorage.setItem('isSubjectView', String(this.isSubjectView));
    if (this.isSubjectView || this.isProfessional) {
      sessionStorage.setItem('scheduleDate', String(this.schedDate[0]));
    }
    else {
      sessionStorage.setItem('scheduleDate', String(this.courseLevelSchedDate));
    }
    this.router.navigate(['/view/dashboard/exam-marks-batch']);
  }

  //  Role Based Access
  checkIfUserHadAccess(id) {
    let permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null || permissionArray) {
      return false;
    } else {
      if (id) {
        return false;
      } else {
        return true;
      }
    }
  }

  addKeyInData(data, keyname, value) {
    if (data && data.length > 0) {
      data.forEach(element => {
        element[keyname] = value;
      });
    }
  }

  sortDataByDateTime(data) {
    let arr: any = data;
    this.addKeyInData(arr, 'timeStamp', '');
    arr.map(element => {
      let hr = element.start_time.split(':')[0] + " " + element.start_time.split(':')[1].split(' ')[1];
      let min = element.start_time.split(':')[1].split(' ')[0];
      let t: any;
      if (element.isExam) {
        t = moment(element.exam_date).format('YYYY-MM-DD') + " " + this.convertToFullTimeFormat(hr, min);
      } else {
        t = moment(element.class_date).format('YYYY-MM-DD') + " " + this.convertToFullTimeFormat(hr, min);
      }
      element.timeStamp = moment(t, "YYYY-MM-DD HH:mm");
    });
    arr.sort(function (a, b) {
      return moment(a.timeStamp).unix() - moment(b.timeStamp).unix();
    })
    return arr;
  }

  convertToFullTimeFormat(hr, min) {
    let result: any = "";
    let hour: any;
    let time = hr.split(' ');
    if (time[1] == "AM") {
      if (time[0] == "12") {
        hour = "00";
      } else {
        hour = time[0];
      }
      result = hour + ":" + min;
      return result;
    } else {
      if (time[0] != "12") {
        hour = Number(time[0]) + 12;
      } else {
        hour = Number(time[0]);
      }
      result = hour + ":" + min;
      return result;
    }
  }

}
