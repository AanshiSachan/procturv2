import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageShowService } from '../../..';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { ProductService } from '../../../services/products.service';


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
  hour = ['01 AM', '02 AM', '03 AM', '04 AM', '05 AM', '06 AM', '07 AM', '08 AM', '09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM', '07 PM', '08 PM', '09 PM', '10 PM', '11 PM', '12 AM'];
  minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
  selectedStudentList: any[] = [];
  selectedUserList: any[] = [];
  selectedFacultyList: any[] = [];
  selectedModeratorList: any[] = [];
  selectedCourseList: any[] = [];
  selectedSubjectList: any[] = [];
  selectedBatchList: any[] = [];
  userTy: any;
  dropdownList = [];
  teachersAssigned: any[] = [];
  userAssigned: any[] = [];
  studentList: any[] = [];
  dropdownSettings = {};
  facultySettings = {};
  moderatorSettings = {};
  studentListSettings = {};
  userListSetting = {};
  courseListSetting = {};
  batchListSetting = {};
  productSetting = {};
  masterCourseListSetting = {};
  subjectSetting = {};
  product_id: any = "";
  productData: any[] = [];
  userData: any[] = [];

  facultyId = [];
  custUserIds = [];
  studentsId = [];
  eLearnCustUserIDs = [];

  courseValue: any = '';
  batches: any[] = [];
  masters: any[] = [];
  courses: any[] = [];
  courseIds: any = null;
  batchesIds: any = null;
  courseId: any[] = [];

  dateTimeStatus: boolean = false;
  topicName: string = '';
  hoursFrom: string = '';
  minuteFrom: string = '';
  hoursTo: string = '';
  minuteTo: string = '';
  isShowProductOption: boolean = false;
  userType: any;
  scheduledateFrom = moment(new Date()).format('YYYY-MM-DD');
  institution_id: any = sessionStorage.getItem('institution_id');
  getPayloadBatch = {
    inst_id: this.institution_id,
    coursesArray: [''],
    role: 'student'
  }
  addOnlineClass = {
    custUserIds: [],
    end_datetime: "",
    institution_id: this.institution_id,
    sent_notification_flag: 0,
    session_name: "",
    start_datetime: "",
    studentIds: [],
    teacherIds: [],
    eLearnCustUserIDs: [],
    product_ids: null,
    private_access: false,
    access_enable_lobby: false,
    access_enable_breakout_rooms: false,
    access_before_start: 0,
    batch_list: null,
    course_list: null,
    host_video: true,
    participant_video: false,
    join_before_host: true,
    mute_upon_entry: true,
    auto_recording: "none",
    is_zoom_live_class: false,
    hide_recording_notifications: true,
    prevent_user_count: false
  };
  // Zoom
  auto_recording: boolean = false;
  is_zoom_integration_enable: boolean = true;
  live_class_for: any = sessionStorage.getItem('setLiveClassType');
  singleSelectionOfFaculty: boolean = false;
  zoom_enable: boolean = false;
  schoolModel: boolean = false;
  subjectList: any = [];
  fullResponse: any = [];

  constructor(
    private auth: AuthenticatorService,
    private router: Router,
    private appC: AppComponent,
    private product_service: ProductService,
    private http_service: HttpService,
    private msgService: MessageShowService
  ) { }

  ngOnInit() {
    this.institution_id = sessionStorage.getItem('institution_id');
    this.userType = sessionStorage.getItem('userType');
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    // changes by Nalini - to handle school model conditions
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )
    let zoom = sessionStorage.getItem('is_zoom_enable');
    this.is_zoom_integration_enable = JSON.parse(zoom);
    if (this.is_zoom_integration_enable && this.live_class_for == "2") {
      this.singleSelectionOfFaculty = true;
      this.zoom_enable = true
    }

    this.setMultiSelectSetting();
    this.getTeachers();
    this.getCustomUsers();
    this.checkIsEnableElearnFeature();
    this.getBatchesCourses();
  }

  changeLiveClassFor() {
    if (this.live_class_for == "2") {
      this.singleSelectionOfFaculty = true;
      this.zoom_enable = true;
      this.selectedFacultyList = [];
      this.selectedModeratorList = [];
      this.facultySettings = {
        singleSelection: this.singleSelectionOfFaculty,
        idField: 'teacher_id',
        textField: 'teacher_name',
        itemsShowLimit: 2,
        enableCheckAll: false
      };
    }
    else if (this.live_class_for == "1") {
      this.singleSelectionOfFaculty = false;
      this.zoom_enable = false;
      this.selectedModeratorList = [];
      this.facultySettings = {
        singleSelection: this.singleSelectionOfFaculty,
        idField: 'teacher_id',
        textField: 'teacher_name',
        itemsShowLimit: 2,
        enableCheckAll: false
      };
    }
  }

  setMultiSelectSetting() {
    this.facultySettings = {
      singleSelection: this.singleSelectionOfFaculty,
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
      itemsShowLimit: 2,
      enableCheckAll: true
    };

    this.userListSetting = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true
    }

    this.courseListSetting = {
      singleSelection: false,
      idField: 'course_id',
      textField: 'course_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true
    }

    this.batchListSetting = {
      singleSelection: false,
      idField: 'batch_id',
      textField: 'batch_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true
    }

    this.productSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true
    }

    this.subjectSetting = {
      singleSelection: false,
      idField: 'batch_id',
      textField: 'subject_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true
    }

    this.masterCourseListSetting = {
      singleSelection: false,
      idField: 'master_course',
      textField: 'master_course',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true
    }
  }

  checkIsEnableElearnFeature() {
    let data = sessionStorage.getItem('enable_eLearn_feature');
    if (data == '1') {
      this.isShowProductOption = true;
      this.auth.showLoader();
      this.product_service.getMethod('product/get-product-list?slug=Online_Class', null).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          this.productData = data.result;
          console.log(this.productData);
        },
        (error: any) => {
          this.auth.hideLoader();
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
    let pro_id = Array.prototype.map.call(event, function(item) { return item.id; }).join(",");
    if(institute_id!='100058' && institute_id!='100127' && institute_id!='101924') {
      this.selectedUserList = [];
    }
    let url = `/api/v1/meeting_manager/userDetailByProductID/${institute_id}?productIds=${pro_id}`;
    this.auth.showLoader();
    this.http_service.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.userData = data;
      },
      (error: any) => {
        this.auth.hideLoader();
        this.appC.popToast({ type: "error", body: error.error.message })
      }
    );
  }

  getEvent(event) {
    let proctur_live_expiry_date: any = sessionStorage.getItem('proctur_live_expiry_date');
    if (moment(event).diff(moment(), 'days') < 0) {
      let msg = {
        type: "info",
        body: "You cannot select past date"
      }
      this.appC.popToast(msg);
      this.scheduledateFrom = moment(new Date()).format();
    }
    event = (new Date(event));
    proctur_live_expiry_date = (new Date(proctur_live_expiry_date));
    event.setHours(0, 0, 0, 0);
    proctur_live_expiry_date.setHours(0, 0, 0, 0);
    if (proctur_live_expiry_date < event && proctur_live_expiry_date != event) {
      const tempMsg = 'Your live class subscription will get expired on '.concat(moment(proctur_live_expiry_date).format('DD-MM-YYYY')).concat(' hence you will not be able create live class. Renew your subscription to conduct live classes again!');
      this.msgService.showErrorMessage('info', '', tempMsg);
      this.scheduledateFrom = moment(new Date()).format();
    }
  }
  

  getEventHourFrom(e) {
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
      this.appC.popToast({ type: "error", body: "From time cannot be greater than to time" });
      this.dateTimeStatus = false;
      return false;
    }

    else if (this.hoursFrom == "" || this.hoursTo == "" || this.minuteFrom == "" || this.minuteTo == "") {
      this.appC.popToast({ type: "error", body: "All fields are required" });
      this.dateTimeStatus = false;
      return false;
    }

    else if (moment(fromTimeT).diff(moment(), 'minutes') <= 0) {
      this.appC.popToast({ type: "error", body: "Class cannot be schedule before current time" });
      this.dateTimeStatus = false;
      return false;
    }

    else if (fromTimeT == toTimeT) {
      this.appC.popToast({ type: "error", body: "From time and to time cannot be same" });
      this.dateTimeStatus = false;
      return false;
    }
    else {
      this.dateTimeStatus = true;
    }

  }
  //Added by ashwini gupta ticket 1104
  checkMandatoryFields() {
    if (this.userType === "3") {
      if (this.topicName != "" && this.topicName != null) {
        if (this.dateTimeStatus) {
          // this.navigateTo("assignStudent")
          return true;
        }
        else {
          this.getEventHourTo();
        }
      }
      else {
        this.appC.popToast({ type: "error", body: "All fields are required" });
        return false;
      }
    } else {


      if (this.topicName != "" && this.topicName != null && this.selectedFacultyList.length != 0) {
        if (this.dateTimeStatus) {
          // this.navigateTo("assignStudent");
          return true;
        }
        else {
          this.getEventHourTo();
        }
      }
      else {
        this.appC.popToast({ type: "error", body: "All fields are required" });
        return false;
      }
    }
  }

  scheduleClass() {
    const userType: any = sessionStorage.getItem('userType');
    let validationFlag = false;
    if (!this.isProfessional) {
      if (this.courseIds != null && this.courseValue != null && this.courseValue != '') {
        if (this.selectedStudentList.length != 0 || this.selectedUserList.length != 0) {
          validationFlag = true;
          if(this.checkMandatoryFields()) {
            if(this.schoolModel) {
              if(this.selectedSubjectList!=null && this.selectedSubjectList.length!=0 ) {
                validationFlag = true;
              } else {
                validationFlag = false;
                this.appC.popToast({ type: "error", body: "Please select subject" })
              }
            } else {
              validationFlag = true;
            }
          } else {
            validationFlag = false;
          }
        } else {
          validationFlag = false;
          this.appC.popToast({ type: "info", body: "Please select students or users" })
        }
      }
      else {
        validationFlag = false;
        this.appC.popToast({ type: "error", body: "All fields are required" })
      }
    }
    else {
      if (this.batchesIds != null) {
        if (this.selectedStudentList.length != 0 || this.selectedUserList.length != 0) {
          validationFlag = true;
          if(this.checkMandatoryFields()) {
            validationFlag = true;
          } else {
            validationFlag = false;
          }
        } else {
          validationFlag = false;
          this.appC.popToast({ type: "info", body: "Please select students or users" })
        }
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
      let product_ids = [];

      //Adding for faculty module so that faculty is not able to assign live classes to another faculty- Ashwini Kumar Gupta  1104
      if (userType == "3") {
        let tempFaculty: any = sessionStorage.getItem('teacherIDs');
        this.facultyId.push(tempFaculty);
      } else {
        this.selectedFacultyList.map(
          (ele: any) => {
            let x = ele.teacher_id.toString();
            this.facultyId.push(x);
          }
        )
      }
      // End
      if(this.product_id && this.product_id.length) {
        this.product_id.map(
          (ele: any) => {
            let x = ele.id.toString();
            product_ids.push(x);
          }
        )
      }

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
      let course_list: any[] = [];
      if(!this.schoolModel) {
      this.selectedCourseList.map(
        (ele: any) => {
          let x = { 'course_id': ele.course_id.toString() }
          course_list.push(x);
        }
      );
      }

      let batch_list: any = [];
      this.selectedBatchList.map(
        (ele: any) => {
          let x = { 'batch_id': ele.batch_id.toString() }
          batch_list.push(x);
        }
      );
      if(this.schoolModel) {       
        for(let i=0;i<this.selectedCourseList.length;i++) {
            let x = { 'course_id': this.selectedCourseList[i].course_id.toString() }
            course_list.push(x);
              course_list[i].subject_list = [];
              for(let j=0;j<this.subjectList.length;j++) {
              for(let l=0;l<this.selectedSubjectList.length;l++) {                
                if((this.subjectList[j].batch_id == this.selectedSubjectList[l].batch_id) && (this.subjectList[j].course_id == this.selectedCourseList[i].course_id)) {
                    let x = { 'batch_id': this.subjectList[j].batch_id.toString() }
                    course_list[i].subject_list.push(x);
                  }
                }
              }
          }
      }
      this.addOnlineClass.course_list = course_list;
      this.addOnlineClass.batch_list = batch_list;

      if (this.selectedUserList.length != 0) {
        this.eLearnCustUserIDs = [];
        this.selectedUserList.map(
          (ele: any) => {
            let x = ele.user_id.toString();
            this.eLearnCustUserIDs.push(x);
          }
        );
        this.addOnlineClass.eLearnCustUserIDs = this.eLearnCustUserIDs;
      } else {
        this.addOnlineClass.eLearnCustUserIDs = [];
      }
      this.addOnlineClass.session_name = this.topicName;
      this.addOnlineClass.custUserIds = this.custUserIds;
      this.addOnlineClass.studentIds = this.studentsId;
      this.addOnlineClass.teacherIds = this.facultyId;
      if (product_ids != null) {
        this.addOnlineClass.product_ids = product_ids;
      } else {
        this.addOnlineClass.product_ids = null;
      }
      this.addOnlineClass.start_datetime = moment(this.scheduledateFrom).format('YYYY-MM-DD') + " " + this.hoursFrom.split(' ')[0] + "" + ":" + this.minuteFrom + " " + this.hoursFrom.split(' ')[1];
      this.addOnlineClass.end_datetime = moment(this.scheduledateFrom).format('YYYY-MM-DD') + " " + this.hoursTo.split(' ')[0] + "" + ":" + this.minuteTo + " " + this.hoursTo.split(' ')[1];

      if (this.addOnlineClass.sent_notification_flag) {
        this.addOnlineClass.sent_notification_flag = 1;
      }
      else if (!this.addOnlineClass.sent_notification_flag) {
        this.addOnlineClass.sent_notification_flag = 0;
      }

      if (this.addOnlineClass.access_before_start) {
        this.addOnlineClass.access_before_start = 1;
      }

      if (!this.addOnlineClass.access_before_start) {
        this.addOnlineClass.access_before_start = 0;
      }

      if (this.live_class_for == "1") {
        this.addOnlineClass.is_zoom_live_class = false;
      }
      else {
        this.addOnlineClass.is_zoom_live_class = true;
      }

      if (this.auto_recording) {
        this.addOnlineClass.auto_recording = "local";
      }
      else if (!this.auto_recording) {
        this.addOnlineClass.auto_recording = "none";
      }

      console.log(this.addOnlineClass)

      this.auth.showLoader();
      const url = '/api/v1/meeting_manager/createV2'
      this.http_service.putData(url, this.addOnlineClass).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          if (data.statusCode >= 200 && data.statusCode <= 300) {
            let session = (this.live_class_for == "1") ? 'Live class session ' : 'Zoom class session ';
            this.appC.popToast({ type: "success", body: session + this.topicName + " " + "created successfully" });
            this.navigateTo("studentForm");
            this.clearOnlineSchedulesObject();
          }
          else {
            this.appC.popToast({ type: "error", body: data.message })
          }

        },
        (error: any) => {
          this.auth.hideLoader();
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
      institution_id: this.institution_id,
      sent_notification_flag: 0,
      session_name: "",
      start_datetime: "",
      studentIds: [],
      teacherIds: [],
      product_ids: [],
      eLearnCustUserIDs: [],
      private_access: false,
      access_enable_lobby: false,
      access_enable_breakout_rooms: false,
      access_before_start: 0,
      batch_list: null,
      course_list: null,
      host_video: false,
      participant_video: false,
      join_before_host: false,
      mute_upon_entry: false,
      auto_recording: "none",
      is_zoom_live_class: false,
      hide_recording_notifications: true,
      prevent_user_count: false
    };

    this.topicName = "";
    this.product_id = "";
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
    this.selectedUserList = [];
    this.selectedBatchList = [];
    this.selectedCourseList = [];
    this.selectedSubjectList = [];

    this.navigateTo('classDetails');

  }

  /** this function is used to fetch teacher details */
  getTeachers() {
    this.auth.showLoader();
    let url = `/api/v1/teachers/all/${this.institution_id}?active=Y`
    this.http_service.getData(url).subscribe(
      (data: any) => {
        this.teachersAssigned = data;
        console.log(this.teachersAssigned)
        // this.getCheckedBox(this.teachersAssigned);
        this.auth.hideLoader();
      },
      (error: any) => {
        this.teachersAssigned = [];
        this.errorMessage(error);
        this.auth.hideLoader();
      }
    )
  }

  /** this function is used to fetch customer details */
  getCustomUsers() {
    this.auth.showLoader();
    const url = '/api/v1/profiles/custUsers/' + this.institution_id
    this.http_service.getData(url).subscribe(
      (data: any) => {
        this.userAssigned = data;
        console.log(this.userAssigned)
        // this.getCheckedBox(this.userAssigned);
        this.auth.hideLoader();
      },
      (error: any) => {
        this.errorMessage(error);
        this.userAssigned = [];
        this.auth.hideLoader();
      }
    )
  }

  getBatchesCoursesIds(ids) {
    this.selectedStudentList = [];
    if (this.isProfessional) {
      this.batchesIds = ids;
      let temp: any = [];
      this.batchesIds.forEach(element => {
        temp.push(element.batch_id);
      });
      this.fetchStudentsApi(temp);
      // this.getStudents();
    }
    else {
      this.courseIds = ids;
        let tempData: any = this.courses;
        if(this.schoolModel) {
        this.subjectList = [];
        this.updateSubjectList(ids);
      } else {
        let temp: any = [];
        this.courseIds.forEach(element => {
          temp.push(element.course_id);
        });
        this.fetchStudentsApi(temp);
      }
        //End
      // this.getStudents();
    }
  }

  updateSubjectList(event) {
    console.log(event);
    this.subjectList = [];
    if(event && event.length) {
    let course_id = Array.prototype.map.call(event, function(item) { return item.course_id; }).join(",");
    const url = "/api/v1/subjects/course?courseIds=" + course_id;
    this.auth.showLoader();
    this.http_service.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.subjectList = res.result;
        if(this.subjectList && this.subjectList.length) {
        this.subjectList.forEach(element => {
          element.subject_name = element.course_name + ' - ' + element.subject_name;
          if(element.is_optional == 'Y') {
            element.subject_name = element.subject_name + ' (Optional)';
          }
        });
      }
      },
      err => {
        this.msgService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
        //console.log(err);
      }
    )
    }
  }

  getStudentsBySubject(obj) {
    console.log(obj);
    if(obj && obj.length) {
      let temp:any = [];
      obj.forEach(element => {
        temp.push(element.batch_id);
      });
      this.fetchStudentsApi(temp);
    }
  }

  getBatchesCourses() {
    this.auth.showLoader();
    if (this.isProfessional) {
      let url = '';
      if (this.userType === '3') {
        url = '/api/v1/batches/all/' + this.institution_id + '?active=Y' + '&isTeacher=true&isActiveNotExpire=Y';

      } else {
        url = '/api/v1/batches/all/' + this.institution_id + '?active=Y&isActiveNotExpire=Y';

      }
      this.http_service.getData(url).subscribe(
        (data: any) => {

          this.batches = data;
          if (this.batches && !this.batches.length) {
            this.appC.popToast({ type: "error", body: "Please check batches are active or not." });
          }
          console.log(this.batches)
          this.auth.hideLoader();
        },
        (error: any) => {
          this.auth.hideLoader();
          this.errorMessage(error);
        }
      )
    }
    else {
      let url = '';
      if(this.schoolModel) {
        url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem("institute_id") + "?is_standard_wise=true&sorted_by=course_name&is_active_not_expire=Y";
      } else if (this.userType === '3') {
        url = '/api/v1/courseMaster/fetch/' + this.institution_id + '/all' + '?isAllCourses=N&isActiveNotExpire=Y'; //Changed isAllCourses flay Y to N as per ticket 1103
      } else {
        url = '/api/v1/courseMaster/fetch/' + this.institution_id + '/all?isActiveNotExpire=Y';
      }
      this.http_service.getData(url).subscribe(
        (data: any) => {
          this.fullResponse = data.result;
          this.masters = (this.schoolModel) ? (Object.keys(data.result)) : data;
          if (this.masters && !this.masters.length) {
            this.appC.popToast({ type: "error", body: "Please check courses are active or not." });
          }
          this.auth.hideLoader();
        },
        (error: any) => {
          console.log(error)
          this.errorMessage(error);
          this.auth.hideLoader();
        }
      )
    }
  }

  // Removed the previous API call as their is not need to call one more api to fetch courselist. It already coming in master course
  // api. Added By ashwini kumar gupta
  getCourses(master_course_name) {
    this.selectedCourseList = [];
    this.selectedSubjectList = [];
    this.courses = [];
    let tempData: any = this.masters;
    if(this.schoolModel) {
      let temp = this.fullResponse[master_course_name];
      for (let i = 0; i < temp.length; i++) {
        this.courses.push(temp[i]);
      }
    } else {
      for (let i = 0; i < tempData.length; i++) {
        for(let j=0;j< master_course_name.length; j++) {
          if (tempData[i].master_course === master_course_name[j].master_course) {
            console.log(tempData[i].coursesList);
            for(let k=0;k<tempData[i].coursesList.length;k++) {
              this.courses.push(tempData[i].coursesList[k]);
            }
          }
        }
      }
    }
    //End
  }
  // End


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
    this.getPayloadBatch.coursesArray = courseArray;
    const url = '/api/v1/courseMaster/onlineClass/fetch/users'
    this.auth.showLoader();
    this.http_service.postData(url, this.getPayloadBatch).subscribe(
      (data: any) => {
        this.studentList = data.studentsAssigned;
        // this.getCheckedBox(this.studentsAssigned);
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
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
    this.router.navigateByUrl('/view/live-classes');
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }


}
