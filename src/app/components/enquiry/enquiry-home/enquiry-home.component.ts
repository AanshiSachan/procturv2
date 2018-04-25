import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { instituteInfo } from '../../../model/instituteinfo';
import { updateEnquiryForm } from '../../../model/update-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { ActionButtonComponent } from './action-button.component';
import { SmsOptionComponent } from './sms-option.component';
import { CommentTooltipComponent } from './comment-tooltip.component';

/* Third party imports */
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';

@Component({
  selector: 'app-enquiry-home',
  templateUrl: './enquiry-home.component.html',
  styleUrls: ['./enquiry-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiryHomeComponent implements OnInit, OnDestroy, OnChanges {


  isConvertToStudent: boolean;
  sortBy: string = 'followUpDateTime';
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* ====================================Declarations================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */



  /* Variable Declaration */
  sourceEnquiry: any[] = []; smsSourceApproved: any[] = []; smsSourceOpen: any[] = []; busy: Subscription;
  checkedStatus = []; filtered = []; enqstatus: any[] = []; enqPriority: any[] = []; campaignList: any[] = [];
  enqFollowType: any[] = []; enqAssignTo: any[] = []; enqStd: any[] = []; enqSubject: any[] = []; sources: any[] = [];
  enqScholarship: any[] = []; enqSub2: any[] = []; paymentMode: any[] = []; schools: any[] = []; commentFormData: any = {};
  today: any = Date.now(); searchBarData: any = null; searchBarDate: any = "";
  displayBatchSize: number = 100; incrementFlag: boolean = true; updateFormComments: any = [];
  updateFormCommentsBy: any = []; updateFormCommentsOn: any = []; PageIndex: number = 1;
  maxPageSize: number = 0; totalEnquiry: number = 0; isProfessional: boolean = false;
  isActionDisabled: boolean = false; isMessageAddOpen: boolean = false; isMultiSms: boolean = false;
  smsSelectedRowsLength: number = 0; sizeArr: any[] = [25, 50, 100, 150, 200, 500];
  isAllSelected: boolean = false; isApprovedTab: boolean = true; isOpenTab: boolean = false;
  private customComponents: any[] = []; selectedSmsMessage: string = ''; slots: any[] = [];
  isSideBar: boolean = false;
  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];
  isRippleLoad: boolean = false;
  hour: string = ''; minute: string = ''; meridian: string = '';
  newSmsString = {
    data: "",
    length: 0,
    type: "",
  };

  statusString: any[] = []; smsSelectedRows: any; smsGroupSelected: any[] = [];

  private selectedSlots: any[] = [];
  private slotIdArr: any[] = [];
  private selectedSlotsString: string = '';
  private selectedSlotsID: string = '';

  selectedOption: any = {
    email: { show: false, id: 'email' },
    Gender: { show: false, id: 'Gender' },
    standard: { show: false, id: 'standard' },
    subjects: { show: false, id: 'subjects' }
  };


  myOptions: any[] = [
    { id: 'email', name: 'Email' },
    { id: 'Gender', name: 'Gender' },
    { id: 'standard', name: 'Standard' },
    { id: 'subjects', name: 'Subject' }
  ]

  /* items added on ngOnInit */
  bulkAddItems: MenuItem[];
  indexJSON = [];
  selectedRow: any = {
  };

  isEnquiryOptions: boolean = false;

  currentDirection = 'desc'; selectedRowGroup: any[] = []; componentPrefill: any = [];
  componentListObject: any = {}; emptyCustomComponent: any; componentRenderer: any = []; customComponentResponse: any = [];
  fetchingDataMessage: number = 1; smsBtnToggle: boolean = false;

  selectedSMS: any = {
    message: "",
    message_id: "",
    sms_type: "",
    status: "",
    statusValue: "",
    date: "",
    feature_type: "",
    institute_name: "",
  };

  sendSmsFormData: any = {
    baseIds: [],
    messageArray: []
  };
  smsSearchData: string = ""; isConverted: boolean = false; hasReceipt: boolean = false; isadmitted: boolean = false; notClosednAdmitted: boolean = false; isClosed: boolean = false; isAssignEnquiry: boolean = false; availableSMS: number = 0; smsDataLength: number = 0; isEnquiryAdmin: boolean = false; selectedRowCount: number = 0;

  /* Model for Enquiry Update Popup Form */
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
    followUpTime: "",
    followUpDateTime: '',
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
  }

  customCompid: any;

  /* Model For Registration, valid only for professional institute 
  where status is registred else will thow an error with status code 400 */
  registrationForm = {
    institute_enquiry_id: "",
    amount: "",
    paymentDate: moment().format('YYYY-MM-DD'),
    paymentMode: "",
    //remark: "",
    reference: "",
  }


  /* Model for checkbox toggler to update data table */
  stats = {
    All: { value: 'All', prop: 'All', checked: false, disabled: false },
    Pending: { value: 'Pending Followup', prop: 'Pending', checked: true, disabled: false },
    Open: { value: 'Open', prop: 'Open', checked: false, disabled: false },
    In_Progress: { value: 'In-Progress', prop: 'In_Progress', checked: false, disabled: false },
    Registered: { value: 'Registered', prop: 'Registered', checked: false, disabled: false },
    Student_Admitted: { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false },
    Inactive: { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false },
  };

  statFilter = [
    { value: 'All', prop: 'All', checked: false, disabled: false },
    { value: 'Pending Followup', prop: 'Pending', checked: true, disabled: false },
    { value: 'Open', prop: 'Open', checked: false, disabled: false },
    { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false },
    { value: 'Registered', prop: 'Registered', checked: false, disabled: false },
    { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false },
    { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false },
  ];


  /* Variable to handle popups */
  message: string = '';


  /* Variable to store JSON.stringify value and update service for multi-component communication */
  selectedRowJson: string = '';


  /* Settings for SMS Table Display */
  smsHeader = {
    message: { title: 'Message', id: 'message', show: true },
    statusValue: { title: 'Status.', id: 'statusValue', show: false },
    date: { title: 'Date.', id: 'date', show: true },
    action: { title: 'Action', id: 'action', show: true },
    status: { title: 'Status Key', id: 'status', show: false },
    feature_type: { title: 'Feature Type.', id: 'feature_type', show: false },
    message_id: { title: 'Message Id.', id: 'message_id', show: false },
    sms_type: { title: 'Sms Type.', id: 'sms_type', show: false },
  };


  /* Model for institute Data */
  instituteData: instituteInfo = {
    name: "",
    phone: "",
    email: "",
    enquiry_no: "",
    priority: "",
    status: -1,
    filtered_statuses: "",
    follow_type: "",
    followUpDate: moment().format('YYYY-MM-DD'),
    enquiry_date: "",
    assigned_to: -1,
    standard_id: -1,
    subject_id: -1,
    is_recent: "Y",
    slot_id: -1,
    filtered_slots: "",
    isDashbord: "N",
    enquireDateFrom: "",
    enquireDateTo: "",
    updateDate: "",
    updateDateFrom: "",
    updateDateTo: "",
    start_index: 0,
    batch_size: this.displayBatchSize,
    closedReason: "",
    enqCustomLi: null,
    sorted_by: "",
    order_by: "",
    commentShow: 'false'
  };

  /* Form for advanced filter  */
  advancedFilterForm: instituteInfo = {
    name: "",
    phone: "",
    email: "",
    enquiry_no: "",
    priority: "",
    status: -1,
    commentShow: 'false',
    filtered_statuses: "",
    follow_type: "",
    followUpDate: "",
    enquiry_date: "",
    assigned_to: -1,
    standard_id: -1,
    subject_id: -1,
    is_recent: "Y",
    slot_id: -1,
    filtered_slots: "",
    isDashbord: "N",
    enquireDateFrom: "",
    enquireDateTo: "",
    updateDate: "",
    updateDateFrom: "",
    updateDateTo: "",
    start_index: 0,
    batch_size: this.displayBatchSize,
    closedReason: "",
    enqCustomLi: null,
    source_id: "-1",
    school_id: "-1",
    list_id: "-1"
  };

  enquiryFullDetail: any;

  EnquirySettings: ColumnSetting[] = [
    { primaryKey: 'enquiry_no', header: 'Enquiry No.', format: this.currentDirection },
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'phone', header: 'Contact No.' },
    { primaryKey: 'statusValue', header: 'Status' },
    { primaryKey: 'priority', header: 'Priority' },
    { primaryKey: 'followUpDate', header: 'Follow up Date', format: this.currentDirection },
    { primaryKey: 'updateDate', header: 'Update Date' },
  ];

  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM']

  assignMultipleForm: any = {
    enqLi: [],/* array of institute enquiry ID */
    assigned_to: "" /* Id of assignee */
  };
  summaryOptions: boolean = false;
  downloadReportOption: any = 1;
  summaryReport = {
    from_date: "",
    to_date: "",
  };
  showDateRange: boolean = false;

  @ViewChild('skelton') skel: ElementRef;
  @ViewChild('mySidenav') mySidenav: ElementRef;
  @ViewChild('enqPage') enqPage: ElementRef;
  @ViewChild('tablemain') tablemain: ElementRef;
  @ViewChild('pager') pager: ElementRef;
  @ViewChild('optMenu') optMenu: ElementRef;


  /* =========================================================================== */
  /* ===================== Declaration Fin ===================================== */
  /* =========================================================================== */


  constructor(private enquire: FetchenquiryService, private prefill: FetchprefilldataService,
    private router: Router, private fb: FormBuilder, private pops: PopupHandlerService, private postdata: PostEnquiryDataService,
    private appC: AppComponent, private login: LoginService, private rd: Renderer2, private cd: ChangeDetectorRef) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  /* =========================================================================== */
  /* =========================================================================== */




  /* OnInit Function */
  ngOnInit() {

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.isEnquiryAdministrator();
    this.FetchEnquiryPrefilledData();
    //this.prefill.getLeadSource().subscribe( (data)=>{ console.log(data)})
    /* Fetch prefill data after table data load completes */

    /* Dropdown items for Bulk Actions */
    this.bulkAddItems = [
      {
        label: 'Send SMS', icon: 'fa-envelope-o', command: () => {
          this.sendBulkSms();
        }
      },
      {
        label: 'Delete Enquiries', icon: 'fa-trash-o', command: () => {
          this.bulkDeleteEnquiries();
        }
      },
      {
        label: 'Assign Enquiries', icon: 'fa-buysellads', command: () => {
          this.bulkAssignEnquiriesOpen();
        }
      }
    ];
    /* Load paginated enquiry data from server */
    let params = sessionStorage.getItem('dashBoardParam');
    if (params != "" && params != null && params != undefined) {
      this.checkIfRoutedFromEnquiry();
      sessionStorage.setItem('dashBoardParam', '');
    } else {
      this.loadTableDatatoSource(this.instituteData);
    }
    this.cd.markForCheck();
    /* Fetch the status of message from  popup handler service */
    this.pops.currentMessage.subscribe(message => {
      this.cd.markForCheck();
      if (message == 'sms') {
        this.cd.markForCheck();
        this.smsServicesInvoked();
        this.message = message;
        this.cd.markForCheck();
        this.smsSelectedRows = this.selectedRow;
        this.cd.markForCheck();
      }
      else if (message == 'update') {
        
        this.prefill.fetchCommentsForEnquiry(this.selectedRow.institute_enquiry_id).subscribe(res => {
          this.cd.markForCheck();
          this.updateFormData.priority = this.getPriority(res.priority);
          this.updateFormData.follow_type = this.getFollowUp(res.follow_type);
          this.updateFormData.statusValue = this.selectedRow.statusValue;
          this.updateFormData.followUpDate = moment(this.selectedRow.followUpDate).format('YYYY-MM-DD');
          if (res.followUpTime != '' && res.followUpTime != null) {
            let timeObj = this.convertTimeToFormat(this.selectedRow.followUpTime);
            this.hour = timeObj.hour + " " + timeObj.meridian;
            this.minute = timeObj.minute;
          }

          if (res.walkin_followUpTime != "" && res.walkin_followUpTime != null) {
            let timeObj = this.convertTimeToFormat(res.walkin_followUpTime);
            this.updateFormData.walkin_followUpTime.hour = timeObj.hour + " " + timeObj.meridian;
            this.updateFormData.walkin_followUpTime.minute = timeObj.minute;
          }
          this.updateFormData.walkin_followUpDate = res.walkin_followUpDate;
          this.updateFormData.followUpTime = res.followUpTime;
          if(res.followUpTime != "" && res.followUpTime != null && res.followUpDate != null && res.followUpDate != ""){
            this.updateFormData.is_follow_up_time_notification = true;
          }else{
            this.updateFormData.is_follow_up_time_notification = false;
          }
          this.updateFormComments = res.comments;
          this.updateFormCommentsOn = res.commentedOn;
          this.updateFormCommentsBy = res.commentedBy;
          this.updateFormData.assigned_to = res.assigned_to;
          this.cd.markForCheck();
        });
        this.message = message;
      }
      else {
        this.message = message
        this.cd.markForCheck();
      }
    });

    /* SMS message service handler to communicate between components */
    this.pops.currentSms.subscribe(res => {
      if (res == 'edit') {
        this.cd.markForCheck();
        this.editSms();
      }
    });


    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    sessionStorage.setItem('displayBatchSize', this.displayBatchSize.toString());
  }

  convertTimeToFormat(data) {
    let time: any = {};
    time.hour = data.split(':')[0];
    time.minute = data.split(':')[1].split(" ")[0];
    time.meridian = data.split(':')[1].split(" ")[1];
    return time;
  }

  timeChanges(ev) {
    let obj: any = {};
    let time = ev.split(' ');
    obj.hour = time[0];
    obj.meridian = time[1];
    return obj;
  }

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



  ngOnDestroy() {
    this.sourceEnquiry = [];
  }

  /* =========================================================================== */
  /* =========================================================================== */



  ngOnChanges() {
  }

  /* =========================================================================== */
  /* =========================================================================== */



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


  /* =========================================================================== */
  /* =========================================================================== */


  /* Load Table data with respect to the institute data provided */
  loadTableDatatoSource(obj) {
    this.isRippleLoad = true;
    this.fetchingDataMessage = 1;
    this.isAllSelected = false;
    this.sourceEnquiry = [];
    this.closeEnquiryFullDetails();
    this.isSideBar = false;
    /* start index of object passed is zero then create pagination */
    if (obj.start_index == 0) {
      return this.enquire.getAllEnquiry(obj).subscribe(
        data => {
          //this.isRippleLoad = false;
          if (data.length != 0) {
            this.totalEnquiry = data[0].totalcount;
            this.sourceEnquiry = data;
            this.cd.markForCheck();
            return this.sourceEnquiry;
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any enquiry for the specified query'
            }
            this.fetchingDataMessage = 2;
            this.appC.popToast(alert);
            this.totalEnquiry = data.length;
            this.cd.markForCheck();
          }
        },
        err => {
          this.isRippleLoad = false;
          let alert = {
            type: 'error',
            title: 'Unable To Connect To Server',
            body: 'Please check your internet connection or contact proctur support if the issue persist'
          }
          this.fetchingDataMessage = 2;
          this.appC.popToast(alert);
          this.totalEnquiry = 0;
          this.cd.markForCheck();
        });
    }
    else {
      return this.enquire.getAllEnquiry(obj).subscribe(
        data => {
          this.isRippleLoad = false;
          if (data.length != 0) {
            this.sourceEnquiry = data;
            this.cd.markForCheck();
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any enquiry for the specified query'
            }
            this.fetchingDataMessage = 2;
            this.appC.popToast(alert);
            this.totalEnquiry = 0;
            this.cd.markForCheck();
          }
        },
        err => {
          this.isRippleLoad = false;
          let alert = {
            type: 'error',
            title: 'Unable To Connect To Server',
            body: 'Please check your internet connection or contact proctur support if the issue persist'
          }
          this.fetchingDataMessage = 2;
          this.appC.popToast(alert);
          this.totalEnquiry = 0;
          this.cd.markForCheck();
        });
    }

  }

  /* =========================================================================== */
  /* =========================================================================== */


  /* Function to fetch prefill data for advanced filter */
  FetchEnquiryPrefilledData() {

    /* Status */
    let status = this.prefill.getEnqStatus().subscribe(
      data => {
        this.enqstatus = data;
        // console.log(this.enqstatus)
      }
    );

    /* Campaigns */
    this.prefill.getCampaignsList().subscribe(
      data => {
        this.campaignList = data;
      }
    )


    /* Priority */
    let priority = this.prefill.getEnqPriority().subscribe(
      data => { this.enqPriority = data; }
    );


    /* FollowUp Type */
    this.prefill.getFollowupType().subscribe(
      data => { this.enqFollowType = data }
    );


    /* Assign To */
    this.prefill.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; }
    );

    /* Sources */
    this.prefill.getLeadSource().subscribe(
      data => { this.sources = data }
    );

    /* Schools */
    this.prefill.getSchoolDetails().subscribe(
      data => { this.schools = data }
    );

    /* Standard */
    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; }
    );

    if (this.isProfessional) {
      this.prefill.getEnquirySlots().subscribe(
        res => {
          res.forEach(el => {
            let obj = {
              label: el.slot_name,
              value: el,
              status: false
            }
            this.slots.push(obj);
          });
        },
        err => { }
      )
    }

    /* Payment Modes */
    this.prefill.fetchPaymentModes().subscribe(
      data => { this.paymentMode = data; }
    )

    if (status != null && priority != null) {
      /* Custom Components */
      return this.prefill.fetchCustomComponentEmpty().subscribe(
        data => {
          data.forEach(el => {

            let obj = {
              data: el,
              id: el.component_id,
              is_required: el.is_required,
              is_searchable: el.is_searchable,
              label: el.label,
              prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
              selected: [],
              selectedString: '',
              type: el.type,
              value: el.enq_custom_value
            }
            this.customComponents.push(obj);

          });
          this.emptyCustomComponent = this.componentListObject;
        }
      );
    }

  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Custom Compoenent array creater */
  createPrefilledData(dataArr: any[]): any[] {
    let customPrefilled: any[] = [];
    dataArr.forEach(el => {
      let obj = {
        data: el,
        checked: false
      }
      customPrefilled.push(obj);
    });

    return customPrefilled;
  }

  /* =========================================================================== */
  /* =========================================================================== */



  /* if custom component is of type multielect then toggle the visibility of the dropdowm */
  multiselectVisible(elid) {
    let targetid = elid + "multi";
    if (elid != null && elid != '') {
      if (document.getElementById(targetid).classList.contains('hide')) {
        document.getElementById(targetid).classList.remove('hide');
      }
      else {
        document.getElementById(targetid).classList.add('hide');
      }
    }
  }

  /* =========================================================================== */
  /* =========================================================================== */



  /* if custom component is of type multielect then update the selected or unselected data*/
  updateMultiSelect(data, id) {
    this.customComponents.forEach(el => {
      if (el.id == id) {
        el.prefilled_data.forEach(com => {
          //console.log(com);
          if (com.data == data.data) {
            /* Component checked */
            if (com.checked) {
              el.selected.push(com.data);
              if (el.selected.length != 0) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              //console.log(com.selected);
              el.selectedString = el.selected.join(',');
              el.value = el.selectedString;
            }
            /* Component unchecked */
            else {
              if (el.selected.length > 1) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else if (el.selected.length == 0) {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              else if (el.selected.length == 1) {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              //console.log(com.selected);
              var index = el.selected.indexOf(data.data);
              if (index > -1) {
                el.selected.splice(index, 1);
              }
              el.selectedString = el.selected.join(',');
              el.value = el.selectedString;
              /* var index2 = el.selected.indexOf(data.data);
                if (index2 > -1) {
                el.selected.splice(index, 1);
                }
                el.selectedString = el.selected.join(','); 
              */
            }
          }
        });
      }
    });

  }


  /* =========================================================================== */
  /* =========================================================================== */


  statusFilterUpdater(e) {
    debugger;
    this.stats[e.prop].checked = e.checked;
    this.statusFilter(e);
  }




  /* Function to toggle table data on checkbox click */
  statusFilter(checkerObj) {
    this.searchBarData = '';

    if (checkerObj.prop == "All") {
      this.statusString = [];
      if (checkerObj.checked) {
        this.stats.Student_Admitted.checked = false;
        this.stats.Inactive.checked = false;
        this.stats.Open.checked = false;
        this.stats.In_Progress.checked = false;
        this.stats.Registered.checked = false;
        this.stats.Pending.checked = false;
        this.stats.All.checked = true;
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          follow_type: "",
          followUpDate: "",
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: "",
          enquireDateTo: "",
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }
    }

    else if (checkerObj.prop == "Pending") {
      this.stats.Student_Admitted.checked = false;
      this.stats.Inactive.checked = false;
      this.stats.Open.checked = false;
      this.stats.In_Progress.checked = false;
      this.stats.Registered.checked = false;
      this.stats.Pending.checked = true;
      this.stats.All.checked = false;
      this.instituteData = {
        name: "",
        phone: "",
        email: "",
        enquiry_no: "",
        commentShow: 'false',
        priority: "",
        status: -1,
        follow_type: "",
        followUpDate: this.searchBarDate,
        enquiry_date: "",
        assigned_to: -1,
        standard_id: -1,
        subject_id: -1,
        is_recent: "Y",
        slot_id: -1,
        filtered_slots: "",
        isDashbord: "N",
        enquireDateFrom: "",
        enquireDateTo: "",
        updateDate: "",
        updateDateFrom: "",
        updateDateTo: "",
        start_index: 0,
        batch_size: this.displayBatchSize,
        closedReason: "",
        enqCustomLi: null
      };
      this.busy = this.loadTableDatatoSource(this.instituteData);
    }

    else if (checkerObj.prop == "Student_Admitted") {
      this.stats.All.checked = false;

      if (this.stats.Student_Admitted.checked) {
        this.statusString.push('12');

        let stat = this.statusString.join(',');
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          commentShow: 'false',
          enquiry_no: "",
          priority: "",
          status: -1,
          filtered_statuses: stat,
          follow_type: "",
          followUpDate: "",
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: "",
          enquireDateTo: "",
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);

      }

      else {
        let index = this.statusString.indexOf('12');
        if (index !== -1) {
          this.statusString.splice(index, 1);
        }

        if (this.statusString.length == 0) {
          this.stats.All.checked = true;
          this.stats.Student_Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
          this.stats.In_Progress.checked = false;
          this.stats.Registered.checked = false;
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }

        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            filtered_statuses: stat,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }
      }

    }

    else if (checkerObj.prop == "Inactive") {
      this.stats.All.checked = false;

      if (this.stats.Inactive.checked) {
        this.statusString.push('1');

        let stat = this.statusString.join(',');

        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: stat,
          follow_type: "",
          followUpDate: this.searchBarDate,
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: "",
          enquireDateTo: "",
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };

        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      else {
        let index = this.statusString.indexOf('1');
        if (index !== -1) {
          this.statusString.splice(index, 1);
        }

        if (this.statusString.length == 0) {
          this.stats.All.checked = true;
          this.stats.Student_Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
          this.stats.In_Progress.checked = false;
          this.stats.Registered.checked = false;
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            filtered_statuses: stat,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }
      }

    }

    else if (checkerObj.prop == "Open") {
      this.stats.All.checked = false;

      if (this.stats.Open.checked) {
        this.statusString.push('0');
        let stat = this.statusString.join(',');
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: stat,
          follow_type: "",
          followUpDate: this.searchBarDate,
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: "",
          enquireDateTo: "",
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      else {
        let index = this.statusString.indexOf('0');
        if (index !== -1) {
          this.statusString.splice(index, 1);
        }
        if (this.statusString.length == 0) {
          this.stats.All.checked = true;
          this.stats.Student_Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
          this.stats.In_Progress.checked = false;
          this.stats.Registered.checked = false;
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            filtered_statuses: stat,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }

      }

    }

    else if (checkerObj.prop == "In_Progress") {
      this.stats.All.checked = false;

      if (this.stats.In_Progress.checked) {
        this.statusString.push('3');

        let stat = this.statusString.join(',');
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: stat,
          follow_type: "",
          followUpDate: this.searchBarDate,
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: "",
          enquireDateTo: "",
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      else {

        let index2 = this.statusString.indexOf('3');
        if (index2 !== -1) {
          this.statusString.splice(index2, 1);
        }

        if (this.statusString.length == 0) {
          this.stats.All.checked = true;
          this.stats.Student_Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
          this.stats.In_Progress.checked = false;
          this.stats.Registered.checked = false;
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            filtered_statuses: stat,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }

      }

    }


    else if (checkerObj.prop == "Registered") {
      this.stats.All.checked = false;
      if (this.stats.Registered.checked) {
        this.statusString.push('11');

        let stat = this.statusString.join(',');
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: stat,
          follow_type: "",
          followUpDate: this.searchBarDate,
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: "",
          enquireDateTo: "",
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      else {
        let index = this.statusString.indexOf('11');
        if (index !== -1) {
          this.statusString.splice(index, 1);
        }

        if (this.statusString.length == 0) {
          this.stats.All.checked = true;
          this.stats.Student_Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
          this.stats.In_Progress.checked = false;
          this.stats.Registered.checked = false;
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            filtered_statuses: stat,
            follow_type: "",
            followUpDate: this.searchBarDate,
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };
          this.busy = this.loadTableDatatoSource(this.instituteData);
        }

      }

    }

  }

  /* =========================================================================== */
  checkIfRoutedFromEnquiry() {

    this.stats = {
      All: { value: 'All', prop: 'All', checked: false, disabled: false },
      Pending: { value: 'Pending Followup', prop: 'Pending', checked: true, disabled: false },
      Open: { value: 'Open', prop: 'Open', checked: false, disabled: false },
      In_Progress: { value: 'In-Progress', prop: 'In_Progress', checked: false, disabled: false },
      Registered: { value: 'Registered', prop: 'Registered', checked: false, disabled: false },
      Student_Admitted: { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false },
      Inactive: { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false },
    };

    this.statFilter = [
      { value: 'All', prop: 'All', checked: false, disabled: false },
      { value: 'Pending Followup', prop: 'Pending', checked: true, disabled: false },
      { value: 'Open', prop: 'Open', checked: false, disabled: false },
      { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false },
      { value: 'Registered', prop: 'Registered', checked: false, disabled: false },
      { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false },
      { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false },
    ];

    if (sessionStorage.getItem('dashBoardParam') == "" || sessionStorage.getItem('dashBoardParam') == null || sessionStorage.getItem('dashBoardParam') == undefined) {
      return;
    }
    else {
      let obj = JSON.parse(sessionStorage.getItem('dashBoardParam'));
      let filter = obj.type;
      let fromDate = obj.dateR[0];
      let toDate = obj.dateR[1];
      this.searchBarData = '';

      if (filter == "Admitted") {
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          commentShow: 'false',
          enquiry_no: "",
          priority: "",
          status: -1,
          filtered_statuses: "12",
          follow_type: "",
          followUpDate: "",
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: moment(fromDate).format("YYYY-MM-DD"),
          enquireDateTo: moment(toDate).format("YYYY-MM-DD"),
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      if (filter == "Closed") {
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: "1",
          follow_type: "",
          followUpDate: "",
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: moment(fromDate).format("YYYY-MM-DD"),
          enquireDateTo: moment(toDate).format("YYYY-MM-DD"),
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      if (filter == "Open") {
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: "0",
          follow_type: "",
          followUpDate: "",
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: moment(fromDate).format("YYYY-MM-DD"),
          enquireDateTo: moment(toDate).format("YYYY-MM-DD"),
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      if (filter == "In_Progress") {
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: "3",
          follow_type: "",
          followUpDate: "",
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: moment(fromDate).format("YYYY-MM-DD"),
          enquireDateTo: moment(toDate).format("YYYY-MM-DD"),
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

      if (filter == "Registered") {
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
          commentShow: 'false',
          priority: "",
          status: -1,
          filtered_statuses: "11",
          follow_type: "",
          followUpDate: "",
          enquiry_date: "",
          assigned_to: -1,
          standard_id: -1,
          subject_id: -1,
          is_recent: "Y",
          slot_id: -1,
          filtered_slots: "",
          isDashbord: "N",
          enquireDateFrom: moment(fromDate).format("YYYY-MM-DD"),
          enquireDateTo: moment(toDate).format("YYYY-MM-DD"),
          updateDate: "",
          updateDateFrom: "",
          updateDateTo: "",
          start_index: 0,
          batch_size: this.displayBatchSize,
          closedReason: "",
          enqCustomLi: null
        };
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }

    }
  }

  /* =========================================================================== */
  /* Function to search data on smart table */
  searchDatabase() {
    this.clearFilterAdvanced();
    this.stats.All.checked = true;
    this.stats.Open.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Student_Admitted.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Inactive.checked = false;
    this.statusString = [];
    this.statFilter = [
      { value: 'All', prop: 'All', checked: false, disabled: false },
      { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false },
      { value: 'Open/In-Progress', prop: 'Open', checked: false, disabled: false },
      { value: 'Registered', prop: 'Registered', checked: false, disabled: false },
      { value: 'Admitted', prop: 'Student_Admitted', checked: false, disabled: false },
      { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false },
    ];
    this.indexJSON = [];
    this.instituteData.filtered_statuses = this.statusString.join(',');

    /* Both are empty */
    if ((this.searchBarData === "" || this.searchBarData === " " || this.searchBarData === null) &&
      (this.searchBarDate === "" || this.searchBarDate === " " || this.searchBarDate === null)) {
      this.instituteData = {
        name: "",
        phone: "",
        email: "",
        enquiry_no: "",
        commentShow: 'false',
        priority: "",
        status: -1,
        follow_type: "",
        followUpDate: "",
        enquiry_date: "",
        assigned_to: -1,
        standard_id: -1,
        subject_id: -1,
        is_recent: "Y",
        slot_id: -1,
        filtered_slots: "",
        isDashbord: "N",
        enquireDateFrom: "",
        enquireDateTo: "",
        updateDate: "",
        updateDateFrom: "",
        updateDateTo: "",
        start_index: 0,
        batch_size: this.displayBatchSize,
        closedReason: "",
        enqCustomLi: null
      };
      this.busy = this.loadTableDatatoSource(this.instituteData);

    }
    /* date is filled */
    else if ((this.searchBarData === "" || this.searchBarData === " " || this.searchBarData === null) &&
      (this.searchBarDate != "" || this.searchBarDate != " " || this.searchBarDate != null)) {
      this.instituteData = {
        name: "",
        phone: "",
        email: "",
        enquiry_no: "",
        commentShow: 'false',
        priority: "",
        status: -1,
        follow_type: "",
        followUpDate: "",
        enquiry_date: "",
        assigned_to: -1,
        standard_id: -1,
        subject_id: -1,
        is_recent: "N",
        slot_id: -1,
        filtered_slots: "",
        isDashbord: "N",
        enquireDateFrom: "",
        enquireDateTo: "",
        updateDate: "",
        updateDateFrom: "",
        updateDateTo: "",
        start_index: 0,
        batch_size: this.displayBatchSize,
        closedReason: "",
        enqCustomLi: null
      };
      this.busy = this.loadTableDatatoSource(this.instituteData);
    }
    /* Searchbar filled date empty */
    else if ((this.searchBarData != "" || this.searchBarData != " " || this.searchBarData != null) &&
      (this.searchBarDate === "" || this.searchBarDate === " " || this.searchBarDate === null)) {

      if (isNaN(this.searchBarData)) {
        /* Valid string entered */
        if (this.validateString(this.searchBarData)) {

          this.instituteData = {
            name: this.searchBarData,
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };

          this.busy = this.loadTableDatatoSource(this.instituteData);

        }
        /* invalid string raise alert */
        else {
          let msg = {
            type: 'info',
            title: 'Invalid Input',
            body: 'Please enter a valid name or number'
          }
          this.appC.popToast(msg);
        }
      }
      /* In Case of Number */
      else {
        /* mobile number detected */
        if (this.validateNumber(this.searchBarData)) {

          this.instituteData = {
            name: "",
            phone: this.searchBarData,
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };

          this.busy = this.loadTableDatatoSource(this.instituteData);

        }
        /* send data as enquiry number */
        else {

          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: this.searchBarData,
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "Y",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };

          this.busy = this.loadTableDatatoSource(this.instituteData);

        }
      }
    }
    /* Both have been filled  */
    else if ((this.searchBarData != "" || this.searchBarData != " " || this.searchBarData != null) &&
      (this.searchBarDate != "" || this.searchBarDate != " " || this.searchBarDate != null)) {
      if (isNaN(this.searchBarData)) {
        /* Valid string entered */
        if (this.validateString(this.searchBarData)) {

          this.instituteData = {
            name: this.searchBarData,
            phone: "",
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "N",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };

          this.busy = this.loadTableDatatoSource(this.instituteData);

        }
        /* invalid string raise alert */
        else {
          let msg = {
            type: 'info',
            title: 'Invalid Input',
            body: 'Please enter a valid name or number'
          }
          this.appC.popToast(msg);
        }
      }
      /* In Case of Number */
      else {
        /* mobile number detected */
        if (this.validateNumber(this.searchBarData)) {

          this.instituteData = {
            name: "",
            phone: this.searchBarData,
            email: "",
            enquiry_no: "",
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "N",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };

          this.busy = this.loadTableDatatoSource(this.instituteData);

        }
        /* send data as enquiry number */
        else {

          this.instituteData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: this.searchBarData,
            commentShow: 'false',
            priority: "",
            status: -1,
            follow_type: "",
            followUpDate: "",
            enquiry_date: "",
            assigned_to: -1,
            standard_id: -1,
            subject_id: -1,
            is_recent: "N",
            slot_id: -1,
            filtered_slots: "",
            isDashbord: "N",
            enquireDateFrom: "",
            enquireDateTo: "",
            updateDate: "",
            updateDateFrom: "",
            updateDateTo: "",
            start_index: 0,
            batch_size: this.displayBatchSize,
            closedReason: "",
            enqCustomLi: null
          };

          this.busy = this.loadTableDatatoSource(this.instituteData);

        }
      }
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* regex validation for name atleast one word required */
  validateString(data: string) {
    return /^[a-zA-Z ]{1,40}$/.test(data);
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Custom validation suited only for indian mobile numbers*/
  validateNumber(data) {
    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(data);;
  }

  /* =========================================================================== */
  /* =========================================================================== */


  /* Function to open advanced filter */
  openAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
    this.closeEnquiryFullDetails();
    this.isSideBar = false;
    document.getElementById('adFilterOpen').classList.add('hide');
    document.getElementById('adFilterExitVisible').classList.add('hide');
    document.getElementById('qfilt').classList.add('hide');
    document.getElementById('adFilterExit').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
    //console.log(this.advancedFilterForm);
  }

  /* =========================================================================== */
  /* =========================================================================== */


  /* Function to close advanced filter */
  closeAdFilter() {
    document.getElementById('adFilterExitVisible').classList.remove('hide');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('qfilt').classList.remove('hide');
    document.getElementById('adFilterOpen').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }


  /* =========================================================================== */
  /* =========================================================================== */

  updateRegisterEnquiry(){
    this.isConvertToStudent = true;
    this.pushUpdatedEnquiry();
  }

  /* Push the updated enquiry to server */
  pushUpdatedEnquiry() {
    if (this.validateTime()) {
      this.isRippleLoad = true;
      this.updateFormData.comment = this.updateFormData.comment;
      this.updateFormData.follow_type = this.getFollowUpReverse(this.updateFormData.follow_type);
      this.updateFormData.priority = this.getPriorityReverse(this.updateFormData.priority);
      let followupdateTime: string = "";
      if (this.hour != '') {
        let time = this.timeChanges(this.hour);
        let followUpTime = time.hour + ":" + this.minute + " " + time.meridian;
        followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY') + " " + followUpTime;
        this.updateFormData.followUpTime = followUpTime;
      }
      followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY');

      if (this.updateFormData.walkin_followUpTime.hour != "") {
        let time = this.timeChanges(this.updateFormData.walkin_followUpTime.hour);
        let walkin_followUpTime = time.hour + ":" + this.updateFormData.walkin_followUpTime.minute + " " + time.meridian;
        this.updateFormData.walkin_followUpTime = walkin_followUpTime;
      } else {
        this.updateFormData.walkin_followUpTime = "";
      }

      if (this.updateFormData.walkin_followUpDate != "" && this.updateFormData.walkin_followUpDate != null) {
        let walkinfollowUpDate = moment(this.updateFormData.walkin_followUpDate).format('YYYY-MM-DD');
        this.updateFormData.walkin_followUpDate = walkinfollowUpDate;
      } else {
        this.updateFormData.walkin_followUpDate = "";
      }

      this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData)
        .subscribe(
          res => {
            this.isRippleLoad = false;
            let msg = {
              type: 'success',
              title: 'Enquiry Updated',
              body: 'Your enquiry has been successfully submitted'
            }
            this.appC.popToast(msg);
            if(this.isConvertToStudent){
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
                institute_enquiry_id : this.selectedRow.institute_enquiry_id
              }
              localStorage.setItem('studentPrefill', JSON.stringify(obj));
              this.router.navigate(['student/add']);
            }
            else{
              this.closePopup();
              this.busy = this.loadTableDatatoSource(this.instituteData);
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
          })
    }
    else {
      let msg = {
        type: 'error',
        title: 'Invalid Time Input',
        body: 'Please select a valid time for follow up'
      }
      this.appC.popToast(msg);
    }
  }


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
    } else {
      check = false;
      return check;
    }
    return check;
  }

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



  /* Delete Enquiry  */
  deleteEnquiry() {
    this.isRippleLoad = true;
    //console.log(this.selectedRow.institute_enquiry_id);
    this.busy = this.postdata.deleteEnquiryById(this.selectedRow.institute_enquiry_id).subscribe(
      res => {
        this.isRippleLoad = false;
        let alert = {
          type: 'success',
          title: 'Enquiry Deleted',
          body: 'Your enquiry has been deleted'
        }
        this.appC.popToast(alert);
        this.closePopup();
        this.cd.markForCheck();
        this.busy = this.loadTableDatatoSource(this.instituteData);
      },
      err => {
        this.isRippleLoad = false;
        let alert = {
          type: 'error',
          title: 'Failed To Delete Enquiry',
          body: 'There was an error processing your request' + err.message
        }
        this.appC.popToast(alert);
        this.closePopup();
        this.busy = this.loadTableDatatoSource(this.instituteData);
      }
    )
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Make Registration Payment Data update */
  registerPayment() {
    this.isRippleLoad = true;
    this.registrationForm.institute_enquiry_id = this.selectedRow.institute_enquiry_id.toString();
    this.registrationForm.paymentDate = moment(this.registrationForm.paymentDate).format('YYYY-MM-DD');
    this.postdata.updateRegisterationPayment(this.registrationForm).subscribe(
      res => {
        this.isRippleLoad = false;
        let alert = {
          type: 'success',
          title: 'Registration Fee Updated',
        }
        this.appC.popToast(alert);
        this.cd.markForCheck();
        this.selectedRow.invoice_no = res.otherDetails.invoice_no;
        this.hasReceipt = true;
        this.registrationForm = {
          institute_enquiry_id: "",
          amount: "",
          paymentDate: "",
          paymentMode: "",
          //remark: "",
          reference: "",
        }
        this.cd.markForCheck();
      },
      err => {
        this.isRippleLoad = false;
        let alert = {
          type: 'error',
          title: 'Failed To Update Registration Fee',
          body: 'There was an error processing your request'
        }
        this.appC.popToast(alert);
      }
    );
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Service to fetch sms records from server and update table*/
  smsServicesInvoked() {
    this.isRippleLoad = true;
    /* store the data from server and update table */
    this.cd.markForCheck();
    this.enquire.fetchAllSms().subscribe(
      data => {
        this.isRippleLoad = false;
        this.cd.markForCheck();
        this.smsSourceApproved = [];
        this.smsSourceOpen = [];
        this.smsDataLength = data.length;
        this.availableSMS = data[0].institute_sms_quota_available
        this.cd.markForCheck();
        data.forEach(el => {
          if (el.status == 1) {
            this.cd.markForCheck();
            this.smsSourceApproved.push(el);
          }
          else {
            this.cd.markForCheck();
            this.smsSourceOpen.push(el);
          }
        })
      },
      err => {
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: "Error loading SMS",
          body: "Please check your internet connection or refresh"
        }
        this.appC.popToast(msg);
      }
    );
  }


  /* =========================================================================== */
  /* =========================================================================== */



  switchSmsTab(id) {
    if (id === 'approvedSms') {
      this.isApprovedTab = true;
      this.isOpenTab = false;
      this.smsBtnToggle = false;
      this.selectedSMS = {
        message: "",
        message_id: "",
        sms_type: "",
        status: "",
        statusValue: "",
        date: "",
        feature_type: "",
        institute_name: "",
      };
      if (!document.getElementById(id).classList.contains('active')) {
        document.getElementById(id).classList.add('active');
        document.getElementById('openSms').classList.remove('active');
      }
    }
    else if (id === 'openSms') {
      this.isApprovedTab = false;
      this.isOpenTab = true;
      this.smsBtnToggle = false;
      this.selectedSMS = {
        message: "",
        message_id: "",
        sms_type: "",
        status: "",
        statusValue: "",
        date: "",
        feature_type: "",
        institute_name: "",
      };
      if (!document.getElementById(id).classList.contains('active')) {
        document.getElementById(id).classList.add('active');
        document.getElementById('approvedSms').classList.remove('active');
      }
    }
  }



  /* =========================================================================== */
  /* =========================================================================== */



  /* push new sms template to server and update the table */
  addNewSmsTemplate() {
    if (this.newSmsString.data == '' || this.newSmsString.data == ' ') {
      let msg = {
        type: 'error',
        title: 'Empty Input',
        body: 'Please enter a valid text message'
      }
      this.appC.popToast(msg);
    }
    else {
      let sms = {
        feature_type: 2,
        message: this.newSmsString.data,
        sms_type: "Transactional"
      }
      this.isRippleLoad = true;
      this.postdata.addNewSmsTemplate(sms).subscribe(
        res => {
          this.isRippleLoad = false;
          if (res.statusCode == 200) {
            let msg = {
              type: "success",
              title: "New SMS Added",
              body: ""
            }
            this.appC.popToast(msg);
            this.cd.markForCheck();
            this.newSmsString.data = '';
            this.newSmsString.length = 0;
            this.cd.markForCheck();
            this.enquire.fetchAllSms().subscribe(
              data => {
                this.cd.markForCheck();
                this.smsSourceApproved = [];
                this.smsSourceOpen = [];
                this.smsDataLength = data.length;
                this.availableSMS = data[0].institute_sms_quota_available
                this.cd.markForCheck();
                data.forEach(el => {
                  if (el.status == 1) {
                    this.cd.markForCheck();
                    this.smsSourceApproved.push(el);
                  }
                  else {
                    this.cd.markForCheck();
                    this.smsSourceOpen.push(el);
                  }
                })

              },
              err => {
                let msg = {
                }
              }
            );
            this.cd.markForCheck();
          }
        },
        err => {
          this.isRippleLoad = false;
        }
      )
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Stores data for row user has clicked of selected */
  appSmsSelected(row, id) {
    this.cd.markForCheck();
    document.getElementById('appradiosms' + id).click();
    //this.smsBtnToggle = false;
    this.selectedSMS = row;
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Stores data for row user has clicked of selected */
  opSmsSelected(row, id) {
    this.cd.markForCheck();
    document.getElementById('opradiosms' + id).click();
    this.selectedSMS = row;
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* toggle visibility for add new sms DIV */
  addNewMessage() {
    let content = document.getElementById('sms-toggler-icon').innerHTML;
    if (content == "-") {
      document.getElementById('sms-toggler-icon').innerHTML = "+";
      this.newSmsString.data = "";
      this.newSmsString.length = 0;
      this.isMessageAddOpen = false;
    }
    else if (content == "+") {
      document.getElementById('sms-toggler-icon').innerHTML = "-";
      this.isMessageAddOpen = true;
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Char Count and sms string data update */
  smsStringUpdate(ev) {
    let stringArr = this.newSmsString.data.split('');
    this.newSmsString.length = 0;
    stringArr.forEach(ch => {
      if (ch.charCodeAt(0) <= 127) {
        this.newSmsString.length = this.newSmsString.length + 1;
        this.cd.markForCheck();
      }
      else {
        this.newSmsString.length = this.newSmsString.length + 1;
        this.cd.markForCheck();
      }
    });
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* SMS button visibility */
  editSms() {
    this.smsBtnToggle = true;
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Sms edit mode cancel */
  cancelSmsEdit() {
    this.smsBtnToggle = false;
    this.smsServicesInvoked();
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Update the sms template */
  saveEditedSms() {

    let data = {
      message: this.selectedSMS.message
    }
    this.isRippleLoad = true;
    this.postdata.saveEditedSms(this.selectedSMS.message_id, data).subscribe(
      res => {
        this.isRippleLoad = false;
        let msg = {
          type: 'success',
          title: "SMS Template saved",
          body: 'Your sms has been sent for approval'
        }
        this.appC.popToast(msg);
        this.cancelSmsEdit();
      },
      err => {
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: "Failed To Edit SMS Template",
          body: 'Please check your internet connection or try again later'
        }
        this.appC.popToast(msg);
      }
    )
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Approved SMS template send */
  sendSmsTemplate() {

    if (this.selectedSMS.message != null && this.selectedSMS.message != '') {

      /* Denied */
      if (this.selectedSMS.statusValue == 'Open') {
        let msg = {
          type: 'warning',
          title: 'Unable To Send SMS',
          body: 'Your sms template is pending approval, kindly contact support'
        }
        this.appC.popToast(msg);
        this.cd.markForCheck();
      }

      /* Rejected  */
      else if (this.selectedSMS.statusValue == 'Rejected') {

        let msg = {
          type: 'error',
          title: 'Unable To Send SMS',
          body: 'Your sms template has been rejected, kindly contact support'
        }
        this.appC.popToast(msg);
        this.cd.markForCheck();

      }

      /* Ok Send SMS */
      else if (this.selectedSMS.statusValue == 'Approved') {

        /* Send Multi SMS */
        if (this.isMultiSms) {

          let messageId = [];
          messageId.push((this.selectedSMS.message_id).toString());
          this.sendSmsFormData.baseIds = this.selectedRowGroup;
          this.sendSmsFormData.messageArray = messageId;
          this.cd.markForCheck();
          this.postdata.sendSmsToEnquirer(this.sendSmsFormData).subscribe(
            res => {
              //console.log(res);
              let msg = {
                type: 'success',
                title: 'SMS sent',
                body: "Your sms has been sent and will be delivered shortly"
              }
              this.appC.popToast(msg);
              this.cd.markForCheck();
            },
            err => {
              let msg = {
                type: 'error',
                title: 'Unable To Send SMS',
                body: "SMS notification cannot be sent due to any of following reasons: SMS setting is not enabled for institute. SMS Quota is insufficient for institute. No Users(Contacts) found for notify."
              }
              this.appC.popToast(msg);
              this.cd.markForCheck();
            }
          )

        }
        /* Send Single SMS */
        else {

          let userId = [];
          userId.push((this.selectedRow.institute_enquiry_id).toString());
          let messageId = [];
          messageId.push((this.selectedSMS.message_id).toString());

          this.sendSmsFormData.baseIds = userId;
          this.sendSmsFormData.messageArray = messageId;

          this.postdata.sendSmsToEnquirer(this.sendSmsFormData).subscribe(
            res => {
              // console.log(res);
              let msg = {
                type: 'success',
                title: 'SMS sent',
                body: "Your sms has been sent and will be delivered shortly"
              }
              this.appC.popToast(msg);
            },
            err => {
              let msg = {
                type: 'error',
                title: 'Unable To Send SMS',
                body: "SMS notification cannot be sent due to any of following reasons: SMS setting is not enabled for institute. SMS Quota is insufficient for institute. No Users(Contacts) found for notify."
              }
              this.appC.popToast(msg);
            }
          )
        }
      }
    }
    else {
      let msg = {
        type: 'error',
        title: 'Cannot Send Blank SMS',
        body: 'Please select an approved SMS Template to be sent'
      }
      this.appC.popToast(msg);
    }

  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Trigger Bulk Send SMS PopUp */
  sendBulkSms() {
    if ((this.selectedRowGroup != null || this.selectedRowGroup != undefined) && (this.selectedRowGroup.length != 0)) {
      this.isMultiSms = true;
      this.smsServicesInvoked();
      this.smsSelectedRowsLength = this.selectedRowGroup.length;
      this.cd.markForCheck();
    }
    else {
      let msg = {
        type: 'warning',
        title: 'Please Select An Enquiry To Send Bulk SMS'
      }
      this.appC.popToast(msg)
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Close Bulk Enquiry Popup and clear the field records and state */
  closeBulkSms() {
    this.isMultiSms = false;
    this.isMessageAddOpen = false;
    this.smsBtnToggle = false;
    this.selectedSMS = {
      message: "",
      message_id: "",
      sms_type: "",
      status: "",
      statusValue: "",
      date: "",
      feature_type: "",
      institute_name: "",
    };
    this.newSmsString.data = "";
    this.newSmsString.length = 0;
    this.smsSelectedRows = null;
    this.sendSmsFormData = {
      baseIds: [],
      messageArray: []
    };
    this.cd.markForCheck();
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Peform Delete Operation if access is OK */
  bulkDeleteEnquiries() {
    this.cd.markForCheck();
    /* If Admin */
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == '') {

      /* Multi rows selected */
      if (this.selectedRowGroup.length != 0) {
        if (confirm('You are about to delete multiple enquiries')) {
          /* Check if user has selected any enquiry with status 11 or 12 */
          if (this.validateDeletable()) {
            let deleteString: string = '';

            this.selectedRowGroup.forEach(el => {
              deleteString = deleteString + ',' + el;
            });

            let data = {
              enquiryIdList: deleteString.slice(1),
              institution_id: sessionStorage.getItem('institute_id')
            };
            this.isRippleLoad = true;
            this.postdata.deleteEnquiryBulk(data).subscribe(
              res => {
                this.isRippleLoad = false;
                let alert = {
                  type: 'success',
                  title: 'Enquiry Deleted from Record',
                  body: 'Your delete request has been processed'
                }
                this.appC.popToast(alert);
                this.selectedRowGroup = [];
                this.statusFilter({ value: 'All', prop: 'All', checked: true, disabled: false });
              },
              err => {
                this.isRippleLoad = false;
                let alert = {
                  type: 'error',
                  title: 'Failed To Delete Enquiry',
                  body: err.message
                }
                this.appC.popToast(alert);
              });
          }
          else {
            let msg = {
              type: 'error',
              title: 'Unable to Delete Enquiries',
              body: 'Only open enquiries can be deleted'
            }
            this.appC.popToast(msg);
          }
        }
      }
      /* Inadequate row selected */
      else {
        let msg = {
          type: 'warning',
          title: 'Please Select An Enquiry To Perform Bulk Action',
        }
        this.appC.popToast(msg);
      }
    }
    /* Role based access verification */
    else {

      /* If User is Authorized to assign Enquiries */
      if (JSON.parse(sessionStorage.getItem('permissions')).includes('115')) {
        //console.log("user has rights");
        /* Multi rows selected */
        if (this.selectedRowGroup.length != 0) {
          if (confirm('You are about to delete multiple enquiries')) {

            if (this.validateDeletable()) {
              let deleteString: string = '';
              this.selectedRowGroup.forEach(el => {
                deleteString = deleteString + ',' + el;
              });

              let data = {
                enquiryIdList: deleteString.slice(1),
                institution_id: sessionStorage.getItem('institute_id')
              };

              this.postdata.deleteEnquiryBulk(data).subscribe(
                res => {
                  let alert = {
                    type: 'success',
                    title: 'Enquiry Deleted from Record',
                    body: 'Your delete request has been processed'
                  }
                  this.appC.popToast(alert);
                  this.selectedRowGroup = [];
                  this.statusFilter({ value: 'All', prop: 'All', checked: true, disabled: false });
                },
                err => {
                  let alert = {
                    type: 'error',
                    title: 'Failed To Delete Enquiry',
                    body: err.message
                  }
                  this.appC.popToast(alert);
                });
            }
            else {
              let msg = {
                type: 'error',
                title: 'Unable to Delete Enquiries',
                body: 'Only open enquiries can be deleted'
              }
              this.appC.popToast(msg);
            }
          }
        }
        /* Inadequate row selected */
        else {
          let msg = {
            type: 'warning',
            title: 'Please Select An Enquiry To Be Deleted'
          }
          this.appC.popToast(msg);
        }
      }
      /* If User is not Authorized to assign Enquiries */
      else {

        let msg = {
          type: 'error',
          title: 'You Are Not Authorized To Delete Enquiries, Contact Administrator For Access',
        }
        this.appC.popToast(msg);

      }
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Check if enquiry is deletable  */
  validateDeletable() {

    let temp: any[] = [];
    this.selectedRowGroup.forEach(s => {
      this.sourceEnquiry.forEach(el => {
        if (el.institute_enquiry_id == s) {
          temp.push(el);
        }
      });
    });

    let passed = temp.every(isOpenEnquiry);
    function isOpenEnquiry(element, index, array) {
      return (element.status == 0);
    }

    return passed;
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Bulk Assign popup open */
  bulkAssignEnquiriesOpen() {
    this.cd.markForCheck();
    /* If Admin */
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == '') {

      /* Multi rows selected */
      if (this.selectedRowGroup.length != 0) {
        this.isAssignEnquiry = true;
      }
      /* Inadequate row selected */
      else {
        let msg = {
          type: 'warning',
          title: 'Please Select An Enquiry To Perform Bulk Action',
        }
        this.appC.popToast(msg);
      }
    }
    else {
      /* If User is Authorized to assign Enquiries */
      if (JSON.parse(sessionStorage.getItem('permissions')).includes('115')) {
        /* Multi rows selected */
        if (this.selectedRowGroup.length != 0) {
          this.isAssignEnquiry = true;
        }
        /* Inadequate row selected */
        else {
          let msg = {
            type: 'warning',
            title: 'Please Select An Enquiry To Perform Bulk Action',
          }
          this.appC.popToast(msg);
        }
      }
      /* If User is not Authorized to assign Enquiries */
      else {
        let msg = {
          type: 'error',
          title: 'You Are Not Authorized To Assign Enquiries, Contact Administrator For Access',
        }
        this.appC.popToast(msg);
      }
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Bulk Assign popup close */
  bulkAssignEnquiriesClose() {
    this.isAssignEnquiry = false;
    this.assignMultipleForm = {
      enqLi: [],/* array of institute enquiry ID */
      assigned_to: "" /* Id of assignee */
    }
    this.cd.markForCheck();
  }



  /* =========================================================================== */
  /* =========================================================================== */


  /* Bulk Assign popup operation */
  bulkAssignEnquiries() {
    this.cd.markForCheck();
    let assigneeArr: any[] = [];
    this.isRippleLoad = true;
    this.assignMultipleForm.enqLi = this.selectedRowGroup;
    this.postdata.setEnquiryAssignee(this.assignMultipleForm).subscribe(
      res => {
        this.isRippleLoad = false;
        let msg = {
          type: 'success',
          title: 'Enquiries Assigned',
        }
        this.appC.popToast(msg);
        this.busy = this.loadTableDatatoSource(this.instituteData);
        this.bulkAssignEnquiriesClose();
        this.cd.markForCheck();
      },
      err => {
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Failed To Assign Enquiry',
        }
        this.appC.popToast(msg);

      }
    );
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Convert assignee Id to name */
  getAssigneeName(id): string {
    let name: string = '';
    this.enqAssignTo.forEach(el => {
      if (el.userid == id) {
        name = el.name;
      }
    });
    return name;
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Function to perform advanced filter and update table data */
  filterAdvanced() {
    this.fetchingDataMessage = 1;
    this.stats.All.checked = true;
    this.stats.Open.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Student_Admitted.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Inactive.checked = false;
    this.statusString = [];

    this.isAllSelected = false;

    this.instituteData.filtered_statuses = this.statusString.join(',');

    let tempCustomArr: any[] = [];

    this.customComponents.forEach(el => {
      if (el.is_searchable == 'Y' && el.value != "") {

        if (el.type == '5') {
          let obj = {
            component_id: el.id,
            enq_custom_id: "0",
            enq_custom_value: moment(el.value).format("YYYY-MM-DD")
          }
          tempCustomArr.push(obj);
        }
        else if (el.type != '5') {
          let obj = {
            component_id: el.id,
            enq_custom_id: "0",
            enq_custom_value: el.value
          }
          tempCustomArr.push(obj);
        }
      }
    });

    if (tempCustomArr.length != 0) {
      this.advancedFilterForm.enqCustomLi = tempCustomArr;
    }

    this.sourceEnquiry = [];
    this.selectedRowGroup = [];
    this.selectedRow = null;
    this.closeEnquiryFullDetails();
    this.isSideBar = false;
    this.isRippleLoad = true;
    if (this.advancedFilterForm.followUpDate != null && this.advancedFilterForm.followUpDate != '' && this.advancedFilterForm.followUpDate != 'Invalid date') {
      this.advancedFilterForm.is_recent = "N";
    }
    else if (this.advancedFilterForm.followUpDate == null || this.advancedFilterForm.followUpDate != '' || this.advancedFilterForm.followUpDate != 'Invalid date') {
      this.advancedFilterForm.is_recent = "Y";
    }
    this.busy = this.enquire.getAllEnquiry(this.advancedFilterForm).subscribe(
      data => {
        this.isRippleLoad = false;
        this.sourceEnquiry = data;
        /* pagination defination here */
        if (this.sourceEnquiry.length != 0) {
          this.totalEnquiry = data[0].totalcount;
          this.cd.markForCheck();
          this.closeAdFilter();
        }
        else {
          let alert = {
            type: 'info',
            title: 'No Records Found',
            body: 'We did not find any enquiry for the specified query'
          }
          this.fetchingDataMessage = 2;
          this.appC.popToast(alert);
          this.totalEnquiry = 0;
          this.cd.markForCheck();
          this.closeAdFilter();
        }
      },
      err => {
        this.isRippleLoad = false;
      }
    );
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Function to clear the advance filter Manually */
  clearFilterAdvanced() {
    this.advancedFilterForm = {
      name: "",
      phone: "",
      email: "",
      enquiry_no: "",
      priority: "",
      status: -1,
      filtered_statuses: "",
      follow_type: "",
      followUpDate: "",
      enquiry_date: "",
      assigned_to: -1,
      standard_id: -1,
      subject_id: -1,
      is_recent: "Y",
      slot_id: -1,
      filtered_slots: "",
      isDashbord: "N",
      enquireDateFrom: "",
      enquireDateTo: "",
      updateDate: "",
      updateDateFrom: "",
      updateDateTo: "",
      start_index: 0,
      batch_size: this.displayBatchSize,
      closedReason: "",
      enqCustomLi: null,
      commentShow: 'false'
    };

    this.customComponents.forEach(el => {
      el.selectedString = '';
      el.selected = [];
      el.value = '';
    });
    this.cd.markForCheck();
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* common function to close popups */
  closePopup() {
    this.pops.changeMessage('');
    this.hour = "";
    this.minute = "";
    this.meridian = "";
    this.isApprovedTab = true;
    this.isOpenTab = false;
    this.isMessageAddOpen = false;
    this.smsBtnToggle = false;
    this.newSmsString.data = "";
    this.newSmsString.length = 0;
    this.smsSelectedRows = null;
    this.selectedSMS = {
      message: "",
      message_id: "",
      sms_type: "",
      status: "",
      statusValue: "",
      date: "",
      feature_type: "",
      institute_name: "",
    };
    this.sendSmsFormData = {
      baseIds: [],
      messageArray: []
    };
    this.registrationForm = {
      institute_enquiry_id: "",
      amount: "",
      paymentDate: moment().format('YYYY-MM-DD'),
      paymentMode: "",
      //remark: "",
      reference: "",
    }
    this.updateFormData = {
      comment: "",
      status: "",
      institution_id: sessionStorage.getItem('institute_id'),
      isEnquiryUpdate: "Y",
      closedReason: null,
      slot_id: null,
      priority: "",
      follow_type: "",
      followUpDate: "",
      commentDate: moment().format('YYYY-MM-DD'),
      followUpTime: "",
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
    }
    this.summaryOptions = false;
    this.summaryReport = {
      from_date: "",
      to_date: "",
    };
    this.showDateRange = false;
    this.cd.markForCheck();
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* fetch subject when user selects any standard on select menu */
  fetchEnquirySubject() {
    this.isRippleLoad = true;
    if (this.advancedFilterForm.standard_id != null || this.advancedFilterForm.standard_id != '-1') {
      this.advancedFilterForm.subject_id = '-1';
      this.enqSubject = [];
      this.prefill.getEnqSubjects(this.advancedFilterForm.standard_id).subscribe(
        data => {
          this.isRippleLoad = false;
          this.enqSubject = data;
          this.cd.markForCheck();
        }
      );
    }
    else {
      this.isRippleLoad = false;
      this.advancedFilterForm.subject_id = '-1';
      this.enqSubject = [];
    }
  }



  /* =========================================================================== */
  /* =========================================================================== */



  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.PageIndex++;
    this.fectchTableDataByPage(this.PageIndex);
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.PageIndex--;
    this.fectchTableDataByPage(this.PageIndex);
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.instituteData.start_index = startindex;
    this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
    this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
    this.instituteData.filtered_statuses = this.statusString.join(',');
    this.busy = this.loadTableDatatoSource(this.instituteData);
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.displayBatchSize = parseInt(num);
    this.instituteData.batch_size = this.displayBatchSize;
    this.instituteData.start_index = 0;
    this.stats.All.checked = true;
    this.stats.Open.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Student_Admitted.checked = false;
    this.stats.Registered.checked = false;
    this.statusString = [];
    this.instituteData.filtered_statuses = this.statusString.join(',');
    this.busy = this.loadTableDatatoSource(this.instituteData);
  }

  /* =========================================================================== */
  /* =========================================================================== */

  /* Function to store the data of Custom Component in to Base64 encoded array string */
  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Fetch all the enquiries as xls file */
  downloadAllEnquiries() {
    this.cd.markForCheck();
    this.isRippleLoad = true;
    let obj = {
      name: this.instituteData.name,
      phone: this.instituteData.phone,
      email: this.instituteData.email,
      enquiry_no: this.instituteData.enquiry_no,
      priority: this.advancedFilterForm.priority,
      status: -1,
      filtered_statuses: "",
      follow_type: this.advancedFilterForm.follow_type,
      followUpDate: this.advancedFilterForm.followUpDate,
      enquiry_date: this.instituteData.enquiry_date,
      assigned_to: this.advancedFilterForm.assigned_to,
      standard_id: this.advancedFilterForm.standard_id,
      subject_id: this.advancedFilterForm.subject_id,
      is_recent: "Y",
      slot_id: this.advancedFilterForm.slot_id,
      filtered_slots: this.advancedFilterForm.filtered_slots,
      isDashbord: this.instituteData.isDashbord,
      enquireDateFrom: this.advancedFilterForm.enquireDateFrom,
      enquireDateTo: this.advancedFilterForm.enquireDateTo,
      updateDate: this.advancedFilterForm.updateDate,
      updateDateFrom: this.advancedFilterForm.updateDateFrom,
      updateDateTo: this.advancedFilterForm.updateDateTo,
      start_index: 0,
      batch_size: this.displayBatchSize,
      closedReason: "",
      enqCustomLi: this.advancedFilterForm.enqCustomLi,
      sorted_by: "",
      order_by: "",
      commentShow: 'false'
    };
    this.busy = this.enquire.fetchAllEnquiryAsXls(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('enq_download');
        this.cd.markForCheck();
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        this.cd.markForCheck();
        dwldLink.click();
        this.cd.markForCheck();
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }


  ///// Download Summary Report

  toggleDateSection() {
    if (this.showDateRange == false) {
      this.showDateRange = true;
      document.getElementById('anchTagToggle').text = "Hide";
    } else {
      this.showDateRange = false;
      document.getElementById('anchTagToggle').text = "Download By Date Range";
    }
  }

  downloadSummaryReport() {
    this.summaryOptions = true;
    setTimeout(() => {
      document.getElementById('anchTagToggle').text = "Download By Date Range";
    }, 100);
  }

  downloadSummaryReportXl() {
    if (this.downloadReportOption == 1) {
      let msg = {
        type: 'error',
        title: 'Selection',
        body: 'Please select other options'
      }
      this.appC.popToast(msg);
    } else if (this.downloadReportOption == 2) {
      this.isRippleLoad = true;
      this.enquire.getSummaryReportOfThisMonth().subscribe(
        res => {
          this.isRippleLoad = false;
          this.performDownloadAction(res);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    } else if (this.downloadReportOption == 3) {
      this.isRippleLoad = true;
      this.enquire.getPreviousMSummary().subscribe(
        res => {
          this.isRippleLoad = false;
          this.performDownloadAction(res);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    } else {
      this.isRippleLoad = true;
      this.enquire.getSummaryReportOfLastTwoMonth().subscribe(
        res => {
          this.isRippleLoad = false;
          this.performDownloadAction(res);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    }
  }


  downloadSummaryReportXlDateWise() {
    if (this.summaryReport.to_date != "" && this.summaryReport.from_date != "") {
      this.isRippleLoad = true;
      let obj = {
        to_date: moment(this.summaryReport.to_date).format('YYYY-MM-DD'),
        from_date: moment(this.summaryReport.from_date).format('YYYY-MM-DD')
      }
      this.enquire.getSummaryReportFromDates(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          this.performDownloadAction(res);
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    } else {
      let msg = {
        type: 'error',
        title: 'Error',
        body: 'Please provide dates'
      }
      this.appC.popToast(msg);
    }
  }

  performDownloadAction(res) {
    let byteArr = this.convertBase64ToArray(res.document);
    let format = res.format;
    let fileName = res.docTitle;
    let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(file);
    let dwldLink = document.getElementById('downloadSummaryReport121');
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", fileName);
    document.body.appendChild(dwldLink);
    dwldLink.click();
  }

  /* =========================================================================== */
  /* =========================================================================== */



  /* Converts base64 string into a byte[] */
  convertBase64ToArray(val) {

    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;

  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Convert enquiry to student */
  convertRow(ev) {
    localStorage.setItem('studentPrefill', JSON.stringify(this.selectedRow));
    this.router.navigate(['student/add'])
    this.closePopup();
    this.cd.markForCheck();
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Download Receipt API */
  downloadReceiptPdf() {
    this.isRippleLoad = true;
    this.enquire.fetchReceiptPdf(this.selectedRow.invoice_no).subscribe(
      res => {
        this.isRippleLoad = false;
        this.cd.markForCheck();
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'application/pdf' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('reg-pdf-link');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        dwldLink.click();
        this.cd.markForCheck();
      },
      err => { }
    )

  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Customiized click detection strategy */
  inputClicked(ev) {
    //document.getElementById("bulk-drop").classList.add("hide");
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });

        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /*  */
  sortTableById(id) {
    this.sortBy = id;
    //console.log(id);
    if (id == 'followUpDateTime') { id = 'followUpDate' }
    this.instituteData.sorted_by = id;
    //this.currentDirection = this.currentDirection == 'desc' ? 'asc' : 'desc';
    this.instituteData.order_by = this.currentDirection;
    this.instituteData.filtered_statuses = this.statusString.join(',');
    this.cd.markForCheck();
    this.busy = this.loadTableDatatoSource(this.instituteData);

  }


  /* =========================================================================== */
  /* =========================================================================== */



  clearSearchDate() {
    /*  */
    this.searchBarDate = "";
    this.instituteData.followUpDate = "";
    this.instituteData.enquireDateFrom = "";
    this.instituteData.enquireDateTo = "";
  }


  /* =========================================================================== */
  /* =========================================================================== */



  clearadfilterUpdateDate() {
    this.advancedFilterForm.updateDate = "";
  }


  clearfollowUpDate() {
    this.advancedFilterForm.followUpDate = "";
  }



  /* =========================================================================== */
  /* =========================================================================== */


  clearadfilterEnqFromDate() {
    this.advancedFilterForm.enquireDateFrom = "";
  }


  /* =========================================================================== */
  /* =========================================================================== */



  clearadfilterEnqToDate() {
    this.advancedFilterForm.enquireDateTo = "";
  }


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



  updateSlotSelected(data) {
    /* slot checked */
    if (data.status) {
      this.slotIdArr.push(data.value.slot_id);
      this.selectedSlots.push(data.value.slot_name);
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      this.selectedSlotsID = this.slotIdArr.join(',')
      this.selectedSlotsString = this.selectedSlots.join(',');
      this.advancedFilterForm.filtered_slots = this.selectedSlotsID;
    }
    /* slot unchecked */
    else {
      if (this.selectedSlots.length < 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else if (this.selectedSlots.length == 0) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      else if (this.selectedSlots.length == 1) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      var index = this.selectedSlots.indexOf(data.value.slot_name);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
      this.selectedSlotsString = this.selectedSlots.join(',');

      var index2 = this.slotIdArr.indexOf(data.value.slot_id);
      if (index2 > -1) {
        this.slotIdArr.splice(index, 1);
      }
      this.selectedSlotsID = this.slotIdArr.join(',');
      this.advancedFilterForm.filtered_slots = this.selectedSlotsID;
    }

  }


  /* =========================================================================== */
  /* =========================================================================== */



  getPriority(id): string {
    let temp: string = ""
    this.enqPriority.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    //console.log(temp);
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
    //console.log(temp);
    return temp;
  }


  /* =========================================================================== */
  /* =========================================================================== */

  openEnquiryFullDetails(id) {
    this.closeAdFilter();
    let mySidenavWidth = '29%';
    if (window.innerWidth < 768)
      mySidenavWidth = '100%';
    this.mySidenav.nativeElement.style.width = mySidenavWidth;
    this.mySidenav.nativeElement.style.display = 'block';
    this.enqPage.nativeElement.style.width = "70%";
    this.enqPage.nativeElement.style.marginRight = mySidenavWidth;
    this.optMenu.nativeElement.classList.add('shorted');
    this.isRippleLoad = true;
    this.cd.markForCheck();
    this.prefill.fetchCustomComponentById(id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.cd.markForCheck();
        this.customCompid = res;
        this.isSideBar = true;
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }


  /* =========================================================================== */
  /* =========================================================================== */



  closeEnquiryFullDetails() {
    this.isRippleLoad = true;
    this.isSideBar = false;
    this.mySidenav.nativeElement.style.width = "0";
    this.mySidenav.nativeElement.style.display = 'none';
    this.enqPage.nativeElement.style.width = "100%";
    this.enqPage.nativeElement.style.marginRight = "0";
    this.optMenu.nativeElement.classList.remove('shorted');
    this.isRippleLoad = false;
  }

  /* =========================================================================== */
  /* =========================================================================== */



  userRowSelect(ev) {
    if (ev != null) {
      this.openEnquiryFullDetails(ev.institute_enquiry_id);
      this.cd.markForCheck();
      this.enquiryFullDetail = ev.institute_enquiry_id;
      this.selectedRow = ev;
      this.isConverted = this.selectedRow.status == 12 ? true : false;
      if ((this.selectedRow.status == 11) && (this.selectedRow.invoice_no != 0)) {
        this.hasReceipt = true;
        localStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
      }
      else {
        if (this.selectedRow.status == 0 || this.selectedRow.status == 3 || this.selectedRow.status == 2) {
          this.notClosednAdmitted = true;
          this.isadmitted = false;
          this.isClosed = false;
          this.hasReceipt = false;
        }
        else if (this.selectedRow.status == 11) {
          this.notClosednAdmitted = false;
          this.isadmitted = true;
          this.isClosed = false;
          this.hasReceipt = false;
        }
        else if (this.selectedRow.status == 1 || this.selectedRow.status == 12) {
          this.notClosednAdmitted = false;
          this.isadmitted = false;
          this.isClosed = true;
          this.hasReceipt = false;
        }
        localStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
      }
    }
    else {
      this.closeEnquiryFullDetails();
      this.isSideBar = false;
    }
  }

  /* =========================================================================== */
  /* =========================================================================== */



  virtualUpdateEnquiry(obj) {
    this.updateFormData = obj;
    this.cd.markForCheck();
    this.isRippleLoad = true;
    this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData)
      .subscribe(
        res => {
          this.isRippleLoad = false;
          let msg = {
            type: 'success',
            title: 'Enquiry Updated',
            body: 'Your enquiry has been successfully submitted'
          }
          this.cd.markForCheck();
          this.appC.popToast(msg);
          this.closePopup();
          this.busy = this.loadTableDatatoSource(this.instituteData);
        },
        err => {
          this.isRippleLoad = false;
          let alert = {
            type: 'error',
            title: 'Failed To Update Enquiry',
            body: 'There was an error processing your request'
          }
          this.appC.popToast(alert);
        })
  }


  /* =========================================================================== */
  /* =========================================================================== */


  getRowCount(ev) {
    this.selectedRowCount = ev;
  }

  /* =========================================================================== */
  /* =========================================================================== */



  getSelectedEnquiries(ev) {
    this.cd.markForCheck();
    this.selectedRowGroup = ev;
  }


  /* =========================================================================== */
  /* =========================================================================== */
  getDirection(e) {
    if (e) {
      this.currentDirection = "asc";
    }
    else {
      this.currentDirection = "desc";
    }
  }
}






@Pipe({ name: 'dateConverter' })

export class DateConverter implements PipeTransform {
  transform(value: any, exponent: any): any {

    console.log(value);

    return null;

  }
}
