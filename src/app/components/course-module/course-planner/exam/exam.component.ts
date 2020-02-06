import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ClassScheduleService } from '../../../../services/course-services/class-schedule.service';
import { ExamCourseService } from '../../../../services/course-services/exam-schedule.service';
import { TopicListingService } from '../../../../services/course-services/topic-listing.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { WidgetService } from '../../../../services/widget.service';
import { CoursePlanner } from '../course-planner.model';
import { SessionFilter } from '../session-filter.model';
declare var $;

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated
})
export class ExamComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    showHideColumn: false,
    setting: true
  };
  coursePlannerFor: String = "exam";
  // apis variables to send
  inputElements = {
    masterCourse: "-1",
    course: "-1",
    subject: "-1",
    standard_id: "-1",
    subject_id: "-1",
    batch_id: "-1",
    faculty: "-1",
    isAssigned: "N"
  };
  // Duration filter for course planner data
  filterDateInputs = {
    thisWeek: true,
    lastWeek: false,
    thisMonth: false,
    custom: false
  };
  //  class status filter for course planner data
  filterStatusInputs = {
    upcoming: true,
    attendancePending: true,
    marksUpdated: true,
    marksPending: true,
    cancelled: true,
  };
  // Default col show hide status
  showHideColumns = {
    subject: true,
    topic: true,
    description: false,
    // roomNo: false
  };
  // for show hide table columns
  checkedColCounter: number = 1;
  // Array Elements
  facultyList: any[] = [];
  coursePlannerData: any = [];  // saved course planner fetched data
  allData: any = [];  // used for pagination purpose
  // course model array
  masterCourseList: any[] = [];
  courseList: any[] = [];
  subjectList: any[] = [];
  // batch model array
  batchList: any[] = [];

  coursePlannerFilters: CoursePlanner = new CoursePlanner();
  sessionFiltersArr: SessionFilter = new SessionFilter();

  filterShow: boolean = false;
  filterDateRange: any = "";
  courseStartDate: any;
  courseEndDate: any;

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 20;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];

  // pop up section variables

  // Cancel Exam
  tempData: any = [];
  courseTempData: any = '';
  courseCommonExamCancelPopUP = false;
  showReasonSection: any = '';

  cancelPopUpData = {
    reason: "",
    notify: true
  };

  cancelExamPopUP: boolean = false;

  // for Edit
  editClass: any = {
    description: "",
    topic_covered_ids: "",
    topic_covered_names: "",
    subject_id: "",
    course_id: "",
    class_sche_date: "",
    class_schedule_id: "",
    batch_id: "",
    start_time: "",
    end_time: "",
    total_marks: "",
    duration: "",
    course_exam_schedule_id: "",
    room_no: ""
  };
  topicsList : any = [];
  totalTopicsList: any = [];
  selectedTopics: any = '' //join ids by '|'
  selectedTopicsNames: any = '';

  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private classService: ClassScheduleService,
    private widgetService: WidgetService,
    private topicService: TopicListingService,
    private examService: ExamCourseService
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )


    this.showHideColForModel();
    this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');
    this.fetchPreFillData();
    let filters = sessionStorage.getItem('coursePlannerFilter');
    if(filters){  // if session filters are not blank
      this.sessionFilters(filters);
    }
  }

  showHideColForModel(){
    if(this.jsonFlag.isProfessional){
      this.showHideColumns.description = true;
      this.showHideColumns.topic = false;
      // this.jsonFlag.setting = false;
    }
  }

  sessionFilters(filters){
    this.sessionFiltersArr = JSON.parse(filters);
    this.inputElements.masterCourse = this.sessionFiltersArr.masterCourse;
    this.inputElements.course = this.sessionFiltersArr.courseId;
    this.inputElements.standard_id = this.sessionFiltersArr.standardId;
    this.inputElements.subject_id = this.sessionFiltersArr.subjectId;
    this.inputElements.faculty = this.sessionFiltersArr.facultyId;
    if(!this.jsonFlag.isProfessional){
      this.inputElements.subject = this.sessionFiltersArr.batchId;
    }
    else{
      this.inputElements.batch_id = this.sessionFiltersArr.batchId;
    }

    this.filterDateInputs.thisWeek = this.sessionFiltersArr.thisWeek;
    this.filterDateInputs.lastWeek = this.sessionFiltersArr.lastWeek;
    this.filterDateInputs.thisMonth = this.sessionFiltersArr.thisMonth;
    this.filterDateInputs.custom = this.sessionFiltersArr.custom;

    this.filterStatusInputs.marksUpdated = this.sessionFiltersArr.isCompleted;
    this.filterStatusInputs.attendancePending = this.sessionFiltersArr.isPending;
    this.filterStatusInputs.cancelled = this.sessionFiltersArr.isCancelled;
    this.filterStatusInputs.upcoming = this.sessionFiltersArr.isUpcoming;
    this.filterStatusInputs.marksPending = this.sessionFiltersArr.isMarksUpdate;

    this.coursePlannerFilters.master_course_name = this.sessionFiltersArr.masterCourse;
    this.coursePlannerFilters.course_id = this.sessionFiltersArr.courseId;
    this.coursePlannerFilters.batch_id = this.sessionFiltersArr.batchId;
    this.coursePlannerFilters.teacher_id = this.sessionFiltersArr.facultyId;

    if(!this.filterStatusInputs.upcoming){
      this.coursePlannerFilters.isUpcoming = "N";
    }
    else if(!this.filterStatusInputs.attendancePending){
      this.coursePlannerFilters.isPending = "N";
    }
    else if(!this.filterStatusInputs.marksUpdated){
      this.coursePlannerFilters.isCompleted =  "N";
    }
    else if(!this.filterStatusInputs.marksPending){
      this.coursePlannerFilters.isMarksUpdate =  "N";
    }
    else if(!this.filterStatusInputs.cancelled){
      this.coursePlannerFilters.isCancelled = "N";
    }

    this.coursePlannerFilters.from_date = moment(this.sessionFiltersArr.from_date).format("YYYY-MM-DD");
    this.coursePlannerFilters.to_date = moment(this.sessionFiltersArr.to_date).format("YYYY-MM-DD");

    if(this.sessionFiltersArr.masterCourse != "-1"){
      this.updateCoursesList()
    }

    sessionStorage.setItem('isFromCoursePlanner', String(false));
    sessionStorage.setItem('coursePlannerFilter', '');
    setTimeout (() => {
       this.getData();
    }, 2000);
  }


  clearFilters(){
    sessionStorage.setItem('batch_info', '');
    sessionStorage.setItem('isSubjectView', '');
    sessionStorage.setItem('isFromCoursePlanner', '');
    sessionStorage.setItem('coursePlannerFilter', '');
    this.sessionFiltersArr = new SessionFilter();
  }

  fetchPreFillData(){

    // get master course - course - subject data  for course model
    if(!this.jsonFlag.isProfessional){
      this.auth.showLoader();
      this.classService.getAllMasterCourse().subscribe(
        res => {
          this.masterCourseList = res;
          if(this.sessionFiltersArr.masterCourse != "-1"){
            this.updateCoursesList();
          }
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
         }
      );
    }
    else{
      // get master course - course - subject data  for Batch model
      this.auth.showLoader();
      this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
        res => {
          this.masterCourseList = res.standardLi;
          this.batchList = res.batchLi;
          if(this.sessionFiltersArr.standardId != "-1"){
            this.updateCoursesList();
          }
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
         }
      );
    }


    // get active faculty list
    this.classService.getAllTeachersList().subscribe(
      res => {
        this.facultyList = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
      }
    );
  }

  updateCoursesList() {
    if(!this.jsonFlag.isProfessional){
      this.coursePlannerFilters.master_course_name = this.inputElements.masterCourse;
      if(this.sessionFiltersArr.courseId != "-1" && this.sessionFiltersArr.courseId != ""){
        this.inputElements.course = this.sessionFiltersArr.courseId;
      }
      else{
        this.inputElements.course = "-1";
        this.inputElements.subject = "-1";
        this.coursePlannerFilters.course_id = "-1";
        this.coursePlannerFilters.batch_id = "-1";
      }

      if(this.inputElements.masterCourse == ""){
        this.courseList = [];
        this.subjectList = [];
      }
      else{
        for (var i = 0; i < this.masterCourseList.length; i++) {
          if(this.masterCourseList[i].master_course == this.inputElements.masterCourse){
            this.courseList = this.masterCourseList[i].coursesList;
            if(this.sessionFiltersArr.courseId != "-1" && this.sessionFiltersArr.courseId != ""){
              this.updateSubjectsList();
            }
            else{
              this.subjectList = [];
              return;
            }
          }
        }
      }
    }
    else{
      this.coursePlannerFilters.standard_id = this.inputElements.standard_id;
      this.inputElements.subject_id = "-1";
      this.coursePlannerFilters.subject_id =  "-1";
      if(this.inputElements.standard_id == "-1"){
        this.courseList = [];
      }
      else{
        this.auth.showLoader();
        this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
          res => {
            this.auth.hideLoader();
            this.courseList = res.subjectLi;
            this.batchList = res.batchLi;
            this.auth.hideLoader();
            for (var i = 0; i < this.masterCourseList.length; i++) {
              if(this.masterCourseList[i].standard_id == this.inputElements.standard_id){
                this.courseStartDate = this.masterCourseList[i].start_date;
                this.courseEndDate = this.masterCourseList[i].end_date;
                if(this.sessionFiltersArr.subjectId != "-1" && this.sessionFiltersArr.subjectId != ""){   // check subject id null to fetch course according to it.
                  this.inputElements.subject_id = this.sessionFiltersArr.subjectId;
                  this.updateSubjectsList();
                }
                this.clearFilters();
                return;
              }
            }
          },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
           }
        );
      }
    }
  }

  updateSubjectsList(){
    if(!this.jsonFlag.isProfessional){
      this.coursePlannerFilters.course_id = this.inputElements.course;
      if(this.inputElements.course == "" || this.inputElements.course == "-1"){
        this.subjectList = [];
        this.inputElements.subject = "-1";
        this.coursePlannerFilters.batch_id = this.inputElements.subject;
      }
      else{
        for (var i = 0; i < this.courseList.length; i++) {
          if(this.courseList[i].course_id == this.inputElements.course){
            this.subjectList = this.courseList[i].batchesList;
            this.courseStartDate = this.courseList[i].start_date;
            this.courseEndDate = this.courseList[i].end_date;
            if(this.sessionFiltersArr.standardId != "-1" && this.sessionFiltersArr.standardId != ""){
              this.inputElements.subject = this.sessionFiltersArr.batchId;
            }
            this.clearFilters();
            return;
          }
        }
      }
    }
    else{
      this.auth.showLoader();
      this.coursePlannerFilters.subject_id = this.inputElements.subject_id;
      this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
        res => {
          this.auth.hideLoader();
          this.batchList = res.batchLi;
          this.clearFilters();
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
          this.clearFilters();
         }
      );
    }

  }

  updateSubject(){
    if(!this.jsonFlag.isProfessional){
      this.coursePlannerFilters.batch_id = this.inputElements.subject;
    }
    else{
      this.coursePlannerFilters.batch_id = this.inputElements.batch_id;
    }
  }

  updateFacultyInFilter(){
    this.coursePlannerFilters.teacher_id = this.inputElements.faculty;
  }

  toggleFilter(){
    if(this.filterShow){
      this.filterShow = false;
    }
    else{
      this.filterShow = true;
    }
  }

  updateDateFilter(inputDateFilter, e){

    this.filterDateInputs.thisWeek = false;
    this.filterDateInputs.lastWeek = false;
    this.filterDateInputs.thisMonth = false;
    this.filterDateInputs.custom = false;

    if(inputDateFilter == 'custom'){   //  Custom
      this.openCalendar('customeDate');
      this.filterDateInputs.custom = true;
      e.currentTarget.checked = true;
    }
    else if(inputDateFilter == 'lastWeek'){     // Last week
      this.coursePlannerFilters.from_date = moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().subtract(1, 'weeks').endOf('isoWeek').format("YYYY-MM-DD");
      this.filterDateInputs.lastWeek = true;
      e.currentTarget.checked = true;
    }
    else if(inputDateFilter == 'thisMonth'){     // This month
      this.coursePlannerFilters.from_date = moment().format("YYYY-MM-01");
      this.coursePlannerFilters.to_date = moment().format("YYYY-MM-") + moment().daysInMonth();
      this.filterDateInputs.thisMonth = true;
      e.currentTarget.checked = true;
    }
    else if(inputDateFilter == 'thisWeek'){   // This Week
      this.coursePlannerFilters.from_date = moment().isoWeekday("Monday").format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().weekday(7).format("YYYY-MM-DD");
      this.filterDateInputs.thisWeek = true;
      e.currentTarget.checked = true;
    }

  }

  updateStatusFilter(e, statusFilter){
    if(!e.currentTarget.checked){
      if(statusFilter == 'upcoming'){
        this.coursePlannerFilters.isUpcoming = "N";
      }
      else if(statusFilter == 'pending'){
        this.coursePlannerFilters.isPending = "N";
      }
      else if(statusFilter == 'marksUpdated'){
        this.coursePlannerFilters.isCompleted =  "N";
      }
      else if(statusFilter == 'marksPending'){
        this.coursePlannerFilters.isMarksUpdate =  "N";
      }
      else if(statusFilter == 'cancelled'){
        this.coursePlannerFilters.isCancelled = "N";
      }
    }
    else if(e.currentTarget.checked){
      if(statusFilter == 'upcoming'){
        this.coursePlannerFilters.isUpcoming = "Y";
      }
      else if(statusFilter == 'pending'){
        this.coursePlannerFilters.isPending = "Y";
      }
      else if(statusFilter == 'marksUpdated'){
        this.coursePlannerFilters.isCompleted =  "Y";
      }
      else if(statusFilter == 'marksPending'){
        this.coursePlannerFilters.isMarksUpdate =  "Y";
      }
      else if(statusFilter == 'cancelled'){
        this.coursePlannerFilters.isCancelled = "Y";
      }
    }
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  updateFilterDateRange(e) {
    if(this.filterDateInputs.custom){
      this.coursePlannerFilters.from_date = moment(e[0]).format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment(e[1]).format("YYYY-MM-DD");
    }
  }

  getData(){
    this.filterShow = false;
    this.jsonFlag.showHideColumn = false;
    this.auth.showLoader();
    // Course/bacth model and master course is selected check
    if((!this.jsonFlag.isProfessional && this.coursePlannerFilters.master_course_name == "-1") ||
       (this.jsonFlag.isProfessional && this.coursePlannerFilters.standard_id == "-1")) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please select master course');
      this.auth.hideLoader();
      return;
    }
    else{   // Get Course Planner Data
      this.classService.getCoursePlannerData(this.coursePlannerFilters, this.coursePlannerFor).subscribe(
        res => {
          console.log(res)
          this.auth.hideLoader();
          this.allData = res;
          if(this.allData.length == 0){
            this.msgService.showErrorMessage(this.msgService.toastTypes.info, 'Info', "No result found");
          }
          else{
            this.totalCount = this.allData.length;
            this.pageIndex = 1;
            this.fectchTableDataByPage(this.pageIndex);
          }
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      );
    }
  }

  showHideCol(){   // toggle function to show and hide menu/pop up
    if(this.jsonFlag.showHideColumn){
      this.jsonFlag.showHideColumn = false;
    }
    else{
      this.jsonFlag.showHideColumn = true;
    }
  }

  hideCol(e){   //  change column of column to show and hide
    if(!e.currentTarget.checked){
      this.checkedColCounter++;
    }
    else{
      this.checkedColCounter--;
    }
  }

  hideShowHideMenu(){
    this.jsonFlag.showHideColumn = false;
  }


  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.pageIndex++;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.pageIndex--;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.coursePlannerData = this.getDataFromDataSource(startindex);
  }

  getDataFromDataSource(startindex) {
    let t = this.allData.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.getData();
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

  closeAll(){
    this.filterShow = false;
  }


  // Send Reminder pop up section///
  // Course Model
  sendReminderForCourse(data) {
    if (confirm('Are you sure you want to notify?')) {
      let obj = {
        course_exam_schedule_id: data.schedule_id,
        course_id: data.course_id,
        requested_date: moment(data.date).format('YYYY-MM-DD')
      }
      this.auth.showLoader();
      this.widgetService.sendReminder(obj).subscribe(
        res => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Reminder Sent', 'Reminder Sent Successfull');
        },
        err => {
          this.auth.hideLoader();
          console.log(err);
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      )
    }
  }

  // Batch Model
  notifyExamSchedule(data) {
    if (confirm('Are you sure you want to send Exam Schedule SMS to the batch?')) {
      this.auth.showLoader();
      this.widgetService.notifyStudentExam(data.schedule_id).subscribe(
        res => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Notified', 'Notification Sent Successfully');
        },
        err => {
          this.auth.hideLoader();
          //console.log(err);
        }
      )
    }

  }


  // Cancel Exam section

  // Cancel Exam for Course model

  onCancelExamClickCourse(data) {
    this.tempData = data;
    this.courseTempData = data;
    this.courseCommonExamCancelPopUP = true;
  }

  // cancelExamCourseWise() {
  //   this.showReasonSection = "Course";
  //   this.cancelPopUpData = {
  //     reason: "",
  //     notify: true
  //   };
  // }


  // cancelSubjectWiseExam(data) {
  //   this.showReasonSection = "Subject";
  //   this.tempData = data;
  //   this.cancelPopUpData = {
  //     reason: "",
  //     notify: true
  //   };
  // }

  cancelExamCall() {
    let notify: any;
    if (this.cancelPopUpData.notify) {
      notify = 'Y';
    } else {
      notify = 'N';
    }
    if (this.cancelPopUpData.reason.trim() == "" || null) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter reason');
      return false;
    }
      let obj = {
        cancel_reason: this.cancelPopUpData.reason,
        course_exam_schedule_id: this.tempData.schedule_id,
        course_id: this.tempData.course_id,
        is_cancel_notify: notify,
        requested_date: moment(this.tempData.date).format('YYYY-MM-DD')
      }
      // this.auth.showLoader();
      this.widgetService.cancelExamScheduleCourse(obj).subscribe(
        res => {
          // this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Cancelled', 'Exam Cancelled Successfully');
          this.closePopUpCommon();
          this.getData();
        },
        err => {
          // this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      )
  }

  closePopUpCommon() {
    this.tempData = "";
    this.subjectList = [];
    this.courseCommonExamCancelPopUP = false;
    this.showReasonSection = "";
    this.courseTempData = '';
    this.cancelPopUpData.reason = "";
  }



  // Cancel Exam for Batch MODEL

  onCancelExamClick(data) {
    this.cancelExamPopUP = true;
    this.tempData = data;
  }

  closeExamPopup() {
    this.cancelExamPopUP = false;
    this.tempData = "";
    this.cancelPopUpData = {
      reason: "",
      notify: true
    }
  }

  cancelExamClassSchedule() {
    if (this.cancelPopUpData.reason.trim() == "" || null) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter cancellation reason');
      return;
    }
    let notify: any = "";
    if (this.cancelPopUpData.notify) {
      notify = "Y";
    } else {
      notify = "N";
    }
    let obj: any = {
      batch_id: this.tempData.batch_id,
      exam_freq: "OTHER",
      cancelSchd: [{
        schd_id: this.tempData.schedule_id,
        exam_desc: this.cancelPopUpData.reason,
        is_notified: notify
      }]
    }
    // this.auth.showLoader();
    this.widgetService.cancelExamSchedule(obj).subscribe(
      res => {
        // this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Successfully Cancelled', 'Exam Schedule Cancelled Successfully');
        this.closeExamPopup();
        this.getData();
      },
      err => {
        // this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }



  //  Notify to Cancel Class
    notifyCancelClass(selected){
      if (confirm('Are you sure you want to notify?')) {
        let obj = {};
        if(!this.jsonFlag.isProfessional){
          obj = {
            "institute_id": this.jsonFlag.institute_id,
            "schedule_id": selected.schedule_id,
            "to_date": selected.date,
            "course_id": selected.course_id
          }
        }
        else{
          obj = {
            "institute_id": this.jsonFlag.institute_id,
            "schedule_id": selected.schedule_id,
            "to_date": selected.date,
            "batch_id": selected.batch_id
          }
        }

        this.auth.showLoader();
        this.classService.notifyCancelClass(obj, 'exam').subscribe(
          res => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Cancelled schedule notification', 'Notification has been sent successfully');
          },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          }
        )
      }
    }


  // Update Attendance
  markAttendanceExamCourse(exam) {
    let obj  = {};
    if(this.jsonFlag.isProfessional){
      obj = {
        batch_id: exam.batch_id,
        schd_id: exam.schedule_id,
        batch_name: exam.batch_name,
        topics_covered: exam.topic_covered_ids,
        course_name: exam.standard_name,
        master_course_name: exam.batch_name,
        subject_id: exam,
        forCourseWise: true,
        forSubjectWise: false,
        isExam: true,
        is_attendance_marked: exam.is_attendance_marked
      }
    }
    else{
       obj = {
          course_exam_schedule_id: exam.schedule_id,
          course_name: exam.course_name,
          master_course_name: exam.master_course_name,
          batch_name: exam.course_name,
          forCourseWise: true,
          forSubjectWise: false,
          isExam: true,
          schedDate: moment(exam.date).format('YYYY-MM-DD'),
          is_attendance_marked: exam.is_attendance_marked
        }
    }
    let batch_info = JSON.stringify(obj);
    this.storeSession();
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(false));
    this.router.navigate(['/view/home/mark-attendance']);

  }


  // Update Exam Marks for course model
  examMarksUpdateCourse(data) {
    let examInfoObj = {
      "course_exam_schedule_id": data.schedule_id,
      "course_marks_update_level": data.course_mark_level_level,
      "is_exam_grad_feature": "",
      "batch_name": data.master_course_name+"-"+data.course_name+"-"+data.subject_name
    };

    let obj = {
        data: examInfoObj
      }
    let exam_info = JSON.stringify(obj);
    this.storeSession();
    sessionStorage.setItem('exam_info', btoa(exam_info));
    sessionStorage.setItem('isSubjectView', String(false));
    this.router.navigate(['/view/home/exam-marks']);
  }

  // Update Exam marks for Batch model
  examMarksUpdate(data) {
    let examInfoObj = {
      "schd_id": data.schedule_id,
      "batch_id": data.batch_id,
      "class_schedule_id": data.schedule_id
    };

    let obj = {
        data: examInfoObj
      }
    let exam_info = JSON.stringify(obj)
    this.storeSession();
    sessionStorage.setItem('exam_info', btoa(exam_info));
    sessionStorage.setItem('isSubjectView', String(false));
    this.router.navigate(['/view/home/exam-marks-batch']);
  }


  storeSession(){

    this.sessionFiltersArr.isCompleted = this.filterStatusInputs.marksUpdated;
    this.sessionFiltersArr.isPending = this.filterStatusInputs.attendancePending;
    this.sessionFiltersArr.isCancelled = this.filterStatusInputs.cancelled;
    this.sessionFiltersArr.isUpcoming = this.filterStatusInputs.upcoming;
    this.sessionFiltersArr.isMarksUpdate = this.filterStatusInputs.marksPending;
    this.sessionFiltersArr.from_date = String(this.coursePlannerFilters.from_date);
    this.sessionFiltersArr.to_date = String(this.coursePlannerFilters.to_date);
    this.sessionFiltersArr.masterCourse = this.inputElements.masterCourse;
    this.sessionFiltersArr.courseId = this.inputElements.course;
    this.sessionFiltersArr.batchId = this.inputElements.subject;


    this.sessionFiltersArr.standardId = this.inputElements.standard_id;
    this.sessionFiltersArr.subjectId = this.inputElements.subject_id;
    if(!this.jsonFlag.isProfessional){
      this.sessionFiltersArr.batchId = this.inputElements.subject;
    }
    else{
      this.sessionFiltersArr.batchId = this.inputElements.batch_id;
    }

    this.sessionFiltersArr.facultyId = this.inputElements.faculty;
    this.sessionFiltersArr.thisWeek = this.filterDateInputs.thisWeek;
    this.sessionFiltersArr.lastWeek = this.filterDateInputs.lastWeek;
    this.sessionFiltersArr.thisMonth = this.filterDateInputs.thisMonth;
    this.sessionFiltersArr.custom = this.filterDateInputs.custom;

    let filter_info = JSON.stringify(this.sessionFiltersArr);
    sessionStorage.setItem('isClass', String(false));
    sessionStorage.setItem('isFromCoursePlanner', String(true));
    sessionStorage.setItem('coursePlannerFilter', filter_info);
  }

  redirect(){
    this.storeSession();
    this.router.navigate(['/view/course/create/exam']);
  }


// Edit class functions
  editCourseExam(course){
    console.log(course)

    this.editClass.description = course.description;
    this.editClass.topic_covered_ids = course.topic_covered_ids;
    this.editClass.topic_covered_names = course.topics_covered;
    this.editClass.subject_id = course.subject_id;
    this.editClass.course_id = course.course_id;
    this.editClass.class_sche_date = course.date;
    if(this.jsonFlag.isProfessional){
      this.editClass.batch_id = course.batch_id;
    }
    this.editClass.class_schedule_id = course.schedule_id;
    this.editClass.start_time = course.start_time;
    this.editClass.end_time = course.end_time;
    this.editClass.total_marks = course.total_marks;
    this.editClass.duration = course.duration;
    this.editClass.course_exam_schedule_id = course.course_id;
    this.editClass.room_no = course.room_no;

  }

  toggleArrow(topic){
    topic.isExpand = !(topic.isExpand);
  }

  fetchTopics(){
    this.auth.showLoader();
    let subject_id = '';
    if(this.jsonFlag.isProfessional){
      subject_id = this.editClass.course_id;
    }
    else{
      subject_id = this.editClass.subject_id;
    }
    this.topicService.getAllTopicsSubTopics(subject_id).subscribe((resp)=>{
      this.auth.hideLoader();
      this.topicsList = [];
      this.totalTopicsList = [];
      this.topicsList = resp;
      if(!!this.topicsList && this.topicsList.length > 0){
        $('#topicModel').modal('show');
        $('#editExam').modal('hide');

        this.topicsList.forEach(tpc =>{
          this.totalTopicsList.push(tpc);
          tpc.checked = false;
          if(tpc.subTopic.length){
            this.getAllTopics(tpc.subTopic)
          }
        })

        let topicIds = this.editClass.topic_covered_ids.split('|');
        topicIds.forEach(tpc =>{
            this.topicsList.forEach(tp =>{
              if(tp.topicId == tpc){
                tp.checked = true;
              }
            })
        })

        console.log(this.topicsList);
      }
      else {
        this.msgService.showErrorMessage(this.msgService.toastTypes.info, 'Info', "No topics available to link");
      }
    },err =>{
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
    })
  }

  getAllTopics(topic){
    topic.forEach(obj =>{
      this.totalTopicsList.push(obj);
      obj.checked = false;
      if(obj.subTopic.length){
        this.getAllTopics(obj.subTopic)
      }
    })
  }

  selectTopics(topic,event){
    topic.checked = !topic.checked;
      if(topic.subTopic.length){
        this.checkAllSubTopics(topic.subTopic, event.target.checked);
      }
      if(!event.target.checked){
        if(topic.parentTopicId != 0){
          this.uncheckParent(topic);
        }
      }
      this.checkParents(topic);
  }

  checkAllSubTopics(topic,param){
    topic.forEach(obj =>{
      if(param){
      obj.checked = true;
      }
      else{
        obj.checked = false
      }
      if(obj.subTopic.length){
        this.checkAllSubTopics(obj.subTopic,param);
      }
    })
  }

  //uncheck parent if any of the child is deselected
  uncheckParent(topic){
    var getParentTopic = this.totalTopicsList.find(obj => obj.topicId == topic.parentTopicId);
    if(!!getParentTopic){
      getParentTopic.checked = false;
      if(getParentTopic.parentTopicId != 0){
        this.uncheckParent(getParentTopic)
      }
    }
  }
  //check parent if all subtopics are checked
  checkParents(topic){
    var checkAll: boolean = true;
    if(this.totalTopicsList.find(el => el.topicId == topic.topicId) != undefined){
      var parentTopic = this.totalTopicsList.find(ele => ele.topicId == topic.parentTopicId);
      if(parentTopic != undefined){
      if(parentTopic.subTopic.length){
        parentTopic.subTopic.forEach(subTpc =>{
          if(!subTpc.checked){
            checkAll = false;
          }
        });
        if(checkAll){
          parentTopic.checked = true;
          if(parentTopic.parentTopicId != 0){
            this.checkParents(parentTopic)
          }
        }
      }
    }
    }
  }

  saveTopics(){
    var getSelectedTopics = this.totalTopicsList.filter(el => el.checked == true);
    var getTopicIds;
    if(getSelectedTopics != undefined){
    getTopicIds = getSelectedTopics.map(obj =>{
      return obj.topicId;
    })
    getTopicIds = getTopicIds.join('|')
    console.log(getTopicIds);
    console.log(getSelectedTopics)

    this.editClass.topic_covered_ids = getTopicIds;
    this.editClass.topic_covered_names = '';
    for (let index = 0; index < getSelectedTopics.length; index++) {
      this.editClass.topic_covered_names += getSelectedTopics[index].topicName;
    }
    $('#topicModel').modal('hide');
    $('#editExam').modal('show');
  }

  }

  updateExam(){
    if(!this.jsonFlag.isProfessional){ // for course model
        let obj = {
          "master_course": this.inputElements.masterCourse,
          "requested_date": this.editClass.class_sche_date,
          "coursesList": [{
            "course_id": this.editClass.course_id,
            "course_exam_schedule_id": this.editClass.course_exam_schedule_id,
            "exam_start_time": this.editClass.start_time,
            "exam_end_time": this.editClass.end_time,
            "courseClassSchdList": [{
                    "batch_id": this.editClass.batch_id,
                    "start_time": this.editClass.start_time,
                    "end_time": this.editClass.end_time,
                    "class_desc": this.editClass.description,
                    "duration": this.editClass.duration,
                    "total_marks": this.editClass.total_marks,
                    "topics_covered": this.editClass.topic_covered_ids,
                    "room_no": this.editClass.room_no,
                    "class_schedule_id": this.editClass.class_schedule_id
            }]
          }]
        }

      // let obj =  {
      //   "batch_id": this.editClass.batch_id,
      //   "exam_freq": "Other",
      //   "otherSchd": [{
      //           "exam_date": this.editClass.class_sche_date,
      //           "start_time" : this.editClass.start_time,
      //           "end_time": this.editClass.end_time,
      //           "total_marks": this.editClass.total_marks,
      //           "exam_desc": this.editClass.description,
      //           "isReferenced": "N",
      //           "duration": this.editClass.duration,
      //           "schd_id": this.editClass.class_schedule_id
      //             }]
      //     }

      	this.examService.updateExamSch(obj).subscribe(
          res => {
            this.auth.hideLoader();
            let result: any = res;
            $('#editExam').modal('hide');
            if(result.statusCode == 200){
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Class updated successfully');
              this.getData();
            }
          },
          err => {
            $('#editExam').modal('hide');
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          }
        )

    }
    else{
      let obj = {
        "batch_id": this.editClass.batch_id,
        "is_exam_schedule": "Y",
        "class_schedule_id": this.editClass.class_schedule_id,
        "exam_desc": this.editClass.description,
        "topics_covered": this.editClass.topic_covered_ids,
        "cousre_planner_update_operation": "desc_and_topic_covered_update"
      }
      this.classService.changeClassTeacher(obj).subscribe(   // update exam for batch model
        res => {
          this.auth.hideLoader();
          let result: any = res;
          $('#editExam').modal('hide');
          if(result.statusCode == 200){
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Exam updated successfully');
            this.clearEditValues();
            this.getData();
          }
        },
        err => {
          $('#editExam').modal('hide');
          this.auth.hideLoader();
          this.clearEditValues();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      )

    }

  }

  clearEditValues(){
      this.editClass.description = "";
      this.editClass.topic_covered_ids = "";
      this.editClass.topic_covered_names = "";
      this.editClass.subject_id = "";
      this.editClass.course_id = "";
      this.editClass.class_sche_date = "";
      this.editClass.class_schedule_id = "";
      this.editClass.batch_id = "";
      this.editClass.start_time = "";
      this.editClass.end_time = "";
      this.editClass.total_marks = "";
      this.editClass.duration = "";
  }

}
