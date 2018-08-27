import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FetchprefilldataService } from '../../services/fetchprefilldata.service';
import { AuthenticatorService } from '../../services/authenticator.service';
import { MultiBranchDataService } from '../../services/multiBranchdata.service';
import * as moment from 'moment';
import { CommonServiceFactory } from '../../services/common-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiry-update-popup',
  templateUrl: './enquiry-update-popup.component.html',
  styleUrls: ['./enquiry-update-popup.component.scss']
})
export class EnquiryUpdatePopupComponent implements OnInit, OnChanges {

  isRippleLoad: boolean = false;
  enqstatus: any = [];
  enqFollowType: any = [];
  enqPriority: any = [];
  enqAssignTo: any = [];
  closingReasonDataSource: any = [];
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['', '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  isMainBranch: string = "N";
  branchesList: any = [];
  subBranchSelected: boolean = false;
  isMultiBranch: boolean = false;
  updateFormData: any = {
    comment: "",
    status: "",
    statusValue: "",
    institution_id: sessionStorage.getItem('institute_id'),
    isEnquiryUpdate: "Y",
    closedReason: null,
    slot_id: null,
    priority: "",
    follow_type: "",
    followUpDate: "",
    commentDate: moment().format('YYYY-MM-DD'),
    followUpTime: {
      hour: "",
      minute: ""
    },
    followUpDateTime: "",
    isEnquiryV2Update: "N",
    isRegisterFeeUpdate: "N",
    amount: null,
    paymentMode: null,
    paymentDate: null,
    reference: null,
    walkin_followUpDate: '',
    walkin_followUpTime: {
      hour: '',
      minute: '',
    },
    is_follow_up_time_notification: 0,
    source_instituteId: '-1',
    closing_reason_id: '0',
    assigned_to: "-1"
  };
  updateFormComments: any = [];
  updateFormCommentsBy: any = [];
  updateFormCommentsOn: any = [];
  enquiryDet: any = {
    enquiry_no: 0,
    name: "",
    status: 0,
    institute_enquiry_id: '',
    phone: "",
    email: "",
    gender: "",
    dob: "",
    parent_email: "",
    parent_name: "",
    parent_phone: ""
  };
  isEnquiryAdmin: boolean = false;
  isNotifyVisible: boolean = false;

  @Input() enqData: any;
  @Output() closePopUp = new EventEmitter<any>(null);

  constructor(
    private fetchService: FetchprefilldataService,
    private auth: AuthenticatorService,
    private multiBranchService: MultiBranchDataService,
    private commonService: CommonServiceFactory,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchDataFromServer();
    this.checkForMultiBranch();
    this.isEnquiryAdmin = this.commonService.checkUserHadPermission('115');
    console.log(this.enqData);

  }

  ngOnChanges() {
    this.enqData;
    if (this.enqData != null && this.enqData != "") {
      this.fetchCommentData(this.enqData);
      this.enquiryDataFetch(this.enqData);
    }
  }

  // Fetch Required Data From Server
  fetchDataFromServer() {
    this.fetchService.getEnqStatus().subscribe(
      data => {
        this.enqstatus = data;
      }
    );

    this.fetchService.getFollowupType().subscribe(
      data => { this.enqFollowType = data }
    );

    this.fetchService.getEnqPriority().subscribe(
      data => { this.enqPriority = data; }
    );

    this.fetchService.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; }
    );

    this.fetchService.getClosingReasons().subscribe(
      data => { this.closingReasonDataSource = data; }
    )
  }

  // Comment Data From Server
  fetchCommentData(id) {
    this.fetchService.fetchCommentsForEnquiry(id).subscribe(
      (res: any) => {

        if (res.comments != null) {
          this.updateFormComments = res.comments;
          this.updateFormCommentsOn = res.commentedOn;
          this.updateFormCommentsBy = res.commentedBy;
        }
        else if (res.comments == null) {
          this.updateFormComments = [];
          this.updateFormCommentsOn = [];
          this.updateFormCommentsBy = [];
        }
      },
      err => {
        this.messageNotifier("error", "Error Fetching Enquiry Comments", err.error.message);
      }
    );
  }

  // Other Info Regarding Enq
  enquiryDataFetch(id) {
    this.fetchService.fetchEnquiryByInstituteID(id).subscribe(
      res => {

        // Name ,Number And Status
        this.enquiryDet = res;

        this.updateFormData.priority = res.priority;
        this.updateFormData.follow_type = res.follow_type;
        this.updateFormData.status = res.status;
        this.updateFormData.assigned_to = res.assigned_to;

        // Notify Me
        if (res.is_follow_up_time_notification == 1) {
          this.updateFormData.is_follow_up_time_notification = true;
        }
        else {
          this.updateFormData.is_follow_up_time_notification = false;
        }

        // Follow Up Date And Time Validation

        if (res.followUpTime != '' && res.followUpTime != null && res.followUpTime != ": ") {
          this.updateFormData.followUpTime = this.commonService.breakTimeInToHrAndMin(res.followUpTime);
        }

        if (res.followUpDate != "" && res.followUpDate != null && res.followUpDate != "Invalid date") {
          this.updateFormData.followUpDate = res.followUpDate;
        }

        // Walkin Date And Time Validation

        if (res.walkin_followUpDate != "" && res.walkin_followUpDate != "Invalid date" && res.walkin_followUpDate != null) {
          this.updateFormData.walkin_followUpDate = res.walkin_followUpDate;
        }

        if (res.walkin_followUpTime != "" && res.walkin_followUpTime != null && res.walkin_followUpTime != ": ") {
          this.updateFormData.walkin_followUpTime = this.commonService.breakTimeInToHrAndMin(res.walkin_followUpTime);
        }
        this.isRippleLoad = false;
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier("error", "Error Fetching Enquiry Data", err.error.message);
      }

    );
  }

  // IF Multi Branch  then show Branch Drop Down
  checkForMultiBranch() {
    let insttitueId = sessionStorage.getItem("institute_id");
    const permissionArray = sessionStorage.getItem('permissions');

    if (permissionArray == "" || permissionArray == null) {
      this.auth.isMainBranch.subscribe(
        (value: any) => {
          this.isMainBranch = value;
          if (this.isMainBranch == "Y") {
            this.updateFormData.source_instituteId = insttitueId;
            this.multiBranchInstituteFound(insttitueId);
            this.branchUpdated(this.updateFormData.source_instituteId);
            this.updateBranchVisibility();
          }
        }
      );

      this.multiBranchService.subBranchSelected.subscribe(
        res => {
          this.subBranchSelected = res;
          if (res == true) {
            this.updateFormData.source_instituteId = insttitueId;
            const mainBranchId = sessionStorage.getItem('mainBranchId');
            if (mainBranchId != null) {
              this.multiBranchInstituteFound(mainBranchId);
              this.branchUpdated(this.updateFormData.source_instituteId);
              this.updateBranchVisibility();
            }
          }
        }
      )
    }
    else {
      this.isMainBranch = "N";
      this.subBranchSelected = false;
      this.updateBranchVisibility();
    }
  }

  updateBranchVisibility() {
    if (this.isMainBranch == 'Y' || this.subBranchSelected == true) {
      this.isMultiBranch = true;
    }
  }

  multiBranchInstituteFound(id) {
    this.fetchService.getAllSubBranches(id).subscribe(
      (res: any) => {
        this.branchesList = res;
      },
      err => {
        console.log(err);
      }
    );
  }

  // Update Enquiry Assignee List on selection of Institute
  branchUpdated(e) {
    this.enqAssignTo = [];
    this.isRippleLoad = true;
    this.fetchService.fetchAssignedToData(e).subscribe(
      res => {
        this.isRippleLoad = false;
        this.enqAssignTo = res;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    );
  }

  // Show Hide Notify Me Checkbox
  isNotifyDisplayed() {
    if (this.updateFormData.followUpDate != '' && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid date") {
      if (this.updateFormData.followUpTime.hour != '' && this.updateFormData.followUpTime.hour != null && this.updateFormData.followUpTime.hour != undefined) {
        if (this.updateFormData.followUpTime.minute != '' && this.updateFormData.followUpTime.minute != null && this.updateFormData.followUpTime.minute != 'Invalid date') {
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

  // Update Notify Me Value
  notifyMe(e) {
    if (e) {
      this.updateFormData.is_follow_up_time_notification = 1;
    }
    else {
      this.updateFormData.is_follow_up_time_notification = 0;
    }
  }

  // Update And Admit 
  updateRegisterEnquiry() {
    this.updateFormData.follow_type = "Walkin";
    this.updateFormData.walkin_followUpDate = moment(new Date()).format('YYYY-MM-DD');
    this.updateFormData.walkin_followUpTime = this.commonService.getCurrentTImeForDropDown();
    if (this.updateFormData.walkin_followUpTime != '' && this.updateFormData.walkin_followUpTime != null) {
      this.pushUpdatedEnquiry(true);
    }
  }

  // Update Enquiry Details

  pushUpdatedEnquiry(isAdmit) {
    if (isAdmit == false) {
      // Validate Walkin Time
      let walkinCheck = this.commonService.validateTimeAndMinute(this.updateFormData.walkin_followUpTime);
      if (walkinCheck == false) {
        this.messageNotifier('error', 'Error', 'Please provide valid walk-in time.');
        return false;
      }
    }
    // Validate Follow Up Time
    let followUpCheck = this.commonService.validateTimeAndMinute(this.updateFormData.followUpTime);
    if (followUpCheck == false) {
      this.messageNotifier('error', 'Error', 'Please provide valid follow-up time.');
      return false;
    }

    // Validate Closing Reason
    if (this.updateFormData.status == '1') {
      if (this.updateFormData.closing_reason_id == '0' || this.updateFormData.closing_reason_id == '-1') {
        this.messageNotifier('error', 'Error', 'Please provide closing reason');
        return false;
      }
    }

    /// Date conversion given by user

    if (this.updateFormData.followUpDate != "" && this.updateFormData.followUpDate != null && this.updateFormData.followUpDate != "Invalid date") {
      this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('YYYY-MM-DD');
    } else {
      this.updateFormData.followUpDate = "";
    }

    if (this.updateFormData.walkin_followUpDate != "" && this.updateFormData.walkin_followUpDate != null && this.updateFormData.walkin_followUpDate != "Invalid date") {
      this.updateFormData.walkin_followUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
    } else {
      this.updateFormData.walkin_followUpDate = "";
    }


    /// If Follow Up Type is Walkin (Validate if only enquiry is updataed)

    if (isAdmit == false) {
      if (this.updateFormData.follow_type == "Walkin") {
        // Validate Walkin Date
        if (this.updateFormData.walkin_followUpDate == "") {
          this.messageNotifier('error', 'Error', 'Please provide walkin date for follow up type walkin.');
          return false;
        }

        // Validate Walkin Time
        if (this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.minute != "") {
          this.messageNotifier('error', 'Error', 'Please provide walkin time for follow up type walkin.');
          return false;
        }
      }
    }

    // Change Follow Up Time 

    if (this.updateFormData.followUpTime.hour != "" && this.updateFormData.followUpTime.minute != "") {
      let time = this.updateFormData.followUpTime.hour.split(' ');
      this.updateFormData.followUpTime = time[0] + ":" + this.updateFormData.followUpTime.minute + " " + time[1];
    } else {
      this.updateFormData.followUpTime = "";
    }

    // Change Walkin Time
    if (this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.minute != "") {
      let time = this.updateFormData.walkin_followUpTime.hour.split(' ');
      this.updateFormData.walkin_followUpTime = time[0] + ':' + this.updateFormData.walkin_followUpTime.minute + " " + time[1];
    } else {
      this.updateFormData.walkin_followUpTime = "";
    }

    // Notify Me

    if (this.updateFormData.is_follow_up_time_notification) {
      this.updateFormData.is_follow_up_time_notification = 1;
    }
    else {
      this.updateFormData.is_follow_up_time_notification = 0;
    }

    this.fetchService.updateEnquiryForm(this.enquiryDet.institute_enquiry_id, this.updateFormData).subscribe(
      res => {
        this.messageNotifier('success', 'Enquiry Updated', 'Enquiry Updated Successfully');
        if (isAdmit == true) {
          this.createObjectToStoreInfo();
          this.closeEnquiryUpdate();
          this.router.navigate(['/view/student/add']);
        } else {
          this.closeEnquiryUpdate();
        }
      },
      err => {
        this.messageNotifier('error', 'Error', err.error.message);
        this.handleTimeConversion();
      }
    )

  }

  handleTimeConversion() {
    this.updateFormData.followUpTime = {
      hour: "",
      minute: ""
    };
    this.updateFormData.walkin_followUpTime = {
      hour: "",
      minute: ""
    };

    if (this.updateFormData.followUpTime != "") {
      this.updateFormData.followUpTime = this.commonService.breakTimeInToHrAndMin(this.updateFormData.followUpTime);
    }

    if (this.updateFormData.walkin_followUpTime != "") {
      this.updateFormData.walkin_followUpTime = this.commonService.breakTimeInToHrAndMin(this.updateFormData.walkin_followUpTime);
    }

  }

  // Save The copy of Data in session storage if user admit a student
  createObjectToStoreInfo() {
    let obj: any = {
      name: this.enquiryDet.name,
      phone: this.enquiryDet.phone,
      email: this.enquiryDet.email,
      gender: this.enquiryDet.gender,
      dob: moment(this.enquiryDet.dob).format("YYYY-MM-DD"),
      parent_email: this.enquiryDet.parent_email,
      parent_name: this.enquiryDet.parent_name,
      parent_phone: this.enquiryDet.parent_phone,
      enquiry_id: this.enquiryDet.institute_enquiry_id,
      institute_enquiry_id: this.enquiryDet.institute_enquiry_id
    };
    sessionStorage.setItem('studentPrefill', JSON.stringify(obj));
  }

  // Close Enquiry Pop Up
  closeEnquiryUpdate() {
    this.closePopUp.emit(true);
    this.updateFormData = {
      comment: "",
      status: "",
      statusValue: "",
      institution_id: sessionStorage.getItem('institute_id'),
      isEnquiryUpdate: "Y",
      closedReason: null,
      slot_id: null,
      priority: "",
      follow_type: "",
      followUpDate: "",
      commentDate: moment().format('YYYY-MM-DD'),
      followUpTime: {
        hour: "",
        minute: ""
      },
      followUpDateTime: "",
      isEnquiryV2Update: "N",
      isRegisterFeeUpdate: "N",
      amount: null,
      paymentMode: null,
      paymentDate: null,
      reference: null,
      walkin_followUpDate: '',
      walkin_followUpTime: {
        hour: '',
        minute: '',
      },
      is_follow_up_time_notification: 0,
      source_instituteId: '-1',
      closing_reason_id: '0',
      assigned_to: '-1'
    };
  }

  messageNotifier(type, title, message) {
    this.commonService.showErrorMessage(type, title, message);
  }

}
