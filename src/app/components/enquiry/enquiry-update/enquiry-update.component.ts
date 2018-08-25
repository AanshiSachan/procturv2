import { Component, Output, Input, OnChanges, EventEmitter } from '@angular/core';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'enquiry-update',
  templateUrl: './enquiry-update.component.html',
  styleUrls: ['./enquiry-update.component.scss']
})
export class EnquiryUpdatepComponent implements OnChanges {

  @Input() updateFormData: any;
  @Input() enqPriority: any;
  @Input() enqFollowType: any;
  @Input() hour: any;
  @Input() selectedRow: any;
  @Input() times: any;
  @Input() minute: any;
  @Input() minArr: any;
  @Input() isNotifyVisible: any;
  @Input() isMainBranch: any;
  @Input() branchesList: any;
  @Input() subBranchSelected: any;
  @Input() enqstatus: any;
  @Input() isEnquiryAdmin: any;
  @Input() enqAssignTo: any;
  @Input() updateFormComments: any;
  @Input() updateFormCommentsOn: any;
  @Input() updateFormCommentsBy: any;
  @Input() meridian: any;
  @Input() isConvertToStudent: boolean = false;
  @Input() closingReasonDataSource: any;
  @Output() close = new EventEmitter<any>(null);
  isRippleLoad: boolean = false;
  isMultiBranch: boolean = false;

  constructor(
    private prefill: FetchprefilldataService,
    private appC: AppComponent,
    private postdata: PostEnquiryDataService,
    private router: Router
  ) { }

  ngOnChanges() {
    if (this.isMainBranch == 'Y' || this.subBranchSelected == true) {
      this.isMultiBranch = true;
    }
    if (this.updateFormData.walkin_followUpTime == "" || this.updateFormData.walkin_followUpTime == null) {
      this.updateFormData.walkin_followUpTime = {
        hour: '',
        minute: ''
      }
    }
  }

  /* =========================================================================== */
  /* =========================================================================== */
  isNotifyDisplayed() {

    if (this.updateFormData.followUpDate != '' && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid date") {
      if (this.hour != '' && this.hour != null && this.hour != undefined) {
        if (this.minute != '' && this.minute != null && this.minute != 'Invalid date') {

          this.isNotifyVisible = true;
        }
        else {

          this.isNotifyVisible = false;
        }
      }
      else {

        this.isNotifyVisible = false;
      }
    }
    else {

      this.isNotifyVisible = false;
    }
  }
  /* =========================================================================== */
  /* =========================================================================== */


  /* =========================================================================== */
  /* =========================================================================== */
  clearupdateDate() {
    this.updateFormData.followUpDate = "";
    this.hour = '';
    this.minute = '';
    this.meridian = '';
  }
  /* =========================================================================== */
  /* =========================================================================== */



  /* =========================================================================== */
  /* =========================================================================== */
  notifyMe(e) {
    if (e) {
      this.updateFormData.is_follow_up_time_notification = 1;
    }
    else {
      this.updateFormData.is_follow_up_time_notification = 0;
    }
  }
  /* =========================================================================== */
  /* =========================================================================== */



  /* =========================================================================== */
  /* =========================================================================== */
  branchUpdated(e) {
    this.enqAssignTo = [];
    this.isRippleLoad = true;
    this.prefill.fetchAssignedToData(e).subscribe(
      res => {
        this.isRippleLoad = false;
        this.enqAssignTo = res;
      },
      err => {
        this.isRippleLoad = false;
      }
    );
  }
  /* =========================================================================== */
  /* =========================================================================== */



  /* =========================================================================== */
  /* =========================================================================== */
  /* update the enquiry id for enquiry update pop up */
  updateStatusForEnquiryUpdate(val) {
    this.enqstatus.forEach(el => {
      if (el.data_value == val) {
        this.updateFormData.status = el.data_key;
      }
    });
  }
  /* =========================================================================== */
  /* =========================================================================== */


  closePopup() {
    this.close.emit(true);
  }


  /* =========================================================================== */
  /* =========================================================================== */
  updateRegisterEnquiry() {
    this.isConvertToStudent = true;
    this.updateFormData.follow_type = "Walkin";
    this.updateFormData.walkin_followUpDate = moment(new Date()).format('YYYY-MM-DD');
    this.updateFormData.walkin_followUpTime = this.getFollowupTime();
    this.pushUpdatedEnquiry();
  }
  /* =========================================================================== */
  /* =========================================================================== */


  /* =========================================================================== */
  /* =========================================================================== */
  getFollowupTime(): any {
    let hour: any = parseInt(moment(new Date()).format('hh'));
    let min: any = moment(new Date()).format('mm');
    let mer: any = moment(new Date()).format('A');

    if (parseInt(min) % 5 != 0) {
      min = Math.ceil(parseInt(min) / 5) * 5;
      if (min >= 60) {
        min = '00';
        if (hour == 12) {
          hour = '1';
          if (mer == 'AM') {
            mer = 'PM';
          }
          else {
            mer = 'AM';
          }
        }
        else {
          hour += 1;
          let formattedNumber = (hour).slice(-2);
          hour = formattedNumber.toString();
        }
      }
    }

    return (hour + ":" + min + " " + mer);
  }
  /* =========================================================================== */
  /* =========================================================================== */


  /* =========================================================================== */
  /* =========================================================================== */
  validateTime(): boolean {
    /* some time selected by user or nothing*/
    let check = false;

    if ((this.hour != '' && this.minute != '') || (this.hour == '' && this.minute == '')) {
      check = true;
    }
    else {
      check = false;
      return check;
    }
    if ((this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.minute != "") || (this.updateFormData.walkin_followUpTime.hour == "" && this.updateFormData.walkin_followUpTime.minute == "")) {
      check = true;
    }
    else {
      check = false;
      return check;
    }
    return check;
  }
  /* =========================================================================== */
  /* =========================================================================== */



  /* =========================================================================== */
  /* =========================================================================== */
  /* Push the updated enquiry to server */
  pushUpdatedEnquiry() {
    if (this.validateTime()) {
      if (this.updateFormData.followUpDate != "Invalid date") {
        //this.isRippleLoad = true;
        this.updateFormData.comment = this.updateFormData.comment;
        this.updateFormData.follow_type = this.getFollowUpReverse(this.updateFormData.follow_type);
        this.updateFormData.priority = this.getPriorityReverse(this.updateFormData.priority);
        let followupdateTime: string = "";
        if (this.hour != '' && this.hour != null && this.hour != undefined) {
          let time = this.timeChanges(this.hour);
          let followUpTime = time.hour + ":" + this.minute + " " + time.meridian;
          followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY') + " " + followUpTime;
          this.updateFormData.followUpTime = followUpTime;
        }

        if (this.updateFormData.followUpDate != "" && this.updateFormData.followUpDate != null) {
          followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY');
        }

        if (this.isConvertToStudent === false) {
          if (this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.hour != null && this.updateFormData.walkin_followUpTime.hour != " :") {
            let time = this.timeChanges(this.updateFormData.walkin_followUpTime.hour);
            let walkin_followUpTime = time.hour + ":" + this.updateFormData.walkin_followUpTime.minute + " " + time.meridian;
            this.updateFormData.walkin_followUpTime = walkin_followUpTime;
          }
          else {
            this.updateFormData.walkin_followUpTime = "";
          }
          if (this.updateFormData.walkin_followUpDate != "" && this.updateFormData.walkin_followUpDate != null) {
            let walkinfollowUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
            this.updateFormData.walkin_followUpDate = walkinfollowUpDate;
          }
          else {
            this.updateFormData.walkin_followUpDate = "";
          }
        }

        if (this.updateFormData.follow_type == "Walkin") {
          if (this.updateFormData.walkin_followUpDate == "") {
            this.appC.popToast({ type: 'error', title: 'Error', body: 'Please provide walkin date for follow up type walkin.' })
            return;
          }

          if (this.updateFormData.walkin_followUpTime == "") {
            this.appC.popToast({ type: 'error', title: 'Error', body: 'Please provide walkin time for follow up type walkin.' })
            return;
          }
        }

        if (this.updateFormData.is_follow_up_time_notification) {
          this.updateFormData.is_follow_up_time_notification = 1;
        }

        else if (!this.updateFormData.is_follow_up_time_notification) {
          this.updateFormData.is_follow_up_time_notification = 0;
        }

        if (this.updateFormData.walkin_followUpDate != null && this.updateFormData.walkin_followUpDate != undefined && this.updateFormData.walkin_followUpDate != "") {
          this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format("YYYY-MM-DD");
        }

        // Closing Reason Check
        if (this.updateFormData.status == '1') {
          if (this.updateFormData.closing_reason_id == '0') {
            this.appC.popToast({ type: 'error', title: 'Error', body: 'Please provide closing reason' });
            return;
          }
        }

        /* 
          If All conditions are good to go then updating the enquiry
        */
        if (this.updateFormData.walkin_followUpDate != "Invalid date" && this.updateFormData.followUpDate != "Invalid date") {

          let obj = {
            amount: this.updateFormData.amount,
            assigned_to: this.updateFormData.assigned_to,
            closedReason: this.updateFormData.closedReason,
            comment: this.updateFormData.comment,
            commentDate: this.updateFormData.commentDate,
            followUpDate: this.updateFormData.followUpDate,
            followUpDateTime: this.updateFormData.followUpDateTime,
            followUpTime: this.updateFormData.followUpTime,
            follow_type: this.updateFormData.follow_type,
            institution_id: this.updateFormData.institution_id,
            isEnquiryUpdate: this.updateFormData.isEnquiryUpdate,
            isEnquiryV2Update: this.updateFormData.isEnquiryV2Update,
            isRegisterFeeUpdate: this.updateFormData.isRegisterFeeUpdate,
            is_follow_up_time_notification: this.updateFormData.is_follow_up_time_notification,
            paymentDate: this.updateFormData.paymentDate,
            paymentMode: this.updateFormData.paymentMode,
            priority: this.updateFormData.priority,
            reference: this.updateFormData.reference,
            slot_id: this.updateFormData.slot_id,
            source_instituteId: this.updateFormData.source_instituteId,
            status: this.updateFormData.status,
            statusValue: this.updateFormData.statusValue,
            walkin_followUpDate: this.updateFormData.walkin_followUpDate,
            walkin_followUpTime: this.updateFormData.walkin_followUpTime,
            closing_reason_id: this.updateFormData.closing_reason_id
          }

          this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, obj).subscribe(
            res => {
              this.isRippleLoad = false;
              let msg = {
                type: 'success',
                title: 'Enquiry Updated',
                body: 'Your enquiry has been successfully submitted'
              }
              this.appC.popToast(msg);
              if (this.isConvertToStudent) {
                let obj = {
                  name: this.selectedRow.name,
                  phone: this.selectedRow.phone,
                  email: this.selectedRow.email,
                  gender: this.selectedRow.gender,
                  dob: moment(this.selectedRow.dob).format("YYYY-MM-DD"),
                  parent_email: this.selectedRow.parent_email,
                  parent_name: this.selectedRow.parent_name,
                  parent_phone: this.selectedRow.parent_phone,
                  enquiry_id: this.selectedRow.institute_enquiry_id,
                  institute_enquiry_id: this.selectedRow.institute_enquiry_id
                }
                sessionStorage.setItem('studentPrefill', JSON.stringify(obj));
                this.router.navigate(['/view/student/add']);
              }
              else {
                this.closePopup();
              }
            },
            err => {
              this.isRippleLoad = false;
              let alert = {
                type: 'error',
                title: 'Failed To Update Enquiry',
                body: 'There was an error processing your request'
              }
              this.appC.popToast(alert);
            }
          )
        }
        else {
          this.isRippleLoad = false;
          let msg = {
            type: 'error',
            title: 'Invalid Date Time Input',
            body: 'Please select a valid date time for follow up'
          }
          this.appC.popToast(msg);
        }

      }
      else {
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Invalid Date Time Input',
          body: 'Please select a valid date time for follow up'
        }
        this.appC.popToast(msg);
      }


    }
    else {
      this.isRippleLoad = false;
      let msg = {
        type: 'error',
        title: 'Invalid Date-Time Input',
        body: 'Please select a valid date time'
      }
      this.appC.popToast(msg);
    }
  }
  /* =========================================================================== */
  /* =========================================================================== */


  /* =========================================================================== */
  /* =========================================================================== */
  getPriority(id): string {
    let temp: string = ""
    this.enqPriority.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }
  /* =========================================================================== */
  /* =========================================================================== */
  getFollowUp(id): string {
    let temp: string = ""
    this.enqFollowType.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }
  /* =========================================================================== */
  /* =========================================================================== */
  getFollowUpReverse(id): string {
    let temp: string = ""
    this.enqFollowType.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    return temp;
  }
  /* =========================================================================== */
  /* =========================================================================== */
  getPriorityReverse(id): string {
    let temp: string = ""
    this.enqPriority.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    return temp;
  }
  /* =========================================================================== */
  /* =========================================================================== */

  /* =========================================================================== */
  /* =========================================================================== */
  timeChanges(ev) {
    let obj: any = {};
    let time = ev.split(' ');
    obj.hour = time[0];
    obj.meridian = time[1];
    return obj;
  }
  /* =========================================================================== */
  /* =========================================================================== */

}
