import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { ClassScheduleService } from '../../../../services/course-services/class-schedule.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { CoursePlanner } from '../course-planner.model';
import { SessionFilter } from '../session-filter.model';
import { WidgetService } from '../../../../services/widget.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated
})

export class ClassComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    showHideColumn: false
  };
  coursePlannerFor: String = "class";
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
    completed: true,
    cancelled: true,
  };
  // Default col show hide status
  showHideColumns = {
    course: true,
    subject: true,
    teacher: true,
    topic: true,
    description: false,
    homework: false
  };
  // for show hide table columns
  checkedColCounter: number = 2;
  dynamicColCounter: number = 2;
  userType: any = 0;
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

  // pop up section flags and arrays
  classMarkedForAction: any;
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  isReminderPop: boolean = false;
  isReschedulePop: boolean = false;
  isCancelPop: boolean = false;    // For Course MODEL
  isCourseCancel: boolean = false;  // For Batch Model

  // FOR Reschedule
  reschedDate: any = new Date();
  reschedReason: any = "";
  resheduleNotified: any = "Y";
  timepicker: any = {
    reschedStartTime: {
      hour: '12 PM',
      minute: '00',
      meridian: ''
    },
    reschedEndTime: {
      hour: '1 PM',
      minute: '00',
      meridian: ''
    },
  }

  // FOR NOTIFY
  reminderRemarks: string = '';
  remarksLimit: number = 50;

  // FOR CANCEL PopUP
  cancellationReason: string = '';
  is_notified: any = 'Y';

  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private classService: ClassScheduleService,
    private widgetService: WidgetService
  ) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('userType');
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )

    this.coursePlannerFilters.isMarksUpdate =  "N";
    this.showHideColForModel();
    this.fetchPreFillData();
    this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');
    let filters = sessionStorage.getItem('coursePlannerFilter');
    if(filters){
      this.sessionFilters(filters);
    }
  }

  showHideColForModel(){
    if(this.jsonFlag.isProfessional){
      this.dynamicColCounter = 1;
      this.checkedColCounter = 1;
      this.showHideColumns.description = true;
      this.showHideColumns.topic = false;
    }
  }

  clearFilters(){
    sessionStorage.setItem('batch_info', '');
    sessionStorage.setItem('isSubjectView', '');
    sessionStorage.setItem('isFromCoursePlanner', '');
    sessionStorage.setItem('coursePlannerFilter', '');
    this.sessionFiltersArr = new SessionFilter();
  }

  sessionFilters(filters){
    this.sessionFiltersArr = JSON.parse(filters);
    this.inputElements.masterCourse = this.sessionFiltersArr.masterCourse;
    this.inputElements.course = this.sessionFiltersArr.courseId;
    this.inputElements.standard_id = this.sessionFiltersArr.standardId;
    this.inputElements.subject_id = this.sessionFiltersArr.subjectId;
    if(!this.jsonFlag.isProfessional){
      this.inputElements.subject = this.sessionFiltersArr.batchId;
    }
    else{
      this.inputElements.batch_id = this.sessionFiltersArr.batchId;
    }
    this.inputElements.faculty = this.sessionFiltersArr.facultyId;
    this.filterStatusInputs.completed = this.sessionFiltersArr.isCompleted;
    this.filterStatusInputs.attendancePending = this.sessionFiltersArr.isPending;
    this.filterStatusInputs.cancelled = this.sessionFiltersArr.isCancelled;
    this.filterStatusInputs.upcoming = this.sessionFiltersArr.isUpcoming;
    this.filterDateInputs.thisWeek = this.sessionFiltersArr.thisWeek;
    this.filterDateInputs.lastWeek = this.sessionFiltersArr.lastWeek;
    this.filterDateInputs.thisMonth = this.sessionFiltersArr.thisMonth;
    this.filterDateInputs.custom = this.sessionFiltersArr.custom;

    this.coursePlannerFilters.master_course_name = this.sessionFiltersArr.masterCourse;
    this.coursePlannerFilters.course_id = this.sessionFiltersArr.courseId;
    this.coursePlannerFilters.batch_id = this.sessionFiltersArr.batchId;
    this.coursePlannerFilters.teacher_id = this.sessionFiltersArr.facultyId;


    if(!this.filterStatusInputs.completed){
      this.coursePlannerFilters.isCompleted = "N";
    }
    if(!this.filterStatusInputs.attendancePending){
      this.coursePlannerFilters.isPending = "N";
    }
    if(!this.filterStatusInputs.cancelled){
      this.coursePlannerFilters.isCancelled = "N";
    }
    if(!this.filterStatusInputs.upcoming){
      this.coursePlannerFilters.isUpcoming = "N";
    }

    this.coursePlannerFilters.from_date = moment(this.sessionFiltersArr.from_date).format("YYYY-MM-DD");
    this.coursePlannerFilters.to_date = moment(this.sessionFiltersArr.to_date).format("YYYY-MM-DD");

    sessionStorage.setItem('isFromCoursePlanner', String(false));
    sessionStorage.setItem('coursePlannerFilter', '');
    setTimeout (() => {
       this.getData();
    }, 2000);
  }


    fetchPreFillData(){
    // get master course - course - subject data  for course model
    if(!this.jsonFlag.isProfessional){
      this.jsonFlag.isRippleLoad = true;
      this.classService.getAllMasterCourse().subscribe(
        res => {
          this.masterCourseList = res;
          if(this.sessionFiltersArr.masterCourse != "-1"){  //update course list if it was set in session
            this.updateCoursesList();
          }
          this.jsonFlag.isRippleLoad = false;
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
          this.jsonFlag.isRippleLoad = false;
        }
      );
    }
    else{
      // get master course - course - subject data  for Batch model
      this.jsonFlag.isRippleLoad = true;
      this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
        res => {
          this.masterCourseList = res.standardLi;
          this.batchList = res.batchLi;
          if(this.sessionFiltersArr.standardId != "-1"){   //update course list if it was set in session
            this.updateCoursesList();
          }
          this.jsonFlag.isRippleLoad = false;
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
         }
      );
    }

    // get active faculty list
    this.classService.getAllTeachersList().subscribe(
      res => {
        this.facultyList = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
      }
    );
  }

  updateCoursesList() {
    // For Course Model
    if(!this.jsonFlag.isProfessional){
      this.coursePlannerFilters.master_course_name = this.inputElements.masterCourse;
      if(this.sessionFiltersArr.courseId != "-1" && this.sessionFiltersArr.courseId != ""){  // if courseid is set in seesion then fetch data according to it
        this.inputElements.course = this.sessionFiltersArr.courseId;
      }
      else{   // else reset to default values
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
            if(this.sessionFiltersArr.courseId != "-1" && this.sessionFiltersArr.courseId != ""){   //
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
    // For Batch Model
    else{
      this.coursePlannerFilters.standard_id = this.inputElements.standard_id;
      this.inputElements.subject_id = "-1";
      this.coursePlannerFilters.subject_id =  "-1";
      if(this.inputElements.standard_id == "-1"){
        this.courseList = [];
      }
      else{
        // Fetch batches according to standard and subject id for all active batches
        this.jsonFlag.isRippleLoad = true;
        this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
          res => {
            this.jsonFlag.isRippleLoad = false;
            this.courseList = res.subjectLi;
            this.batchList = res.batchLi;
            this.jsonFlag.isRippleLoad = false;
            for (var i = 0; i < this.masterCourseList.length; i++) {
              if(this.masterCourseList[i].standard_id == this.inputElements.standard_id){
                this.courseStartDate = this.masterCourseList[i].start_date;
                this.courseEndDate = this.masterCourseList[i].end_date;
                if(this.sessionFiltersArr.subjectId != "-1" && this.sessionFiltersArr.subjectId != ""){   // check subject id null to fetch course according to it.
                  this.inputElements.subject_id = this.sessionFiltersArr.subjectId;
                  this.updateSubjectsList();
                }
                return;
              }
            }
          },
          err => {
            this.jsonFlag.isRippleLoad = false;
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err);
           }
        );
      }
    }
  }

  updateSubjectsList(){
    // For Course Model
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
            this.clearFilters();  // after updating all the filter values clear session filter
            return;
          }
        }
      }
    }
    // For Batch Model
    else{
      this.jsonFlag.isRippleLoad = true;
      this.coursePlannerFilters.subject_id = this.inputElements.subject_id;
      this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
          this.batchList = res.batchLi;
          this.clearFilters();
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err);
         }
      );
    }

  }

  updateSubject(){   // after selecting batch update course planner payload value
    if(!this.jsonFlag.isProfessional){   // for Course Model
      this.coursePlannerFilters.batch_id = this.inputElements.subject;
    }
    else{  // For Batch Model
      this.coursePlannerFilters.batch_id = this.inputElements.batch_id;
    }
  }

  updateFacultyInFilter(){  //  set faculty id in course planner payload
    this.coursePlannerFilters.teacher_id = this.inputElements.faculty;
  }

  toggleFilter(){  // show hide filter
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
    if(!e.currentTarget.checked){   // if checkbox is unchecked then set courseplanner payload
      if(statusFilter == 'upcoming'){
        this.coursePlannerFilters.isUpcoming = "N";
      }
      else if(statusFilter == 'pending'){
        this.coursePlannerFilters.isPending = "N";
      }
      else if(statusFilter == 'completed'){
        this.coursePlannerFilters.isCompleted =  "N";
      }
      else if(statusFilter == 'cancelled'){
        this.coursePlannerFilters.isCancelled = "N";
      }
    }
    else if(e.currentTarget.checked){   // if checkbox is getting checked
      if(statusFilter == 'upcoming'){
        this.coursePlannerFilters.isUpcoming = "Y";
      }
      else if(statusFilter == 'pending'){
        this.coursePlannerFilters.isPending = "Y";
      }
      else if(statusFilter == 'completed'){
        this.coursePlannerFilters.isCompleted =  "Y";
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

  getData(){   //  Fetch Course Planner data according to filters
    this.filterShow = false;
    this.jsonFlag.showHideColumn = false;
    this.jsonFlag.isRippleLoad = true;
    // Course/bacth model and master course is selected
    if((!this.jsonFlag.isProfessional && this.coursePlannerFilters.master_course_name == "-1") ||
       (this.jsonFlag.isProfessional && this.coursePlannerFilters.standard_id == "-1")) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please select master course');
      this.jsonFlag.isRippleLoad = false;
      return;
    }
    else{   // Get Course Planner Data
      this.classService.getCoursePlannerData(this.coursePlannerFilters, this.coursePlannerFor).subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
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
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
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

  hideShowHideMenu(){   // HIDE --> show hide menu
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

  // get  appropriate course planner data according to page
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


  // All pop up section with their functions

  initiateRescheduleClass(selected) {  // Reschdule class pop up
    this.classMarkedForAction = selected;
    this.isReschedulePop = true;
  }

  initiateRemiderClass(selected) {   // Notify to student pop up
    this.classMarkedForAction = selected;
    this.isReminderPop = true;
  }

  initiateCancelClass(selected) {  //  Cancel class for course model pop up
    this.classMarkedForAction = selected;
    this.isCancelPop = true;
  }

  initiateCourseCancelClass(selected) {  // cancel class for batch model
    this.classMarkedForAction = selected;
    this.isCourseCancel = true;
  }

  getVisibility(c): boolean {  // hide upcoming activity
    let d = moment(c.class_date).format("YYYY-MM-DD");
    if (d >= moment(new Date()).format("YYYY-MM-DD")) {
      return true;
    }
    else {
      return false;
    }
  }

  getCheckedStatus(id: string) {
    if (id === "notifyCancel") {
      return true;
    }
    else if (id === 'resheduleNotified') {
      return true;
    }
  }

  notifyRescheduleUpdate(e) {
    if (e.target.checked) {
      this.resheduleNotified = "Y";
    }
    else {
      this.resheduleNotified = "N";
    }
  }

  closeRescheduleClass() {   // close reScheduleClass pop and clear array
    this.isReschedulePop = false;
    this.reschedDate = new Date();
    this.reschedReason = "";
    this.timepicker = {
      reschedStartTime: {
        hour: '12 PM',
        minute: '00',
        meridian: ''
      },
      reschedEndTime: {
        hour: '1 PM',
        minute: '00',
        meridian: ''
      },
    }
  }

  rescheduleClass() {   // Reschdule Class

    if (this.reschedReason == null || this.reschedReason == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide reschedule reason');
      return;
    }

    if (moment().format('YYYY-MM-DD') > moment(this.reschedDate).format('YYYY-MM-DD')) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide future reschedule date');
      return;
    }

    let check = this.checkIfTimeProvided(this.timepicker.reschedStartTime.hour);
    if (check) {
      let startTime = this.timepicker.reschedStartTime.hour.split(' ');
      this.timepicker.reschedStartTime.hour = startTime[0];
      this.timepicker.reschedStartTime.meridian = startTime[1];
    } else {
      return;
    }
    let check1 = this.checkIfTimeProvided(this.timepicker.reschedEndTime.hour);
    if (check1) {
      let endTime = this.timepicker.reschedEndTime.hour.split(' ');
      this.timepicker.reschedEndTime.hour = endTime[0];
      this.timepicker.reschedEndTime.meridian = endTime[1];
    } else {
      return;
    }
    if (this.reSheduleFormValid()) {
      let temp1: any = {
        cancel_note: this.reschedReason,
        schd_id: this.classMarkedForAction.schedule_id,
        is_notified: this.resheduleNotified
      }
      let temp2 = {
        class_date: moment(this.reschedDate).format("YYYY-MM-DD"),
        start_time: this.timepicker.reschedStartTime.hour + ":" + this.timepicker.reschedStartTime.minute + " " + this.timepicker.reschedStartTime.meridian,
        end_time: this.timepicker.reschedEndTime.hour + ":" + this.timepicker.reschedEndTime.minute + " " + this.timepicker.reschedEndTime.meridian,
        duration: this.getDifference()
      }
      let obj = {
        batch_id: this.classMarkedForAction.batch_id,
        cancelSchd: [],
        extraSchd: []
      }
      obj.cancelSchd.push(temp1);
      obj.extraSchd.push(temp2);

      this.jsonFlag.isRippleLoad = true;
      this.widgetService.reScheduleClass(obj).subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Class Rescheduled', 'The request has been processed');
          this.closeRescheduleClass();
          this.getData();
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Failed To Reschedule', err.error.message);
        }
      )
    } else {
      this.timepicker.reschedStartTime.hour = this.timepicker.reschedStartTime.hour + " " + this.timepicker.reschedStartTime.meridian;
      this.timepicker.reschedEndTime.hour = this.timepicker.reschedEndTime.hour + " " + this.timepicker.reschedEndTime.meridian;
    }
  }

  checkIfTimeProvided(data) {
    if (data == "" || data == null) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct time');
      return false;
    } else {
      return true;
    }
  }

  getDifference(): any {
    let startTime = this.timepicker.reschedStartTime.hour + ":" + this.timepicker.reschedStartTime.minute + " " + this.timepicker.reschedStartTime.meridian;
    let endTime = this.timepicker.reschedEndTime.hour + ":" + this.timepicker.reschedEndTime.minute + " " + this.timepicker.reschedEndTime.meridian;
    let start = moment.utc(startTime, "HH:mm A");
    let end = moment.utc(endTime, "HH:mm A");
    if (end.isBefore(start)) {
      end.add(1, 'day');
    }
    let d: any = moment.duration(end.diff(start));
    return d._milliseconds / 60000;
  }

  isTimeValid() {

    if (this.timepicker.reschedStartTime.hour.trim() != '' && this.timepicker.reschedStartTime.minute.trim() != '' && this.timepicker.reschedStartTime.meridian.trim() != '' && this.timepicker.reschedEndTime.hour.trim() != '' && this.timepicker.reschedEndTime.minute.trim() != '' && this.timepicker.reschedEndTime.meridian.trim() != '') {
      let startTime = this.timepicker.reschedStartTime.hour + ":" + this.timepicker.reschedStartTime.minute + " " + this.timepicker.reschedStartTime.meridian;
      let endTime = this.timepicker.reschedEndTime.hour + ":" + this.timepicker.reschedEndTime.minute + " " + this.timepicker.reschedEndTime.meridian;
      let start = moment.utc(startTime, "HH:mm A");
      let end = moment.utc(endTime, "HH:mm A");
      if ((parseInt(start.format("HH")) < parseInt(end.format("HH")))) {
        return true;
      }
      else if ((parseInt(start.format("HH")) == parseInt(end.format("HH"))) && (parseInt(start.format("mm")) < parseInt(end.format("mm")))) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  reSheduleFormValid(): boolean {
    /* Date Validation */
    if (this.reschedDate != '' && this.reschedDate != 'Invalid Date') {
      /* Reschedule Reason */
      if (this.reschedReason.trim() != '') {
        /* Validate Time */
        if (this.isTimeValid()) {
          return true;
        }
        else {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Invalid Time', 'Please provide a complete start and end time for rescheduling');
          return false;
        }
      }
      else {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Reschedule Reason Missing', 'Please mention a reason for rescheduling the class');
        return false;
      }
    }
    /* Date not found */
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Date Missing', 'Please select a date to reschedule class');
      return false;
    }
  }

// FOR NOTIFY POP UP
  closeRemiderClass() {
    this.isReminderPop = false;
    this.reminderRemarks = "";
    this.remarksLimit = 50;
  }

  countRemarksLimit(){
    this.remarksLimit = 50 - this.reminderRemarks.length;
  }

  sendReminder() {  // Send Reminder course wise only

      let obj = {
        batch_id: this.classMarkedForAction.batch_id,
        class_schedule_id: this.classMarkedForAction.schedule_id,
        is_exam_schedule: "N",
        remarks: this.reminderRemarks
      };
      this.jsonFlag.isRippleLoad = true;
      this.widgetService.notifyStudentSchedule(obj).subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Reminder Sent', 'Students have been notified');
          this.closeRemiderClass();
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Failed To Notify', err.error.message);
        }
      )
  }


  initiateCourseRemiderClass() {  // course reminder for class for course-wise
    let obj = {
      course_ids: this.classMarkedForAction.course_id,
      inst_id: this.jsonFlag.institute_id,
      master_course: this.classMarkedForAction.master_course_name,
      requested_date: moment(this.classMarkedForAction.date).format("YYYY-MM-DD"),
      remarks: this.reminderRemarks
    }
    this.jsonFlag.isRippleLoad = true;
    this.widgetService.remindCourseLevel(obj).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Reminder Sent', 'The student have been notified');
        this.reminderRemarks = "";
        this.closeRemiderClass();
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Unable to Send Reminder', err.error.message);
      }
    )
  }

// Cancel class  For Course Model pop Section

  closeCancelClass() {
    // this.isCancelPop = false;
    this.cancellationReason = '';
  }

  cancelClass() {
    let obj = {
      batch_id: this.classMarkedForAction.batch_id,
      cancelSchd: []
    }
    let schd = {
      cancel_note: this.cancellationReason,
      schd_id: this.classMarkedForAction.schedule_id,
      is_notified: this.is_notified
    }
    obj.cancelSchd.push(schd);
    // this.jsonFlag.isRippleLoad = true;
    this.widgetService.cancelClassSchedule(obj).subscribe(
      res => {
        // this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Schedule Cancelled', 'The requested scheduled has been cancelled');
        this.closeCancelClass();
        this.getData();
      },
      err => {
        // this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Failed To Cancel Schedule', err.error.message);
      }
    )
  }

  notifyCancelUpdate(e) {
    if (e.target.checked) {
      this.is_notified = "Y";
    }
    else {
      this.is_notified = "N";
    }
  }


//  Cancel class for batch model pop up

  closeCourseCancelClass() {
    this.isCourseCancel = false;
    this.cancellationReason = '';
  }

  cancelCourseClass() {
    let obj = {
      cancel_reason: this.cancellationReason,
      course_ids: this.classMarkedForAction.course_id,
      inst_id: this.jsonFlag.institute_id,
      is_cancel_notify: this.is_notified,
      master_course: this.classMarkedForAction.master_course_name,
      requested_date: moment(this.classMarkedForAction.date).format("YYYY-MM-DD")
    }
    // this.jsonFlag.isRippleLoad = true;
    this.widgetService.cancelCourseSchedule(obj).subscribe(
      res => {
        // this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Course Schedule Cancelled', 'The requested scheduled has been cancelled');
        this.closeCourseCancelClass();
        this.getData();
      },
      err => {
        // this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Failed To Cancel Schedule', err.error.message);
      }
    )
  }

  cancelBatchClass() {
    if (this.cancellationReason == "" || this.cancellationReason == null) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Cancellation Reason', 'Please provide cancellation reason');
      return;
    }
    let obj = {
      batch_id: this.classMarkedForAction.batch_id,
      cancelSchd: this.getCancelReason()
    }
    // this.jsonFlag.isRippleLoad = true;
    this.widgetService.cancelBatchSchedule(obj).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Batch Schedule Cancelled', 'The requested scheduled has been cancelled');
        this.closeCourseCancelClass();
        this.getData();
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Failed To Cancel Schedule', err.error.message);
      }
    )
  }

  getCancelReason(): any[] {
    let temp = [];
    let obj = {
      cancel_note: this.cancellationReason,
      is_notified: this.is_notified,
      schd_id: this.classMarkedForAction.schedule_id
    }
    temp.push(obj);
    return temp;
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

      this.jsonFlag.isRippleLoad = true;
      this.classService.notifyCancelClass(obj, 'class').subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Cancelled schedule notification', 'Notification has been sent successfully');
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Failed To Notify', err.error.message);
        }
      )
    }
  }

  // Mark Attendance Section
  initiateMarkAttendance(selected) {
    let obj = {
        batch_id: selected.batch_id,
        schd_id: selected.schedule_id,
        batch_name: selected.batch_name,
        subject_id: selected.subject_id,
        topics_covered: selected.topic_covered_ids,
        course_name: selected.course_name,
        master_course_name: selected.master_course_name,
        forCourseWise: false,
        forSubjectWise: true,
        isExam: false,
        is_attendance_marked: selected.is_attendance_marked
      }
    let batch_info = JSON.stringify(obj);
    this.storeSession();
    sessionStorage.setItem('batch_info', btoa(batch_info));
    sessionStorage.setItem('isSubjectView', String(true));
    this.router.navigate(['/view/home/mark-attendance']);
  }

  redirect(){
    this.storeSession();
    this.router.navigate(['/view/course/create/class/add']);
  }

  storeSession(){  // Set all course planner filter values in session
    this.sessionFiltersArr.isCompleted = this.filterStatusInputs.completed;
    this.sessionFiltersArr.isPending = this.filterStatusInputs.attendancePending;
    this.sessionFiltersArr.isCancelled = this.filterStatusInputs.cancelled;
    this.sessionFiltersArr.isUpcoming = this.filterStatusInputs.upcoming;
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
    sessionStorage.setItem('isFromCoursePlanner', String(true));
    sessionStorage.setItem('isClass', String(true));
    sessionStorage.setItem('coursePlannerFilter', filter_info);
  }

  closeAll(){
    this.filterShow = false;
  }
}
