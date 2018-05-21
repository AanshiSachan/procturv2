import { Component, OnInit } from '@angular/core';
import { ExamCourseService } from '../../../services/course-services/exam-schedule.service';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { SelectItem } from 'primeng/components/common/api';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';


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
    notify: true
  }
  currentDate: any = moment().format("YYYY-MM-DD");
  courseData = {
    master_course: '',
    course_id: -1,
    requested_date: moment().format("YYYY-MM-DD")
  }
  types: SelectItem[] = [
    { label: 'Course', value: 'course' },
    { label: 'Subject', value: 'subject' }
  ];
  selectedType: string = "course";
  viewList: any = [];
  cancelCourseLevel: boolean = false;
  isRippleLoad: boolean = false;

  constructor(
    private apiService: ExamCourseService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService
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
    this.isRippleLoad = true;
    this.apiService.getCombinedList(this.batchData.standard_id, this.batchData.subject_id).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
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
        this.isRippleLoad = false;
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
      this.isRippleLoad = true;
      this.apiService.getExamSchedule(this.batchData.batch_id).subscribe(
        (res: any) => {
          this.isRippleLoad = false;
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
          this.isRippleLoad = false;
          //console.log(err);
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
    if (this.examScheduleData.is_exam_grad_feature == "0") {
      this.batchAdderData.total_marks = Number(this.batchAdderData.total_marks);
      if (this.batchAdderData.total_marks == 0) {
        this.messageNotifier('error', 'Error', 'Please Provide Total Marks');
        return;
      }
    }
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
    this.batchAdderData = {
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
  }

  addDataToExamSchedule() {
    let dataToSend = this.makeJsonToSendData();
    if (dataToSend == false) {
      return;
    }
    let type: string = "";
    if (this.examScheduleData.otherSchd == 0) {
      type = "post";
    } else if (this.examScheduleData.otherSchd == null) {
      type = "post";
    } else if (this.examScheduleData.otherSchd == undefined) {
      type = "post";
    } else {
      type = "put";
    }
    this.isRippleLoad = true;
    this.apiService.serverRequestToSaveSchedule(dataToSend, type).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Successfully', 'Schedule Created Successfully');
        this.batchModelGoClick();
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
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
        test.exam_date = moment(this.examSchedule[i].exam_date).format('YYYY-MM-DD'),
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
          //console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
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
    this.cancelCourseLevel = false;
    this.cancelExamPopUp = false;
    this.cancelExamData = "";
    this.cancelPopUpData = {
      reason: "",
      notify: true
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
        //console.log(err);
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
    this.isRippleLoad = true;
    this.apiService.fetchStudentList(obj).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        this.studentList = res;
        this.getTotalCountForCourse(res);
        if (res.length > 0) {
          this.attendanceNote = res[0].dateLi[0].attendance_note;
        } else {
          this.attendanceNote = "";
        }
      },
      err => {
        //console.log(err);
        this.isRippleLoad = false;
        this.messageNotifier('error', 'Error', err.error.message);
        this.closeCourseLevelAttendance();
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
    this.isRippleLoad = true;
    let dataToSend = this.makeJsonForAttendceMark();
    this.apiService.markAttendance(dataToSend).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Attendance Marked', 'Attendance Marked Successfully');
        this.closeCourseLevelAttendance();
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
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
          //console.log(err);
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
          //console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  ////////// Course Model 

  getMasterCourseList() {
    this.isRippleLoad = true;
    this.apiService.getMasterCourse().subscribe(
      res => {
        this.isRippleLoad = false;
        this.masterCourseList = res;
      },
      err => {
        console.log(err);
        this.isRippleLoad = false;
      }
    )
  }

  getCourseList(event) {
    this.courseList = [];
    this.courseData.course_id = -1;
    if (event != -1) {
      this.isRippleLoad = true
      this.apiService.fetchCourseListData(this.courseData.master_course).subscribe(
        res => {
          this.isRippleLoad = false;
          this.courseList = res;
        },
        err => {
          console.log(err);
          this.isRippleLoad = false;
        }
      )
    }
  }

  getExamSchedule() {
    if (this.courseData.master_course != "" && this.courseData.course_id != -1) {
      this.isRippleLoad = true;
      this.courseData.requested_date = moment(this.courseData.requested_date).format('YYYY-MM-DD');
      this.apiService.getSchedule(this.courseData).subscribe(
        (res: any) => {
          this.isRippleLoad = false;
          this.examScheduleData = res;
          this.calculateDataAsPerSelection(res);
          this.showContentSection = true;
          //console.log(res);
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    } else {
      this.messageNotifier('error', 'Error', 'Please Provide Mandatory Fields');
    }
  }

  calculateDataAsPerSelection(result) {
    this.viewList = [];
    if (result != null) {
      if (result.coursesList.length > 0) {
        for (let i = 0; i < result.coursesList.length; i++) {
          if (this.courseData.course_id == result.coursesList[i].course_id) {
            let obj: any = {};
            obj.selectedCourseList = result.coursesList[i];
            obj.batchStartDate = result.coursesList[i].start_date;
            obj.batchEndDate = result.coursesList[i].end_date;
            obj.subjectList = result.coursesList[i].batchesList;
            obj.courseModelAdder = {
              start_time: {
                hour: "12 PM",
                minute: '00'
              },
              end_time: {
                hour: "1 PM",
                minute: "00"
              },
              total_marks: 0,
              exam_desc: "",
              room_no: ""
            };
            obj.coursetableAdder = {
              batch_id: -1,
              total_marks: 0
            };
            if (result.coursesList[i].courseClassSchdList != null && result.coursesList[i].courseClassSchdList.length > 0) {
              obj.courseTableList = result.coursesList[i].courseClassSchdList;
              if (result.coursesList[i].courseClassSchdList.length > 0) {
                obj.courseModelAdder.start_time = this.breakTimeFormat(result.coursesList[i].courseClassSchdList[0].start_time);
                obj.courseModelAdder.end_time = this.breakTimeFormat(result.coursesList[i].courseClassSchdList[0].end_time);
                obj.courseModelAdder.exam_desc = result.coursesList[i].courseClassSchdList[0].class_desc;
                obj.courseModelAdder.room_no = result.coursesList[i].courseClassSchdList[0].room_no;
                let total_marks: number = 0;
                result.coursesList[i].courseClassSchdList.forEach(element => {
                  total_marks = Number(element.total_marks) + total_marks;
                })
                obj.courseModelAdder.total_marks = total_marks;
              }
            } else {
              obj.courseTableList = [];
            }
            this.viewList.push(obj);
          }
        }
      }
    }
  }

  addNewExamSubjectCourse(index) {
    if (this.viewList[index].coursetableAdder.batch_id == -1) {
      this.messageNotifier('error', 'Error', 'Please Provide Subject');
      return;
    };
    if (this.viewList[index].selectedCourseList.is_exam_grad_feature == '0') {
      if (this.viewList[index].coursetableAdder.total_marks == 0) {
        this.messageNotifier('error', 'Error', 'Please Provide Marks');
        return;
      }
    }
    let obj: any = {};
    obj.total_marks = this.viewList[index].coursetableAdder.total_marks;
    obj.class_schedule_id = '0';
    let selectedSubject = this.getSubjectName(this.viewList[index].subjectList, this.viewList[index].coursetableAdder.batch_id);
    obj.subject_name = selectedSubject.subject_name;
    obj.batch_id = this.viewList[index].coursetableAdder.batch_id;
    obj.otherData = selectedSubject;
    this.viewList[index].courseTableList.push(obj);
    this.viewList[index].coursetableAdder = {
      batch_id: -1,
      total_marks: 0
    };
  }

  getSubjectName(data, id) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].batch_id == id) {
        return data[i];
      }
    }
  }

  addMoreSchedule() {
    let obj: any = {};
    obj.batchStartDate = this.viewList[0].batchStartDate;
    obj.batchEndDate = this.viewList[0].batchEndDate;
    obj.courseModelAdder = {
      start_time: {
        hour: "12 PM",
        minute: '00'
      },
      end_time: {
        hour: "1 PM",
        minute: "00"
      },
      total_marks: 0,
      exam_desc: "",
      room_no: ""
    };
    obj.coursetableAdder = {
      batch_id: -1,
      total_marks: 0
    };
    obj.selectedCourseList = Object.assign({}, this.viewList[0].selectedCourseList);
    obj.selectedCourseList.course_exam_schedule_id = '-1';
    obj.courseTableList = [];
    obj.subjectList = this.viewList[0].subjectList;
    this.viewList.push(obj);
  }

  deleteFromCourse(data, index, j) {
    this.viewList[j].courseTableList.splice(index, 1);
  }

  saveExamScheduleCourse() {
    let dataToSend = this.makeDataJsonToSendServer();
    if (dataToSend == false) {
      return;
    }
    this.isRippleLoad = true;
    this.apiService.updateExamSch(dataToSend).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Success', 'Exam Schedule Added Successfully');
        this.getExamSchedule();
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }


  makeDataJsonToSendServer() {
    /// This section makes json for perticular selected course
    let data: any = {};
    let total = 0;
    data.master_course = this.courseData.master_course;
    data.requested_date = moment(this.courseData.requested_date).format('YYYY-MM-DD');
    data.coursesList = [];
    for (let i = 0; i < this.viewList.length; i++) {
      let test: any = {};
      test.course_id = this.viewList[i].selectedCourseList.course_id;
      test.course_exam_schedule_id = this.viewList[i].selectedCourseList.course_exam_schedule_id;
      let check = this.validateTime(this.viewList[i].courseModelAdder.start_time, this.viewList[i].courseModelAdder.end_time);
      if (check == false) {
        return;
      }
      let startTime = this.createTimeInFormat(this.viewList[i].courseModelAdder.start_time.hour, this.viewList[i].courseModelAdder.start_time.minute, '');
      let endTime = this.createTimeInFormat(this.viewList[i].courseModelAdder.end_time.hour, this.viewList[i].courseModelAdder.end_time.minute, '');
      test.exam_start_time = startTime;
      test.exam_end_time = endTime;
      test.courseClassSchdList = [];
      if (this.viewList[i].courseTableList.length > 0) {
        for (let j = 0; j < this.viewList[i].courseTableList.length; j++) {
          let classLi: any = {};
          classLi.batch_id = this.viewList[i].courseTableList[j].batch_id.toString();
          classLi.start_time = startTime;
          classLi.end_time = endTime;
          classLi.class_desc = this.viewList[i].courseModelAdder.exam_desc;
          classLi.duration = check;
          classLi.total_marks = this.viewList[i].courseTableList[j].total_marks.toString();
          classLi.room_no = this.viewList[i].courseModelAdder.room_no;
          classLi.class_schedule_id = this.viewList[i].courseTableList[j].class_schedule_id.toString();
          total += Number(this.viewList[i].courseTableList[j].total_marks);
          test.courseClassSchdList.push(classLi);
        }
        if (total != this.viewList[i].courseModelAdder.total_marks) {
          this.messageNotifier('error', 'Error', 'Please check total marks provided');
          return false;
        }
      }
      total = 0;
      data.coursesList.push(test);
    }

    /// This section makes json for unselected course
    if (this.examScheduleData.coursesList.length > 0) {
      for (let i = 0; i < this.examScheduleData.coursesList.length; i++) {
        if (this.examScheduleData.coursesList[i].course_id != this.courseData.course_id) {
          let unselected: any = {};
          let timeStart: any = null;
          let timeEnd: any = null;
          unselected.course_id = this.examScheduleData.coursesList[i].course_id.toString();
          unselected.courseClassSchdList = [];
          unselected.course_exam_schedule_id = 0;
          if (this.examScheduleData.coursesList[i].courseClassSchdList != null) {
            let courseSch = this.examScheduleData.coursesList[i].courseClassSchdList;
            if (courseSch.length > 0) {
              for (let j = 0; j < courseSch.length; j++) {
                let classLi: any = {};
                timeStart = courseSch[j].start_time;
                timeEnd = courseSch[j].end_time;
                classLi.batch_id = courseSch[j].batch_id.toString();
                classLi.start_time = courseSch[j].start_time;
                classLi.end_time = courseSch[j].end_time;
                classLi.class_desc = courseSch[j].class_desc;
                classLi.duration = courseSch[j].duration;
                classLi.total_marks = courseSch[j].total_marks.toString();
                classLi.room_no = courseSch[j].room_no;
                classLi.class_schedule_id = courseSch[j].class_schedule_id.toString();
                unselected.courseClassSchdList.push(classLi);
              }
              unselected.course_exam_schedule_id = this.examScheduleData.coursesList[i].course_exam_schedule_id.toString();
            }
          }
          unselected.exam_start_time = timeStart;
          unselected.exam_end_time = timeEnd;
          data.coursesList.push(unselected);
        }
      }

    }
    return data;
  }


  ////cancel Exam popup/////

  cancelExamCourse(data, index, j) {
    this.cancelExamPopUp = true;
    this.cancelExamData = this.viewList[j].courseTableList[index];
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
    let obj: any = {
      batch_id: this.cancelExamData.batch_id,
      exam_freq: "OTHER",
      cancelSchd: [{
        schd_id: this.cancelExamData.class_schedule_id,
        exam_desc: this.cancelPopUpData.reason,
        is_notified: notify
      }]
    }
    this.apiService.cancelExamSchedule(obj).subscribe(
      res => {
        this.messageNotifier('success', 'Successfully Cancelled', 'Cancelled Successfully');
        this.closeCancelExamPopUp();
        this.getExamSchedule();
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }

  // cancel Button next to Send Reminder

  cancelExamForFullCourse(data, index) {
    this.cancelExamPopUp = true;
    this.cancelExamData = data;
    this.cancelCourseLevel = true;
  }

  cancelCourseLevelExam() {
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
      course_exam_schedule_id: this.cancelExamData.selectedCourseList.course_exam_schedule_id,
      course_id: this.courseData.course_id,
      is_cancel_notify: notify,
      requested_date: moment(this.courseData.requested_date).format('YYYY-MM-DD')
    }
    this.apiService.cancelExamScheduleCourse(obj).subscribe(
      res => {
        this.messageNotifier('success', 'Successfully Cancelled', 'Cancelled Successfully');
        this.closeCancelExamPopUp();
        this.getExamSchedule();
      },
      err => {
        //console.log(err);
        this.messageNotifier('error', 'Error', err.error.message);
      }
    )
  }



  //Toggle Buttons////

  onChanged(event) {
    this.selectedType = event.value;
  }


  // Send Reminder

  sendReminderForCourse(data, index) {
    if (confirm('Are you sure, You want to notify?')) {
      let obj = {
        course_exam_schedule_id: data.selectedCourseList.course_exam_schedule_id,
        course_id: this.courseData.course_id,
        requested_date: moment(this.courseData.requested_date).format('YYYY-MM-DD')
      }
      this.apiService.sendReminder(obj).subscribe(
        res => {
          this.messageNotifier('success', 'Reminder Sent', 'Reminder Sent Successfull');
        },
        err => {
          //console.log(err);
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  deleteWholeCourse(data, index) {
    this.viewList.splice(index, 1);
  }

  // Helper Function

  validateTime(start, end) {
    let start_time = moment(this.createTimeInFormat(start.hour, start.minute, 'comp'), 'h:mma');
    let end_time = moment(this.createTimeInFormat(end.hour, end.minute, 'comp'), 'h:mma');
    if (!(start_time.isBefore(end_time))) {
      this.messageNotifier('error', 'Error', 'Please provide correct start time and end time');
      return false;
    } else {
      let duration = end_time.diff(start_time, 'minutes');
      return duration;
    }
  }

  breakTimeFormat(time) {
    let obj: any = {};
    obj.hour = time.split(':')[0] + " " + time.split(':')[1].split(' ')[1];
    obj.minute = time.split(':')[1].split(' ')[0];
    return obj;
  }

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
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitute = true;
        } else {
          this.isLangInstitute = false;
        }
      }
    )
  }

}


@Pipe({
  name: 'dateMonthYear'
})
export class DateMonthFormat implements PipeTransform {
  public transform(value) {
    if (value != "" && value != null && value != undefined) {
      return moment(value).format('DD-MMM-YYYY');
    } else {
      return value
    }
  }
}
