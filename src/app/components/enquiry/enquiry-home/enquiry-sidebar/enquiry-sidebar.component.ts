import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { updateEnquiryForm } from '../../../../model/update-enquiry-form';
import * as moment from 'moment';
import { FetchprefilldataService } from '../../../../services/fetchprefilldata.service';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'enquiry-sidebar',
  templateUrl: './enquiry-sidebar.component.html',
  styleUrls: ['./enquiry-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquirySidebarComponent implements OnChanges, OnDestroy, OnInit {

  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM']
  minArr: any[] = ['', '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  meridianArr: any[] = ['', "AM", "PM"];
  timeObj: any = {
    fhour: '',
    fminute: '',
    fmeridian: '',
    whour: '',
    wminute: '',
    wmeridian: '',
  }
  isEnquiryAdmin: boolean = false;
  rowData: any;
  instituteEnqId: any;
  proMc: string = "";
  proC: string = "";
  isLangInstitute: boolean = false;
  notifyme: boolean = false;
  followUpTime: any;
  walkin_followUpTime: any;
  FollowUpNewDate = "";
  FollowUpNewTime = "";
  updateFormData = {
    assigned_to: '-1',
    closedReason: null,
    comment: "",
    commentDate: moment().format('YYYY-MM-DD'),
    demo_account_end_date: "",
    demo_account_password: "",
    demo_account_status: "",
    demo_account_userid: "",
    followUpDate: "",
    followUpTime: "",
    follow_type: "-1",
    institution_id: sessionStorage.getItem('institute_id'),
    interested_in: "",
    isEnquiryUpdate: "Y",
    is_follow_up_time_notification: 0,
    next_follow_type: "",
    no_of_branches: "",
    no_of_students: "",
    occupation_id: null,
    priority: "-1",
    slot_id: null,
    source_instituteId: sessionStorage.getItem('institute_id'),
    status: "-1",
    statusValue: "",
    followUpDateTime: '',
    isEnquiryV2Update: "N",
    isRegisterFeeUpdate: "N",
    walkin_followUpDate: moment().format('YYYY-MM-DD'),
    walkin_followUpTime: "",
    amount: null,
    paymentMode: null,
    paymentDate: null,
    reference: null,
    closing_reason_id: ''
  };
  updateFormComments: any[] = [];
  updateFormCommentsBy: any[] = [];
  updateFormCommentsOn: any[] = [];
  sourceName: any = "";
  isNotifyVisible: boolean = false;
  courseIdArray: any;
  openEnquiryFeature: string = '0';

  @Input() enquiryRow: any;
  @Input() priorityArr: any;
  @Input() enqAssignTo: any;
  @Input() statusArr: any;
  @Input() followupArr: any;
  @Input() row: any;
  @Input() customComp: any[];
  @Input() sourceList: any[];
  @Input() mainBranchAdmin: any;
  @Input() subBranchAdmin: any;
  @Input() branchesList: any[];
  @Input() masterCourseData: any[];
  @Input() standardArr: any[];
  @Input() subjectArr: any[];
  @Input() closingReasonDataSource: any[];

  @Output() updateEnq = new EventEmitter<any>();
  @Output() cancelUpdate = new EventEmitter<any>();
  @Output() getUserList = new EventEmitter<any>();
  @Output() fullEnquiryDetails = new EventEmitter<any>();

  @ViewChild('acc') acc: ElementRef;
  @ViewChild('one') one: ElementRef;
  @ViewChild('two') two: ElementRef;
  @ViewChild('three') three: ElementRef;
  @ViewChild('four') four: ElementRef;

  constructor(private prefill: FetchprefilldataService, private cd: ChangeDetectorRef, private appC: AppComponent, private auth: AuthenticatorService) {
    this.isEnquiryAdministrator();
    this.checkInstituteType();
  }

  ngOnChanges() {
    this.cd.markForCheck();
    this.enquiryRow;
    this.priorityArr;
    this.statusArr;
    this.priorityArr;
    this.row;
    this.customComp;
    this.instituteEnqId = this.enquiryRow;
    this.masterCourseData;
    this.rowData = this.row;
    this.branchesList;
    this.enqAssignTo;
    this.mainBranchAdmin;
    this.subBranchAdmin;
    this.updateFormData.priority = "";
    this.updateFormData.follow_type = "";
    this.updateFormData.statusValue = "";
    this.getDetailsById(this.instituteEnqId);
  }

  ngOnInit() {
    this.openEnquiryFeature = sessionStorage.getItem('open_enq_Visibility_feature');
  }

  ngOnDestroy() {
  }

  getDetailsById(id) {
    this.cd.markForCheck();
    this.updateFormData.priority = this.rowData.priority;
    this.updateFormData.follow_type = this.rowData.follow_type;
    this.updateFormData.statusValue = this.rowData.statusValue;
    this.timeObj = {
      fhour: '',
      fminute: '',
      fmeridian: '',
      whour: '',
      wminute: '',
      wmeridian: '',
    };
    this.followUpTime = '';
    this.walkin_followUpTime = '';
    this.prefill.fetchAllDataEnquiry(id).subscribe((res: any) => {
      this.fullEnquiryDetails.emit(res);
      this.rowData.dob = res.dob;
      this.rowData.parent_name = res.parent_name;
      this.rowData.parent_email = res.parent_email;
      this.rowData.parent_phone = res.parent_phone;
      this.updateFormData.followUpDate = res.followUpDate;
      this.cd.markForCheck();
      this.updateFormData.assigned_to = res.assigned_to;
      this.updateFormData.walkin_followUpDate = res.walkin_followUpDate;
      if (res.followUpTime != '' && res.followUpTime != null && (res.followUpTime.toLowerCase().includes('invalid') == false)) {
        let followDateTime = res.followUpDate + " " + res.followUpTime;
        this.timeObj.fhour = moment(followDateTime).format('h');
        this.timeObj.fminute = moment(followDateTime).format('mm');
        this.timeObj.fmeridian = moment(followDateTime).format('a').toString().toUpperCase();
        this.followUpTime = this.timeObj.fhour + " " + this.timeObj.fmeridian;
      }
      if (res.walkin_followUpTime != '' && res.walkin_followUpTime != null && (res.walkin_followUpTime.toLowerCase().includes('invalid') == false)) {
        let walkinfollowUpTime = res.walkin_followUpDate + " " + res.walkin_followUpTime;
        this.timeObj.whour = moment(walkinfollowUpTime).format('h');
        this.timeObj.wminute = moment(walkinfollowUpTime).format('mm');
        this.timeObj.wmeridian = moment(walkinfollowUpTime).format('a').toString().toUpperCase();
        this.walkin_followUpTime = this.timeObj.whour + " " + this.timeObj.wmeridian;
      }
      this.updateFormComments = res.comments;
      this.updateFormCommentsOn = res.commentedOn;
      this.updateFormCommentsBy = res.commentedBy;
      if (res.followUpDate != "" && res.followUpDate != null && res.followUpTime != "" && res.followUpTime != null) {
        if (res.is_follow_up_time_notification == 1) {
          this.notifyme = true;
        }
        else {
          this.notifyme = false;
        }

      }
      else {
        this.notifyme = false;
      }
      this.getSourceName(res.source_id);

      if (!this.isLangInstitute) {
        this.courseIdArray = this.getCourseArrayList(res);
        this.rowData.master_course_name = res.master_course_name;
      }
      else if (this.isLangInstitute) {
        this.proMc = this.getMasterCoursePro(res);
        this.prefill.getEnqSubjects(res.standard_id).subscribe(
          (sub: any[]) => {
            this.subjectArr = sub;
            this.proC = this.getCoursePro(res);
          }
        );
      }
      this.updateFormData.status = res.status;
      this.updateFormData.closing_reason_id = res.closing_reason_id;
    });
  }


  getMasterCoursePro(res): string {
    let temp: string = "";
    this.standardArr.forEach(s => {
      if (s.standard_id == res.standard_id) {
        temp = s.standard_name;
      }
    });
    return temp;
  }

  getCoursePro(res): string {
    let temp: any[] = [];

    res.subjectIdArray.forEach(ss => {
      this.subjectArr.forEach(su => {
        if (ss == su.subject_id) {
          temp.push(su.subject_name);
        }
      });
    });

    return temp.join(",");
  }

  getCourseArrayList(res): string {
    let courseArr = res.courseIdArray;
    let temp: any[] = [];

    /* finding course name */
    this.masterCourseData.forEach(e => {
      if (e.master_course == res.master_course_name) {
        courseArr.forEach(ca => {
          e.coursesList.forEach(c => {
            if (c.course_id == ca) {
              temp.push(c.course_name);
            }
          });
        });
      }
    });
    return temp.join(" , ");
  }

  getPriority(id): string {
    let temp: string = ""
    this.priorityArr.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });

    return temp;
  }

  getStatus(id): string {
    let temp: string = ""
    this.statusArr.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }

  getFollowUp(id): string {
    let temp: string = ""
    this.followupArr.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }

  getStatusReverse(id): string {
    let temp: string = ""
    this.statusArr.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    return temp;
  }

  getFollowUpReverse(id): string {
    let temp: string = ""
    this.followupArr.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    return temp;
  }

  getPriorityReverse(id): string {
    let temp: string = ""
    this.priorityArr.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });

    return temp;
  }

  clearupdateDate() {
    this.updateFormData.followUpDate = "";
    this.updateFormData.walkin_followUpDate = "";
    this.timeObj = {
      fhour: '',
      fminute: '',
      fmeridian: '',
      whour: '',
      wminute: '',
      wmeridian: '',
    }
  }

  closeSideNav() {
    this.cancelUpdate.emit(null);
  }

  createUpdateForm() {
    if (this.validateTime()) {

      if (this.updateFormData.statusValue == 'Closed') {
        if (this.updateFormData.closing_reason_id == '0' || this.updateFormData.closing_reason_id == '-1') {
          this.appC.popToast({ type: 'error', title: 'Error', body: 'Please provide closing reason' });
          return;
        }
      }

      if (this.updateFormData.follow_type == "Walkin") {
        if (this.validatewalkindatetime()) {
          this.updateFormData.comment = this.updateFormData.comment;
          this.updateFormData.priority = this.updateFormData.priority == "" ? "" : this.getPriorityReverse(this.updateFormData.priority);
          this.updateFormData.status = this.updateFormData.statusValue == "" ? "" : this.getStatusReverse(this.updateFormData.statusValue);
          if (this.timeObj.fhour != null && this.timeObj.fhour != "") {
            this.updateFormData.followUpTime = this.timeObj.fhour + ":" + this.timeObj.fminute + " " + this.timeObj.fmeridian;
          } else {
            this.updateFormData.followUpTime = "";
          }
          if (this.timeObj.whour != "" && this.timeObj.whour != null) {
            this.updateFormData.walkin_followUpTime = this.timeObj.whour + ":" + this.timeObj.wminute + " " + this.timeObj.wmeridian;
          } else {
            this.updateFormData.walkin_followUpTime = "";
          }
          if (this.updateFormData.followUpDate != "" && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid Date") {
            this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('YYYY-MM-DD');
          } else {
            this.updateFormData.followUpDate = ""
          }
          if (this.updateFormData.walkin_followUpDate != "" && this.updateFormData.walkin_followUpDate != null && this.updateFormData.walkin_followUpDate != "Invalid Date") {
            this.updateFormData.followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
          }
          this.pushUpdatedEnquiry(this.updateFormData);
        }
        else {
          let obj = {
            type: 'error',
            title: 'Walkin Date Time Incorrect',
            body: 'For follow up type walkin, walkin date and time is mandatory'
          }
          this.appC.popToast(obj);
        }
      }
      else {
        this.updateFormData.comment = this.updateFormData.comment;
        this.updateFormData.priority = this.updateFormData.priority == "" ? "" : this.getPriorityReverse(this.updateFormData.priority);
        this.updateFormData.status = this.updateFormData.statusValue == "" ? "" : this.getStatusReverse(this.updateFormData.statusValue);
        this.updateFormData.follow_type = this.updateFormData.follow_type == "" ? "" : this.getFollowUpReverse(this.updateFormData.follow_type);
        if (this.timeObj.fhour != null && this.timeObj.fhour != "") {
          this.updateFormData.followUpTime = this.timeObj.fhour + ":" + this.timeObj.fminute + " " + this.timeObj.fmeridian;
        } else {
          this.updateFormData.followUpTime = "";
        }
        if (this.timeObj.whour != "" && this.timeObj.whour != null) {
          this.updateFormData.walkin_followUpTime = this.timeObj.whour + ":" + this.timeObj.wminute + " " + this.timeObj.wmeridian;
        } else {
          this.updateFormData.walkin_followUpTime = "";
        }
        if (this.updateFormData.followUpDate != "" && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid Date") {
          this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('YYYY-MM-DD');
        } else {
          this.updateFormData.followUpDate = ""
        }
        if (this.updateFormData.walkin_followUpDate != "" && this.updateFormData.walkin_followUpDate != null && this.updateFormData.walkin_followUpDate != "Invalid Date") {
          this.updateFormData.followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
        } else {
          this.updateFormData.walkin_followUpDate = "";
        }
        if (this.updateFormData.walkin_followUpTime.includes('Invalid')) {
          this.updateFormData.walkin_followUpTime = "";
        }
        this.pushUpdatedEnquiry(this.updateFormData);
      }
    }
    else {
      let obj = {
        type: 'error',
        title: 'Incorrect Time',
        body: ''
      }
      this.appC.popToast(obj);
    }
  }

  validatewalkindatetime() {

    this.updateFormData.walkin_followUpTime = this.timeObj.whour + ":" + this.timeObj.wminute + " " + this.timeObj.wmeridian;
    this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
    let d = this.updateFormData.walkin_followUpDate;
    let t = this.updateFormData.walkin_followUpTime;

    if (d == "" || d == null || d == "Invalid date" || t.trim() == "" || t.trim() == ":") {
      return false;
    }
    else {
      return true;
    }
  }

  /* Push the updated enquiry to server */
  pushUpdatedEnquiry(obj) {
    this.updateEnq.emit(obj);
    this.updateFormData.comment = "";
    this.updateFormData.priority = this.updateFormData.priority == "" ? "" : this.getPriority(this.updateFormData.priority);
    this.updateFormData.status = this.updateFormData.statusValue == "" ? "" : this.getStatus(this.updateFormData.statusValue);
    this.updateFormData.follow_type = this.updateFormData.follow_type == "" ? "" : this.getFollowUp(this.updateFormData.follow_type);
  }

  getCommentDate(upDate): string {
    return moment(upDate).fromNow();
  }

  timeChanges(ev, id) {
    debugger;
    if (id === 'followUpTime') {
      if (ev.split(' ')[0] != '') {
        this.timeObj.fhour = ev.split(' ')[0];
        this.timeObj.fmeridian = ev.split(' ')[1];
      }
      else {
        this.timeObj.fhour = '';
        this.timeObj.fmeridian = '';
      }
    }
    else if (id == 'walkin_followUpTime') {
      if (ev.split(' ')[0] != '') {
        this.timeObj.whour = ev.split(' ')[0];
        this.timeObj.wmeridian = ev.split(' ')[1];
      }
      else {
        this.timeObj.whour = '';
        this.timeObj.wmeridian = '';
      }
    }
  }

  validateTime(): boolean {
    if (this.validatefollowuptime() && this.validatewalkintime()) {
      return true;
    }
    else {
      return false;
    }
  }

  validatefollowuptime(): boolean {
    /* some time selected by user or nothing*/
    if (
      (this.timeObj.fhour != '' && this.timeObj.fminute != '' && this.timeObj.fmeridian != '') ||
      (this.timeObj.fhour == '' && this.timeObj.fminute == '' && this.timeObj.fmeridian == '')) {
      return true;
    }
    else {
      let msg = {
        type: 'error',
        title: 'Invalid Time Input',
        body: 'Please select a valid time for follow up'
      }
      this.appC.popToast(msg);
      return false;
    }
  }

  validatewalkintime(): boolean {
    /* some time selected by user or nothing*/
    if (
      (this.timeObj.whour != '' && this.timeObj.wminute != '' && this.timeObj.wmeridian != '') ||
      (this.timeObj.whour == '' && this.timeObj.wminute == '' && this.timeObj.wmeridian == '')
    ) {
      return true;
    }



    else {
      let msg = {
        type: 'error',
        title: 'Invalid Time Input',
        body: 'Please select a valid time for walkin up'
      }
      this.appC.popToast(msg);
      return false;
    }
  }

  updateStatusForEnquiryUpdate(e) {
  }

  toggleAccordian(id) {

    if (id === 'one') {
      this.one.nativeElement.classList.toggle('liclosed');
      this.two.nativeElement.classList.add('liclosed');
      this.three.nativeElement.classList.add('liclosed');
      this.four.nativeElement.classList.add('liclosed');
    }
    else if (id === 'two') {
      this.two.nativeElement.classList.toggle('liclosed');
      this.one.nativeElement.classList.add('liclosed');
      this.three.nativeElement.classList.add('liclosed');
      this.four.nativeElement.classList.add('liclosed');
    }
    else if (id === 'three') {
      this.three.nativeElement.classList.toggle('liclosed');
      this.two.nativeElement.classList.add('liclosed');
      this.one.nativeElement.classList.add('liclosed');
      this.four.nativeElement.classList.add('liclosed');
    }
    else if (id === 'four') {
      this.four.nativeElement.classList.toggle('liclosed');
      this.two.nativeElement.classList.add('liclosed');
      this.three.nativeElement.classList.add('liclosed');
      this.one.nativeElement.classList.add('liclosed');
    }
  }

  notifyMe(e) {
    if (e) {
      this.updateFormData.is_follow_up_time_notification = 1;
    }
    else {
      this.updateFormData.is_follow_up_time_notification = 0;
    }
  }

  isEnquiryAdministrator() {
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
      this.isEnquiryAdmin = true;
    }
    else {
      let permissions: any[] = [];
      permissions = JSON.parse(sessionStorage.getItem('permissions'));
      /* User has permission to view all enquiries */
      if (permissions.includes('115')) {
        this.isEnquiryAdmin = true;
      }
      /* User is not authorized as enquiry admin and see only enquiry assigned to him */
      else {
        this.isEnquiryAdmin = false;
      }
    }
  }

  // get source name

  getSourceName(data) {
    for (let i = 0; i < this.sourceList.length; i++) {
      if (this.sourceList[i].id == data) {
        this.sourceName = this.sourceList[i].name;
        break;
      }
    }
  }

  checkInstituteType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitute = true;
        } else {
          this.isLangInstitute = false;
        }
      }
    )
  }

  isNotifyDisplayed() {
    this.cd.markForCheck();
    if (this.updateFormData.followUpDate != '' && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid date") {
      if (this.followUpTime != '' && this.followUpTime != null && this.followUpTime != undefined) {
        if (this.timeObj.fminute != '' && this.timeObj.fminute != null && this.timeObj.fminute != 'Invalid date') {
          this.cd.markForCheck();
          this.isNotifyVisible = true;
        }
        else {
          this.cd.markForCheck();
          this.isNotifyVisible = false;
        }
      }
      else {
        this.cd.markForCheck();
        this.isNotifyVisible = false;
      }
    }
    else {
      this.cd.markForCheck();
      this.isNotifyVisible = false;
    }
  }

  changeAssignList(event) {
    this.getUserList.emit(event);
  }

  walkinChanges(e) {
    if (e != "Invalid date" && e != null) {
      //valid date detected
      if (this.walkin_followUpTime == "" && this.timeObj.wminute == "") {
        this.walkin_followUpTime = "12 PM";
        this.timeObj.whour = "12";
        this.timeObj.wmeridian = "PM";
        this.timeObj.wminute = "00";
      }
    }
    else {
      this.walkin_followUpTime = "";
      this.timeObj.whour = "";
      this.timeObj.wmeridian = "";
      this.timeObj.wminute = "";
    }
  }

  // On Enquiry Take It Click//
  onEnquiryTakeIt() {
    this.updateFormData.statusValue = "In Progress";
    this.updateFormData.assigned_to = sessionStorage.getItem('userid');
    this.createUpdateForm();
  }

}