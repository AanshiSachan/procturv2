import { Component, OnInit } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { LiveClasses } from '../../../services/live-classes/live-class.service';
import { AppComponent } from '../../../app.component';
import { elementAttribute } from '@angular/core/src/render3/instructions';
import * as moment from 'moment';
@Component({
  selector: 'app-live-classes',
  templateUrl: './live-classes.component.html',
  styleUrls: ['./live-classes.component.scss']
})
export class LiveClassesComponent implements OnInit {


  items: MenuItem[];
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
    sent_notification_flag: 1,
    session_name: "",
    start_datetime: "",
    studentIds: [],
    teacherIds: []
  }
  isUserCheckedArr: any[] = [];
  teacherIdArr: any[] = [];
  dateFrom = moment().format('YYYY-MM-DD')
  hourFrom: string = "";
  hourTo: string = "";
  minuteTo: string = "";
  minuteFrom: string = "";
  getHourTo: string = "";
  getMeridianTo: string = "";
  getMinuteTo: string = "";
  getHourFrom: string = "";
  getMeridianFrom: string = "";
  getMinuteFrom: string = "";
  openClassPopup: boolean = false;
  session: string = "";
  getClasses: any[] = [];
  getPastClasses: any[] = [];
  getFutureClasses: any[] = [];
  pastClassesPopup: boolean = false;
  futureClassesPopup: boolean = false;
  allClasses: boolean = false;
  validations: boolean = false;
  constructor(private messageService: MessageService,
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

  navigateTo(text) {

    if(this.validationsOfStudentForm(this.validations)){
      if (text === "studentForm") {

        document.getElementById('li-one').classList.add('active');
        document.getElementById('li-two').classList.remove('active');
        document.getElementById('li-three').classList.remove('active');
        document.getElementById('li-four').classList.remove('active');
        this.studentForm = true;
        this.kyc = false;
        this.feeDetails = false;
        this.inventory = false;
      }
  
      else if (text === "assignStudents") {
  
      }
  
      else if (text === "assignTeachers") {
  
        if (this.isStudentCheckedArr.length == 0) {
          this.appC.popToast({ type: "info", body: "Please select at least one student" })
          this.studentForm = false;
          this.kyc = true;
          this.feeDetails = false;
          this.inventory = false;
          return;
        }
  
        else {
          document.getElementById('li-one').classList.remove('active');
          document.getElementById('li-two').classList.remove('active');
          document.getElementById('li-three').classList.add('active');
          document.getElementById('li-four').classList.remove('active');
          this.studentForm = false;
          this.kyc = false;
          this.feeDetails = true;
          this.inventory = false;
          this.getTeachers();
        }
      }
      else if (text === "assignUsers") {
        if (this.teacherId != '') {
          document.getElementById('li-one').classList.remove('active');
          document.getElementById('li-two').classList.remove('active');
          document.getElementById('li-three').classList.remove('active');
          document.getElementById('li-four').classList.add('active');
          this.studentForm = false;
          this.kyc = false;
          this.feeDetails = false;
          this.inventory = true;
          this.getCustomUsers();
        }
        else {
          this.appC.popToast({ type: "info", body: "Please select a teacher" })
        }
      }
    }
  
  }

  validationsOfStudentForm(update: boolean) {
    let fromTime = this.dateFrom + " " + this.getHourFrom + ":" + this.getMinuteFrom + " " + this.getMeridianFrom;
    let fromDate = moment().format('YYYY-MM-DD');
    let toTime = this.dateFrom + " " + this.getHourTo + ":" + this.getMinuteTo + " " + this.getMeridianTo;
    let fromTimeT = moment(fromTime).format('YYYY-MM-DD hh:mm a');
    let toTimeT = moment(toTime).format('YYYY-MM-DD hh:mm a');

    if (fromTimeT > toTimeT) {
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
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.add('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');
      this.getBatchesCourses();
      this.studentForm = false;
      this.kyc = true;
      this.feeDetails = false;
      this.inventory = false;
      return true;
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

  viewStudents() {

    let fromTime = this.dateFrom + " " + this.getHourFrom + ":" + this.getMinuteFrom + " " + this.getMeridianFrom;
    let fromDate = moment().format('YYYY-MM-DD');
    let toTime = this.dateFrom + " " + this.getHourTo + ":" + this.getMinuteTo + " " + this.getMeridianTo;
    let fromTimeT = moment(fromTime).format('YYYY-MM-DD hh:mm a');
    let toTimeT = moment(toTime).format('YYYY-MM-DD hh:mm a');

    if (fromTimeT > toTimeT) {
      this.appC.popToast({ type: "error", body: "From time cannot be greater than to time" })
    }

    else if (this.hourFrom == "" || this.hourTo == "" || this.minuteFrom == "" || this.minuteTo == "" || this.getOnlineClasses.session_name == "") {
      this.appC.popToast({ type: "error", body: "All fields are required" })
    }

    else if (moment(fromTimeT).diff(moment(), 'minutes') <= 20) {
      this.appC.popToast({ type: "error", body: "Class can be schedule 20 minutes from current time" })
    }

    else if (fromTimeT == toTimeT) {
      this.appC.popToast({ type: "error", body: "From time and to time cannot be same" })
    }

    else {
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.add('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');
      this.getBatchesCourses();
      this.studentForm = false;
      this.kyc = true;
      this.feeDetails = false;
      this.inventory = false;
    }
  }

  getBatchesCourses() {
    if (this.isProfessional) {
      this.service.fetchBatches().subscribe(
        (data: any) => {
          this.batches = data;
        },
        (error: any) => {

        }
      )
    }
    else {
      this.service.fetchMasters().subscribe(
        (data: any) => {
          this.masters = data;
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

  viewUsers() {
    document.getElementById('li-one').classList.remove('active');
    document.getElementById('li-two').classList.remove('active');
    document.getElementById('li-three').classList.remove('active');
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
    this.getPayloadBatch.coursesArray = courseArray;
    this.service.fetchStudents(this.getPayloadBatch).subscribe(
      (data: any) => {
        this.studentsAssigned = data.studentsAssigned;
        this.studentsAssigned.map(
          (ele: any) => {
            ele.isChecked = false;
          }
        )
      },
      (error: any) => {

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
    this.service.fetchTeachers().subscribe(
      (data: any) => {
        this.teachersAssigned = data;
        this.teachersAssigned.map(
          (ele: any) => {
            ele.isChecked = false;
          }
        )
      },
      (error: any) => {

      }
    )
  }

  getCustomUsers() {
    this.service.fetchUsers().subscribe(
      (data: any) => {
        this.userAssigned = data;
        this.userAssigned.map(
          (ele: any) => {
            ele.isChecked = false;
          }
        )
      },
      (error: any) => {

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
    document.getElementById('li-one').classList.remove('active');
    document.getElementById('li-two').classList.remove('active');
    document.getElementById('li-three').classList.add('active');
    document.getElementById('li-four').classList.remove('active');
    this.studentForm = false;
    this.kyc = false;
    this.feeDetails = true;
    this.inventory = false;
    this.getTeachers();
  }

  getEvent(event) {
    if (moment(this.dateFrom).diff(moment(), 'days') < 0) {
      let msg = {
        type: "info",
        body: "You cannot select past date"
      }
      this.appC.popToast(msg);
      this.dateFrom = moment().format('YYYY-MM-DD');
    }

    else {
      this.dateFrom = moment(event).format('YYYY-MM-DD');
    }
  }

  getEventHourFrom(event) {
    this.getHourFrom = event.split(' ')[0];
    this.getMeridianFrom = event.split(' ')[1];
  }

  getEventMinuteFrom(event) {
    this.getMinuteFrom = event;
  }

  getEventHourTo(event) {
    this.getHourTo = event.split(' ')[0];
    this.getMeridianTo = event.split(' ')[1];
  }

  getEventMinuteTo(event) {
    this.getMinuteTo = event;
  }

  getOnlineSchedules() {
    let customId = [];
    let studentId = [];
    this.isUserCheckedArr.map(
      (ele: any) => {
        let x = ele.toString();
        customId.push(x);
      }
    )
    this.isStudentCheckedArr.map(
      (ele: any) => {
        let x = ele.toString();
        studentId.push(x);
      }
    )
    this.teacherId = this.teacherId.toString();
    this.teacherIdArr.push(this.teacherId);
    this.getOnlineClasses.custUserIds = customId;
    this.getOnlineClasses.studentIds = studentId;
    this.getOnlineClasses.teacherIds = this.teacherIdArr;
    this.getOnlineClasses.start_datetime = this.dateFrom + " " + this.getHourFrom + "" + ":" + this.getMinuteFrom + " " + this.getMeridianFrom;
    this.getOnlineClasses.end_datetime = this.dateFrom + " " + this.getHourTo + "" + ":" + this.getMinuteTo + " " + this.getMeridianTo;
    this.session = this.getOnlineClasses.session_name;
    this.service.getOnlineClasses(this.getOnlineClasses).subscribe(
      (data: any) => {
        this.appC.popToast({ type: "success", body: this.session + "created successfully" });
        document.getElementById('li-one').classList.add('active');
        document.getElementById('li-two').classList.remove('active');
        document.getElementById('li-three').classList.remove('active');
        document.getElementById('li-four').classList.remove('active');
        this.studentForm = true;
        this.kyc = false;
        this.feeDetails = false;
        this.inventory = false;
        this.getOnlineClasses = {
          custUserIds: [],
          end_datetime: "",
          institution_id: "",
          sent_notification_flag: 0,
          session_name: "",
          start_datetime: "",
          studentIds: [],
          teacherIds: []
        }
        this.masters = [];
        this.courseValue = "";
        for(let i=0 ; i<this.studentsAssigned.length ; i++){
          this.studentsAssigned[i].isChecked = false;
        }

        for(let i=0 ;i<this.userAssigned.length ; i++){
          this.userAssigned[i].isChecked = false;
        }
        this.courses = [];
        this.batches = [];
        this.courseIds = [];
        this.isUserCheckedArr = [];
        this.isStudentCheckedArr = [];
        this.teacherIdArr = [];
        this.hourFrom = "";
        this.hourTo = "";
        this.minuteFrom = "";
        this.minuteTo = ""
        this.studentsAssigned = [];
        this.userAssigned = [];
        this.teachersAssigned = [];
        this.dateFrom = moment().format('YYYY-MM-DD');
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
      institution_id: this.service.institute_id,
      user_id: sessionStorage.getItem('userid')
    }
    this.service.fetchOnlineClasses(obj).subscribe(
      (data: any) => {
        this.getClasses = data;
        this.getPastClasses = data[0].liveMeetingPastOnlineClasses;
        this.getFutureClasses = data[0].liveMeetingUpcomingOnlineClasses;
      },
      (error: any) => {

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

}
