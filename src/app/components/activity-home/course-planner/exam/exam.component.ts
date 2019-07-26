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
import { WidgetService } from '../../../../services/widget.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ExamComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    showHideColumn: false,
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
    completed: true,
    cancelled: true,
  };
  // Default col show hide status
  showHideColumns = {
    subject: true,
    topic: true,
    description: false,
    roomNo: false
  };
  // for show hide table columns
  checkedColCounter: number = 2;
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


  coursePlannerFilters: CoursePlanner = {
   standard_id: "-1",
   subject_id: "-1",
   master_course_name: "-1",
   course_id: "-1",
   batch_id: "-1",
   from_date: moment().isoWeekday("Monday").format("YYYY-MM-DD"),
   to_date: moment().weekday(7).format("YYYY-MM-DD"),
   isCompleted: "Y",
   isPending: "Y",
   isCancelled: "Y",
   isUpcoming: "Y",
   isMarksUpdate: "N",
   teacher_id: "-1"
 };

  filterShow: boolean = false;
  filterDateRange: any = "";
  courseStartDate: any;
  courseEndDate: any;

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 20;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];

  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private classService: ClassScheduleService,
    private widgetService: WidgetService
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
    this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');

    this.fetchPreFillData();
  }

  fetchPreFillData(){
    this.jsonFlag.isRippleLoad = true;
    // get master course - course - subject data  for course model
    if(!this.jsonFlag.isProfessional){
      this.classService.getAllMasterCourse().subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
          this.masterCourseList = res;
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err);
         }
      );
    }
    else{
      // get master course - course - subject data  for Batch model
      this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
          this.masterCourseList = res.standardLi;
          this.batchList = res.batchLi;
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err);
         }
      );
    }


    this.jsonFlag.isRippleLoad = true;
    // get active faculty list
    this.classService.getAllTeachersList().subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.facultyList = res;
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err);
      }
    );
  }

  updateCoursesList() {
    if(!this.jsonFlag.isProfessional){
      this.coursePlannerFilters.master_course_name = this.inputElements.masterCourse;
      if(this.inputElements.masterCourse == ""){
        this.courseList = [];
        this.subjectList = [];
      }
      else{
        for (var i = 0; i < this.masterCourseList.length; i++) {
          if(this.masterCourseList[i].master_course == this.inputElements.masterCourse){
            this.courseList = this.masterCourseList[i].coursesList;
            return;
          }
        }
      }
    }
    else{
      this.coursePlannerFilters.standard_id = this.inputElements.standard_id;
      this.inputElements.subject_id = "-1";
      this.coursePlannerFilters.subject_id = this.inputElements.subject_id;
      if(this.inputElements.standard_id == "-1"){
        this.courseList = [];
      }
      else{
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
    if(!this.jsonFlag.isProfessional){
      this.coursePlannerFilters.course_id = this.inputElements.course;
      if(this.inputElements.course == ""){
        this.subjectList = [];
      }
      else{
        for (var i = 0; i < this.courseList.length; i++) {
          if(this.courseList[i].course_id == this.inputElements.course){
            this.subjectList = this.courseList[i].batchesList;
            this.courseStartDate = this.courseList[i].start_date;
            this.courseEndDate = this.courseList[i].end_date;
            return;
          }
        }
      }
    }
    else{
      this.jsonFlag.isRippleLoad = true;
      this.coursePlannerFilters.subject_id = this.inputElements.subject_id;
      this.classService.getStandardSubjectList(this.inputElements.standard_id, this.inputElements.subject_id, this.inputElements.isAssigned).subscribe(
        res => {
          this.jsonFlag.isRippleLoad = false;
          this.batchList = res.batchLi;
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err);
         }
      );
    }

  }

  updateSubject(){
    this.coursePlannerFilters.batch_id = this.inputElements.subject;
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

  updateDateFilter(inputDateFilter){

    this.filterDateInputs.thisWeek = false;
    this.filterDateInputs.lastWeek = false;
    this.filterDateInputs.thisMonth = false;
    this.filterDateInputs.custom = false;

    if(inputDateFilter == 'custom'){   //  Custom
      this.openCalendar('customeDate');
      this.filterDateInputs.custom = true;
    }
    else if(inputDateFilter == 'lastWeek'){     // Last week
      this.coursePlannerFilters.from_date = moment().subtract('week', 1).format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().format("YYYY-MM-DD");
      this.filterDateInputs.lastWeek = true;
    }
    else if(inputDateFilter == 'thisMonth'){     // This month
      this.coursePlannerFilters.from_date = moment().format("YYYY-MM-01");
      this.coursePlannerFilters.to_date = moment().format("YYYY-MM-") + moment().daysInMonth();
      this.filterDateInputs.thisMonth = true;
    }
    else if(inputDateFilter == 'thisWeek'){   // This Week
      this.coursePlannerFilters.from_date = moment().isoWeekday("Monday").format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().weekday(7).format("YYYY-MM-DD");
      this.filterDateInputs.thisWeek = true;
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
      else if(statusFilter == 'completed'){
        this.coursePlannerFilters.isCompleted =  "N";
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
    this.coursePlannerFilters.from_date = moment(e[0]).format("YYYY-MM-DD");
    this.coursePlannerFilters.to_date = moment(e[1]).format("YYYY-MM-DD");
  }

  getData(){
    this.filterShow = false;
    this.jsonFlag.showHideColumn = false;
    this.jsonFlag.isRippleLoad = true;
    // Course/bacth model and master course is selected check
    if((!this.jsonFlag.isProfessional && this.coursePlannerFilters.master_course_name == "-1") ||
       (this.jsonFlag.isProfessional && this.coursePlannerFilters.standard_id == "-1")) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please select master course');
      this.jsonFlag.isRippleLoad = false;
      return;
    }
    else{   // Get Course Planner Data
      this.classService.getCoursePlannerData(this.coursePlannerFilters, this.coursePlannerFor).subscribe(
        res => {
          console.log(res)
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
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err);
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

}
