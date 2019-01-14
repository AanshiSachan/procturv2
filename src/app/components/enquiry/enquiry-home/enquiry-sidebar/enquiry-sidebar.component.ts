import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
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

  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM']
  minArr: any[] = ['', '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  meridianArr: any[] = ['', "AM", "PM"];
  isEnquiryAdmin: boolean = false;
  rowData: any;
  instituteEnqId: any;
  proMc: string = "";
  proC: string = "";
  isLangInstitute: boolean = false;
  notifyme: boolean = false;
  walkin_followUpTime: any = {
    hour: '',
    minute: ''
  };
  followUpTime: any = {
    hour: '',
    minute: ''
  }
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
  minuteArr: any[] = ['', '00', '15', '30', '45'];

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
    this.followUpTime = {
      hour: '',
      minute: ''
    };
    this.walkin_followUpTime = {
      hour: '',
      minute: ''
    };
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
      if (res.followUpTime != '' && res.followUpTime != null) {
        this.followUpTime = this.breakTimeInToHrAndMin(res.followUpTime);
      }
      if (res.walkin_followUpTime != '' && res.walkin_followUpTime != null) {
        this.walkin_followUpTime = this.breakTimeInToHrAndMin(res.walkin_followUpTime);
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
      this.updateFormData.follow_type = res.follow_type;
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

  closeSideNav() {
    this.cancelUpdate.emit(null);
  }

  createUpdateForm() {
    let check: boolean = this.validateWalkinAndFollowUpDateTime();
    if (check) {

      // Closing reason mandatory
      if (this.updateFormData.statusValue == 'Closed') {
        if (this.updateFormData.closing_reason_id == '0' || this.updateFormData.closing_reason_id == '-1') {
          this.appC.popToast({ type: 'error', title: 'Error', body: 'Please provide closing reason' });
          return;
        }
        this.updateFormData.followUpDate = ""; // closed enquiry should not have a follow up date --laxmi 
      }

      // Follow Up Type Walkin Manadatory
      if (this.updateFormData.follow_type == 'Walkin') {

        if (this.updateFormData.walkin_followUpDate == "" || this.updateFormData.walkin_followUpDate == null || this.updateFormData.walkin_followUpDate == "Invalid Date") {
          this.appC.popToast({ type: 'error', title: 'Error', body: 'Please provide Walkin Date for follow up type walkin.' });
          return;
        } else {
          this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
        }
        if (this.walkin_followUpTime.hour == "" || this.walkin_followUpTime.minute == "") {
          this.appC.popToast({ type: 'error', title: 'Error', body: 'Please provide walkin time for follow up type walkin.' });
          return;
        } else {
          let time = this.walkin_followUpTime.hour.split(' ');
          this.updateFormData.walkin_followUpTime = time[0] + ":" + this.walkin_followUpTime.minute + " " + time[1];
        }

      } else {

        if (this.updateFormData.walkin_followUpDate == "" || this.updateFormData.walkin_followUpDate == null || this.updateFormData.walkin_followUpDate == "Invalid Date") {
          this.updateFormData.walkin_followUpDate = "";
        } else {
          this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
        }

        if (this.walkin_followUpTime.hour == "" || this.walkin_followUpTime.minute == "") {
          this.updateFormData.walkin_followUpTime = "";
        } else {
          let time = this.walkin_followUpTime.hour.split(' ');
          this.updateFormData.walkin_followUpTime = time[0] + ":" + this.walkin_followUpTime.minute + " " + time[1];
        }

      }
      this.updateFormData.comment = this.updateFormData.comment;
      this.updateFormData.priority = this.updateFormData.priority == "" ? "" : this.getPriorityReverse(this.updateFormData.priority);
      this.updateFormData.status = this.updateFormData.statusValue == "" ? "" : this.getStatusReverse(this.updateFormData.statusValue);
      if (this.updateFormData.followUpDate != "" && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid Date") {
        this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('YYYY-MM-DD');
      } else {
        this.updateFormData.followUpDate = "";
      }
      if (this.followUpTime.hour != "" && this.followUpTime.minute != "" && this.followUpTime.hour != ": ") {
        let time = this.followUpTime.hour.split(' ');
        this.updateFormData.followUpTime = time[0] + ":" + this.followUpTime.minute + " " + time[1];
      } else {
        this.updateFormData.followUpTime = "";
      }
      this.pushUpdatedEnquiry(this.updateFormData);
    } else {
      return;
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

  validateWalkinAndFollowUpDateTime(): boolean {
    let check: boolean = false;
    if (this.validatefollowuptime()) {
      check = true;
    } else {
      return false;
    }

    if (this.validatewalkintime()) {
      check = true;
    } else {
      return false;
    }
    return check;
  }

  getCommentDate(upDate): string {
    return moment(upDate).fromNow();
  }

  validatefollowuptime(): boolean {
    if ((this.followUpTime.hour != '' && this.followUpTime.minute != '') || (this.followUpTime.hour == '' && this.followUpTime.minute == '')) {
      return true;
    }
    else {
      let msg = {
        type: 'error',
        title: 'Invalid Time Input',
        body: 'Please select a valid follow up time.'
      }
      this.appC.popToast(msg);
      return false;
    }
  }

  validatewalkintime(): boolean {
    /* some time selected by user or nothing*/
    if ((this.walkin_followUpTime.hour != '' && this.walkin_followUpTime.minute != '') || (this.walkin_followUpTime.hour == '' && this.walkin_followUpTime.minute == '')) {
      return true;
    }
    else {
      let msg = {
        type: 'error',
        title: 'Invalid Time Input',
        body: 'Please select a valid walkin time.'
      }
      this.appC.popToast(msg);
      return false;
    }
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
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined 
    || sessionStorage.getItem('permissions') == '' || sessionStorage.getItem('username') == 'admin') {
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
      if (this.followUpTime.hour != '' || this.followUpTime.minute != '') {
        this.cd.markForCheck();
        this.isNotifyVisible = true;
      } else {
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

  // On Enquiry Take It Click//
  onEnquiryTakeIt() {
    this.updateFormData.statusValue = "In Progress";
    this.updateFormData.assigned_to = sessionStorage.getItem('userid');
    this.createUpdateForm();
  }

  breakTimeInToHrAndMin(time) {
    let obj: any = {
      hour: '',
      minute: ''
    };
    obj.hour = time.split(':')[0] + " " + time.split(':')[1].split(' ')[1];
    obj.minute = time.split(':')[1].split(' ')[0];
    return obj;
  }

}