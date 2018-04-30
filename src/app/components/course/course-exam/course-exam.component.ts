import { Component, OnInit } from '@angular/core';
import { ExamCourseService } from '../../../services/course-services/exam-schedule.service';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';

@Component({
  selector: 'app-course-exam',
  templateUrl: './course-exam.component.html',
  styleUrls: ['./course-exam.component.scss']
})
export class CourseExamComponent implements OnInit {

  isLangInstitute: boolean = false;
  showContentSection: boolean = false;
  batchData = {
    standard_id: -1,
    subject_id: -1,
    batch_id: -1,
  }
  masterCourseList: any = [];
  courseList: any = [];
  batchesList: any = [];
  examScheduleData: any = [];
  batchAdderData = {
    exam_date: moment().format("YYYY-MM-DD"),
    exam_desc: "",
    start_time: {
      hour: "12 PM",
      minute: '00'
    },
    end_time: {
      hour: "1 PM",
      minute: "00"
    },
    total_marks: 0
  }
  batchStartDate: any = "";
  batchEndDate: any = "";
  cancelledSchedule: any = [];
  examSchedule: any = [];
  times: any[] = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  markAttendancePopUp: boolean = false;
  markAttendanceData: any = "";
  studentList: any = [];
  cancelExamPopUp: boolean = false;
  absentCount: number = 0;
  presentCount: number = 0;
  leaveCount: number = 0;
  attendanceNote: string = "";
  smsAbsenteesChkbx: boolean = false;
  cancelExamData: any = "";
  cancelPopUpData = {
    reason: "",
    notify: false
  }
  currentDate: any = moment().format("YYYY-MM-DD");
  courseData = {
    master_course: '',
    requested_date: moment().format("YYYY-MM-DD")
  }

  constructor(
    private apiService: ExamCourseService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.checkInstituteType();
    this.fetchPrefillData();
  }

  fetchPrefillData() {
    if (this.isLangInstitute) {
      this.getMasterCourseBatchData();
    } else {
      this.getMasterCourseList();
    }
  }

  getMasterCourseBatchData() {
    this.apiService.getCombinedList(this.batchData.standard_id, this.batchData.subject_id).subscribe(
      (res: any) => {
        if (this.masterCourseList.length == 0) {
          this.masterCourseList = res.standardLi;
        }
        if (res.batchLi != null && res.batchLi.length > 0) {
          this.batchesList = res.batchLi;
        }
        if (res.subjectLi != null && res.subjectLi.length > 0) {
          this.courseList = res.subjectLi;
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  onBatchMasterCourseSelection(event) {
    this.batchData.subject_id = -1;
    this.batchData.batch_id = -1;
    this.courseList = [];
    this.batchesList = [];
    this.getMasterCourseBatchData();
  }

  onBatchCourseSelection(event) {
    this.batchData.batch_id = -1;
    if (this.batchData.subject_id != -1) {
      this.batchesList = [];
      this.getMasterCourseBatchData();
    }
  }

  batchModelGoClick() {
    if (this.batchData.batch_id != -1) {
      this.cancelledSchedule = [];
      this.examSchedule = [];
      this.apiService.getExamSchedule(this.batchData.batch_id).subscribe(
        (res: any) => {
          this.showContentSection = true;
          this.examScheduleData = res;
          this.batchStartDate = res.batch_start_date;
          this.batchEndDate = res.batch_end_date;
          if (res.otherSchd != "" && res.otherSchd != null) {
            if (res.otherSchd.length > 0) {
              this.examSchedule = res.otherSchd;
            }
          }
          if (res.cancelSchd != "" && res.cancelSchd != null) {
            if (res.cancelSchd.length > 0) {
              this.cancelledSchedule = res.cancelSchd;
            }
          }
        },
        err => {
          console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    } else {
      if (this.batchData.standard_id == -1) {
        this.messageNotifier('error', 'Error', 'Please Select Master Course, Course and then Batch or Batch');
      }
      else if (this.batchData.subject_id == -1) {
        this.messageNotifier('error', 'Error', 'Please Select Course and then Batch or Batch');
      }
      else if (this.batchData.batch_id == -1) {
        this.messageNotifier('error', 'Error', 'Please Select Batch');
      }
    }
  }

  addNewExamSchedule() {
    this.batchAdderData.total_marks = Number(this.batchAdderData.total_marks);
    if (this.batchAdderData.total_marks > 0) {
      let obj: any = {};
      obj.total_marks = this.batchAdderData.total_marks;
      obj.exam_date = moment(this.batchAdderData.exam_date).format('YYYY-MM-DD');
      let start_time = moment(this.createTimeInFormat(this.batchAdderData.start_time.hour, this.batchAdderData.start_time.minute, 'comp'), 'h:mma');
      let end_time = moment(this.createTimeInFormat(this.batchAdderData.end_time.hour, this.batchAdderData.end_time.minute, 'comp'), 'h:mma');
      if (!(start_time.isBefore(end_time))) {
        this.messageNotifier('error', 'Error', 'Please provide correct start time and end time');
        return false;
      } else {
        obj.start_time = this.createTimeInFormat(this.batchAdderData.start_time.hour, this.batchAdderData.start_time.minute, '');
        obj.end_time = this.createTimeInFormat(this.batchAdderData.end_time.hour, this.batchAdderData.end_time.minute, '');
        obj.duration = end_time.diff(start_time, 'minutes');
      }
      obj.exam_desc = this.batchAdderData.exam_desc;
      obj.schd_id = 0;
      obj.isReferenced = "Y";
      this.examSchedule.push(obj);
    } else {
      this.messageNotifier('error', 'Error', 'Please Provide Total Marks');
      return;
    }
  }

  addDataToExamSchedule() {
    let dataToSend = this.makeJsonToSendData();
    if (dataToSend == false) {
      return;
    }
    let type: string = "";
    if (this.examScheduleData.otherSchd > 0) {
      type = "post";
    } else {
      type = "put";
    }
    this.apiService.serverRequestToSaveSchedule(dataToSend, type).subscribe(
      res => {
        console.log(res);
        this.messageNotifier('success', 'Successfully', 'Schedule Created Successfully');
        this.batchModelGoClick();
      },
      err => {
        console.log(err);
      }
    )
  }

  makeJsonToSendData() {
    let obj: any = {};
    obj.batch_id = this.batchData.batch_id;
    obj.exam_freq = "OTHER";
    obj.otherSchd = [];
    if (this.examSchedule.length > 0) {
      for (let i = 0; i < this.examSchedule.length; i++) {
        let test: any = {};
        test.exam_date = this.examSchedule[i].exam_date;
        test.start_time = this.examSchedule[i].start_time;
        test.end_time = this.examSchedule[i].end_time;
        test.total_marks = this.examSchedule[i].total_marks;
        test.exam_desc = this.examSchedule[i].exam_desc;
        test.isReferenced = this.examSchedule[i].isReferenced;
        test.duration = this.examSchedule[i].duration;
        test.schd_id = this.examSchedule[i].schd_id;
        obj.otherSchd.push(test);
      }
    }
    return obj;
  }

  // Table Action Menu

  deleteExamSchedule(data, index) {
    this.examSchedule.splice(index, 1)
  }

  notifyExamSchedule(data) {
    if (confirm('Are you sure u want to send Exam Schedule SMS to the batch?')) {
      this.apiService.notifyStudentExam(data.schd_id).subscribe(
        res => {
          this.messageNotifier('success', 'Notified', 'Notification Sent Successfully');
        },
        err => {
          console.log(err);
        }
      )
    }
  }

  //cancelExamSchedule 

  cancelExamSchedule(data) {
    this.cancelExamPopUp = true;
    this.cancelExamData = data;
  }

  closeCancelExamPopUp() {
    this.cancelExamPopUp = false;
    this.cancelExamData = "";
    this.cancelPopUpData = {
      reason: "",
      notify: false
    }
  }

  cancelExamClassSchedule() {
    if (this.cancelPopUpData.reason.trim() == "" || null) {
      this.messageNotifier('error', 'Error', 'Please provide cancellation reason');
      return;
    }
    let notify: any = "";
    if (this.cancelPopUpData.notify) {
      notify = "Y";
    } else {
      notify = "N";
    }
    let obj: any = {
      batch_id: this.batchData.batch_id,
      exam_freq: "OTHER",
      cancelSchd: [{
        schd_id: this.cancelExamData.schd_id,
        exam_desc: this.cancelPopUpData.reason,
        is_notified: notify
      }]
    }
    this.apiService.cancelExamSchedule(obj).subscribe(
      res => {
        this.messageNotifier('success', 'Successfully Cancelled', 'Exam Schedule Cancelled Successfully');
        this.batchModelGoClick();
        this.closeCancelExamPopUp();
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  // Mark Attendance Popup

  markAttendanceSchedule(data) {
    this.markAttendancePopUp = true;
    this.markAttendanceData = data;
    this.getStudentList();
  }

  getStudentList() {
    let obj = {
      attendanceSchdId: this.markAttendanceData.schd_id,
      batch_id: this.batchData.batch_id
    }
    this.apiService.fetchStudentList(obj).subscribe(
      (res: any) => {
        this.studentList = res;
        this.getTotalCountForCourse(res);
        if (res.length > 0) {
          this.attendanceNote = res[0].dateLi[0].attendance_note;
        } else {
          this.attendanceNote = "";
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  getDisability(s): boolean {
    if (s.dateLi[0].status == "L" && s.dateLi[0].isStatusModified == "N") {
      return true;
    }
    else {
      return false;
    }
  }

  markAttendaceBtnClickCourse(event, rowData, index) {
    document.getElementById('leaveBtnCourse' + rowData.student_id).classList.remove('classLeaveBtn');
    document.getElementById('absentBtnCourse' + rowData.student_id).classList.remove('classAbsentBtn');
    document.getElementById('presentBtnCourse' + rowData.student_id).classList.remove('classPresentBtn');
    if (event.target.innerText == "L") {
      document.getElementById('leaveBtnCourse' + rowData.student_id).classList.add('classLeaveBtn');
      this.studentList[index].dateLi[0].status = "L";
      this.studentList[index].dateLi[0].isStatusModified = "Y";
    } else if (event.target.innerText == "A") {
      document.getElementById('absentBtnCourse' + rowData.student_id).classList.add('classAbsentBtn');
      this.studentList[index].dateLi[0].status = "A";
      this.studentList[index].dateLi[0].isStatusModified = "Y";
    } else {
      document.getElementById('presentBtnCourse' + rowData.student_id).classList.add('classPresentBtn');
      this.studentList[index].dateLi[0].status = "P";
      this.studentList[index].dateLi[0].isStatusModified = "Y";
    }
    this.getTotalCountForCourse(this.studentList);
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

  getClassForLeave(data) {
    if (data.dateLi[0].status == "L") {
      return "classLeaveBtn";
    } else {
      return "";
    }
  }

  getClassForAbsent(data) {
    if (data.dateLi[0].status == "A") {
      return "classAbsentBtn";
    } else {
      return "";
    }
  }

  getClassForPresent(data) {
    if (data.dateLi[0].status == "P") {
      return "classPresentBtn";
    } else {
      return "";
    }
  }

  closeCourseLevelAttendance() {
    this.markAttendancePopUp = false;
    this.studentList = [];
    this.absentCount = 0;
    this.presentCount = 0;
    this.leaveCount = 0;
    this.attendanceNote = "";
    this.smsAbsenteesChkbx = false;
    this.markAttendanceData = "";
  }

  markAllPresent(e) {
    if (e.target.checked) {
      this.studentList.forEach(e => {
        if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
          //Do Nothing
        } else {
          document.getElementById('leaveBtnCourse' + e.student_id).classList.remove('classLeaveBtn');
          document.getElementById('absentBtnCourse' + e.student_id).classList.remove('classAbsentBtn');
          document.getElementById('presentBtnCourse' + e.student_id).classList.remove('classPresentBtn');
          document.getElementById('presentBtnCourse' + e.student_id).classList.add('classPresentBtn');
          e.dateLi[0].status = "P";
          e.dateLi[0].isStatusModified = "Y";
        }
      });
    }
    else {
      this.studentList.forEach(e => {
        if (e.dateLi[0].status == "L" && e.dateLi[0].isStatusModified == "N") {
          //Do Nothing
        } else {
          document.getElementById('leaveBtnCourse' + e.student_id).classList.remove('classLeaveBtn');
          document.getElementById('absentBtnCourse' + e.student_id).classList.remove('classAbsentBtn');
          document.getElementById('presentBtnCourse' + e.student_id).classList.remove('classPresentBtn');
          e.dateLi[0].status = "A";
          e.dateLi[0].isStatusModified = "Y";
        }
      });
    }
    this.getTotalCountForCourse(this.studentList);
  }

  checkCheckAllChkboxStatus() {
    let check = false;
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].dateLi[0].status == "P") {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    return check;
  }

  updateCourseAttendance() {
    let dataToSend = this.makeJsonForAttendceMark();
    console.log(dataToSend);
    this.apiService.markAttendance(dataToSend).subscribe(
      res => {
        this.messageNotifier('success', 'Attendance Marked', 'Attendance Marked Successfully');
        this.closeCourseLevelAttendance();
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  makeJsonForAttendceMark() {
    let notify: any = "";
    if (this.smsAbsenteesChkbx) {
      notify = "Y";
    } else {
      notify = "N";
    }
    let obj: any = [];
    for (let i = 0; i < this.studentList.length; i++) {
      let test: any = {};
      test.batch_id = this.batchData.batch_id;
      test.isNotify = notify;
      test.student_id = this.studentList[i].student_id;
      test.dateLi = [{
        date: this.studentList[i].dateLi[0].date,
        status: this.studentList[i].dateLi[0].status,
        isStatusModified: this.studentList[i].dateLi[0].isStatusModified,
        attendance_note: this.attendanceNote,
        schId: this.studentList[i].dateLi[0].schId.toString()
      }]
      obj.push(test);
    }
    return obj;
  }


  // Cancel table Action///////

  notifyCancelClass(data) {
    if (confirm('Are you sure, You want to notify?')) {
      let obj = {
        batch_id: this.batchData.batch_id,
        class_schedule_id: data.schd_id,
        is_exam_schedule: 'Y'
      };
      this.apiService.notifyCancelledClass(obj).subscribe(
        res => {
          this.messageNotifier('success', 'Success', 'Notified Successfully');
        },
        err => {
          console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  unCancelClass(data) {
    if (confirm("Are you sure, you want  to uncancel the exam schedule??")) {
      let obj = {
        batch_id: this.batchData.batch_id,
        cancelSchd: [{
          schd_id: data.schd_id
        }]
      };
      this.apiService.uncancelClassSchedule(obj).subscribe(
        res => {
          this.messageNotifier('success', 'Uncancelled Succesfully', 'Exam Uncancelled Successfully');
          this.batchModelGoClick();
        },
        err => {
          console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  ////////// Course Model 

  getMasterCourseList() {
    this.apiService.getMasterCourse().subscribe(
      res => {
        this.masterCourseList = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  getExamSchedule() {
    if (this.courseData.master_course != "") {
      this.apiService.getSchedule(this.courseData).subscribe(
        (res: any) => {
          this.examScheduleData = res;
        },
        err => {
          console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  ////cancel Exam popup/////

  cancelExamCourse() {
    this.cancelExamPopUp = true;
  }

  cancelCourseExam() {
    if (this.cancelPopUpData.reason.trim() == "" || null) {
      this.messageNotifier('error', 'Error', 'Please Provide Cancellation Reason');
      return;
    }
    let notify: any = "";
    if (this.cancelPopUpData.notify) {
      notify = "Y";
    } else {
      notify = "N";
    }
    let obj = {
      cancel_reason: this.cancelPopUpData.reason,
      course_exam_schedule_id: '0',
      course_id: '',
      is_cancel_notify: notify,
      requested_date: this.courseData.requested_date
    }
    this.apiService.cancelExamScheduleCourse(obj).subscribe(
      res => {
        this.messageNotifier('error', 'Error', 'Canelled Successfully');
        this.closeCancelExamPopUp();
      },
      err => {
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }


  // Send Reminder

  sendReminderForCourse(data) {
    if (confirm('Are you sure, You want to notify?')) {
      let obj = {
        course_exam_schedule_id: '',
        course_id: '',
        requested_date: this.courseData.requested_date
      }
      this.apiService.sendReminder(obj).subscribe(
        res => {
          this.messageNotifier('success', 'Reminder Sent', 'Reminder Sent Successfull');
        },
        err => {
          console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  // Helper Function

  createTimeInFormat(hrMeri, minute, format) {
    let time = hrMeri.split(' ');
    if (format == "comp") {
      let t = time[0] + ":" + minute + time[1];
      return t;
    } else {
      let t = time[0] + ":" + minute + " " + time[1];
      return t;
    }
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

  checkInstituteType() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == "LANG") {
      this.isLangInstitute = true;
    } else {
      this.isLangInstitute = false;
    }
  }

}
