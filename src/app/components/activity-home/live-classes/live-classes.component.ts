import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { LiveClasses } from '../../../services/live-classes/live-class.service';
import { AppComponent } from '../../../app.component';
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
  isProfessional;
  feeDetails: boolean = false;
  inventory: boolean = false;
  batches: any[] = [];
  hour = ['01 AM', '02 AM', '03 AM', '04 AM', '05 AM', '06 AM', '07 AM', '08 AM', '09 AM', '10 AM', '11 AM', '12 AM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM', '07 PM', '08 PM', '09 PM', '10 PM', '11 PM', '12 PM'];
  minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
  batchesIds: any[] = [];
  courseIds: any[] = []
  getPayloadBatch = {
    inst_id: this.service.institute_id,
    coursesArray: [''],
    role: 'student'
  }
  studentsAssigned: any[] = []
  teachersAssigned: any[] = [];
  userAssigned: any[] = [];
  masters: any[] = []
  courses: any[] = []
  courseValue: string = '';
  isStudentCheckedArr: any[] = []
  teacherId: string = '';
  selected: boolean;
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
  isUserCheckedArr: any[] = [];
  teacherIdArr: any[] = [];
  dateFrom = moment(new Date()).format('YYYY-MM-DD');
  rescheduledateFrom = moment(new Date()).format('YYYY-MM-DD');
  hourFrom: string = "";
  hourTo: string = "";
  minuteTo: string = "";
  minuteFrom: string = "";
  dateToday = moment().format('YYYY-MM-DD')
  openClassPopup: boolean = false;
  session: string = "";
  getClasses: any[] = [];
  getPastClasses: any[] = [];
  getFutureClasses: any[] = [];
  pastClassesPopup: boolean = false;
  futureClassesPopup: boolean = false;
  allClasses: boolean = false;
  validations: boolean = false;
  sendNotifyMe: boolean = false;
  rescheduleClass: boolean = false;
  hourFromReschedule: string = "";
  minuteFromReschedule: string = "";
  hourToReschedule: string = "";
  minuteToReschedule: string = "";
  rescheduleclass = {
    end_datetime: "",
    institution_id: this.service.institute_id,
    session_id: "",
    start_datetime: ""
  }
  classDetails: string = ""
  customId = [];
  studentId = [];
  dataStatus: boolean = false;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3];

  constructor(
    private auth: AuthenticatorService,
    private service: LiveClasses,
    private appC: AppComponent) {
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

  }

  getElementsRemove() {
    document.getElementById('li-one').classList.remove('active');
    document.getElementById('li-two').classList.remove('active');
    document.getElementById('li-three').classList.remove('active');
    document.getElementById('li-four').classList.remove('active');
  }

  navigateTo(text) {
    if (this.getTimeInfo()) {
      if (text == "studentForm") {
        document.getElementById('li-two').classList.remove('active');
        document.getElementById('li-three').classList.remove('active');
        document.getElementById('li-four').classList.remove('active');
        document.getElementById('li-one').classList.add('active');
        this.studentForm = true;
        this.kyc = false;
        this.feeDetails = false;
        this.inventory = false;
      }
      else if (text == "assignStudents") {

      }
      else if (text == "assignTeachers") {
        if (this.isStudentCheckedArr.length == 0) {
          this.appC.popToast({ type: "info", body: "Please select at least one student" })
          this.studentForm = false;
          this.kyc = true;
          this.feeDetails = false;
          this.inventory = false;
        }

        else {
          document.getElementById('li-two').classList.remove('active');
          document.getElementById('li-three').classList.add('active');
          document.getElementById('li-four').classList.remove('active');
          document.getElementById('li-one').classList.remove('active');
          this.studentForm = false;
          this.kyc = false;
          this.feeDetails = true;
          this.inventory = false;
          this.getTeachers();
        }
      }
      else if (text == "assignUsers") {
        if (this.isStudentCheckedArr.length != 0) {
          if (this.teacherId == '') {
            this.appC.popToast({ type: "info", body: "Please select a teacher" })
            document.getElementById('li-two').classList.remove('active');
            document.getElementById('li-three').classList.add('active');
            document.getElementById('li-four').classList.remove('active');
            document.getElementById('li-one').classList.remove('active');
            this.studentForm = false;
            this.kyc = false;
            this.feeDetails = true;
            this.inventory = false;
          }
          else {
            document.getElementById('li-two').classList.remove('active');
            document.getElementById('li-three').classList.remove('active');
            document.getElementById('li-four').classList.add('active');
            document.getElementById('li-one').classList.remove('active');
            this.studentForm = false;
            this.kyc = false;
            this.feeDetails = false;
            this.inventory = true;
            this.getCustomUsers();
          }
        }
        else {
          this.appC.popToast({ type: "info", body: "Please select at least one student" })
          this.studentForm = false;
          this.kyc = true;
          this.feeDetails = false;
          this.inventory = false;
        }
      }
    }
  }

  switchToView(id) {
    switch (id) {
      case "studentForm-icon": {
        this.navigateTo("studentForm");
        break;
      }
      case "kyc-icon": {
        this.navigateTo("assignStudents");
        break;
      }
      case "feeDetails-icon": {
        this.navigateTo("assignTeachers");
        break;
      }
      case "inventory-icon": {
        this.navigateTo("assignUsers");
        break;
      }
      default: {
        this.navigateTo("studentForm");
        break;
      }
    }
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
      this.getElementsRemove();
      document.getElementById('li-two').classList.add('active');
      this.getBatchesCourses();
      this.studentForm = false;
      this.kyc = true;
      this.feeDetails = false;
      this.inventory = false;
      return true;
    }
  }

  getBatchesCourses() {
    if (this.isProfessional) {
      this.service.fetchBatches().subscribe(
        (data: any) => {
          this.batches = data;
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
    else {
      this.service.fetchMasters().subscribe(
        (data: any) => {
          this.masters = data;
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
  }

  getAllStudents(event) {
    if (event == true) {
      for (let i = 0; i < this.studentsAssigned.length; i++) {
        this.studentsAssigned[i].isChecked = true;
        this.isStudentCheckedArr.push(this.studentsAssigned[i].student_id);
      }
    }
    else {
      for (let i = 0; i < this.studentsAssigned.length; i++) {
        this.studentsAssigned[i].isChecked = false;
        this.isStudentCheckedArr = [];
      }
    }
  }

  getCheckedBox(userList) {
    userList.map(
      (ele: any) => {
        ele.isChecked = false;
      }
    )
  }

  viewUsers() {
    this.getElementsRemove();
    document.getElementById('li-four').classList.add('active');
    this.studentForm = false;
    this.kyc = false;
    this.feeDetails = false;
    this.inventory = true;
    this.getCustomUsers();
  }

  getCourses(master_course_name) {
    this.service.fetchCourses(master_course_name).subscribe(
      (data: any) => {
        this.courses = data.coursesList;
      },
      (error: any) => {
        this.errorMessage(error);
      }
    )
  }

  getBatchesCoursesIds(ids) {
    if (this.isProfessional) {
      this.batchesIds = ids;
    }
    else {
      this.courseIds = ids
    }
  }

  fetchStudentsApi(courseArray) {
    this.dataStatus = true;
    this.getPayloadBatch.coursesArray = courseArray;
    this.service.fetchStudents(this.getPayloadBatch).subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.studentsAssigned = data.studentsAssigned;
        this.getCheckedBox(this.studentsAssigned);
      },
      (error: any) => {
        this.dataStatus = false;
        this.errorMessage(error);
      }
    )
  }

  getStudents() {
    let str = []
    if (this.isProfessional) {
      this.batchesIds.map(
        (ele: any) => {
          let x = ele.toString();
          str.push(x);
        }
      )
      this.fetchStudentsApi(str);
    }
    else {
      this.courseIds.map(
        (ele: any) => {
          let x = ele.toString();
          str.push(x);
        }
      )
      this.fetchStudentsApi(str);
    }
  }

  getTeachers() {
    this.dataStatus = true;
    this.service.fetchTeachers().subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.teachersAssigned = data;
        this.getCheckedBox(this.teachersAssigned);
      },
      (error: any) => {
        this.dataStatus = false;
        this.errorMessage(error);
      }
    )
  }

  getCustomUsers() {
    this.dataStatus = true;
    this.service.fetchUsers().subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.userAssigned = data;
        this.getCheckedBox(this.userAssigned);
      },
      (error: any) => {
        this.dataStatus = false;
        this.errorMessage(error);
      }
    )
  }


  getUserCheckedValue(isChecked, index) {

    if (isChecked == true) {
      this.isUserCheckedArr.push(this.userAssigned[index].userid);
    }
    else {
      this.isUserCheckedArr = this.isUserCheckedArr.filter((ele: any) => {
        if (ele == this.userAssigned[index].userid) {
          return false;
        }
        else {
          return true;
        }
      })
    }
  }

  getStudentCheckedValue(isChecked, index) {
    if (isChecked == true) {
      this.isStudentCheckedArr.push(this.studentsAssigned[index].student_id);
    }
    else {
      this.isStudentCheckedArr = this.isStudentCheckedArr.filter((ele: any) => {
        if (ele == this.studentsAssigned[index].student_id) {
          return false;
        }
        else {
          return true;
        }
      })
    }


    if (this.isStudentCheckedArr.length == 0) {
      this.appC.popToast({ type: "info", body: "Please select at least one student" })
      return;
    }
  }

  isStudent() {
    this.getElementsRemove();
    document.getElementById('li-three').classList.add('active');
    this.studentForm = false;
    this.kyc = false;
    this.feeDetails = true;
    this.inventory = false;
    this.getTeachers();
  }

  getEvent(event) {
    if (moment(event).diff(moment(), 'days') < 0) {
      let msg = {
        type: "info",
        body: "You cannot select past date"
      }
      this.appC.popToast(msg);
      this.dateFrom = moment().format('YYYY-MM-DD')
      this.rescheduledateFrom = moment().format('YYYY-MM-DD')
    }
  }

  getOnlineSchedules() {

    this.isUserCheckedArr.map(
      (ele: any) => {
        let x = ele.toString();
        this.customId.push(x);
      }
    )
    this.isStudentCheckedArr.map(
      (ele: any) => {
        let x = ele.toString();
        this.studentId.push(x);
      }
    )
    this.teacherId = this.teacherId.toString();
    this.teacherIdArr.push(this.teacherId);
    this.getOnlineClasses.custUserIds = this.customId;
    this.getOnlineClasses.studentIds = this.studentId;
    this.getOnlineClasses.teacherIds = this.teacherIdArr;
    this.getOnlineClasses.start_datetime = moment(this.dateFrom).format('YYYY-MM-DD') + " " + this.hourFrom.split(' ')[0] + "" + ":" + this.minuteFrom + " " + this.hourFrom.split(' ')[1];
    this.getOnlineClasses.end_datetime = moment(this.dateFrom).format('YYYY-MM-DD') + " " + this.hourTo.split(' ')[0] + "" + ":" + this.minuteTo + " " + this.hourTo.split(' ')[1];
    this.session = this.getOnlineClasses.session_name;
    this.service.getOnlineClasses(this.getOnlineClasses).subscribe(
      (data: any) => {
        this.appC.popToast({ type: "success", body: this.session + " " + "created successfully" });
        this.navigateTo("studentForm");
        this.studentForm = true;
        this.kyc = false;
        this.feeDetails = false;
        this.inventory = false;
        this.getOnlineClasses = {
          custUserIds: [],
          end_datetime: "",
          institution_id: this.service.institute_id,
          sent_notification_flag: 0,
          session_name: "",
          start_datetime: "",
          studentIds: [],
          teacherIds: []
        }
        this.masters = [];
        this.courseValue = "";
        for (let i = 0; i < this.studentsAssigned.length; i++) {
          this.studentsAssigned[i].isChecked = false;
        }

        for (let i = 0; i < this.userAssigned.length; i++) {
          this.userAssigned[i].isChecked = false;
        }
        this.courses = [];
        this.batches = [];
        this.courseIds = [];
        this.customId =[];
        this.studentId=[];
        this.isUserCheckedArr = [];
        this.isStudentCheckedArr = [];
        this.teacherIdArr = [];
        this.batchesIds=[];
        this.hourFrom = "";
        this.hourTo = "";
        this.minuteFrom = "";
        this.minuteTo = ""
        this.studentsAssigned = [];
        this.userAssigned = [];
        this.teachersAssigned = [];
        this.dateFrom = moment().format('YYYY-MM-DD');
        this.classDetails = "";
        this.teacherId = "";
      },
      (error: any) => {
        this.appC.popToast({ type: "error", body: error.error.message })
      }
    )
  }

  viewOnlineClasses() {
    this.openClassPopup = true;
    this.allClasses = true;
    this.pastClassesPopup = false;
    this.futureClassesPopup = false;
    let obj = {
      institution_id: this.service.institute_id
    }
    this.service.fetchOnlineClasses(obj).subscribe(
      (data: any) => {
        this.getClasses = data;
        this.getClasses.map((ele)=>{
          ele.start_datetime = moment(ele.start_datetime).format('YYYY-MM-DD hh:mm a')
        })
        this.getClasses.map((ele)=>{
          ele.end_datetime = moment(ele.end_datetime).format('YYYY-MM-DD hh:mm a')
        })
      },
      (error: any) => {
        this.errorMessage(error);
      }
    )
  }

  close() {
    this.openClassPopup = false;
  }

  pastClasses() {
    this.pastClassesPopup = true;
    this.futureClassesPopup = false;
    this.allClasses = false;
  }

  futureClasses() {
    this.pastClassesPopup = false;
    this.futureClassesPopup = true;
    this.allClasses = false;
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
    if (confirm("Are you sure you want to send sms notification ? ")) {
      this.service.smsNotification(id, obj).subscribe(
        (data: any) => {
          this.appC.popToast({ type: "success", body: "Sms notification sent successfully" })
          this.viewOnlineClasses();
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
  }

  pushNotification(id) {
    let obj = {

    }
    if (confirm("Are you sure you want to send push notification ?")) {
      this.service.pushNotification(id, obj).subscribe(
        (data: any) => {
          this.appC.popToast({ type: "success", body: "Push notification sent successfully" })
          this.viewOnlineClasses();
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
  }

  cancel(id) {
    if (confirm("Are you sure you want to delete the class")) {
      this.service.cancelSchedule(id).subscribe(
        (data: any) => {
          this.appC.popToast({ type: "success", body: "Class deleted successfully" })
          this.viewOnlineClasses();
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
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

  getRescheduleTime(){

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
