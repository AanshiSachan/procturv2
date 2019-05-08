import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { LiveClasses } from '../../../services/live-classes/live-class.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-live-classes',
  templateUrl: './live-classes.component.html',
  styleUrls: ['./live-classes.component.scss']
})

export class LiveClassesComponent implements OnInit {


  activeIndex: number = 1;
  studentForm: boolean = true;
  kyc: boolean = false;
  isProfessional: boolean = false;
  feeDetails: boolean = false;
  inventory: boolean = false;
  openClassPopup: boolean = false;
  pastClassesPopup: boolean = false;
  futureClassesPopup: boolean = false;
  allClasses: boolean = true;
  liveClassFor: boolean = false;
  validations: boolean = false;
  sendNotifyMe: boolean = false;
  rescheduleClass: boolean = false;
  PageIndex: number = 1;
  totalRow: number;
  displayClassSize: number = 10;
  classListDataSource: any = [];
  classList: any = [];
  searchData: any = [];
  searchDataFlag: boolean = false;

  JsonVars: any = {
    isRippleLoad: false,
    selected: false,
    submitReq: false
  }

  batches: any[] = [];
  hour = ['01 AM', '02 AM', '03 AM', '04 AM', '05 AM', '06 AM', '07 AM', '08 AM', '09 AM', '10 AM', '11 AM', '12 AM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM', '07 PM', '08 PM', '09 PM', '10 PM', '11 PM', '12 PM'];
  minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
  batchesIds: any[] = [];
  courseIds: any[] = [];
  studentsAssigned: any[] = []
  teachersAssigned: any[] = [];
  userAssigned: any[] = [];
  masters: any[] = []
  courses: any[] = []
  isStudentCheckedArr: any[] = []
  isUserCheckedArr: any[] = [];
  teacherIdArr: any[] = [];
  getClasses: any[] = [];
  getPastClasses: any[] = [];
  getFutureClasses: any[] = [];
  customId = [];
  studentId = [];
  columnMaps: any[] = [0, 1, 2, 3];
  hourFrom: string = "";
  hourTo: string = "";
  minuteTo: string = "";
  minuteFrom: string = "";
  teacherId: string = '';
  courseValue: string = '';
  session: string = "";
  hourFromReschedule: string = "";
  minuteFromReschedule: string = "";
  hourToReschedule: string = "";
  minuteToReschedule: string = "";
  classDetails: string = "";
  dateToday = moment().format('YYYY-MM-DD');
  dateFrom = moment(new Date()).format('YYYY-MM-DD');
  rescheduledateFrom = moment(new Date()).format('YYYY-MM-DD');
  rescheduleclass = {
    end_datetime: "",
    institution_id: this.service.institute_id,
    session_id: "",
    start_datetime: ""
  }
  getOnlineClasses = {
    custUserIds: [],
    end_datetime: "",
    institution_id: this.service.institute_id,
    sent_notification_flag: 0,
    session_name: "",
    start_datetime: "",
    studentIds: [],
    teacherIds: []
  }
  getPayloadBatch = {
    inst_id: this.service.institute_id,
    coursesArray: [''],
    role: 'student'
  }

  previosLiveClasses: any[] = [];
  futureLiveClasses: any[] = [];
  today: any = new Date();
  sortDate: any;
  liveClassSearchFilter: any = {
    from_date: '',
    to_date: ''
  };

  alertBox: boolean = true;
  cancelSessionId: any;
  sendSMSNotification: boolean = false;
  sendPushNotification: boolean = false;
  forUser: boolean = false;


  constructor(
    private auth: AuthenticatorService,
    private service: LiveClasses,
    private appC: AppComponent,
    private router: Router) {
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    const userType = sessionStorage.getItem('userType');
    if (userType == '3') {
      this.forUser = true;
    }

    this.getClassesList();

  }

  getClassesList(){
    this.PageIndex = 1;
    this.JsonVars.isRippleLoad = true;
    let obj = {
      institution_id: this.service.institute_id
    }
    this.service.fetchOnlineClasses(obj).subscribe(
      (data: any) => {
        this.JsonVars.isRippleLoad = false;
        this.previosLiveClasses = data.pastLiveClasses;
        this.futureLiveClasses = data.upcomingLiveClasses;

        this.getClassesFor();
        // console.log(this.getClasses)
        this.totalRow = this.getClasses.length;

        this.fetchTableDataByPage(this.PageIndex);
        this.getClasses.map((ele) => {
          ele.start_datetime = moment(ele.start_datetime).format('YYYY-MM-DD hh:mm a')
        })
        this.getClasses.map((ele) => {
          ele.end_datetime = moment(ele.end_datetime).format('YYYY-MM-DD hh:mm a')
        })
      },
      (error: any) => {
        this.JsonVars.isRippleLoad = false;
        this.errorMessage(error);
      }
    )
  }

  forTeacher(teachersUserIds){
    let userId = sessionStorage.getItem('userid');

    if(teachersUserIds.includes(userId)){
      return true;
    }
    else{
      return false;
    }
  }

  startLiveClass(link, start_time){
    let time = this.diffDate(this.today, start_time);
    let splitedTime = time.split(":");
    let hrs = +splitedTime[0];
    let mins = +splitedTime[1];

    if(hrs <= 0 && mins <= 30){
      window.open(link, "_blank");
    }
    else{
      this.appC.popToast({ type: "error", body: "Sessions can only be started before 30 minutes of start time." })
    }

  }

  checkForTime(start_time){
    let time = this.diffDate(this.today, start_time);
    let splitedTime = time.split(":");
    let hrs = +splitedTime[0];
    let mins = +splitedTime[1];

    if(hrs <= 0 && mins <= 30){
      return true;
    }
    else{
      return false;
    }
  }

  dateRangeChanges(){

    if(this.sortDate == "all"){
      // this.filteredDate = true;
      this.liveClassSearchFilter = {
        from_date: '',
        to_date: ''
      }
    }
    else if(this.sortDate == "last_week"){
      let begin = moment().format('YYYY-MM-DD');
      let end = moment().subtract('week', 1).format('YYYY-MM-DD');
      this.liveClassSearchFilter = {
        from_date: end,
        to_date: begin
      }
    }
    else if(this.sortDate == "this_month"){
      let begin = moment().format("YYYY-MM-01");
      let end = moment().format("YYYY-MM-") + moment().daysInMonth();

      this.liveClassSearchFilter = {
        from_date: begin,
        to_date: end
      }
    }
    else if(this.sortDate == "last_month"){
      let begin = moment().subtract('months', 1).format('YYYY-MM-01');
      let end = moment().date(0).format("YYYY-MM-DD");
      this.liveClassSearchFilter = {
        from_date: begin,
        to_date: end
      }
    }
    else if(this.sortDate == "last_three_month"){
      let begin = moment().format('YYYY-MM-DD');
      let end = moment().subtract('months', 3).format('YYYY-MM-DD');
      this.liveClassSearchFilter = {
        from_date: end,
        to_date: begin
      }
    }
    else if(this.sortDate == "custom_date_range"){
      // this.openCalendar('dateRange');
    }

    let from_date = moment(this.liveClassSearchFilter.from_date).format("DD MMM YYYY");
    let to_date = moment(this.liveClassSearchFilter.to_date).format("DD MMM YYYY");

    console.log(this.liveClassSearchFilter);
  }


  editStudent(session_id){
    this.router.navigate(['/view/activity/edit/'+session_id], { queryParams: { repeat: 0 } });
  }

  repeatSession(session_id){
    this.router.navigate(['/view/activity/edit/'+session_id], { queryParams: { repeat: 1} });
  }

  getClassesFor(){
    if(this.liveClassFor){
      this.getClasses = this.previosLiveClasses;
      this.classListDataSource = this.previosLiveClasses;
    }
    else{
      this.getClasses = this.futureLiveClasses;
      this.classListDataSource = this.futureLiveClasses;
    }
    this.totalRow = this.getClasses.length;
    this.fetchTableDataByPage(this.PageIndex);
  }

  diffDate(date1, date2){
    let dateOut1 = new Date(date1); // it will work if date1 is in ISO format
    let dateOut2 = new Date(date2);
    let timeDiff = dateOut2.getTime() / 1000 - dateOut1.getTime() / 1000;
    let hours: any = Math.floor(timeDiff / (60 * 60));

    let divisor_for_minutes = timeDiff % (60 * 60);
    let minutes: any = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    if(hours.toString().length == 1){
      hours = "0"+hours;
    }
    if(minutes.toString().length == 1){
      minutes = "0"+minutes;
    }

    let time = hours+":"+minutes;
    return time;
  }

  getTimeLeft(date1, date2){
    let time = this.diffDate(date1, date2);
    let splitedTime = time.split(":");
    let hrs = +splitedTime[0];
    let inDays: number = Math.floor(hrs / 24);

    if(inDays > 0){
      if(inDays > 1){
        return inDays+" days";
      }
      else{
        return inDays+" day";
      }
    }
    else if(hrs < 0){
      return "00:00 hrs";
    }
    else{
      return time+" hrs";
    }
  }

  timeLeft(date1, date2){
    let time = this.diffDate(date1, date2);
    let splitedTime = time.split(":");
    let hrs = +splitedTime[0];

    if(hrs < 0){
      return true;
    }
    else{
      return false;
    }

  }

  searchInList(element) {
    if (element.value != "" && element.value != null) {
      let searchData = this.getClasses.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.searchData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.getClasses.length;
    }
  }

  // pagination functions

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayClassSize * (index - 1);
    this.getClasses = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let data = [];
    if (this.searchDataFlag) {
      data = this.searchData.slice(startindex, startindex + this.displayClassSize);
    } else {
      data = this.classListDataSource.slice(startindex, startindex + this.displayClassSize);
    }
    return data;
  }


  getTimeInfo() {
    let fromTime = moment(this.dateFrom).format('YYYY-MM-DD') + " " + this.hourFrom.split(' ')[0] + ":" + this.minuteFrom + " " + this.hourFrom.split(' ')[1];
    let fromDate = moment().format('YYYY-MM-DD');
    let toTime = moment(this.dateFrom).format('YYYY-MM-DD') + " " + this.hourTo.split(' ')[0] + ":" + this.minuteTo + " " + this.hourTo.split(' ')[1];
    let fromTimeT = moment(fromTime).format('YYYY-MM-DD hh:mm a');
    let toTimeT = moment(toTime).format('YYYY-MM-DD hh:mm a');

    if (moment(fromTimeT).diff(moment(toTimeT), 'minutes') > 0) {
      this.appC.popToast({ type: "error", body: "From time cannot be greater than to time" })
      return false;
    }
    else if (this.hourFrom == "" || this.hourTo == "" || this.minuteFrom == "" || this.minuteTo == "" || this.getOnlineClasses.session_name == "") {
      this.appC.popToast({ type: "error", body: "All mandatory fields are required" })
      return false;
    }
    else if (moment(fromTimeT).diff(moment(), 'minutes') <= 20) {
      this.appC.popToast({ type: "error", body: "Class can be schedule 20 minutes from current time" })
      return false;
    }
    else if (fromTimeT == toTimeT) {
      this.appC.popToast({ type: "error", body: "From time and to time cannot be same" })
      return false;
    }
    else {
      // this.getBatchesCourses();

    }
  }

  close() {
    this.openClassPopup = false;
  }

  errorMessage(error) {
    this.appC.popToast({ type: "error", body: error.error.message })
  }

  sendNotify(notify) {
    if (notify == true) {
      this.getOnlineClasses.sent_notification_flag = 1
    }
    else {
      this.getOnlineClasses.sent_notification_flag = 0
    }
  }

  smsNotification(id) {
    let obj = {

    }
    if (confirm("Are you sure you want to send SMS notification ? ")) {
      this.service.smsNotification(id, obj).subscribe(
        (data: any) => {
          this.appC.popToast({ type: "success", body: "SMS notification sent successfully" })
          // this.getClassesList();
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
  }

  pushNotification(id) {
    let obj = {};
    if (confirm("Are you sure you want to send push notification ?")) {
      this.service.pushNotification(id, obj).subscribe(
        (data: any) => {
          this.appC.popToast({ type: "success", body: "Push notification sent successfully" })
          // this.getClassesList();
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
  }

  cancel(id) {
    this.alertBox = false;
    this.cancelSessionId = id;
  }

  cancelSession(){
    this.service.cancelSchedule(this.cancelSessionId).subscribe(
      (data: any) => {
        this.appC.popToast({ type: "success", body: "Live class session cancelled successfully" })
        this.alertBox = true;
        this.getClassesList();
      },
      (error: any) => {
        this.errorMessage(error);
      }
    )
  }

  closeAlert(){
    this.alertBox = true;
    this.cancelSessionId = "";
  }

  reschedule(id) {
    this.rescheduleClass = true;
    this.openClassPopup = false;
    this.rescheduleclass.session_id = id;
  }

  closeReschedule() {
    this.rescheduleClass = false;
    this.openClassPopup = true;
  }

  getRescheduleTime() {
    let fromTime = moment(this.rescheduledateFrom).format('YYYY-MM-DD') + " " + this.hourFromReschedule.split(' ')[0] + ":" + this.minuteFromReschedule + " " + this.hourFromReschedule.split(' ')[1];
    let fromDate = moment().format('YYYY-MM-DD');
    let toTime = moment(this.rescheduledateFrom).format('YYYY-MM-DD') + " " + this.hourToReschedule.split(' ')[0] + ":" + this.minuteToReschedule + " " + this.hourToReschedule.split(' ')[1];
    let fromTimeT = moment(fromTime).format('YYYY-MM-DD hh:mm a');
    let toTimeT = moment(toTime).format('YYYY-MM-DD hh:mm a');

    if (moment(fromTimeT).diff(moment(toTimeT), 'minutes') > 0) {
      this.appC.popToast({ type: "error", body: "From time cannot be greater than to time" })
      return false;
    }

    else if (this.hourFromReschedule == "" || this.hourToReschedule == "" || this.minuteFromReschedule == "" || this.minuteToReschedule == "") {
      this.appC.popToast({ type: "error", body: "All fields are required" })
      return false;
    }

    else if (moment(fromTimeT).diff(moment(), 'minutes') <= 20) {
      this.appC.popToast({ type: "error", body: "Class can be schedule 20 minutes from current time" })
      return false;
    }

    else if (fromTimeT == toTimeT) {
      this.appC.popToast({ type: "error", body: "From time and to time cannot be same" })
      return false;
    }
    else {
      this.isReschedule();
    }
  }


  isReschedule() {
    this.rescheduleclass.end_datetime = moment(this.rescheduledateFrom).format('YYYY-MM-DD') + " " + this.hourToReschedule.split(' ')[0] + ":" + this.minuteToReschedule + " " + this.hourToReschedule.split(' ')[1];
    this.rescheduleclass.start_datetime = moment(this.rescheduledateFrom).format('YYYY-MM-DD') + " " + this.hourFromReschedule.split(' ')[0] + ":" + this.minuteFromReschedule + " " + this.hourToReschedule.split(' ')[1]

    this.service.rescheduleClass(this.rescheduleclass).subscribe(
      (data: any) => {
        this.appC.popToast({ type: "success", body: "Class Reschedule Successfully" })
        this.rescheduleClass = false;
        this.openClassPopup = false;
        this.rescheduleclass = {
          end_datetime: "",
          institution_id: this.service.institute_id,
          session_id: "",
          start_datetime: ""
        }
        this.rescheduledateFrom = moment().format('YYYY-MM-DD');
        this.minuteFromReschedule = "";
        this.minuteToReschedule = "";
        this.hourFromReschedule = "";
        this.hourToReschedule = "";
      },
      (error: any) => {
        this.errorMessage(error);
      }
    )
  }
}
