import {
  Component, OnInit, ViewChild, Input, Output,
  EventEmitter, HostListener, AfterViewInit, OnDestroy, ElementRef, Renderer2
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { ActionButtonComponent } from './action-button.component';
import { SmsOptionComponent } from './sms-option.component';
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

/* Third party imports */
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import { Ng2SmartTableModule, LocalDataSource } from '../../../../assets/imported_modules/ng2-smart-table';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'app-enquiry-manage',
  templateUrl: './enquiry-manage.component.html',
  styleUrls: ['./enquiry-manage.component.scss']
})
export class EnquiryManageComponent implements OnInit, OnDestroy {

  /* Variable Declaration */
  private rows: any = [];
  private optionsModel = [];
  private checkedOpt: any[];
  private myOptions: IMultiSelectOption[];
  private sourceEnquiry: LocalDataSource;
  smsPopSource: LocalDataSource;
  busy: Subscription;
  private checkedStatus = [];
  private filtered = [];
  private enqstatus: any = [];
  private enqPriority: any = [];
  private enqFollowType: any = [];
  private enqAssignTo: any = [];
  private enqStd: any = [];
  private enqSubject: any = [];
  private enqScholarship: any = [];
  private enqSub2: any = [];
  private paymentMode: any = [];
  today: any = Date.now();
  searchBarData: any = null;
  searchBarDate: any = '';
  displayBatchSize: number = 10;
  incrementFlag: boolean = true;
  updateFormComments: any = [];
  updateFormCommentsBy: any = [];
  updateFormCommentsOn: any = [];
  PageIndex: number = 0;
  maxPageSize: number = 0;
  totalEnquiry: number = 0;
  isProfessional: boolean = false;
  isActionDisabled: boolean = false;
  isMessageAddOpen: boolean = false;
  isMultiSms: boolean = false;
  smsSelectedRowsLength: number = 0;
  sizeArr: any[] = [5, 10, 25, 50, 100];
  newSmsString = {
    data: "",
    length: 0,
    type: "",
  };

  statusString: any[] = [];
  smsSelectedRows: any;
  smsGroupSelected: any[] = [];


  /* items added on ngOnInit */
  bulkAddItems: MenuItem[];

  indexJSON = [];

  selectedRow: any = {
    address: null,
    amount: 0,
    assigned_name: "",
    assigned_to: null,
    batch_size: null,
    city: null,
    closedReason: null,
    closedReasonText: "",
    comment: null,
    commentDate: null,
    commentedBy: null,
    commentedOn: null,
    comments: null,
    course_types: null,
    curr_address: null,
    demo_by_id: null,
    discount_offered: null,
    email: "",
    email2: null,
    enqCustomLi: null,
    enqLi: null,
    enqStudentstatusMap: null,
    enquireDateFrom: null,
    enquireDateTo: null,
    enquiry: null,
    enquiryIdList: null,
    enquiry_creation_datetime: "",
    enquiry_date: "",
    enquiry_no: null,
    enquiry_no_date: "",
    failure_reason: "",
    fee_committed: null,
    filtered_slots: "",
    filtered_statuses: "",
    followUpDate: "",
    followUpDateTime: "",
    followUpTime: "",
    follow_type: "",
    from_date: null,
    gender: null,
    grade: null,
    inst_enquiry_handler_no: null,
    institute_enquiry_id: 0,
    institution_id: 0,
    invoice_no: 0,
    isDashbord: "",
    isEnquiryUpdate: "",
    isEnquiryV2Update: "",
    isRegisterFeeUpdate: "",
    isRport: "",
    is_converted: "",
    is_recent: "",
    lead_id: null,
    link: null,
    name: "",
    name_person: "",
    newEnqcount: null,
    occupation_id: null,
    occupation_name: "",
    otherReference: null,
    parent_email: null,
    parent_name: null,
    parent_phone: null,
    pastResult: null,
    pastResultEvaluationType: null,
    paymentDate: null,
    paymentMode: null,
    phone: "",
    phone2: null,
    priority: "",
    promotional_sms: null,
    qualification: null,
    reference: null,
    reference_no: null,
    referred_by: null,
    referred_by_name: "",
    religion: null,
    reportType: null,
    school: null,
    school_id: null,
    slot: "",
    slot_id: null,
    source_id: null,
    source_name: "",
    standard: "",
    standard_id: null,
    standard_subject: "",
    start_index: null,
    status: null,
    statusMap: null,
    statusMasterMap: null,
    statusValue: "",
    statuses: null,
    subject_id: null,
    subjects: "",
    teacherArray: null,
    to_date: null,
    totalFeesCollected: null,
    totalcount: null,
    transactional_sms: "",
    uniqueCatName: null,
    updateDate: "",
    updateDateFrom: null,
    updateDateTo: null,
  };

  selectedRowGroup: any;
  componentPrefill: any = [];
  componentListObject: any = {};
  emptyCustomComponent: any;
  componentRenderer: any = [];
  customComponentResponse: any = [];

  smsBtnToggle: boolean = false;

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

  smsSearchData: string = "";

  private isConverted: boolean = false;
  private hasReceipt: boolean = false;
  private isadmitted: boolean = false;
  private notClosednAdmitted: boolean = false;
  private isClosed: boolean = false;


  /* Model for institute Data */
  instituteData: instituteInfo = {
    name: "",
    phone: "",
    email: "",
    enquiry_no: "",
    priority: "",
    status: -1,
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
  };

  availableSMS: number = 0;
  smsDataLength: number = 0;


  /* Model for Enquiry Update Popup Form */
  updateFormData: updateEnquiryForm = {
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
    All: { value: 'All', prop: 'All', checked: true, disabled: false },
    Open: { value: 'Open', prop: 'Open', checked: false, disabled: false },
    Registered: { value: 'Registered', prop: 'In Progress', checked: false, disabled: false },
    Admitted: { value: 'Admitted', prop: 'Student Admitted', checked: false, disabled: false },
    Inactive: { value: 'Inactive', prop: 'Converted', checked: false, disabled: false },
  };





  /* Variable to handle popups */
  message: string = '';




  /* Variable to store JSON.stringify value and update service for multi-component communication */
  selectedRowJson: string = '';




  /* Default Settings for ng2-smart-table */
  settingsEnquiry = {
    selectMode: 'multi', mode: 'external', hideSubHeader: false,
    actions: { add: false, edit: false, delete: false, columnTitle: '', },
    columns: {
      enquiry_no: { title: 'Enquiry No.', filter: false, show: true },
      enquiry_date: { title: 'Enquiry Date', filter: false, show: true },
      name: { title: 'Student Name', filter: false, show: true },
      phone: { title: 'Contact No.', filter: false, show: true },
      priority: { title: 'Priority', filter: false, show: true },
      follow_type: { title: 'Follow type', filter: false, show: true },
      followUpDate: { title: 'Follow up Date', filter: false, show: true },
      assigned_name: { title: 'Assigned To', filter: false, show: true },
      standard: { title: 'Standard', filter: false, show: true },
      subjects: { title: 'Subjects', filter: false, show: true },
      action: { title: 'Action', filter: false, type: 'custom', renderComponent: ActionButtonComponent },
      updateDate: { title: 'Update Date', filter: false, show: true },
      statusValue: { title: 'Status Value', filter: false, show: true },
      enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false }, followUpTime: { title: 'Follow up Time', filter: false, show: false }, followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false }, filtered_statuses: { title: 'Filtered Status', filter: false, show: false }, email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false }, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false }, name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false }, filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
    },
    pager: {
      display: false
    },
  };





  /* Clone for ng2-smart-table setting that can be updated and assigned on toggle */
  settingsEnquiryUpdater = {
    selectMode: 'multi', mode: 'external', hideSubHeader: false,
    actions: { add: false, edit: false, delete: false, columnTitle: '', },
    columns: {
      enquiry_no: { title: 'Enquiry No.', filter: false, show: true },
      enquiry_date: { title: 'Enquiry Date', filter: false, show: true },
      name: { title: 'Student Name', filter: false, show: true },
      phone: { title: 'Contact No.', filter: false, show: true },
      priority: { title: 'Priority', filter: false, show: true },
      follow_type: { title: 'Follow type', filter: false, show: true },
      followUpDate: { title: 'Follow up Date', filter: false, show: true },
      assigned_name: { title: 'Assigned To', filter: false, show: true },
      standard: { title: 'Standard', filter: false, show: true },
      subjects: { title: 'Subjects', filter: false, show: true },
      action: {
        title: 'Action', filter: false, type: 'custom',
        renderComponent: ActionButtonComponent
      },
      updateDate: { title: 'Update Date', filter: false, show: true },
      statusValue: { title: 'Status Value', filter: false, show: true },
      enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false }, followUpTime: { title: 'Follow up Time', filter: false, show: false }, followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false }, filtered_statuses: { title: 'Filtered Status', filter: false, show: false }, email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false }, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false }, name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false }, filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
    },
    pager: {
      display: false
    },
  };





  /* Settings for SMS Table Display */
  settingsSmsPopup = {
    selectMode: 'single', mode: 'external', hideSubHeader: false,
    actions: { add: false, edit: false, delete: false, columnTitle: '', },
    columns: {
      message: { title: 'Message', filter: false, show: true },
      statusValue: { title: 'Status.', filter: false, show: true },
      date: { title: 'Date.', filter: false, show: true },
      status: { title: 'Status Key', filter: false, show: false },
      campaign_list_id: { title: 'Campaign List.', filter: false, show: false },
      campaign_list_message_id: { title: 'Campaign List Id.', filter: false, show: false },
      feature_type: { title: 'Feature Type.', filter: false, show: false },
      institute_name: { title: 'Institute Name.', filter: false, show: false },
      message_id: { title: 'Message Id.', filter: false, show: false },
      sms_type: { title: 'Sms Type.', filter: false, show: false },
      action: {
        title: ' ', filter: false, type: 'custom',
        renderComponent: SmsOptionComponent
      },
    },
    pager: {
      display: false
    }
  };






  /* Form for advanced filter  */
  advancedFilterForm: instituteInfo = {
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
    enqCustomLi: null
  };





  /* Setting for Multiselect dropdown menu */
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn dropdown-button',
    fixedTitle: true,
    dynamicTitleMaxItems: 0,
    displayAllSelectedText: false
  };




  /* Default Text for Multiselect dropdown menu */
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: '',
    checkedPlural: '',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: '',
    allSelected: 'All selected',
  };




  /* ============================= Delaration Fin ==================================== */
  /* ================================================================= */
  /* ================================================================= */
  /* ================================================================= */
  /* ================================================================= */
  constructor(private enquire: FetchenquiryService, private prefill: FetchprefilldataService,
    private router: Router,
    private logger: Logger, private fb: FormBuilder, private pops: PopupHandlerService,
    private postdata: PostEnquiryDataService, private appC: AppComponent) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }




  /* OnInit Function */
  ngOnInit() {

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    /* Model for toggle Menu Dropdown */
    this.myOptions = [
      { name: 'Enquiry ID', id: 'institute_enquiry_id' },
      { name: 'Institute ID', id: 'institution_id' },
      { name: 'Enquiry No', id: 'enquiry_no' },
      { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' }, { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' }, { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' }, { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' }, { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' }, { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' }, { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }
    ];

    /* If show attribute on table settings, set the checked value on dropdown menu  */

    this.myOptions.forEach(el => {
      if (this.settingsEnquiry.columns[el.id].show) {
        this.optionsModel.push(el.id);
      }
    });

    /* Load paginated enquiry data from server */
    this.busy = this.loadTableDatatoSource(this.instituteData);

    /* Fetch prefill data after table data load completes */
    this.FetchEnquiryPrefilledData();


    /* Dropdown items for Bulk Actions */
    this.bulkAddItems = [
      {
        label: 'Delete', icon: 'fa-close', command: () => {
          this.bulkDeleteEnquiries();
        }
      }
    ];


    /* Fetch the status of message from  popup handler service */
    this.pops.currentMessage.subscribe(message => {
      if (message == 'sms') {
        this.smsServicesInvoked();
        this.message = message;
        this.smsSelectedRows = this.selectedRow;
      }
      else {
        this.message = message
      }
    });


    /* SMS message service handler to communicate between components */
    this.pops.currentSms.subscribe(res => {
      if (res == 'edit') {
        this.editSms();
      }
    });

    sessionStorage.setItem('displayBatchSize', this.displayBatchSize.toString());

  }



  /* Clear row and datasource for smart table */
  ngOnDestroy() {
    this.rows = null;
    this.sourceEnquiry = null;
  }




  /* Load Table data with respect to the institute data provided */
  loadTableDatatoSource(obj) {

    this.unselectAllRow();

    /* If start_index is zero then fetch table data and set page size for paginator */
    if (obj.start_index === 0) {
      /* manual conversion of date object to date string as accepted by server */
      obj.followUpDate = obj.followUpDate == '' ? '' : moment(obj.followUpDate).format('YYYY-MM-DD');
      obj.enquiry_date = obj.enquiry_date == '' ? '' : moment(obj.enquiry_date).format('YYYY-MM-DD');
      obj.enquireDateFrom = obj.enquireDateFrom == '' ? '' : moment(obj.enquireDateFrom).format('YYYY-MM-DD');
      obj.enquireDateTo = obj.enquireDateTo == '' ? '' : moment(obj.enquireDateTo).format('YYYY-MM-DD');
      obj.updateDate = obj.updateDate == '' ? '' : moment(obj.updateDate).format('YYYY-MM-DD');
      obj.updateDateFrom = obj.updateDateFrom == '' ? '' : moment(obj.updateDateFrom).format('YYYY-MM-DD');
      obj.updateDateTo = obj.updateDateTo == '' ? '' : moment(obj.updateDateTo).format('YYYY-MM-DD');

      return this.enquire.getAllEnquiry(obj).subscribe(data => {
        if (sessionStorage.getItem('pageI') != null && this.indexJSON.length != 0) {
          for (var i = 1; i <= this.maxPageSize; i++) {
            if (i == parseInt(sessionStorage.getItem('pageI'))) {
              document.getElementById('page' + i).classList.add('active');
            }
            else {
              document.getElementById('page' + i).classList.remove('active');
            }
          }

          this.rows = data;
          this.sourceEnquiry = new LocalDataSource(this.rows);
          this.totalEnquiry = this.rows[0].totalcount;
          this.indexJSON = [];
          this.setPageSize(this.totalEnquiry);
        }
        else {
          this.rows = data;
          this.sourceEnquiry = new LocalDataSource(this.rows);
          this.totalEnquiry = this.rows[0].totalcount;
          this.indexJSON = [];
          this.setPageSize(this.totalEnquiry);
          //document.getElementById('page1').classList.add('active');
        }
      });
    }
    /* simply returns data obtained from server */
    else {
      /* manual conversion of date object to date string as accepted by server */
      obj.followUpDate = obj.followUpDate == '' ? '' : moment(obj.followUpDate).format('YYYY-MM-DD');
      obj.enquiry_date = obj.enquiry_date == '' ? '' : moment(obj.enquiry_date).format('YYYY-MM-DD');
      obj.enquireDateFrom = obj.enquireDateFrom == '' ? '' : moment(obj.enquireDateFrom).format('YYYY-MM-DD');
      obj.enquireDateTo = obj.enquireDateTo == '' ? '' : moment(obj.enquireDateTo).format('YYYY-MM-DD');
      obj.updateDate = obj.updateDate == '' ? '' : moment(obj.updateDate).format('YYYY-MM-DD');
      obj.updateDateFrom = obj.updateDateFrom == '' ? '' : moment(obj.updateDateFrom).format('YYYY-MM-DD');
      obj.updateDateTo = obj.updateDateTo == '' ? '' : moment(obj.updateDateTo).format('YYYY-MM-DD');

      return this.enquire.getAllEnquiry(obj).map(data => {
        this.rows = data;
      }).subscribe(data => {
        if (sessionStorage.getItem('pageI') != null && this.indexJSON.length != 0) {
          for (var i = 1; i <= this.maxPageSize; i++) {
            if (i == parseInt(sessionStorage.getItem('pageI'))) {
              document.getElementById('page' + i).classList.add('active');
            }
            else {
              document.getElementById('page' + i).classList.remove('active');
            }
          }
          this.sourceEnquiry = new LocalDataSource(this.rows);
        }
        else {
          this.sourceEnquiry = new LocalDataSource(this.rows);
        }
      });
    }
  }



  /* onload clear all selected Row */
  unselectAllRow() {
    this.selectedRowGroup = [];
    this.selectedRow = {
      address: null,
      amount: 0,
      assigned_name: "",
      assigned_to: null,
      batch_size: null,
      city: null,
      closedReason: null,
      closedReasonText: "",
      comment: null,
      commentDate: null,
      commentedBy: null,
      commentedOn: null,
      comments: null,
      course_types: null,
      curr_address: null,
      demo_by_id: null,
      discount_offered: null,
      email: "",
      email2: null,
      enqCustomLi: null,
      enqLi: null,
      enqStudentstatusMap: null,
      enquireDateFrom: null,
      enquireDateTo: null,
      enquiry: null,
      enquiryIdList: null,
      enquiry_creation_datetime: "",
      enquiry_date: "",
      enquiry_no: null,
      enquiry_no_date: "",
      failure_reason: "",
      fee_committed: null,
      filtered_slots: "",
      filtered_statuses: "",
      followUpDate: "",
      followUpDateTime: "",
      followUpTime: "",
      follow_type: "",
      from_date: null,
      gender: null,
      grade: null,
      inst_enquiry_handler_no: null,
      institute_enquiry_id: 0,
      institution_id: 0,
      invoice_no: 0,
      isDashbord: "",
      isEnquiryUpdate: "",
      isEnquiryV2Update: "",
      isRegisterFeeUpdate: "",
      isRport: "",
      is_converted: "",
      is_recent: "",
      lead_id: null,
      link: null,
      name: "",
      name_person: "",
      newEnqcount: null,
      occupation_id: null,
      occupation_name: "",
      otherReference: null,
      parent_email: null,
      parent_name: null,
      parent_phone: null,
      pastResult: null,
      pastResultEvaluationType: null,
      paymentDate: null,
      paymentMode: null,
      phone: "",
      phone2: null,
      priority: "",
      promotional_sms: null,
      qualification: null,
      reference: null,
      reference_no: null,
      referred_by: null,
      referred_by_name: "",
      religion: null,
      reportType: null,
      school: null,
      school_id: null,
      slot: "",
      slot_id: null,
      source_id: null,
      source_name: "",
      standard: "",
      standard_id: null,
      standard_subject: "",
      start_index: null,
      status: null,
      statusMap: null,
      statusMasterMap: null,
      statusValue: "",
      statuses: null,
      subject_id: null,
      subjects: "",
      teacherArray: null,
      to_date: null,
      totalFeesCollected: null,
      totalcount: null,
      transactional_sms: "",
      uniqueCatName: null,
      updateDate: "",
      updateDateFrom: null,
      updateDateTo: null,
    };
  }



  /* Function to fetch prefill data for advanced filter */
  FetchEnquiryPrefilledData() {
    /* Status */
    this.prefill.getEnqStatus().subscribe(
      data => {
        this.enqstatus = data;
        // console.log(this.enqstatus)
      }
    );


    /* Priority */
    this.prefill.getEnqPriority().subscribe(
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


    /* Scholarship */
    /* this.prefill.getScholarPrefillData().subscribe(
      data => {

        data.forEach(el => {
          if (el.label == "Scholarship") {

            this.enqScholarship = el.prefilled_data.split(',');
          }
          else if (el.label == "Subject2") {
            this.enqSub2 = el.prefilled_data.split(',');
          }
        })
      }
    ); */


    /* Standard */
    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; }
    );


    /* Payment Modes */
    this.prefill.fetchPaymentModes().subscribe(
      data => { this.paymentMode = data; }
    )


    /* Custom Components */
    this.prefill.fetchCustomComponent().subscribe(
      data => {

        /* Create a base for storing the custom component Value via json on client side */
        data.forEach(el => {

          let temp = {
            component_id: el.component_id,
            enq_custom_id: "0",
            enq_custom_value: ""
          }
          let index = el.component_id.toString();
          this.componentListObject[index] = temp;
          let dataArr = el.prefilled_data.split(',');
          el.prefilled_data = dataArr
          this.componentPrefill.push(el);
          //console.log(this.componentPrefill);
        });

        this.emptyCustomComponent = this.componentListObject;

      }
    );


    /* Registration Fee Payment JSON */
    this.prefill.fetchRegistrationFeeDetails().subscribe(
      res => {
        console.log(res);
      }
    )
  }




  /* Function to toggle smart table column on click event */
  toggleOptionChange(ev) {

    this.settingsEnquiry = {
      selectMode: 'multi', mode: 'external', hideSubHeader: false,
      actions: { add: false, edit: false, delete: false, columnTitle: '', },
      columns: {
        enquiry_no: { title: 'Enquiry No.', filter: false, show: false },
        enquiry_date: { title: 'Enquiry Date', filter: false, show: false },
        name: { title: 'Student Name', filter: false, show: false },
        phone: { title: 'Contact No.', filter: false, show: false },
        priority: { title: 'Priority', filter: false, show: false },
        follow_type: { title: 'Follow type', filter: false, show: false },
        followUpDate: { title: 'Follow up Date', filter: false, show: false },
        assigned_name: { title: 'Assigned To', filter: false, show: false },
        standard: { title: 'Standard', filter: false, show: false },
        subjects: { title: 'Subjects', filter: false, show: false },
        action: {
          title: 'Action', filter: false, type: 'custom',
          renderComponent: ActionButtonComponent
        },
        updateDate: { title: 'Update Date', filter: false, show: false },
        statusValue: { title: 'Status Value', filter: false, show: false },
        enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false },
        followUpTime: { title: 'Follow up Time', filter: false, show: false },
        followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false },
        filtered_statuses: { title: 'Filtered Status', filter: false, show: false },
        email: { title: 'Email', filter: false, show: false },
        referred_by: { title: 'Reffered By', filter: false, show: false },
        status: { title: 'Status', filter: false, show: false },
        institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false },
        institution_id: { title: 'Institute ID', filter: false, show: false },
        Gender: { title: 'Gender', filter: false, show: false },
        is_converted: { title: 'Is Converted', filter: false, show: false },
        occupation_id: { title: 'Occupation ID', filter: false, show: false },
        school_id: { title: 'School ID', filter: false, show: false },
        standard_id: { title: 'Standard ID', filter: false, show: false },
        subject_id: { title: 'Subject ID', filter: false, show: false },
        source_id: { title: 'Source ID', filter: false, show: false },
        is_recent: { title: 'Is recent', filter: false, show: false },
        slot_id: { title: 'Slot ID', filter: false, show: false },
        slot: { title: 'Slot', filter: false, show: false },
        isDashbord: { title: 'Is Dashboard', filter: false, show: false },
        isRport: { title: 'Is Report', filter: false, show: false },
        totalcount: { title: 'Total Count', filter: false, show: false },
        newEnqcount: { title: 'New Enquiry Count', filter: false, show: false },
        name_person: { title: 'Person Name', filter: false, show: false },
        standard_subject: { title: 'Standard subject', filter: false, show: false },
        closedReasonText: { title: 'Closed Reason', filter: false, show: false },
        filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
      },
      pager: {
        display: false
      },
    };

    this.settingsEnquiryUpdater = Object.assign({}, this.settingsEnquiry);
    this.optionsModel.forEach(el => {
      this.settingsEnquiryUpdater.columns[el].show = true;
    });
    this.settingsEnquiry = Object.assign({}, this.settingsEnquiryUpdater);

  }




  /* Function to toggle table data on checkbox click */
  statusFilter(checkerObj) {



    if (checkerObj.value == "All") {
      if (checkerObj.checked) {
        this.stats.Admitted.checked = false;
        this.stats.Inactive.checked = false;
        this.stats.Open.checked = false;
        this.stats.Registered.checked = false;
        this.instituteData = {
          name: "",
          phone: "",
          email: "",
          enquiry_no: "",
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
        this.loadTableDatatoSource(this.instituteData);
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
        this.loadTableDatatoSource(this.instituteData);

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
          this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
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
          this.loadTableDatatoSource(this.instituteData);
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

        this.loadTableDatatoSource(this.instituteData);
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
          this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
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
          this.loadTableDatatoSource(this.instituteData);
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
        this.loadTableDatatoSource(this.instituteData);
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
          this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
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
          this.loadTableDatatoSource(this.instituteData);
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
        this.loadTableDatatoSource(this.instituteData);
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
          this.loadTableDatatoSource(this.instituteData);
        }
        else if (this.statusString.length != 0) {
          let stat = this.statusString.join(',');
          this.instituteData = {
            name: "",
            phone: "",
            email: "",
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
          this.loadTableDatatoSource(this.instituteData);
        }

      }

    }
  }





  /* Function to search data on smart table */
  searchDatabase() {
    if (this.searchBarData === "" || this.searchBarData === " " || this.searchBarData === null) {

      this.instituteData = {
        name: "",
        phone: "",
        email: "",
        enquiry_no: "",
        priority: "",
        status: -1,
        follow_type: "",
        followUpDate: this.searchBarDate != '' ? this.searchBarDate : '',
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

      this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
        this.rows = data;
      }).subscribe(data => {
        this.sourceEnquiry = new LocalDataSource(this.rows);
        this.totalEnquiry = this.rows[0].totalcount;
        this.indexJSON = [];
        this.setPageSize(this.totalEnquiry);
        this.sourceEnquiry.refresh();
      });
    }
    else {
      /* String detected */
      if (isNaN(this.searchBarData)) {
        if (this.validateString(this.searchBarData)) {
          let tempFormData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
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
          };
          tempFormData.name = this.searchBarData;
          tempFormData.followUpDate = this.searchBarDate != '' ? this.searchBarDate : '';
          this.busy = this.enquire.getAllEnquiry(tempFormData).map(data => {
            this.rows = data;
          }).subscribe(data => {
            this.sourceEnquiry = new LocalDataSource(this.rows);
            this.totalEnquiry = this.rows[0].totalcount;
            this.indexJSON = [];
            this.setPageSize(this.totalEnquiry);
            this.sourceEnquiry.refresh();
          });
        }
        else {
          let alert = {
            type: 'error',
            title: 'Failed To Delete Enquiry',
            body: 'There was an error processing your request'
          }
          this.appC.popToast(alert);
        }
      }
      /* Number detected */
      else {
        if (this.validateNumber(this.searchBarData)) {
          let tempFormData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
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
          };
          tempFormData.phone = this.searchBarData;
          tempFormData.followUpDate = this.searchBarDate != '' ? this.searchBarDate : '';
          this.busy = this.enquire.getAllEnquiry(tempFormData).map(data => {
            this.rows = data;
          }).subscribe(data => {
            this.sourceEnquiry = new LocalDataSource(this.rows);
            this.totalEnquiry = this.rows[0].totalcount;
            this.indexJSON = [];
            this.setPageSize(this.totalEnquiry);
            this.sourceEnquiry.refresh();
          });
        }
        else {
          let tempFormData = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
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
          };
          tempFormData.enquiry_no = this.searchBarData
          tempFormData.followUpDate = this.searchBarDate != '' ? this.searchBarDate : '';
          this.busy = this.enquire.getAllEnquiry(tempFormData).map(data => {
            this.rows = data;
          }).subscribe(data => {
            this.sourceEnquiry = new LocalDataSource(this.rows);
            this.sourceEnquiry.refresh();
          });
        }
      }
    }
  }




  /* regex validation for name atleast one word required */
  validateString(data: string) {
    return /^[a-zA-Z ]{1,40}$/.test(data);
  }




  /* Custom validation suited only for indian mobile numbers*/
  validateNumber(data) {
    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(data);;
  }




  /* Function to open advanced filter */
  openAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
    document.getElementById('adFilterExit').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
  }




  /* Function to close advanced filter */
  closeAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.remove('hasFilter');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }




  /* Function to handle event on table row click*/
  rowClicked(ev) {

    /* If all records are not selected then check for true/false status */
    if (ev.data != null) {

      /* If true, that is multiple option have been checked but not all */
      if (ev.isSelected) {
        //console.log(ev);
        this.selectedRow = ev.data;
        this.selectedRowGroup = ev.selected;
        this.isConverted = this.selectedRow.status == 12 ? true : false;
        //this.isRegistered = this.selectedRow
        if ((this.selectedRow.status == 11) && (this.selectedRow.invoice_no != 0)) {
          this.hasReceipt = true;
          localStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
          this.prefill.fetchCommentsForEnquiry(this.selectedRow.institute_enquiry_id).subscribe(res => {
            this.updateFormComments = res.comments;
            this.updateFormCommentsOn = res.commentedOn;
            this.updateFormCommentsBy = res.commentedBy;
          });
        }
        else {
          /* open, inprogress or converted */
          if (this.selectedRow.status == 0 || this.selectedRow.status == 3 || this.selectedRow.status == 2) {
            this.notClosednAdmitted = true;
            this.isadmitted = false;
            this.isClosed = false;
            this.hasReceipt = false;
          }
          /* admitted or registered */
          else if (this.selectedRow.status == 11) {
            this.notClosednAdmitted = false;
            this.isadmitted = true;
            this.isClosed = false;
            this.hasReceipt = false;
          }
          /* closed */
          else if (this.selectedRow.status == 1 || this.selectedRow.status == 12) {
            this.notClosednAdmitted = false;
            this.isadmitted = false;
            this.isClosed = true;
            this.hasReceipt = false;
          }
          localStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
          this.prefill.fetchCommentsForEnquiry(this.selectedRow.institute_enquiry_id).subscribe(res => {
            this.updateFormComments = res.comments;
            this.updateFormCommentsOn = res.commentedOn;
            this.updateFormCommentsBy = res.commentedBy;
          });
        }
      }

      /* If false, that is only a single input has been selected */
      else {
        //console.log(ev);
        this.selectedRow = ev.data;
        this.isConverted = this.selectedRow.status == 12 ? true : false;

        /* student admitted with invoice */
        if ((this.selectedRow.status == 11) && (this.selectedRow.invoice_no != 0)) {
          this.hasReceipt = true;
          localStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
          this.prefill.fetchCommentsForEnquiry(this.selectedRow.institute_enquiry_id).subscribe(res => {
            this.updateFormComments = res.comments;
            this.updateFormCommentsOn = res.commentedOn;
            this.updateFormCommentsBy = res.commentedBy;
          });
        }
        else {
          /* open, inprogress or converted */
          if (this.selectedRow.status == 0 || this.selectedRow.status == 3 || this.selectedRow.status == 2) {
            this.notClosednAdmitted = true;
            this.isadmitted = false;
            this.isClosed = false;
            this.hasReceipt = false;
          }

          /* admitted or registered */
          else if (this.selectedRow.status == 11) {
            this.notClosednAdmitted = false;
            this.isadmitted = true;
            this.isClosed = false;
            this.hasReceipt = false;
          }
          /* closed */
          else if (this.selectedRow.status == 1 || this.selectedRow.status == 12) {
            this.notClosednAdmitted = false;
            this.isadmitted = false;
            this.isClosed = true;
            this.hasReceipt = false;
          }
          localStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
          this.prefill.fetchCommentsForEnquiry(this.selectedRow.institute_enquiry_id).subscribe(res => {
            this.updateFormComments = res.comments;
            this.updateFormCommentsOn = res.commentedOn;
            this.updateFormCommentsBy = res.commentedBy;
          });
        }
      }
    }

    /* All records in the page have been selected */
    else {
      //console.log(ev);
      this.selectedRowGroup = ev.selected;
    }

  }




  /* Push the updated enquiry to server */
  pushUpdatedEnquiry() {
    this.updateFormData.priority = this.selectedRow.priority;
    this.updateFormData.follow_type = this.selectedRow.follow_type;
    this.updateFormData.status = this.selectedRow.status.toString();
    this.updateFormData.followUpDate = moment(this.selectedRow.followUpDate).format('YYYY-MM-DD');
    this.updateFormData.commentDate = moment(this.updateFormData.commentDate).format('LLL');
    this.updateFormData.comment = "Enquiry Updated. " + this.updateFormData.comment;

    this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData)
      .subscribe(res => {
        let alert = {
          type: 'success',
          title: 'Enquiry Updated',
          body: 'Your enquiry has been successfully submitted'
        }
        this.appC.popToast(alert);
        this.closePopup();
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



  /* update the enquiry id for enquiry update pop up */
  updateStatusForEnquiryUpdate(val) {
    this.selectedRow.status = val;
  }



  /* Delete Enquiry  */
  deleteEnquiry() {
    this.postdata.deleteEnquiryById(this.selectedRow.institute_enquiry_id).subscribe(
      res => {
        let alert = {
          type: 'success',
          title: 'Enquiry Deleted',
          body: 'Your enquiry has been deleted'
        }
        this.appC.popToast(alert);
        this.closePopup();
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




  /* Make Registration Payment Data update */
  registerPayment() {
    this.registrationForm.institute_enquiry_id = this.selectedRow.institute_enquiry_id.toString();
    this.postdata.updateRegisterationPayment(this.registrationForm).subscribe(
      res => {
        let alert = {
          type: 'success',
          title: 'Registration Fee Updated',
        }
        this.appC.popToast(alert);
        this.hasReceipt = true;
        this.registrationForm = {
          institute_enquiry_id: "",
          amount: "",
          paymentDate: "",
          paymentMode: "",
          //remark: "",
          reference: "",
        }
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





  /* Service to fetch sms records from server and update table*/
  smsServicesInvoked() {
    /* store the data from server and update table */
    this.enquire.fetchAllSms().subscribe(
      data => {
        this.smsPopSource = new LocalDataSource(data);
        this.smsDataLength = data.length;
        this.availableSMS = data[0].institute_sms_quota_available

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




  /* Trigger Bulk Send SMS PopUp */
  sendBulkSms() {

    //console.log(this.selectedRowGroup);

    if (this.selectedRowGroup != null || this.selectedRowGroup != undefined) {
      this.isMultiSms = true;
      this.smsServicesInvoked();
      this.smsSelectedRowsLength = this.selectedRowGroup.length;
    }
    else {
      let msg = {
        type: 'warning',
        title: 'Please Select An Enquiry To Send Bulk SMS'
      }
      this.appC.popToast(msg)
    }
  }



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
  }




  bulkDeleteEnquiries() {
    if (this.selectedRowGroup != null || this.selectedRowGroup != undefined) {
      if (confirm('You are about to delete multiple enquiries')) {
        let deleteString: string = '';
        this.selectedRowGroup.forEach(el => {
          deleteString = deleteString + ',' + el.institute_enquiry_id;
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

          },
          err => {

            let alert = {
              type: 'error',
              title: 'Failed To Delete Enquiry',
              body: err.message
            }
            this.appC.popToast(alert);

          }
        )

      }

    }
    else {
      let msg = {
        type: 'warning',
        title: 'Please Select An Enquiry To Be Deleted'
      }
      this.appC.popToast(msg)
    }
  }




  /* Function to perform advanced filter and update table data */
  filterAdvanced() {
    /* a temporary array to store the user selected  */
    let tempArr = [];


    /* Update user selected custom component */
    this.componentPrefill.forEach(el => {
      /* If user has selected the component value will not be empty*/
      if (this.componentListObject[el.component_id].enq_custom_value != "") {
        tempArr.push(this.componentListObject[el.component_id]);
      }
    });


    this.advancedFilterForm.enqCustomLi = tempArr;
    this.instituteData = this.advancedFilterForm;


    this.advancedFilterForm.followUpDate = this.advancedFilterForm.followUpDate == '' ? '' : moment(this.advancedFilterForm.followUpDate).format('YYYY-MM-DD');
    this.advancedFilterForm.enquiry_date = this.advancedFilterForm.enquiry_date == '' ? '' : moment(this.advancedFilterForm.enquiry_date).format('YYYY-MM-DD');
    this.advancedFilterForm.enquireDateFrom = this.advancedFilterForm.enquireDateFrom == '' ? '' : moment(this.advancedFilterForm.enquireDateFrom).format('YYYY-MM-DD');
    this.advancedFilterForm.enquireDateTo = this.advancedFilterForm.enquireDateTo == '' ? '' : moment(this.advancedFilterForm.enquireDateTo).format('YYYY-MM-DD');
    this.advancedFilterForm.updateDate = this.advancedFilterForm.updateDate == '' ? '' : moment(this.advancedFilterForm.updateDate).format('YYYY-MM-DD');
    this.advancedFilterForm.updateDateFrom = this.advancedFilterForm.updateDateFrom == '' ? '' : moment(this.advancedFilterForm.updateDateFrom).format('YYYY-MM-DD');
    this.advancedFilterForm.updateDateTo = this.advancedFilterForm.updateDateTo == '' ? '' : moment(this.advancedFilterForm.updateDateTo).format('YYYY-MM-DD');

    //console.log(moment(this.advancedFilterForm.updateDate).format('YYYY-MM-DD'));
    this.instituteData = this.advancedFilterForm;
    this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
      this.rows = data;
    }).subscribe(
      data => {
        this.sourceEnquiry = new LocalDataSource(this.rows);
        if (this.rows.length != 0) {
          this.totalEnquiry = this.rows[0].totalcount;
          this.indexJSON = [];
          this.setPageSize(this.totalEnquiry);
          this.sourceEnquiry.refresh();
          /* this.advancedFilterForm = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
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
          }; */
          this.closeAdFilter();
        }
        else {
          let alert = {
            type: 'info',
            title: 'No Records Found',
            body: 'We did not find any enquiry for the specified query'
          }
          this.appC.popToast(alert);
          /* this.advancedFilterForm = {
            name: "",
            phone: "",
            email: "",
            enquiry_no: "",
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
          }; */
          this.searchBarData = '';
          //this.searchDatabase();
          this.closeAdFilter();
        }
      },
      err => {
      }
      );
  }




  /* common function to close popups */
  closePopup() {
    this.pops.changeMessage('');
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
    this.loadTableDatatoSource(this.instituteData);
  }




  /* fetch subject when user selects any standard on select menu */
  fetchEnquirySubject() {
    this.prefill.getEnqSubjects(this.advancedFilterForm.standard_id).subscribe(
      data => {
        this.enqSubject = data;
        //console.log(this.enqSubject);
      },
      err => {
        //  console.log(err); 
      }
    );
  }




  /* Fetch next set of data from server and update table */
  fetchNext() {
    if ((this.instituteData.start_index + this.instituteData.batch_size) < this.totalEnquiry) {
      this.instituteData.start_index = this.instituteData.start_index + this.instituteData.batch_size;
      this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
      this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
      this.loadTableDatatoSource(this.instituteData);
    }
  }



  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    if (this.instituteData.start_index > 0) {
      this.instituteData.start_index = this.instituteData.start_index - this.instituteData.batch_size;
      this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
      this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
      this.loadTableDatatoSource(this.instituteData);
    }
  }



  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.displayBatchSize = parseInt(num);
    sessionStorage.setItem('displayBatchSize', num);
    this.instituteData.batch_size = this.displayBatchSize;
    this.instituteData.start_index = 0;
    this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
      this.rows = data;
    }).subscribe(data => {
      this.sourceEnquiry = new LocalDataSource(this.rows);
      this.totalEnquiry = this.rows[0].totalcount;
      this.indexJSON = [];
      this.setPageSize(this.totalEnquiry);
      this.sourceEnquiry.refresh();
    });
  }





  /* Toggle DropDown Menu on Click */
  bulkActionFunction() {
    document.getElementById("bulk-drop").classList.toggle("show");
  }







  validateElementForId(HTMLElement, id: string): boolean {
    if (HTMLElement.id === id) {
      return true;
    }
  }




  /* Function to store the data of Custom Component in to Base64 encoded array string */
  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
    //console.log(this.componentListObject);
  }






  /* Fetch all the enquiries as xls file */
  downloadAllEnquiries() {

    let data = {
      name: "",
      phone: "",
      email: "",
      enquiry_no: "",
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

    this.enquire.fetchAllEnquiryAsXls(data).subscribe(
      res => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('enq_download');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
      },
      err => {

      })
  }




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



  /* Stores data for row user has clicked of selected */
  smsRowSelected(ev) {
    if (ev.isSelected) {
      this.selectedSMS = ev.data;
      this.smsBtnToggle = false;
    }
  }



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
            this.newSmsString.data = '';
            this.enquire.fetchAllSms().subscribe(
              data => {
                this.smsPopSource = new LocalDataSource(data);
              },
              err => {
                let msg = {

                }
              }
            );
          }
        },
        err => { }
      )
    }
  }




  smsStringUpdate(ev) {

    let stringArr = this.newSmsString.data.split('');
    //console.log(stringArr);
    this.newSmsString.length = 0;
    stringArr.forEach(ch => {
      if (ch.charCodeAt(0) <= 127) {
        /* Unicode text detected */
        //console.log(ch.charCodeAt(0));
        this.newSmsString.length = this.newSmsString.length + 1;
      }
      else {
        /* Non unicode detected */
        //console.log(ch.charCodeAt(0));
        this.newSmsString.length = this.newSmsString.length + 1;
      }
    });
  }



  editSms() {
    this.smsBtnToggle = true;
  }



  cancelSmsEdit() {
    this.smsBtnToggle = false;
    this.smsServicesInvoked();
  }



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
      }

      /* Rejected  */
      else if (this.selectedSMS.statusValue == 'Rejected') {

        let msg = {
          type: 'error',
          title: 'Unable To Send SMS',
          body: 'Your sms template has been rejected, kindly contact support'
        }
        this.appC.popToast(msg);

      }

      /* Ok Send SMS */
      else if (this.selectedSMS.statusValue == 'Approved') {

        /* Send Multi SMS */
        if (this.isMultiSms) {
          let userId = [];

          //console.log(this.selectedRowGroup);

          this.selectedRowGroup.forEach(el => {
            //console.log(el);
            userId.push(el.institute_enquiry_id);
          });



          let messageId = [];
          messageId.push((this.selectedSMS.message_id).toString());

          this.sendSmsFormData.baseIds = userId;
          this.sendSmsFormData.messageArray = messageId;

          this.postdata.sendSmsToEnquirer(this.sendSmsFormData).subscribe(
            res => {
              console.log(res);
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
              console.log(res);
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



  setPageSize(totalCount) {
    let pageSize = Math.ceil(totalCount / this.instituteData.batch_size);
    this.maxPageSize = pageSize;
    let index = {
      value: null,
      start_index: null,
      end_index: null
    }
    let start: number = 0;

    for (var i = 1; i <= pageSize; i++) {
      index = {
        value: i,
        start_index: start,
        end_index: start + (this.displayBatchSize - 1)
      }
      this.indexJSON.push(index);
      start = start + this.displayBatchSize;
    }
    //document.getElementById('page1').classList.add('active');
  }



  fectchTableDataByPage(index) {
    this.instituteData.start_index = index.start_index;
    this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
    this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
    sessionStorage.setItem('pageI', index.value);
    this.busy = this.loadTableDatatoSource(this.instituteData);
  }


  convertRow(ev) {
    localStorage.setItem('studentPrefill', JSON.stringify(ev));
    this.router.navigate(['student/add'])
    this.closePopup();
  }


  downloadReceiptPdf() {

    this.enquire.fetchReceiptPdf(this.selectedRow.invoice_no).subscribe(
      res => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'application/pdf' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('reg-pdf-link');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        dwldLink.click();
      },
      err => { }
    )

  }


  onSearch(query: string = '') {

    this.smsPopSource.setFilter(
      [{
        field: 'message',
        search: query
      }], false
    )

  }


  /* Customiized click detection strategy */
  inputClicked() {
    var nodelist = document.querySelectorAll('.form-ctrl');
    [].forEach.call(nodelist, (elm) => {
      elm.addEventListener('blur', function (event) {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    });

    /* var dropdowns = document.getElementsByClassName("bulk-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    } */

  }


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