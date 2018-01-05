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
  checkedStatus = []; filtered = []; enqstatus: any[] = []; enqPriority: any[] = [];
  enqFollowType: any[] = []; enqAssignTo: any[] = []; enqStd: any[] = []; enqSubject: any[] = [];
  enqScholarship: any[] = []; enqSub2: any[] = []; paymentMode: any[] = []; commentFormData: any = {};
  today: any = Date.now(); searchBarData: any = null; searchBarDate: any = moment().format('YYYY-MM-DD');
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

  hour: string = ''; minute: string = ''; meridian: string = '';
  newSmsString = {
    data: "",
    length: 0,
    type: "",
  };

  statusString: any[] = ["0", "3"]; smsSelectedRows: any; smsGroupSelected: any[] = [];

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
  updateFormData: updateEnquiryForm = {
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

  }


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
    Open: { value: 'Open', prop: 'Open', checked: true, disabled: false },
    Registered: { value: 'Registered', prop: 'In Progress', checked: false, disabled: false },
    Admitted: { value: 'Admitted', prop: 'Student Admitted', checked: false, disabled: false },
    Inactive: { value: 'Inactive', prop: 'Converted', checked: false, disabled: false },
  };


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
    filtered_statuses: "0,3",
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
    enqCustomLi: null
  };

  enquiryFullDetail: any;

  header: any = {
    enquiry_no: { id: 'enquiry_no', title: 'Enquiry No.', filter: false, show: true },
    enquiry_date: { id: 'enquiry_date', title: 'Enquiry Date', filter: false, show: true },
    name: { id: 'name', title: 'Name', filter: false, show: true },
    phone: { id: 'phone', title: 'Contact No.', filter: false, show: true },
    statusValue: { id: 'statusValue', title: 'Status', filter: false, show: true },
    priority: { id: 'priority', title: 'Priority', filter: false, show: true },
    follow_type: { id: 'follow_type', title: 'Follow type', filter: false, show: true },
    followUpDateTime: { id: 'followUpDateTime', title: 'Follow up Date', filter: false, show: true },
    actions: { id: 'actions', title: 'Action', filter: false, show: true },
    updateDate: { id: 'updateDate', title: 'Update Date', filter: false, show: true },
    assigned_name: { id: 'assigned_name', title: 'Assigned To', filter: false, show: true },
    email: { id: 'email', title: 'Email', filter: false, show: false },
    Gender: { id: 'Gender', title: 'Gender', filter: false, show: false },
    standard: { id: 'standard', title: 'Standard', filter: false, show: false },
    subjects: { id: 'subjects', title: 'Subjects', filter: false, show: false }
  };


  EnquirySettings: ColumnSetting[] = [
    { primaryKey: 'enquiry_no', header: 'Enquiry No.' },
    { primaryKey: 'enquiry_date', header: 'Enquiry Date.' },
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'phone', header: 'Contact No.' },
    { primaryKey: 'statusValue', header: 'Status' },
    { primaryKey: 'priority', header: 'Priority' },
    { primaryKey: 'follow_type', header: 'Follow up Type' },
    { primaryKey: 'followUpDateTime', header: 'Follow up Date' },
    { primaryKey: 'updateDate', header: 'Update Date' },
    { primaryKey: 'assigned_name', header: 'Assigned To' }
  ];



  assignMultipleForm: any = {
    enqLi: [],/* array of institute enquiry ID */
    assigned_to: "" /* Id of assignee */
  };

  @ViewChild('skelton') skel: ElementRef;


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
    this.busy = this.loadTableDatatoSource(this.instituteData);
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
          if (this.selectedRow.followUpTime != '' && this.selectedRow.followUpTime != null) {
            this.hour = moment(this.selectedRow.followUpDateTime).format('h');
            document.getElementById('hourpar').classList.add('has-value');
            this.minute = moment(this.selectedRow.followUpDateTime).format('mm');
            document.getElementById('minutepar').classList.add('has-value');
            this.meridian = moment(this.selectedRow.followUpDateTime).format('a').toString().toUpperCase();
            document.getElementById('meridianpar').classList.add('has-value');
          }
          this.updateFormComments = res.comments;
          this.updateFormCommentsOn = res.commentedOn;
          this.updateFormCommentsBy = res.commentedBy;
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

    this.fetchingDataMessage = 1;
    document.getElementById("bulk-drop").classList.add("hide");
    this.isAllSelected = false;
    this.sourceEnquiry = [];
    this.closeEnquiryFullDetails();
    this.isSideBar = false;
    /* start index of object passed is zero then create pagination */
    if (obj.start_index == 0) {
      return this.enquire.getAllEnquiry(obj).subscribe(
        data => {
          if (data.length != 0) {
            this.totalEnquiry = data[0].totalcount;
            this.sourceEnquiry = data;
            /* let sourceArr: any[] = [];
            data.forEach(el => {
              let obj = {
                assigned_name: el.assigned_name,
                enquiry_date: el.enquiry_date,
                enquiry_no: el.enquiry_no,
                followUpDate:el.followUpDate,
                followUpDateTime:el.followUpDateTime,
                followUpTime: el.followUpTime,
                follow_type: el.follow_type,
                institute_enquiry_id: el.institute_enquiry_id,
                name: el.name,
                phone: el.phone,
                priority: el.priority,
                order_by: el.order_by,
                sorted_by: el.sorted_by,
                statusValue: el.statusValue,
                uiSelected: el.uiSelected,
                updateDate: el.updateDate,
              }
              sourceArr.push(obj);
            });
            this.sourceEnquiry = sourceArr; */
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
          if (data.length != 0) {
            /* data.forEach(el => {
              let obj = {
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceEnquiry.push(obj);
            }); */
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
      return this.prefill.fetchCustomComponent().subscribe(
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



  /* Function to toggle table data on checkbox click */
  statusFilter(checkerObj) {

    //console.log(this.statusString);
    this.searchBarData = '';
    //this.searchBarDate

    if (checkerObj.value == "All") {
      this.statusString = [];
      if (checkerObj.checked) {
        this.stats.Admitted.checked = false;
        this.stats.Inactive.checked = false;
        this.stats.Open.checked = false;
        this.stats.Registered.checked = false;
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




    else if (checkerObj.value == "Admitted") {
      this.stats.All.checked = false;

      if (this.stats.Admitted.checked) {
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
        let index = this.statusString.indexOf('12');
        if (index !== -1) {
          this.statusString.splice(index, 1);
        }

        if (this.statusString.length == 0) {
          this.stats.All.checked = true;
          this.stats.Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
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




    else if (checkerObj.value == "Inactive") {
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
          this.stats.Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
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





    else if (checkerObj.value == "Open") {
      this.stats.All.checked = false;

      if (this.stats.Open.checked) {
        this.statusString.push('0');
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
        let index = this.statusString.indexOf('0');
        if (index !== -1) {
          this.statusString.splice(index, 1);
        }


        let index2 = this.statusString.indexOf('3');
        if (index2 !== -1) {
          this.statusString.splice(index2, 1);
        }

        if (this.statusString.length == 0) {
          this.stats.All.checked = true;
          this.stats.Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
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





    else if (checkerObj.value == "Registered") {
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
          this.stats.Admitted.checked = false;
          this.stats.Inactive.checked = false;
          this.stats.Open.checked = false;
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
  /* =========================================================================== */



  /* Function to search data on smart table */
  searchDatabase() {
    this.stats.All.checked = true;
    this.stats.Open.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Admitted.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Inactive.checked = false;
    this.statusString = [];
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
        followUpDate: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
            followUpDate: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
            followUpDate: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
            followUpDate: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
    document.getElementById('adFilterExitVisible').classList.add('hide')
    document.getElementById('adFilterExit').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
  }

  /* =========================================================================== */
  /* =========================================================================== */


  /* Function to close advanced filter */
  closeAdFilter() {
    document.getElementById('adFilterExitVisible').classList.remove('hide');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('adFilterOpen').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }


  /* =========================================================================== */
  /* =========================================================================== */


  /* Push the updated enquiry to server */
  pushUpdatedEnquiry() {
    if (this.validateTime()) {
      this.updateFormData.comment = "Enquiry Updated. " + this.updateFormData.comment;
      this.updateFormData.follow_type = this.getFollowUpReverse(this.updateFormData.follow_type);
      this.updateFormData.priority = this.getPriorityReverse(this.updateFormData.priority);

      let followupdateTime: string = "";
      if (this.hour != '') {
        let followUpTime = this.hour + ":" + this.minute + " " + this.meridian;
        followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY') + " " + followUpTime;
        this.updateFormData.followUpTime = followUpTime;
      }
      followupdateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY');
      this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData)
        .subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Enquiry Updated',
            body: 'Your enquiry has been successfully submitted'
          }

        /* this.selectedRow.priority = this.getPriority(this.updateFormData.priority);
          this.selectedRow.follow_type = this.getFollowUp(this.updateFormData.follow_type);
          this.selectedRow.statusValue = this.updateFormData.statusValue;
          this.selectedRow.status = this.enqstatus.forEach(el => { if (el.data_value == this.updateFormData.statusValue) { return el.data_key; } });
          this.selectedRow.updateDate = moment().format();
          if (this.hour != '') {
            let dateTime =
              this.selectedRow.followUpDateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY') + " " + this.updateFormData.followUpTime;
          }
          else if (this.hour == '') {
            this.selectedRow.followUpDateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY');
          } 
        */
          this.appC.popToast(msg);
          this.closePopup();
          this.busy = this.loadTableDatatoSource(this.instituteData);
        },
        err => {
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
    if ((this.hour != '' && this.minute != '' && this.meridian != '') || (this.hour == '' && this.minute == '' && this.meridian == '')) {
      return true;
    }
    else {
      return false;
    }
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
    //console.log(this.selectedRow.institute_enquiry_id);
    this.busy = this.postdata.deleteEnquiryById(this.selectedRow.institute_enquiry_id).subscribe(
      res => {
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
    this.registrationForm.institute_enquiry_id = this.selectedRow.institute_enquiry_id.toString();
    this.registrationForm.paymentDate = moment(this.registrationForm.paymentDate).format('YYYY-MM-DD');
    this.postdata.updateRegisterationPayment(this.registrationForm).subscribe(
      res => {
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
    /* store the data from server and update table */
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
      this.postdata.addNewSmsTemplate(sms).subscribe(
        res => {
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
        err => { }
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
    //this.smsBtnToggle = false;
    this.selectedSMS = row;
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* toggle visibility for add new sms DIV */
  addNewMessage() {
    //console.log(document.getElementById('sms-toggler-icon').innerHTML);
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
    //console.log(stringArr);
    this.newSmsString.length = 0;
    stringArr.forEach(ch => {
      if (ch.charCodeAt(0) <= 127) {
        /* Unicode text detected */
        //console.log(ch.charCodeAt(0));
        this.newSmsString.length = this.newSmsString.length + 1;
        this.cd.markForCheck();
      }
      else {
        /* Non unicode detected */
        //console.log(ch.charCodeAt(0));
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
    /*  if(this.selectedSMS.message == ''){
       this.smsBtnToggle = true;
     }
     else if(this.selectedSMS.message != ''){
       if(confirm('Any changes made to template will be discarded')){
         this.smsBtnToggle = true;
       }
       else{
         this.smsBtnToggle = false;
       }
     } */
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

    this.postdata.saveEditedSms(this.selectedSMS.message_id, data).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: "SMS Template saved",
          body: 'Your sms has been sent for approval'
        }
        this.appC.popToast(msg);
        this.cancelSmsEdit();
      },
      err => {
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
    //console.log(this.selectedRowGroup);
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

    this.assignMultipleForm.enqLi = this.selectedRowGroup;
    this.postdata.setEnquiryAssignee(this.assignMultipleForm).subscribe(
      res => {
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
    this.stats.Admitted.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Inactive.checked = false;
    this.statusString = [];

    this.isAllSelected = false;

    this.instituteData.filtered_statuses = this.statusString.join(',');

    let tempCustomArr: any[] = [];

    this.customComponents.forEach(el => {
      if (el.is_searchable == 'Y' && el.value != "") {
        //console.log(el);
        let obj = {
          component_id: el.id,
          enq_custom_id: "0",
          enq_custom_value: el.value
        }
        tempCustomArr.push(obj);
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
    this.busy = this.enquire.getAllEnquiry(this.advancedFilterForm).subscribe(
      data => {
        this.sourceEnquiry = data
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
    }
    this.cd.markForCheck();
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* fetch subject when user selects any standard on select menu */
  fetchEnquirySubject() {
    if (this.advancedFilterForm.standard_id != null || this.advancedFilterForm.standard_id != '') {
      this.prefill.getEnqSubjects(this.advancedFilterForm.standard_id).subscribe(
        data => {
          this.enqSubject = data;
          this.cd.markForCheck();
        }
      );
    }
    else {
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
    document.getElementById("bulk-drop").classList.add("hide");
    sessionStorage.setItem('displayBatchSize', num);
    this.instituteData.batch_size = this.displayBatchSize;
    this.instituteData.start_index = 0;
    this.stats.All.checked = true;
    this.stats.Open.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Admitted.checked = false;
    this.stats.Registered.checked = false;
    this.statusString = [];
    this.instituteData.filtered_statuses = this.statusString.join(',');
    this.busy = this.loadTableDatatoSource(this.instituteData);
  }


  /* =========================================================================== */
  /* =========================================================================== */



  /* Toggle DropDown Menu on Click */
  bulkActionFunctionOpen() {
    if (document.getElementById("bulk-drop").classList.contains('hide')) {
      document.getElementById("bulk-drop").classList.remove("hide");
    }
    else {
      document.getElementById("bulk-drop").classList.add("hide");
    }
  }


  /* =========================================================================== */
  /* =========================================================================== */


  bulkActionFunctionClose() {
    document.getElementById("bulk-drop").classList.add("hide");
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
    this.busy = this.enquire.fetchAllEnquiryAsXls(this.instituteData).subscribe(
      res => {
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
      }
    )
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

    this.enquire.fetchReceiptPdf(this.selectedRow.invoice_no).subscribe(
      res => {
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
    document.getElementById("bulk-drop").classList.add("hide");
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
    /* Custom server sided sorting */
    if (id == 'followUpDateTime') { id = 'followUpDate' }
    this.instituteData.sorted_by = id;
    this.currentDirection = this.currentDirection == 'desc' ? 'asc' : 'desc'
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



  openEnquiryFullDetails() {
    document.getElementById("mySidenav").style.width = "30%";
    document.getElementById("table-main").style.width = "70%";
    document.getElementById("table-main").style.marginRight = "30%";
  }


  /* =========================================================================== */
  /* =========================================================================== */



  closeEnquiryFullDetails() {
    this.isSideBar = true;
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("table-main").style.width = "100%";
    document.getElementById("table-main").style.marginRight = "0";
  }

  /* =========================================================================== */
  /* =========================================================================== */



  userRowSelect(ev) {
    if (ev != null) {
      this.openEnquiryFullDetails();
      this.cd.markForCheck();
      this.enquiryFullDetail = ev.institute_enquiry_id;
      this.selectedRow = ev;
      this.isSideBar = true;
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
    this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData)
      .subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Enquiry Updated',
          body: 'Your enquiry has been successfully submitted'
        }
        this.cd.markForCheck();
      /* this.selectedRow.priority = obj.priority;
        this.cd.markForCheck();
        this.selectedRow.follow_type = obj.follow_type;
        this.cd.markForCheck();
        this.selectedRow.statusValue = this.updateFormData.statusValue;
        this.cd.markForCheck();
        this.selectedRow.status = this.enqstatus.forEach(el => { if (el.data_value == this.updateFormData.statusValue) { return el.data_key; } });
        this.selectedRow.updateDate = moment().format('DD-MMM-YY h:mm:ss a');
        if (this.hour != '') {
          let dateTime =
            this.selectedRow.followUpDateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY') + " " + this.updateFormData.followUpTime;
        }
        else if (this.hour == '') {
          this.selectedRow.followUpDateTime = moment(this.updateFormData.followUpDate).format('DD-MMM-YY');
        } 
      */
        this.appC.popToast(msg);
        this.closePopup();
        this.busy = this.loadTableDatatoSource(this.instituteData);
      },
      err => {
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





  /* Function to convert all select-option tag to ul-li */
  /*convertSelectToUl() {
 
    var myNodeListOne = document.querySelectorAll('.form-ctrl');
 
    [].forEach.call(myNodeListOne, function (elm) {
      if (elm.tagName == 'SELECT') {
        var allOptions = elm.getElementsByTagName('option');
        var allreadyCustomDropDown = elm.parentNode.querySelector('.customDropdown');
        if (allreadyCustomDropDown != null) {
          allreadyCustomDropDown.remove();
        }
        if (allOptions.length > 0) {
          var listWrapper = document.createElement('ul');
          listWrapper.classList.add('customDropdown');
          for (var i = 0; i < allOptions.length; i++) {
            var list = document.createElement('li');
            list.innerHTML = allOptions[i].innerHTML;
            listWrapper.appendChild(list);
          }
          elm.parentNode.appendChild(listWrapper);
          elm.parentNode.classList.add('customSelectWrapper');
          var listNode = listWrapper.querySelectorAll('li');
          [].forEach.call(listNode, function (liList) {
            liList.addEventListener('click', function () {
              liList.parentNode.parentNode.querySelector('.form-ctrl').value = liList.innerHTML;
              liList.parentNode.parentNode.classList.add('has-value');
              liList.parentNode.classList.remove('visibleDropdown');
              liList.parentNode.parentNode.querySelector('.form-ctrl').style.opacity = 1;
            })
          })
        }
 
      }
    });
 
    var myNodeListTwo = document.querySelectorAll('select.form-ctrl');
 
    [].forEach.call(myNodeListTwo, function (elm) {
      elm.addEventListener('click', function () {
        var listDropdown = document.querySelectorAll('.customDropdown');
        [].forEach.call(listDropdown, function (elm1) {
          elm1.parentNode.querySelector('.customDropdown').classList.remove('visibleDropdown');
        });
        elm.style.opacity = 0;
        elm.parentNode.querySelector('.customDropdown').classList.add('visibleDropdown');
      });
    });
 
    document.addEventListener('click', (e) => {
      let parent = (<HTMLElement>(<HTMLElement>e.target).parentNode);
      if (!parent.classList.contains('customDropdown')
        && !parent.classList.contains('customSelectWrapper')) {
        var nodeDropdown = document.querySelectorAll('.customDropdown');
        [].forEach.call(nodeDropdown, function (elm) {
          elm.classList.remove('visibleDropdown');
          elm.parentNode.querySelector('.form-ctrl').style.opacity = 1;
        });
      }
    });
  }*/

}






@Pipe({ name: 'dateConverter' })

export class DateConverter implements PipeTransform {
  transform(value: any, exponent: any): any {

    console.log(value);

    return null;

  }
}
