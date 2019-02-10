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
  isProfessional: boolean = false;
  feeDetails: boolean = false;
  inventory: boolean = false;
  openClassPopup: boolean = false;
  pastClassesPopup: boolean = false;
  futureClassesPopup: boolean = false;
  allClasses: boolean = false;
  validations: boolean = false;
  sendNotifyMe: boolean = false;
  rescheduleClass: boolean = false;
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
        this.getElementsRemove();
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
          this.getElementsRemove();
          document.getElementById('li-three').classList.add('active');
          this.studentForm = false;
          this.kyc = false;
          this.feeDetails = true;
          this.inventory = false;
          if (this.teachersAssigned.length == 0) {
            this.getTeachers();
          }
        }
      }
      else if (text == "assignUsers") {
        if (this.isStudentCheckedArr.length != 0) {
          if (this.teacherId == '') {
            this.appC.popToast({ type: "info", body: "Please select a teacher" });
            this.getElementsRemove();
            document.getElementById('li-three').classList.add('active');
            this.studentForm = false;
            this.kyc = false;
            this.feeDetails = true;
            this.inventory = false;
          }
          else {
            this.getElementsRemove();
            document.getElementById('li-four').classList.add('active');
            this.studentForm = false;
            this.kyc = false;
            this.feeDetails = false;
            this.inventory = true;
            if(this.userAssigned.length==0){
              this.getCustomUsers();
            }
            
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
    this.JsonVars.isRippleLoad = true;
    if (this.isProfessional) {
      this.service.fetchBatches().subscribe(
        (data: any) => {
          this.batches = data;
          this.JsonVars.isRippleLoad = false;
        },
        (error: any) => {
          this.JsonVars.isRippleLoad = false;
          this.errorMessage(error);
        }
      )
    }
    else {
      this.service.fetchMasters().subscribe(
        (data: any) => {
          this.masters = data;
          this.JsonVars.isRippleLoad = false;
        },
        (error: any) => {
          this.errorMessage(error);
          this.JsonVars.isRippleLoad = false;
        }
      )
    }
  }

  getAllStudents(flag) {
    this.studentsAssigned.forEach((student) => {
      student.isChecked = flag;
      this.isStudentCheckedArr.push(student.student_id);
    });
    if (!flag) {
      this.isStudentCheckedArr = [];
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
    if(this.userAssigned.length==0){
      this.getCustomUsers();
    }
    
  }

  getCourses(master_course_name) {
    this.JsonVars.isRippleLoad = true;
    this.service.fetchCourses(master_course_name).subscribe(
      (data: any) => {
        this.courses = data.coursesList;
        this.JsonVars.isRippleLoad = false;
      },
      (error: any) => {
        this.errorMessage(error);
        this.JsonVars.isRippleLoad = false;
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
    this.JsonVars.isRippleLoad = true;
    this.getPayloadBatch.coursesArray = courseArray;
    this.service.fetchStudents(this.getPayloadBatch).subscribe(
      (data: any) => {
        this.studentsAssigned = data.studentsAssigned;
        this.getCheckedBox(this.studentsAssigned);
        this.JsonVars.isRippleLoad = false;
      },
      (error: any) => {
        this.JsonVars.isRippleLoad = false;
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

    /** this function is used to fetch teacher details */
  getTeachers() {
    this.JsonVars.isRippleLoad = true;
    this.service.fetchTeachers().subscribe(
      (data: any) => {
        this.teachersAssigned = data;
        this.getCheckedBox(this.teachersAssigned);
        this.JsonVars.isRippleLoad = false;
      },
      (error: any) => {
        this.teachersAssigned = [];
        this.errorMessage(error);
        this.JsonVars.isRippleLoad = false;
      }
    )
  }

  /** this function is used to fetch customer details */
  getCustomUsers() {
    this.JsonVars.isRippleLoad = true;
    this.service.fetchUsers().subscribe(
      (data: any) => {
        this.userAssigned = data;
        this.getCheckedBox(this.userAssigned);
        this.JsonVars.isRippleLoad = false;
      },
      (error: any) => {
        this.errorMessage(error);
        this.userAssigned =[];
        this.JsonVars.isRippleLoad = false;
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

  // this function select student 
  getStudentCheckedValue(isChecked, index) {
    this.studentsAssigned[index].isChecked = isChecked;
    if (isChecked) {
      this.isStudentCheckedArr.push(this.studentsAssigned[index].student_id);
    }
    else {
      this.isStudentCheckedArr = this.isStudentCheckedArr.filter(
        (ele: any) => { return ele != this.studentsAssigned[index].student_id })
    }
    this.JsonVars.selected = this.studentsAssigned.length == this.isStudentCheckedArr.length ? true : false;
  }

  isStudent() {
    this.getElementsRemove();
    document.getElementById('li-three').classList.add('active');
    this.studentForm = false;
    this.kyc = false;
    this.feeDetails = true;
    this.inventory = false;
    if (this.teachersAssigned.length == 0) {
      this.getTeachers();
    }

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

  clearOnlineSchedulesObject() {
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
     this.courses = [];
    this.batches = [];
    this.courseIds = [];
    this.customId = [];
    this.studentId = [];
    this.isUserCheckedArr = [];
    this.isStudentCheckedArr = [];
    this.teacherIdArr = [];
    this.batchesIds = [];
    this.hourFrom = "";
    this.hourTo = "";
    this.minuteFrom = "";
    this.minuteTo = ""
    this.studentsAssigned = [];
    this.dateFrom = moment().format('YYYY-MM-DD');
    this.classDetails = "";
    this.teacherId = "";
    this.getCheckedBox(this.teachersAssigned);// unselect selected teachers
    this.getCheckedBox(this.userAssigned);// unselect selected users
  }

  getOnlineSchedules() {
    this.JsonVars.submitReq = true;
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
    this.JsonVars.isRippleLoad = true;
    this.service.getOnlineClasses(this.getOnlineClasses).subscribe(
      (data: any) => {
        this.appC.popToast({ type: "success", body: this.session + " " + "created successfully" });
        this.navigateTo("studentForm");
        this.JsonVars.submitReq = false;
        this.JsonVars.isRippleLoad = false;
        this.clearOnlineSchedulesObject();
      },
      (error: any) => {
        this.JsonVars.isRippleLoad = false;
        this.JsonVars.submitReq = false;
        this.appC.popToast({ type: "error", body: error.error.message })
      }
    )
  }

  viewOnlineClasses() {
    this.JsonVars.isRippleLoad = true;
    this.openClassPopup = true;
    this.allClasses = true;
    this.pastClassesPopup = false;
    this.futureClassesPopup = false;
    let obj = {
      institution_id: this.service.institute_id
    }
    this.service.fetchOnlineClasses(obj).subscribe(
      (data: any) => {
        this.JsonVars.isRippleLoad = false;
        this.getClasses = data;
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
    let obj = {};
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
