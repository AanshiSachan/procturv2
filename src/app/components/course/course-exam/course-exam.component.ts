import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ExamCourseService } from '../../../services/course-services/exam-schedule.service';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { SelectItem } from 'primeng/components/common/api';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';

import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of } from 'rxjs/observable/of';
import { TopicListingService } from '../../../services/course-services/topic-listing.service';
import { Observable } from 'rxjs/Observable';
import { TreeItemLookup } from '@progress/kendo-angular-treeview';


@Component({
  selector: 'app-course-exam',
  templateUrl: './course-exam.component.html',
  styleUrls: ['./course-exam.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CourseExamComponent implements OnInit {

  masterCourseList: any = [];
  courseList: any = [];
  batchesList: any = [];
  examScheduleData: any = [];
  cancelledSchedule: any = [];
  studentList: any = [];
  examSchedule: any = [];
  viewList: any = [];
  subjectListData: any[] = [];
  newExamSubjectData: any = [];
  subjectListDataSource: any = [];
  edit_subject_topicId: any[];
  subject_topics: any[] = [];
  row_edit_subject_topicId: any[] = [];
  public checkedKeys: any[] = [];
  topicsName: any[] = [];
  isLangInstitute: boolean = false;
  showContentSection: boolean = false;
  showCourseStartEndDate: boolean = false;
  markAttendancePopUp: boolean = false;
  cancelExamPopUp: boolean = false;
  smsAbsenteesChkbx: boolean = false;
  absentCount: number = 0;
  presentCount: number = 0;
  leaveCount: number = 0;
  attendanceNote: string = "";
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

  batchData = {
    standard_id: -1,
    subject_id: -1,
    batch_id: -1,
  }

  cancelPopUpData = {
    reason: "",
    notify: true
  }

  courseData = {
    master_course: '-1',
    course_id: -1,
    requested_date: moment().format("YYYY-MM-DD")
  }
  types: SelectItem[] = [
    { label: 'Course', value: 'course' },
    { label: 'Subject', value: 'subject' }
  ];
  batchStartDate: any = "";
  batchEndDate: any = "";
  markAttendanceData: any = "";
  cancelExamData: any = "";
  times: any[] = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  selectedType: string = "course";
  currentDate: any = moment().format("YYYY-MM-DD");
  jsonVar = {
    isSheduleBatch: true,
    cancelCourseLevel: false
  }
  newExamData = {
    startTimeHrs: '12 PM',
    startTimeMins: '00',
    endTimeHrs: '1 PM',
    endTimeMins: '00',
    total_marks: ''
  };
  exam_desc:any ='';
  exam_room_no:any ='';
  subject_id:any ='';
  subject_name:any ='';
  exam_marks:any ='';
  edit_subject_id:any ='';
  edit_subject_name:any ='';
  edit_exam_marks:any ='';
  edit_subject_topics:any ='';
  edit_exam_desc:any ='';
  edit_exam_room_no:any ='';
  row_edit_subject_id:any ='';
  row_edit_subject_name:any ='';
  row_edit_exam_marks:any ='';
  row_edit_subject_topics:any ='';
  row_edit_exam_desc:any ='';
  row_edit_exam_room_no:any ='';
  selectedSubId: any;
  total_marks_to_show = 0;
  // Topic listing variables
  topicBox: boolean = true;
  selectAllTopics: boolean = false;
  public enableCheck: boolean = true;
  public checkChildren: boolean = true;
  public checkParents: boolean = true;
  public checkOnClick: boolean = true;
  public checkMode: any = 'multiple';
  topicLinkColor: boolean = false;
  changeColor: boolean = false;
  multiClickDisabled: boolean = false;
  isRippleLoad: boolean = false;
  selectedRow = "";
  public topicsData: any;
  public children;
  public hasChildren;
  public isExpanded;

  coursePlannerStatus: any;

  constructor(
    private apiService: ExamCourseService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService,
    private topicService: TopicListingService,
    private cd: ChangeDetectorRef
  ) { }

  public get checkableSettings(): CheckableSettings {
    return {
      checkChildren: this.checkChildren,
      checkParents: this.checkParents,
      enabled: this.enableCheck,
      mode: this.checkMode,
      checkOnClick: this.checkOnClick
    };
  }

  ngOnInit() {
    this.checkInstituteType();
    this.fetchPrefillData();
    this.checkForCoursePlannerRoute();
  }

  checkForCoursePlannerRoute(){
    this.coursePlannerStatus = sessionStorage.getItem('isFromCoursePlanner')
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
          this.jsonVar.isSheduleBatch = true;
          this.examScheduleData = res;
          this.batchStartDate = this.examScheduleData.batch_start_date;
          this.batchEndDate = this.examScheduleData.batch_end_date;
          if (moment(this.batchEndDate).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
            this.jsonVar.isSheduleBatch = false;
          }
          else {
            this.jsonVar.isSheduleBatch = true;
          }
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
    if (this.examScheduleData.is_exam_grad_feature <= 0) {
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
    if (!this.isRippleLoad) {
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

  clearExam() {
    if (this.examScheduleData.coursesList[0].courseClassSchdList) {
      this.calculateTotalMarks();
      this.clearAllField();
    }
    else {
      this.messageNotifier('error', 'Error', "Only class present");
    }
  }

  editSubject(row_no, subject_data) {

    if (this.selectedRow !== "") {
      if (this.row_edit_subject_id != "" && this.row_edit_subject_id != undefined) {
        document.getElementById(("row_already" + this.selectedRow).toString()).classList.add('displayComp');
        document.getElementById(("row_already" + this.selectedRow).toString()).classList.remove('editComp');
      }
      else {
        document.getElementById(("row" + this.selectedRow).toString()).classList.add('displayComp');
        document.getElementById(("row" + this.selectedRow).toString()).classList.remove('editComp');
      }
    }
    this.selectedRow = row_no;
    document.getElementById(("row" + row_no).toString()).classList.remove('displayComp');
    document.getElementById(("row" + row_no).toString()).classList.add('editComp');

    this.edit_subject_id = subject_data.subject_id;
    this.edit_subject_name = subject_data.subject_name;
    this.edit_exam_marks = subject_data.exam_marks;
    this.edit_subject_topics = subject_data.subject_topics;
    this.edit_subject_topicId = subject_data.topicsId;
    this.edit_exam_desc = subject_data.exam_desc;
    this.edit_exam_room_no = subject_data.exam_room_no;


    this.checkedKeys = subject_data.topicsId;

    console.log(subject_data);

  }

  updateSubject(row_no, subject_data) {

    if (this.edit_subject_id == null || this.edit_subject_id == '') {
      this.messageNotifier('error', 'Error', 'No subject(s) added!');
      return;
    }
    if (this.edit_exam_marks == '' || this.edit_exam_marks == null) {
      this.messageNotifier('error', 'Error', 'Please Provide Marks');
      return;
    }

    let subjectName = "";
    if (this.subjectListData.length > 0) {
      this.subjectListData[0].forEach(
        ele => {
          if (this.edit_subject_id == ele.subject_id) {
            subjectName = ele.subject_name;
          }
        }
      );
    }

    let topic_names = this.topicsName.join(", ");
    this.newExamSubjectData[row_no].subject_id = this.edit_subject_id
    this.newExamSubjectData[row_no].subject_name = subjectName;
    this.newExamSubjectData[row_no].exam_marks = this.edit_exam_marks;
    this.newExamSubjectData[row_no].subject_topics = topic_names;
    this.newExamSubjectData[row_no].topicsId = this.checkedKeys;
    this.newExamSubjectData[row_no].exam_desc = this.edit_exam_desc;
    this.newExamSubjectData[row_no].exam_room_no = this.edit_exam_room_no;

    this.edit_subject_id = '';
    this.edit_subject_name = '';
    this.edit_exam_marks = '';
    this.edit_subject_topics = '';
    this.edit_exam_desc = '';
    this.edit_exam_room_no = '';
    this.edit_subject_topicId = [];
    this.calculateTotalMarks();
    document.getElementById(("row" + row_no).toString()).classList.add('displayComp');
    document.getElementById(("row" + row_no).toString()).classList.remove('editComp');
    this.selectedRow = "";
  }

  clearAllField() {
    this.newExamSubjectData = [];
    this.newExamData.startTimeHrs = '12 PM';
    this.newExamData.startTimeMins = '00';
    this.newExamData.endTimeHrs = '1 PM';
    this.newExamData.endTimeMins = '00';
    this.newExamData.total_marks = '';
    this.clearField();

  }

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
    this.jsonVar.cancelCourseLevel = false;
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

    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
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
          this.messageNotifier('success', 'Successfully Cancelled', 'Scheduled exam cancelled successfully');
          this.isRippleLoad = false;
          this.batchModelGoClick();
          this.closeCancelExamPopUp();
        },
        err => {
          //console.log(err);
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
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

  displayCourseDate() {
    console.log(this.courseData.course_id)
    this.showCourseStartEndDate = true;
    for (let i = 0; i < this.courseList.coursesList.length; i++) {
      if (this.courseList.coursesList[i].course_id == this.courseData.course_id) {
        this.batchStartDate = this.courseList.coursesList[i].start_date;
        this.batchEndDate = this.courseList.coursesList[i].end_date;
      }
    }

  }

  validateDateRange() {
    let selectedCourse: any = {};
    let check = true;
    if (this.courseList.coursesList.length > 0) {
      selectedCourse = this.courseList.coursesList.filter(
        el => el.course_id == this.courseData.course_id
      )
      if (moment(selectedCourse[0].start_date).format('YYYY-MM-DD') <= moment(this.courseData.requested_date).format('YYYY-MM-DD') && moment(this.courseData.requested_date).format('YYYY-MM-DD') <= moment(selectedCourse[0].end_date).format('YYYY-MM-DD')) {
        check = true;
      } else {
        this.messageNotifier('error', 'Date Out Of Range', 'You have selected date out of course start date ' + selectedCourse[0].start_date + " and course end date " + selectedCourse[0].end_date);
        check = false;
      }
    }
    return check;
  }

  getExamSchedule() {
    if (this.courseData.master_course != "" && this.courseData.course_id != -1) {
      if (!this.validateDateRange()) {
        this.showContentSection = false;
        return false;
      }
      this.clearAllField();
      this.isRippleLoad = true;
      this.courseData.requested_date = moment(this.courseData.requested_date).format('YYYY-MM-DD');
      this.apiService.getSchedule(this.courseData).subscribe(
        (res: any) => {
          this.isRippleLoad = false;
          this.multiClickDisabled = false;
          this.examScheduleData = res;
          this.calculateDataAsPerSelection(res);
          // console.log(this.subjectListData);
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

  subjectChanged() {
    this.checkedKeys = [];
    this.changeColor = false;
    this.topicsName = [];
  }

  calculateDataAsPerSelection(result) {
    this.subjectListData = [];
    this.viewList = [];
    if (result != null) {
      if (result.coursesList.length > 0) {
        for (let i = 0; i < result.coursesList.length; i++) {
          // if(result.coursesList[i].courseClassSchdList != null && result.coursesList[i].courseClassSchdList.length > 0){
          if (this.courseData.course_id == result.coursesList[i].course_id) {
            this.subjectListData.push(result.coursesList[i].batchesList);
            let obj: any = {};
            obj.selectedCourseList = result.coursesList[i];
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
              total_marks: "",
              exam_desc: "",
              room_no: ""
            };
            obj.coursetableAdder = {
              batch_id: -1,
              total_marks: ""
            };

            if (result.coursesList[i].courseClassSchdList != null && result.coursesList[i].courseClassSchdList.length > 0) {
              obj.courseTableList = result.coursesList[i].courseClassSchdList;
              obj.courseModelAdder.start_time = this.breakTimeFormat(result.coursesList[i].courseClassSchdList[0].start_time);
              obj.courseModelAdder.end_time = this.breakTimeFormat(result.coursesList[i].courseClassSchdList[0].end_time);
              obj.courseModelAdder.exam_desc = result.coursesList[i].courseClassSchdList[0].class_desc;
              obj.courseModelAdder.room_no = result.coursesList[i].courseClassSchdList[0].room_no;
              obj.courseModelAdder.total_marks = 0;
              result.coursesList[i].courseClassSchdList.forEach(element => {
                obj.courseModelAdder.total_marks += Number(element.total_marks);
              })

            } //end if
            else {
              obj.courseTableList = [];
            }
            this.viewList.push(obj);
          }
        }
      }
    }
  }

  /**
   * check negative value
   */
  checkNgetiveValue($event) {
    // console.log($event);
    if ($event < 0) {
      this.messageNotifier('error', 'Error', 'Negative mark not allowed');
    }
  }



  topicLinking(subjectData, index) {
    let subject_id;
    for (let i = 0; i < subjectData.length; i++) {
      if (this.viewList[index].coursetableAdder.batch_id == subjectData[i].batch_id) {
        subject_id = subjectData[i].subject_id;
      }
    }

    if (subject_id == '' || subject_id == null || subject_id == '-1' || subject_id == undefined) {
      this.messageNotifier('error', 'Error', 'Please Select Subject');
      return;
    }
    else {
      this.isRippleLoad = true;
      this.topicService.getAllTopicsSubTopics(subject_id).subscribe(
        res => {
          this.topicLinkColor = true;
          let temp: any;
          temp = res;
          if (temp != null && temp.length != 0) {
            this.topicBox = false;
            this.isRippleLoad = false;
            this.topicsData = res;

            let subjectName = "";
            subjectData.forEach(
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
          else {
            this.isRippleLoad = false;
            this.messageNotifier('info', 'Info', 'No topics available to Link');
          }

        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  topicLinkingForPreSelectedTopics(subjectData) {

    if (this.row_edit_subject_id == '' || this.row_edit_subject_id == null || this.row_edit_subject_id == '-1' || this.row_edit_subject_id == undefined) {
      this.messageNotifier('error', 'Error', 'Please Select Subject');
      return;
    }
    else {
      this.isRippleLoad = true;
      this.topicService.getAllTopicsSubTopics(this.row_edit_subject_id).subscribe(
        res => {
          this.checkedKeys = [];
          let temp: any;
          temp = res;
          if (temp != null && temp.length != 0) {
            this.topicBox = false;
            this.isRippleLoad = false;
            this.topicsData = res;
            let subjectName = "";
            let tempCheckedKeys;
            let data = this.row_edit_subject_topicId.toString();

            if (data != undefined && data.includes("|")) {
              tempCheckedKeys = data.split("|");
            }
            else {
              tempCheckedKeys = this.row_edit_subject_topicId;
            }

            tempCheckedKeys.forEach((value) => {
              if (value != " " || value != "0") {
                this.checkedKeys.push(Number(value));
              }
            })


            subjectData.forEach(
              ele => {
                if (ele.subject_id == this.row_edit_subject_id) {
                  subjectName = ele.subject_name;
                }
              }
            )
            this.subject_name = subjectName;
            this.children = (dataItem: any) => of(dataItem.subTopic);
            this.hasChildren = (item: any) => item.subTopic && item.subTopic.length > 0;
          }
          else {
            this.isRippleLoad = false;
            this.messageNotifier('info', 'Info', 'No topics available to Link');
          }

        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  topicListing() {
    if (this.subject_id == '' || this.subject_id == null || this.subject_id == '-1' || this.subject_id == undefined) {
      this.messageNotifier('error', 'Error', 'Please Select Subject');
      return;
    }
    else {
      this.isRippleLoad = true;
      this.topicService.getAllTopicsSubTopics(this.subject_id).subscribe(
        res => {
          let temp: any;
          temp = res;
          if (temp != null && temp.length != 0) {
            this.topicBox = false;
            this.isRippleLoad = false;
            this.topicsData = res;

            let subjectName = "";
            this.subjectListData[0].forEach(
              ele => {
                if (this.subject_id == ele.subject_id) {
                  this.subject_name = ele.subject_name;
                }
              }
            );
            this.children = (dataItem: any) => of(dataItem.subTopic);
            this.hasChildren = (item: any) => item.subTopic && item.subTopic.length > 0;
          }
          else {
            this.isRippleLoad = false;
            this.messageNotifier('info', 'Info', 'No topics available to Link');
          }

        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }


  public handleChecking(itemLookup: TreeItemLookup): void {
    let subTopic = itemLookup.item.dataItem.subTopic;
    let arrayIndex = this.checkedKeys.indexOf(itemLookup.item.dataItem.topicId);
    if (arrayIndex > -1) {
      // this.checkedKeys.splice(arrayIndex, 1);
      let subTopic = itemLookup.item.dataItem.subTopic;
      subTopic.length ? this.removeNLevelTopic(subTopic) : '';
    } else {
      // this.checkedKeys.push(itemLookup.item.dataItem.topicId);
      if (subTopic.length)
        this.AddNLevelTopic(subTopic);
    }
    this.cd.markForCheck();
  }

  removeNLevelTopic(subTopics) {
    if (subTopics.length == 0) {
      let arrayIndex = this.checkedKeys.indexOf(subTopics.topicId);
      this.checkedKeys.splice(arrayIndex, 1);
      return;
    }
    else {
      subTopics.forEach((object) => {
        let arrayIndex = this.checkedKeys.indexOf(object.topicId);
        if (arrayIndex > -1) {
          this.checkedKeys.splice(arrayIndex, 1);
        }
        if (object.subTopic.length) {
          this.removeNLevelTopic(object.subTopic);
        }
      });
    }
    this.cd.markForCheck();
  }

  AddNLevelTopic(subTopics) {
    if (subTopics.length == 0) {
      this.checkedKeys.push(subTopics.topicId);
      return;
    }
    else {
      subTopics.forEach((object) => {
        let arrayIndex = this.checkedKeys.indexOf(object.topicId);
        if (arrayIndex == -1) {
          this.checkedKeys.push(object.topicId);
        }
        if (object.subTopic.length) {
          this.AddNLevelTopic(object.subTopic);
        }
      });
    }
  }

  preSelectedTopicListing() {

    if (this.edit_subject_id == '' || this.edit_subject_id == null || this.edit_subject_id == '-1' || this.edit_subject_id == undefined) {
      this.messageNotifier('error', 'Error', 'Please Select Subject');
      return;
    }
    else {
      this.isRippleLoad = true;
      this.topicService.getAllTopicsSubTopics(this.edit_subject_id).subscribe(
        res => {
          let temp: any;
          temp = res;
          if (temp != null && temp.length != 0) {
            this.topicBox = false;
            this.isRippleLoad = false;
            this.topicsData = res;
            this.checkedKeys = this.edit_subject_topicId;
            this.subjectListDataSource.forEach(
              ele => {
                if (ele.subject_id == this.subject_id) {
                  this.subject_name = ele.subject_name;
                }
              }
            );
            this.children = (dataItem: any) => of(dataItem.subTopic);
            this.hasChildren = (item: any) => item.subTopic && item.subTopic.length > 0;
          }
          else {
            this.isRippleLoad = false;
            this.messageNotifier('info', 'Info', 'No topics available to Link');
          }

        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }

  }


  saveTopic() {
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
    if (this.row_edit_subject_id) {
      this.row_edit_subject_topicId = this.checkedKeys;
      let joinedArr = this.row_edit_subject_topicId.join(",").toString();

      let x = joinedArr.replace(/,/g, "|");
      let y = x.split("|")
      this.row_edit_subject_topicId = y;
    }
    console.log(this.topicsName);
    this.topicBox = true;

    if (this.topicLinkColor) {
      this.changeColor = true;
    }

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

  closeAlert() {
    this.topicBox = true;
    this.topicLinkColor = false;
    this.changeColor = false;
  }


  addNewExamSubject() {
    if (this.newExamData.startTimeHrs == this.newExamData.endTimeHrs
      && this.newExamData.startTimeMins == this.newExamData.endTimeMins) {
      this.messageNotifier('error', 'Error', 'Exam  start time and end time cannot be same !');
      return;
    }
    if (this.subject_id == null || this.subject_id == '') {
      this.messageNotifier('error', 'Error', 'No subject(s) added!');
      return;
    }
    if (this.exam_marks == '' || this.exam_marks == null) {
      this.messageNotifier('error', 'Error', 'Please Provide Marks');
      return;
    }

    for (let i = 0; i < this.newExamSubjectData.length; i++) {
      if (this.newExamSubjectData[i].subject_id == this.subject_id) {
        this.messageNotifier('error', 'Error', 'Selected subject already added!');
        return;
      }
    }

    let subjectName = "";
    this.subjectListData[0].forEach(
      ele => {
        if (this.subject_id == ele.subject_id) {
          subjectName = ele.subject_name;
        }
      }
    )

    let topic_names = this.topicsName.join(", ");

    let obj: any = {};
    obj.subject_id = this.subject_id;
    obj.subject_name = subjectName;
    obj.exam_marks = this.exam_marks;
    obj.subject_topics = topic_names;
    obj.topicsId = this.checkedKeys;
    obj.exam_desc = this.exam_desc;
    obj.exam_room_no = this.exam_room_no;

    this.newExamSubjectData.push(obj);

    this.calculateTotalMarks();
    this.clearField();

    this.subject_topics = [];

  }

  calculateTotalMarks() {
    this.total_marks_to_show = 0;
    for (let i = 0; i < this.newExamSubjectData.length; i++) {
      this.total_marks_to_show += this.newExamSubjectData[i].exam_marks;
    }
  }

  clearField() {
    this.subject_id = '';
    this.subject_name = '';
    this.exam_marks = '';
    this.subject_topics = [];
    this.exam_desc = '';
    this.exam_room_no = '';

    this.checkedKeys = [];
    this.topicsName = [];
  }

  addNewExamSubjectCourse(index) {
    if (this.viewList[index].coursetableAdder.batch_id == -1) {
      this.messageNotifier('error', 'Error', 'No subject(s) added!');
      return;
    };
    if (this.viewList[index].selectedCourseList.is_exam_grad_feature == '0') {
      if (this.viewList[index].coursetableAdder.total_marks == 0) {
        this.messageNotifier('error', 'Error', 'Please Provide Marks');
        return;
      }
    }

    let selectedSubjectDemo = this.getSubjectName(this.viewList[index].subjectList, this.viewList[index].coursetableAdder.batch_id);

    for (let i = 0; i < this.viewList[index].courseTableList.length; i++) {
      if (this.viewList[index].courseTableList[i].subject_name == selectedSubjectDemo.subject_name) {
        this.messageNotifier('error', 'Error', 'Selected subject already added!');
        return;
      }
    }

    let topic_names = this.topicsName.join(", ");
    let obj: any = {};
    obj.total_marks = this.viewList[index].coursetableAdder.total_marks;
    obj.class_schedule_id = '0';
    let selectedSubject = this.getSubjectName(this.viewList[index].subjectList, this.viewList[index].coursetableAdder.batch_id);
    obj.subject_name = selectedSubject.subject_name;
    obj.batch_id = this.viewList[index].coursetableAdder.batch_id;
    obj.otherData = selectedSubject;
    obj.topicName = topic_names;
    obj.topics_covered = this.checkedKeys;
    obj.class_desc = this.viewList[index].coursetableAdder.exam_desc;
    obj.room_no = this.viewList[index].coursetableAdder.room_no;
    this.viewList[index].courseTableList.push(obj);

    this.viewList[index].courseModelAdder.total_marks += this.viewList[index].coursetableAdder.total_marks;

    this.viewList[index].coursetableAdder = {
      batch_id: -1,
      total_marks: 0
    };

    this.topicLinkColor = false;
    this.changeColor = false;


  }

  getSubjectName(data, id) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].batch_id == id) {
        return data[i];
      }
    }
  }


  deleteSubject(subject_id) {
    for (let i = 0; i < this.newExamSubjectData.length; i++) {
      if (this.newExamSubjectData[i].subject_id == subject_id) {
        this.newExamSubjectData.splice(i, 1);
      }
    }
    this.messageNotifier('success', 'Success', 'Scheduled exam deleted successfully');
  }

  deleteFromCourse(data, index, j) {

    if (this.viewList[j].courseTableList.length == 1) {
      this.messageNotifier('error', 'Error', "Subject can't be deleted from the scheduled exam since only one subject is left!");
      return;
    }
    else {
      this.viewList[j].courseTableList.splice(index, 1);
      this.messageNotifier('success', 'Success', 'Scheduled exam deleted successfully');
    }
    let total = 0;
    for (let i = 0; i < this.viewList[j].courseTableList.length; i++) {
      total += this.viewList[j].courseTableList[i].total_marks;
    }

    this.viewList[j].courseModelAdder.total_marks = total;
  }

  editFromCourse(data, index, j) {
    if (this.selectedRow !== "") {
      if (this.edit_subject_id) {
        document.getElementById(("row" + this.selectedRow).toString()).classList.add('displayComp');
        document.getElementById(("row" + this.selectedRow).toString()).classList.remove('editComp');
      }
      else {
        document.getElementById(("row_already" + this.selectedRow).toString()).classList.add('displayComp');
        document.getElementById(("row_already" + this.selectedRow).toString()).classList.remove('editComp');
      }
    }
    this.selectedRow = index + "_" + j;
    document.getElementById(("row_already" + index + "_" + j).toString()).classList.remove('displayComp');
    document.getElementById(("row_already" + index + "_" + j).toString()).classList.add('editComp');

    let subject_id;
    if (data.otherData) {
      subject_id = data.otherData.subject_id
    }
    else {
      subject_id = data.subject_id;
    }
    this.row_edit_subject_id = subject_id;
    this.row_edit_subject_name = data.subject_name;
    this.row_edit_exam_marks = data.total_marks;
    this.row_edit_subject_topics = data.topicName;
    this.row_edit_subject_topicId = data.topics_covered;
    this.row_edit_exam_desc = data.class_desc;
    this.row_edit_exam_room_no = data.room_no;
    //
    let temp;
    if (data.topics_covered != undefined) {
      if (data.topics_covered.includes("|")) {
        temp = data.topics_covered.replace("|", ",");
      }
      else {
        temp = data.topics_covered;
      }
      this.checkedKeys = temp;
    }
  }

  updateEditedSubject(row, index, j) {

    if (this.row_edit_exam_marks == '' || this.row_edit_exam_marks == null) {
      this.messageNotifier('error', 'Error', 'Please Provide Marks');
      return;
    }

    let subjectName = "";
    console.log(this.viewList);
    this.viewList[j].subjectList.forEach(
      ele => {
        if (this.row_edit_subject_id == ele.subject_id) {
          subjectName = ele.subject_name;
        }
      }
    )

    let topic_names = this.topicsName.join(", ");
    let topicsNames;

    if (this.topicsName.length > 0) {
      let y = this.row_edit_subject_topicId.join(",")
      topicsNames = y.replace(/,/g, "|");
    }


    this.viewList[j].courseTableList[index].subject_id = this.row_edit_subject_id;
    this.viewList[j].courseTableList[index].subject_name = subjectName;
    this.viewList[j].courseTableList[index].total_marks = this.row_edit_exam_marks;
    this.viewList[j].courseTableList[index].topicName = topic_names;
    this.viewList[j].courseTableList[index].topics_covered = topicsNames;
    this.viewList[j].courseTableList[index].class_desc = this.row_edit_exam_desc;
    this.viewList[j].courseTableList[index].room_no = this.row_edit_exam_room_no;

    this.row_edit_subject_id = '';
    this.row_edit_subject_name = '';
    this.row_edit_exam_marks = '';
    this.row_edit_subject_topics = '';
    this.row_edit_subject_topicId = [];
    this.row_edit_exam_desc = '';
    this.row_edit_exam_room_no = '';
    //
    // // this.calculateTotalMarks();
    //

    let total = 0;
    for (let i = 0; i < this.viewList[j].courseTableList.length; i++) {
      total += this.viewList[j].courseTableList[i].total_marks;
    }

    this.viewList[j].courseModelAdder.total_marks = total;

    this.checkedKeys = [];
    this.topicsName = [];


    document.getElementById(("row_already" + index + "_" + j).toString()).classList.remove('editComp');
    document.getElementById(("row_already" + index + "_" + j).toString()).classList.add('displayComp');

    this.selectedRow = "";
  }

  saveExamScheduleCourse() {
    this.multiClickDisabled = true;
    this.isRippleLoad = true;
    let dataToSend = this.makeDataJsonToSendServer();
    // console.log(dataToSend);
    // dataToSend = false;
    if (dataToSend == false ||dataToSend==undefined) {
      this.isRippleLoad = false;
      this.multiClickDisabled = false;
      return;
    }
    if (dataToSend.coursesList.length > 0) {
      let flag = false;
      dataToSend.coursesList.forEach((object, index) => {
        if (object) {
          if (object.courseClassSchdList.length) {
            flag = true;
          }
          else {
            object.exam_start_time = null;
            object.exam_end_time = null;
          }
        }
        else {
          dataToSend.coursesList.splice(index, 1);
        }
      });
      if (flag) {
        this.apiService.updateExamSch(dataToSend).subscribe(
          (res: any) => {
            this.isRippleLoad = false;
            if (res.statusCode == 200) {
              this.messageNotifier('success', 'Success', 'Exam scheduled successfully');
              this.clearAllField();
              this.getExamSchedule();
            }
            else {
              this.messageNotifier('error', 'Error', res.message);
            }
          },
          err => {
            this.isRippleLoad = false;
            this.multiClickDisabled = false;
            console.log(err);
            this.messageNotifier('error', 'Error', err.error.message);
          }
        )
      }
    }
    else {
      this.multiClickDisabled = false;
      this.isRippleLoad = false;
      this.messageNotifier('error', 'Error', 'Required fields not mentioned!');
    }

  }


  makeDataJsonToSendServer() {
    let coursesLists = [];
    /// This section makes json for perticular selected course
    let data: any = {};
    let total = 0;
    data.master_course = this.courseData.master_course;
    data.requested_date = moment(this.courseData.requested_date).format('YYYY-MM-DD');
    data.coursesList = [];

    // FOR ALREADY PRESENT EXAM
    let validation_flag = false;
    for (let p = 0; p < this.viewList.length; p++) {
      if (this.viewList[p].courseTableList.length > 0) {
        validation_flag = true;
      }
    }

    if (validation_flag) {
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
        for (let j = 0; j < this.viewList[i].courseTableList.length; j++) {
          let classLi: any = {};
          if (this.viewList[i].courseTableList[j].total_marks == undefined) {
            this.messageNotifier('error', 'Error', 'please enter total marks');
            return false;
          }
          let topics = this.viewList[i].courseTableList[j].topics_covered;
          classLi.batch_id = this.viewList[i].courseTableList[j].batch_id.toString();
          classLi.start_time = startTime;
          classLi.end_time = endTime;
          classLi.class_desc = this.viewList[i].courseTableList[j].class_desc;
          classLi.duration = check;
          classLi.total_marks = this.viewList[i].courseTableList[j].total_marks.toString();
          if (topics && topics.includes(",")) {
            classLi.topics_covered = topics.replace(/,/g, "|");
          }
          else {
            if (typeof topics != 'string') {
              classLi.topics_covered = topics ? (topics.length == 0 ? "" : topics.join("|")) : "";
            }
            else {
              classLi.topics_covered = topics;
            }
          }
          classLi.room_no = this.viewList[i].courseTableList[j].room_no;
          classLi.class_schedule_id = this.viewList[i].courseTableList[j].class_schedule_id.toString();;
          total += Number(this.viewList[i].courseTableList[j].total_marks);
          test.courseClassSchdList.push(classLi);
        }
        if (total != this.viewList[i].courseModelAdder.total_marks) {
          this.messageNotifier('error', 'Error', 'Please check total marks provided');
          return false;
        }

        total = 0;
        coursesLists.push(test);
        if (this.newExamSubjectData.length == 0) {
          data.coursesList.push(test);
        }
      }
    }

    // FOR NEWLY ADDED EXAM
    if (this.newExamSubjectData.length > 0) {
      // for (let i = 0; i < this.newExamSubjectData.length; i++) {
      let test: any = { course_id: '', course_exam_schedule_id: '-1' };
      if (this.viewList.length > 0) {
        test.course_id = this.viewList[0].selectedCourseList.course_id;
      }
      let check = this.validateTime2();
      if (check == false) {
        return;
      }
      let startTime = this.createTimeInFormat(this.newExamData.startTimeHrs, this.newExamData.startTimeMins, '');
      let endTime = this.createTimeInFormat(this.newExamData.endTimeHrs, this.newExamData.endTimeMins, '');
      test.exam_start_time = startTime;
      test.exam_end_time = endTime;
      test.courseClassSchdList = [];

      if (this.newExamSubjectData.length > 0) {
        for (let j = 0; j < this.newExamSubjectData.length; j++) {
          let classLi: any = {};
          let bactch_id = "";
          for (let k = 0; k < this.subjectListData[0].length; k++) {
            if (this.newExamSubjectData[j].subject_id == this.subjectListData[0][k].subject_id) {
              bactch_id = this.subjectListData[0][k].batch_id;
            }
          }
          classLi.batch_id = bactch_id.toString();;
          classLi.start_time = startTime;
          classLi.end_time = endTime;
          classLi.class_desc = this.newExamSubjectData[j].exam_desc;
          classLi.duration = check;
          classLi.topics_covered = this.newExamSubjectData[j].topicsId.join("|")
          classLi.total_marks = this.newExamSubjectData[j].exam_marks.toString();
          classLi.room_no = this.newExamSubjectData[j].exam_room_no;
          classLi.class_schedule_id = "0";
          total += Number(this.newExamSubjectData[j].exam_marks.toString());
          test.courseClassSchdList.push(classLi);
        }
        // if (total != this.viewList[i].courseModelAdder.total_marks) {
        //   this.messageNotifier('error', 'Error', 'Please check total marks provided');
        //   return false;
        // }
      }
      total = 0;
      data.coursesList.push(test);
      if (validation_flag) {
        for (let m = 0; m < coursesLists.length; m++) {
          let isPush = false;
          console.log(coursesLists[m]);
          this.examScheduleData.coursesList.forEach((object, index) => {
            if (object.course_exam_schedule_id == coursesLists[m].course_exam_schedule_id) {
              isPush = true;;
            }
          });
          if (isPush) {
            coursesLists[m] && coursesLists[m].courseClassSchdList.length != 0 ? data.coursesList.push(coursesLists[m]) : '';
          }
        }
      }
      // }
    }


    /// This section makes json for unselected course
    if (this.examScheduleData.coursesList.length > 0) {
      let startIndex = 0;
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
        else if (this.examScheduleData.coursesList[i].course_id == this.courseData.course_id &&
          this.examScheduleData.coursesList[i] && this.examScheduleData.coursesList[i].courseClassSchdList == null &&
          this.examScheduleData.coursesList[i].course_exam_schedule_id != 0) {
          /** this condition used  for cancel exam if user try to create exam 
           * using  same time and type then cancel exam course_exam_schedule_id need to send in new created 
           * exam object  --- added laxmi */
          if (data.coursesList[i] && this.examScheduleData.coursesList[i]) {
            data.coursesList[startIndex].course_exam_schedule_id = this.examScheduleData.coursesList[i].course_exam_schedule_id;
            startIndex++;
          }
          else if (this.examScheduleData.coursesList[i]) {
            let obj = {
              "course_id": this.examScheduleData.coursesList[i].course_id,
              "courseClassSchdList": [],
              "exam_start_time": null,
              "exam_end_time": null,
              "course_exam_schedule_id": this.examScheduleData.coursesList[i].course_exam_schedule_id
            }
            data.coursesList.push(obj);
          }
        } else if (this.examScheduleData.coursesList[i].course_id == this.courseData.course_id &&
          this.examScheduleData.coursesList[i] && this.examScheduleData.coursesList[i].courseClassSchdList) {
          let isNeedToAdd = true;

          data.coursesList.forEach((obj) => {
            if (obj.course_exam_schedule_id == this.examScheduleData.coursesList[i].course_exam_schedule_id) {
              isNeedToAdd = false;
            }
          });
          if (isNeedToAdd) {
            if (coursesLists[i]) {
              data.coursesList.push(coursesLists[i]);
            }
          }

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
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
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
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Successfully Cancelled', 'Scheduled exam cancelled successfully');
          this.closeCancelExamPopUp();
          this.getExamSchedule();
        },
        err => {
          //console.log(err);
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }
  }

  // cancel Button next to Send Reminder

  cancelExamForFullCourse(data, index) {
    this.cancelExamPopUp = true;
    this.cancelExamData = data;
    this.jsonVar.cancelCourseLevel = true;
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

    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      let obj = {
        cancel_reason: this.cancelPopUpData.reason,
        course_exam_schedule_id: this.cancelExamData.selectedCourseList.course_exam_schedule_id,
        course_id: this.courseData.course_id,
        is_cancel_notify: notify,
        requested_date: moment(this.courseData.requested_date).format('YYYY-MM-DD')
      }
      this.apiService.cancelExamScheduleCourse(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Successfully Cancelled', 'Scheduled exam cancelled successfully');
          this.closeCancelExamPopUp();
          this.getExamSchedule();
        },
        err => {
          //console.log(err);
          this.isRippleLoad = false;
          this.messageNotifier('error', 'Error', err.error.message);
        }
      )
    }

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
          this.messageNotifier('success', 'Reminder Sent', 'Notification sent successfully');
        },
        err => {
          //console.log(err);
          this.messageNotifier('error', 'Error', "SMS notification can't be sent due to any of the following reasons: SMS setting is not enabled for the institute. SMS quota is not sufficient for the institute. No student(s) assigned in the course to notify");
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

  validateTime2() {
    let start_time = moment(this.createTimeInFormat(this.newExamData.startTimeHrs, this.newExamData.startTimeMins, 'comp'), 'h:mma');
    let end_time = moment(this.createTimeInFormat(this.newExamData.endTimeHrs, this.newExamData.endTimeMins, 'comp'), 'h:mma');
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