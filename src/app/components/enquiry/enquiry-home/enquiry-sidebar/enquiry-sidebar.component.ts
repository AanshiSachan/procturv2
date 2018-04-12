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

@Component({
  selector: 'enquiry-sidebar',
  templateUrl: './enquiry-sidebar.component.html',
  styleUrls: ['./enquiry-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquirySidebarComponent implements OnChanges, OnDestroy {



  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM']
  minArr: any[] = ['', '00', '15', '30', '45'];
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

  @Input() enquiryRow: any;
  @Input() priorityArr: any;
  @Input() enqAssignTo: any;
  @Input() statusArr: any;
  @Input() followupArr: any;
  @Input() row: any;
  @Input() customComp: any[];

  @Output() updateEnq = new EventEmitter<any>();
  @Output() cancelUpdate = new EventEmitter<any>();

  @ViewChild('acc') acc: ElementRef;
  @ViewChild('one') one: ElementRef;
  @ViewChild('two') two: ElementRef;
  @ViewChild('three') three: ElementRef;
  @ViewChild('four') four: ElementRef;


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
  }



  updateFormComments: any[] = [];
  updateFormCommentsBy: any[] = [];
  updateFormCommentsOn: any[] = [];



  constructor(private prefill: FetchprefilldataService, private cd: ChangeDetectorRef, private appC: AppComponent) {
    this.isEnquiryAdministrator();
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
    this.rowData = this.row;
    this.updateFormData.priority = "";
    this.updateFormData.follow_type = "";
    this.updateFormData.statusValue = "";
    this.getDetailsById(this.instituteEnqId);
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
    }
    this.followUpTime = '';
    this.walkin_followUpTime = '';
    this.prefill.fetchAllDataEnquiry(id).subscribe(res => {
      this.rowData.dob = res.dob;
      this.updateFormData.followUpDate = res.followUpDate;
      this.cd.markForCheck();
      this.updateFormData.assigned_to = res.assigned_to;
      this.updateFormData.walkin_followUpDate = res.walkin_followUpDate;
      if (res.followUpTime != '' && res.followUpTime != null) {
        let followDateTime = res.followUpDate + " " + res.followUpTime;
        this.timeObj.fhour = moment(followDateTime).format('h');
        this.timeObj.fminute = moment(followDateTime).format('mm');
        this.timeObj.fmeridian = moment(followDateTime).format('a').toString().toUpperCase();
        this.followUpTime = this.timeObj.fhour + " " + this.timeObj.fmeridian;
      }
      if (res.walkin_followUpTime != '' && res.walkin_followUpTime != null) {
        let walkinfollowUpTime = res.walkin_followUpDate + " " + res.walkin_followUpTime;
        this.timeObj.whour = moment(walkinfollowUpTime).format('h');
        this.timeObj.wminute = moment(walkinfollowUpTime).format('mm');
        this.timeObj.wmeridian = moment(walkinfollowUpTime).format('a').toString().toUpperCase();
        this.walkin_followUpTime = this.timeObj.whour + " " + this.timeObj.wmeridian;
      }
      this.updateFormComments = res.comments;
      this.updateFormCommentsOn = res.commentedOn;
      this.updateFormCommentsBy = res.commentedBy;
    });
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
      console.log(this.updateFormData);
      if (this.updateFormData.follow_type == "Walkin") {
        if (this.validatewalkindatetime()) {
          this.updateFormData.comment = this.updateFormData.comment;
          this.updateFormData.priority = this.updateFormData.priority == "" ? "" : this.getPriorityReverse(this.updateFormData.priority);
          this.updateFormData.status = this.updateFormData.statusValue == "" ? "" : this.getStatusReverse(this.updateFormData.statusValue);
          this.updateFormData.followUpTime = this.timeObj.fhour + ":" + this.timeObj.fminute + " " + this.timeObj.fmeridian;
          this.updateFormData.walkin_followUpTime = this.timeObj.whour + ":" + this.timeObj.wminute + " " + this.timeObj.wmeridian;
          this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('YYYY-MM-DD');
          this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
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
        this.updateFormData.followUpTime = this.timeObj.fhour + ":" + this.timeObj.fminute + " " + this.timeObj.fmeridian;
        this.updateFormData.walkin_followUpTime = this.timeObj.whour + ":" + this.timeObj.wminute + " " + this.timeObj.wmeridian;
        this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('YYYY-MM-DD');
        if (this.updateFormData.walkin_followUpDate != "Invalid date") {
          this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
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
    else {
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

}