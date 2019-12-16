import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';
import { MessageShowService } from '../../../services/message-show.service';
import { ActivityPtmService } from '../../../services/activity-ptmservice/activity-ptm.service';

@Component({
  selector: 'app-ptm-management',
  templateUrl: './ptm-management.component.html',
  styleUrls: ['./ptm-management.component.scss']
})
export class PtmManagementComponent implements OnInit {

  jsonFlag = {
    isRippleLoad: false,
    isProfessional: false
  }
  // apis variables to send
  inputElements = {
    masterCourse: "-1",
    course: "-1",
    subject: "-1",
    batch_id: "-1",
    ptmId: "-1"
  };

  hrs = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  mins = ["00", "15", "30", "45"];

  startTime = {
    startHH: "12",
    startMM: "00",
    startMed: "PM"
  };

  endTime = {
    endHH: "01",
    endMM: "00",
    endMed: "PM"
  };

  batchQueryParam = {
    is_active: 1
  }
  getptmDates = {
    batch_id: "-1"
  }

  searchInput: string = '';

  // Create PTM variables
  createPTMShow: boolean = false;
  createPTMAllBatches: any[] = [];
  ptmScheduleDate: any;
  today: any = Date.now();
  ptmSelectAll: boolean = false;
  createPTM = {
    batchArray: [],
    startTimeArray: [],
    endTimeArray: [],
    ptm_date: moment().format("YYYY-MM-DD")
  };

  // All Array list
  masterCourseList: any;
  courseList: any[] = [];
  subjectList: any[] = [];
  getAllBatches: any[] = [];
  fetchPtmDates: any[] = [];
  viewStudents: any[] = [];
  tempStudents: any[] = [];

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 20;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];

  queryStatus: any;
  illustration: boolean = true;

  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private ptmService: ActivityPtmService,
    private msgService: MessageShowService
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )

    if(this.jsonFlag.isProfessional){
      this.fetchBatchesList();
    }
    else{
      this.fetchPreFillData();
    }
  }

  fetchPreFillData(){
  this.jsonFlag.isRippleLoad = true;
  //get master course - course - subject data  for course model
    this.ptmService.getAllMasterCourse().subscribe(
      res => {
        this.masterCourseList = res;
        this.jsonFlag.isRippleLoad = false;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
        this.jsonFlag.isRippleLoad = false;
       }
    );
  }

  updateCoursesList(){
    for (var i = 0; i < this.masterCourseList.length; i++) {
      if(this.masterCourseList[i].master_course == this.inputElements.masterCourse){
       this.courseList = this.masterCourseList[i].coursesList;
          this.inputElements.course = "-1";
          this.subjectList = [];
          this.fetchPtmDates = [];
          return;
      }
    }
  }

  updateSubjectsList(){
    for (var i = 0; i < this.courseList.length; i++) {
      if(this.courseList[i].course_id == this.inputElements.course){
        this.subjectList = this.courseList[i].batchesList;
        this.inputElements.subject = "-1";
        return;
      }
    }
  }

  fetchBatchesList() {
    this.jsonFlag.isRippleLoad = true;
    this.ptmService.getBatches(this.batchQueryParam).subscribe(
      (data: any) => {
        this.getAllBatches = data;
        this.jsonFlag.isRippleLoad = false;
      },
      (error: any) => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }

  loadPtmDates() {
    this.inputElements.ptmId = "-1";
    if(!this.jsonFlag.isProfessional){
      this.getptmDates = {
        batch_id: this.inputElements.subject
      }
    }
    else{
      this.getptmDates = {
        batch_id: this.inputElements.batch_id
      }
    }
    this.jsonFlag.isRippleLoad = true;
    this.ptmService.loadPtm(this.getptmDates).subscribe(
      (data: any) => {
        this.jsonFlag.isRippleLoad = false;
        this.fetchPtmDates = data;
        if(this.fetchPtmDates.length == 0){
          this.msgService.showErrorMessage(this.msgService.toastTypes.info, 'Info', 'No PTM schedule found');
        }
      },
      (error: any) => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }

  viewStudentsData() {
    let validation: boolean = true;
    if(this.jsonFlag.isProfessional){
      if(this.inputElements.batch_id == "-1"){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please select all mandatory field(s)');
        validation = false;
      }
      else if(this.inputElements.ptmId == "-1"){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please select PTM schedule');
        validation = false;
      }
    }
    else{
      if(this.inputElements.masterCourse == "-1" || this.inputElements.course == "-1" || this.inputElements.subject == "-1"){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please select all mandatory field(s)');
        validation = false;
      }
      else if(this.inputElements.ptmId == "-1"){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please select PTM schedule');
        validation = false;
      }
    }
    if(validation){
      this.jsonFlag.isRippleLoad = true;
      this.ptmService.viewStudents(this.inputElements.ptmId).subscribe(
        (data: any) => {
          this.jsonFlag.isRippleLoad = false;
          this.viewStudents = data;
          for (let j = 0; j < this.viewStudents.length; j++) {
            this.viewStudents[j].isAttendanceChanged = "N";
            this.viewStudents[j].defaultAtt = this.viewStudents[j].attendance;
          }
          this.tempStudents = data;
          this.illustration = false;
          this.totalCount = this.viewStudents.length;
          this.pageIndex = 1;
          this.fectchTableDataByPage(this.pageIndex);

        },
        (error: any) => {
          this.jsonFlag.isRippleLoad = false;
        }
      )
    }

  }

  searchInList(search_string: any){
    this.viewStudents = this.tempStudents;
    let temp = this.viewStudents;
    if(this.searchInput != '' && this.searchInput != null){
      temp = this.viewStudents.filter(element =>  element.student_name.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase()) || element.student_disp_id.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase()) );
    }
    this.viewStudents = temp;
    this.totalCount = this.viewStudents.length;
    this.pageIndex = 1;
    this.fectchTableDataByPage(this.pageIndex);
  }

  sendNotification(){
    if(this.inputElements.ptmId != "-1"){
      console.log(this.inputElements.ptmId);
      this.jsonFlag.isRippleLoad = true;
      this.ptmService.sendNotification(this.inputElements.ptmId).subscribe(
        (data: any) => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Success', 'Notification has been sent successfully');
        },
        (error: any) => {
          this.jsonFlag.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', error);
        }
      )
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please select PTM schedule');
    }
  }

  cancelPTM(){
      if (confirm('Are you sure, you want to cancel PTM Schedule ??')) {
        let obj = {
          batch_id: this.getptmDates.batch_id,
          ptm_reminder: true,
          ptm_id: this.inputElements.ptmId
        }
        this.jsonFlag.isRippleLoad = true;
        this.ptmService.cancelPTM(obj).subscribe(
          res => {
            this.jsonFlag.isRippleLoad = false;
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Success', 'Cancelled Successfully');
            this.inputElements.ptmId = "-1";
            this.viewStudents = [];
            this.tempStudents = [];
            this.totalCount = this.viewStudents.length;
            this.loadPtmDates();
            this.illustration = true;
          },
          err => {
            this.jsonFlag.isRippleLoad = false;
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          }
        )
      }
  }

  showCreateNewPTM(){
    this.createPTMShow = true;
    this.jsonFlag.isRippleLoad = true;
    this.createPTMAllBatches = [];
    this.ptmService.getBatches(this.batchQueryParam).subscribe(
      (data: any) => {
        this.createPTMAllBatches = data;
        this.createPTM.batchArray = [];
        this.createPTM.startTimeArray = [];
        this.createPTM.endTimeArray = [];
        for (let j = 0; j < this.createPTMAllBatches.length; j++) {
          this.createPTMAllBatches[j].isSelected = false;
          this.createPTMAllBatches[j].startHH = "12";
          this.createPTMAllBatches[j].startMM = "00";
          this.createPTMAllBatches[j].startMed = "PM";

          this.createPTMAllBatches[j].endHH = "01";
          this.createPTMAllBatches[j].endMM = "00";
          this.createPTMAllBatches[j].endMed = "PM";
        }
        this.jsonFlag.isRippleLoad = false;
      },
      (error: any) => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }

  checkAllBatch(){
    if(this.ptmSelectAll){
      for (let j = 0; j < this.createPTMAllBatches.length; j++) {
        this.createPTMAllBatches[j].isSelected = true;
        this.createPTM.batchArray.push(this.createPTMAllBatches[j].batch_id);
        this.createPTM.startTimeArray.push(this.createPTMAllBatches[j].startHH+":"+this.createPTMAllBatches[j].startMM+" "+this.createPTMAllBatches[j].startMed);
        this.createPTM.endTimeArray.push(this.createPTMAllBatches[j].endHH+":"+this.createPTMAllBatches[j].endMM+" "+this.createPTMAllBatches[j].endMed);
      }
    }
    else{
      for (let j = 0; j < this.createPTMAllBatches.length; j++) {
        this.createPTMAllBatches[j].isSelected = false;
        this.createPTM.batchArray = [];
        this.createPTM.startTimeArray = [];
        this.createPTM.endTimeArray = [];
      }
    }
  }

  checkBatch(batch, e){
    if(batch.isSelected){
      this.createPTM.batchArray.push(batch.batch_id);
      this.createPTM.startTimeArray.push(batch.startHH+":"+batch.startMM+" "+batch.startMed);
      this.createPTM.endTimeArray.push(batch.endHH+":"+batch.endMM+" "+batch.endMed);
    }
    else{
      for (let j = 0; j < this.createPTM.batchArray.length; j++) {
        if(batch.batch_id == this.createPTM.batchArray[j]){
          this.createPTM.batchArray.splice(j,1);
          this.createPTM.startTimeArray.splice(j,1);
          this.createPTM.endTimeArray.splice(j,1);
        }
      }
    }
  }

  changeTime(batch){
    for (let j = 0; j < this.createPTM.batchArray.length; j++) {
      if(batch.batch_id == this.createPTM.batchArray[j]){
        let time1 = batch.startHH;
        let time2 = batch.endHH;
        if(batch.startMed == "PM" && batch.startHH != "12"){
          time1 = Number(batch.startHH) + 12
        }
        if(batch.endMed == "PM" && batch.endHH != "12"){
          time2 =  Number(batch.endHH) + 12
        }
        let startTime = moment(time1+":"+batch.startMM, "HH:mm");
        let endTime = moment(time2+":"+batch.endMM, "HH:mm");
        if(startTime.isAfter(endTime)){
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Start time should not be greater than end time');
        }
        else if(endTime.isBefore(startTime)){
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'End time should not be lesser than start time');
        }
        else if(startTime == endTime){
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Start time and end time should not be same');
        }

        this.createPTM.startTimeArray[j] = batch.startHH+":"+batch.startMM+" "+batch.startMed;
        this.createPTM.endTimeArray[j] = batch.endHH+":"+batch.endMM+" "+batch.endMed;

        return;
      }
    }
  }

  scheduleNewPTM(){
    let validation = true;
    for (let j = 0; j < this.createPTM.startTimeArray.length; j++) {
      let startTime = moment(this.createPTM.startTimeArray[j], "HH:mm A");
      let endTime = moment(this.createPTM.endTimeArray[j], "HH:mm A");
      if(startTime.isAfter(endTime)){
        validation = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Start time should not be greater than end time');
      }
      else if(endTime.isBefore(startTime)){
        validation = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'End time should not be lesser than start time');
      }
    }

    if(validation){
      this.jsonFlag.isRippleLoad = true;
      this.ptmService.scheduleNewPTM(this.createPTM).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Success', 'Created Successfully');
          this.jsonFlag.isRippleLoad = false;
          this.createPTMShow = false;
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
        }
      )
    }
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  addNewDate() {
    let currentDate = moment().format("YYYY-MM-DD");
    let scheDate = moment(this.ptmScheduleDate).format("YYYY-MM-DD");
    if(moment(scheDate).isBefore(currentDate)){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'PTM schedule date can not be past date');
    }
    else{
      document.getElementById("changeDate").innerHTML = moment(this.ptmScheduleDate).format("DD MMM YYYY");
      this.createPTM.ptm_date = moment(this.ptmScheduleDate).format("YYYY-MM-DD");
    }
  }

  attendanceChange(student){
    if(student.defaultAtt == student.attendance){
      student.isAttendanceChanged = "N";
    }
    else{
      student.isAttendanceChanged = "Y";
    }
  }

  updatePTM(){
    let studentArray = [];
    for (let j = 0; j < this.viewStudents.length; j++) {
      let studentObj = {
        "attendance": this.viewStudents[j].attendance,
        "isAttendanceChanged": this.viewStudents[j].isAttendanceChanged,
        "parent_remark": this.viewStudents[j].parent_remark,
        "status": this.viewStudents[j].status,
        "student_id": this.viewStudents[j].student_id,
        "student_ptm_id": this.viewStudents[j].student_ptm_id,
        "teacher_remark": this.viewStudents[j].teacher_remark
      }
      studentArray.push(studentObj);
    }

    this.jsonFlag.isRippleLoad = true;
    this.ptmService.updatePTM(studentArray, this.inputElements.ptmId).subscribe(
      res => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Success', 'Updated Successfully');
        this.jsonFlag.isRippleLoad = false;
        this.viewStudentsData();
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    )
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
    this.viewStudents = this.getDataFromDataSource(startindex);
  }

  getDataFromDataSource(startindex) {
    if(this.searchInput != '' && this.searchInput != null){
      let t = this.viewStudents.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }
    else{
      let t = this.tempStudents.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }

  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.viewStudentsData();
  }


}
