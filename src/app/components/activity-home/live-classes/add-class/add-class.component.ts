import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { LiveClasses } from '../../../../services/live-classes/live-class.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonServiceFactory } from '../../../../services/common-service';
import { ViewEncapsulation } from '@angular/core'
import { ProductService } from '../../../../services/products.service';
import { HttpService } from '../../../../services/http.service';


@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddClassComponent implements OnInit {

  isProfessional: boolean = false;
  isBasicActive: boolean = true;
  isOtherActive: boolean = false;
  class_id: any = 0;
  hour = ['01 AM', '02 AM', '03 AM', '04 AM', '05 AM', '06 AM', '07 AM', '08 AM', '09 AM', '10 AM', '11 AM', '12 AM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM', '07 PM', '08 PM', '09 PM', '10 PM', '11 PM', '12 PM'];
  minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']


  isRippleLoad: boolean = false;
  selectedStudentList: any[] = [];
  selectedUserList: any[] = [];
  selectedFacultyList: any[] = [];
  selectedModeratorList: any[] = [];

  dropdownList = [];
  teachersAssigned: any[] = [];
  userAssigned: any[] = [];
  studentList: any[] = [];
  dropdownSettings = {};
  facultySettings = {};
  moderatorSettings = {};
  studentListSettings = {};
  userListSetting = {};
  product_id: {} = null;
  productData: any[] = [];
  userData: any[] = [];

  facultyId = [];
  custUserIds = [];
  studentsId = [];
  eLearnCustUserIDs = [];

  courseValue: any;
  batches: any[] = [];
  masters: any[] = [];
  courses: any[] = [];
  courseIds: any[] = [];
  batchesIds: any[] = [];
  courseId: any[] = [];

  dateTimeStatus: boolean = false;
  topicName: string = '';
  hoursFrom: string = '';
  minuteFrom: string = '';
  hoursTo: string = '';
  minuteTo: string = '';
  isShowProductOption: boolean = false;
  scheduledateFrom = moment(new Date()).format('YYYY-MM-DD');
  getPayloadBatch = {
    inst_id: this.service.institute_id,
    coursesArray: [''],
    role: 'student'
  }
  addOnlineClass = {
    custUserIds: [],
    end_datetime: "",
    institution_id: this.service.institute_id,
    sent_notification_flag: 0,
    session_name: "",
    start_datetime: "",
    studentIds: [],
    teacherIds: [],
    eLearnCustUserIDs: [],
    product_id: null,
  }

  constructor(
    private auth: AuthenticatorService,
    private router: Router,
    private appC: AppComponent,
    private service: LiveClasses,
    private product_service: ProductService,
    private http_service: HttpService
  ) { }

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

    this.facultySettings = {
      singleSelection: false,
      idField: 'teacher_id',
      textField: 'teacher_name',
      itemsShowLimit: 2,
      enableCheckAll: false
    };

    this.moderatorSettings = {
      singleSelection: false,
      idField: 'userid',
      textField: 'name',
      itemsShowLimit: 2,
      enableCheckAll: false
    };

    this.studentListSettings = {
      singleSelection: false,
      idField: 'student_id',
      textField: 'student_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      enableCheckAll: true
    };

    this.userListSetting = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      enableCheckAll: true
    }

    this.getTeachers();
    this.getCustomUsers();
    this.checkIsEnableElearnFeature();
  }

  checkIsEnableElearnFeature() {
    let enable_eLearn_feature = sessionStorage.getItem('enable_eLearn_feature');
    let data: any;
    data = atob(enable_eLearn_feature);
    data = JSON.parse(data);
    console.log(data);
    if (data != 0) {
      this.isShowProductOption = true;
      this.isRippleLoad = true;
      this.product_service.getMethod('product/get-product-list',null).subscribe(
        (data: any) => {
          this.isRippleLoad = false;
          this.productData = data.result;
          console.log(this.productData);
        },
        (error: any) => {
          this.isRippleLoad = false;
          // this.clearOnlineSchedulesObject() ;
          this.appC.popToast({ type: "error", body: error.error.message })
        }
      )
    }
    else {
      this.isShowProductOption = false;
    }
  }

  onChangeProduct(event) {
    let institute_id = sessionStorage.getItem('institute_id');
    let url = `/api/v1/meeting_manager/userDetailByProductID/${institute_id}/${event}`;
    this.isRippleLoad = true;
    this.http_service.getData(url).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.userData = data;
        console.log(this.userData);
      },
      (error: any) => {
        this.isRippleLoad = false;
        this.appC.popToast({ type: "error", body: error.error.message })
      }
    );
  }


  getEvent(event) {
    if (moment(event).diff(moment(), 'days') < 0) {
      let msg = {
        type: "info",
        body: "You cannot select past date"
      }
      this.appC.popToast(msg);
      this.scheduledateFrom = moment().format('YYYY-MM-DD')
    }
  }

  getEventHourFrom(e) {
    // this.minuteFrom = "00";
    if (this.hoursFrom != "" && this.hoursFrom != null && this.minuteFrom == "") {
      this.minuteFrom = "00";
    }
    else if (this.hoursTo != "" && this.hoursTo != null && this.minuteTo == "") {
      this.minuteTo = "00";
    }
    if (this.hoursFrom != "" && this.hoursFrom != null && this.minuteFrom != "" && this.minuteFrom != null
      && this.hoursTo != "" && this.hoursTo != null && this.minuteTo != "" && this.minuteTo != null) {
      this.getEventHourTo();
    }


  }

  getEventHourTo() {

    let fromTime = moment(this.scheduledateFrom).format('YYYY-MM-DD') + " " + this.hoursFrom.split(' ')[0] + ":" + this.minuteFrom + " " + this.hoursFrom.split(' ')[1];
    let toTime = moment(this.scheduledateFrom).format('YYYY-MM-DD') + " " + this.hoursTo.split(' ')[0] + ":" + this.minuteTo + " " + this.hoursTo.split(' ')[1];
    let fromTimeT = moment(fromTime).format('YYYY-MM-DD hh:mm a');
    let toTimeT = moment(toTime).format('YYYY-MM-DD hh:mm a');

    if (moment(fromTimeT).diff(moment(toTimeT), 'minutes') > 0) {
      this.appC.popToast({ type: "error", body: "From time cannot be greater than to time" })
      return false;
    }

    else if (this.hoursFrom == "" || this.hoursTo == "" || this.minuteFrom == "" || this.minuteTo == "") {
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
      this.dateTimeStatus = true;
    }

  }


  checkMandatoryFields() {
    // this.navigateTo("assignStudent")
    if (this.topicName != "" && this.topicName != null && this.selectedFacultyList.length != 0 && this.selectedModeratorList.length != 0) {
      if (this.dateTimeStatus) {
        this.navigateTo("assignStudent")
      }
      else {
        this.getEventHourTo();
      }
    }
    else {
      this.appC.popToast({ type: "error", body: "All fields are required" })
    }
  }

  scheduleClass() {
    let validationFlag = false;
    if (!this.isProfessional) {
      if (this.courseIds != null && this.courseValue != null && this.courseValue != '') {
        validationFlag = true;
      }
      else {
        validationFlag = false;
        this.appC.popToast({ type: "error", body: "All fields are required" })
      }
    }
    else {
      if (this.batchesIds != null) {
        validationFlag = true;
      }
      else {
        validationFlag = false;
        this.appC.popToast({ type: "error", body: "All fields are required" })
      }
    }

    if (validationFlag) {
      this.facultyId = [];
      this.custUserIds = [];
      this.studentsId = [];

      this.selectedFacultyList.map(
        (ele: any) => {
          let x = ele.teacher_id.toString();
          this.facultyId.push(x);
        }
      )

      this.selectedModeratorList.map(
        (ele: any) => {
          let x = ele.userid.toString();
          this.custUserIds.push(x);
        }
      )

      this.selectedStudentList.map(
        (ele: any) => {
          let x = ele.student_id.toString();
          this.studentsId.push(x);
        }
      );

        if (this.selectedUserList.length != 0) {
          this.selectedUserList.map(
            (ele: any) => {
              let x = ele.user_id.toString();
              this.eLearnCustUserIDs.push(x);
            }
          );
          this.addOnlineClass.eLearnCustUserIDs = this.eLearnCustUserIDs;
        } else {
        this.addOnlineClass.eLearnCustUserIDs = null;
      }
      this.addOnlineClass.session_name = this.topicName;
      this.addOnlineClass.custUserIds = this.custUserIds;
      this.addOnlineClass.studentIds = this.studentsId;
      this.addOnlineClass.teacherIds = this.facultyId;
      if (this.product_id != null) {
        this.addOnlineClass.product_id = this.product_id;
      } else {
        this.addOnlineClass.product_id = null;
      }
      this.addOnlineClass.start_datetime = moment(this.scheduledateFrom).format('YYYY-MM-DD') + " " + this.hoursFrom.split(' ')[0] + "" + ":" + this.minuteFrom + " " + this.hoursFrom.split(' ')[1];
      this.addOnlineClass.end_datetime = moment(this.scheduledateFrom).format('YYYY-MM-DD') + " " + this.hoursTo.split(' ')[0] + "" + ":" + this.minuteTo + " " + this.hoursTo.split(' ')[1];

      if (this.addOnlineClass.sent_notification_flag) {
        this.addOnlineClass.sent_notification_flag = 1;
      }
      else if (!this.addOnlineClass.sent_notification_flag) {
        this.addOnlineClass.sent_notification_flag = 0;
      }
      console.log(this.addOnlineClass)

      this.isRippleLoad = true;
      console.log(this.addOnlineClass);
      this.service.getOnlineClasses(this.addOnlineClass).subscribe(
        (data: any) => {
          this.appC.popToast({ type: "success", body: "Live class session " + this.topicName + " " + "created successfully" });
          this.navigateTo("studentForm");
          this.isRippleLoad = false;
          this.clearOnlineSchedulesObject();
        },
        (error: any) => {
          this.isRippleLoad = false;
          // this.clearOnlineSchedulesObject() ;
          this.facultyId = [];
          this.custUserIds = [];
          this.studentsId = [];
          this.appC.popToast({ type: "error", body: error.error.message })
        }
      )

    }



  }

  clearOnlineSchedulesObject() {

    this.addOnlineClass = {
      custUserIds: [],
      end_datetime: "",
      institution_id: this.service.institute_id,
      sent_notification_flag: 0,
      session_name: "",
      start_datetime: "",
      studentIds: [],
      teacherIds: [],
      product_id: [],
      eLearnCustUserIDs: []
    };

    this.topicName = "";
    this.studentsId = [];
    this.facultyId = [];
    this.scheduledateFrom = moment().format('YYYY-MM-DD');
    this.hoursFrom = "";
    this.minuteFrom = "";
    this.hoursTo = "";
    this.minuteTo = "";

    this.courseIds = [];
    this.batchesIds = [];
    this.courseValue = [];
    this.selectedStudentList = [];
    this.selectedFacultyList = [];
    this.selectedModeratorList = [];

    this.navigateTo('classDetails');

  }


  /** this function is used to fetch teacher details */
  getTeachers() {
    this.isRippleLoad = true;
    this.service.fetchTeachers().subscribe(
      (data: any) => {
        this.teachersAssigned = data;
        console.log(this.teachersAssigned)
        // this.getCheckedBox(this.teachersAssigned);
        this.isRippleLoad = false;
      },
      (error: any) => {
        this.teachersAssigned = [];
        this.errorMessage(error);
        this.isRippleLoad = false;
      }
    )
  }

  /** this function is used to fetch customer details */
  getCustomUsers() {
    this.isRippleLoad = true;
    this.service.fetchUsers().subscribe(
      (data: any) => {
        this.userAssigned = data;
        console.log(this.userAssigned)
        // this.getCheckedBox(this.userAssigned);
        this.isRippleLoad = false;
      },
      (error: any) => {
        this.errorMessage(error);
        this.userAssigned = [];
        this.isRippleLoad = false;
      }
    )
  }

  getBatchesCoursesIds(ids) {
    if (this.isProfessional) {
      this.batchesIds = ids;
      this.fetchStudentsApi(this.batchesIds);
      // this.getStudents();
    }
    else {
      this.courseIds = ids
      this.fetchStudentsApi(this.courseIds);
      // this.getStudents();
    }
  }

  getBatchesCourses() {
    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.service.fetchBatches().subscribe(
        (data: any) => {
          this.batches = data;
          console.log(this.batches)
          this.isRippleLoad = false;
        },
        (error: any) => {
          this.isRippleLoad = false;
          this.errorMessage(error);
        }
      )
    }
    else {
      this.service.fetchMasters().subscribe(
        (data: any) => {
          this.masters = data;
          // console.log(this.masters)
          this.isRippleLoad = false;
        },
        (error: any) => {
          console.log(error)
          this.errorMessage(error);
          this.isRippleLoad = false;
        }
      )
    }
  }

  getCourses(master_course_name) {
    if (master_course_name == null || master_course_name == '') {
      this.courses = [];
    }
    else {
      this.isRippleLoad = true;
      this.service.fetchCourses(master_course_name).subscribe(
        (data: any) => {
          this.isRippleLoad = false;
          this.courses = data.coursesList;
        },
        (error: any) => {
          this.errorMessage(error);
          this.isRippleLoad = false;
        }
      )
    }
  }

  getStudents() {
    this.studentList = [];
    let str = []
    if (this.isProfessional) {
      // this.batchesIds.map(
      //   (ele: any) => {
      //     let x = ele.toString();
      //     str.push(x);
      //   }
      // )
      this.fetchStudentsApi(this.batchesIds);
    }
    else {
      // this.courseIds.map(
      //   (ele: any) => {
      //     let x = ele.toString();
      //     str.push(x);
      //   }
      // )
      this.fetchStudentsApi(this.courseIds);
    }
  }

  fetchStudentsApi(courseArray) {
    this.isRippleLoad = true;
    this.getPayloadBatch.coursesArray = [courseArray];
    this.service.fetchStudents(this.getPayloadBatch).subscribe(
      (data: any) => {
        this.studentList = data.studentsAssigned;
        console.log(data.studentsAssigned)
        // this.getCheckedBox(this.studentsAssigned);
        this.isRippleLoad = false;
      },
      (error: any) => {
        this.isRippleLoad = false;
        this.errorMessage(error);
      }
    )
  }

  errorMessage(error) {
    this.appC.popToast({ type: "error", body: error.error.message })
  }

  /* Function to navigate on icon click */
  switchToView(id) {
    switch (id) {
      case "class-icon": {
        this.navigateTo("classDetails");
        break;
      }
      case "assignStudent-icon": {
        this.navigateTo("assignStudent");
        break;
      }
      default: {
        this.navigateTo("classDetails");
        break;
      }
    }
  }


  /* Function to navigate through the Student Add Form on button Click Save/Submit*/
  navigateTo(text) {
    if (text === "classDetails") {
      if (this.class_id == 0 || this.class_id == null) {
        document.getElementById('li-one').classList.add('active');
        document.getElementById('li-two').classList.remove('active');
        this.isBasicActive = true;
        this.isOtherActive = false;
      }
      else {
        let msg = { type: 'info', title: 'Live Class Details Already Saved', body: '' };
        this.appC.popToast(msg);
      }
    }
    else if (text === "assignStudent") {
      if (this.class_id == 0 || this.class_id == null) {
        document.getElementById('li-one').classList.remove('active');
        document.getElementById('li-two').classList.add('active');
        this.isBasicActive = false;
        this.isOtherActive = true;
        this.getBatchesCourses();
      }
      else {
        let msg = { type: 'info', title: 'Live Class Details Already Saved', body: '' };
        this.appC.popToast(msg);
      }
    }

  }

  cancel() {
    this.router.navigateByUrl('/view/activity/liveClass');
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }


}
