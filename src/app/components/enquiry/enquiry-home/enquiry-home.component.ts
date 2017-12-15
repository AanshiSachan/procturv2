import {
  Component, OnInit, ViewChild, Input, Output,
  EventEmitter, HostListener, AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef
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
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import { Ng2SmartTableModule, LocalDataSource } from '../../../../assets/imported_modules/ng2-smart-table';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';



@Component({
  selector: 'app-enquiry-home',
  templateUrl: './enquiry-home.component.html',
  styleUrls: ['./enquiry-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiryHomeComponent implements OnInit, OnDestroy {


  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* ====================================Declarations================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */



  /* Variable Declaration */
  optionsModel = []; checkedOpt: any[]; myOptions: IMultiSelectOption[];
  sourceEnquiry: any[] = []; smsPopSource: LocalDataSource; busy: Subscription;
  checkedStatus = []; filtered = []; enqstatus: any[] = []; enqPriority: any[] = [];
  enqFollowType: any[] = []; enqAssignTo: any[] = []; enqStd: any[] = []; enqSubject: any[] = [];
  enqScholarship: any[] = []; enqSub2: any[] = []; paymentMode: any[] = []; commentFormData: any = {};
  today: any = Date.now(); searchBarData: any = null; searchBarDate: any = moment().format('YYYY-MM-DD');
  displayBatchSize: number = 100; incrementFlag: boolean = true; updateFormComments: any = [];
  updateFormCommentsBy: any = []; updateFormCommentsOn: any = []; PageIndex: number = 1;
  maxPageSize: number = 0; totalEnquiry: number = 0; isProfessional: boolean = false;
  isActionDisabled: boolean = false; isMessageAddOpen: boolean = false; isMultiSms: boolean = false;
  smsSelectedRowsLength: number = 0; sizeArr: any[] = [25, 50, 100, 150, 200];
  isAllSelected: boolean = false;
  private customComponents: any[] = [];

  newSmsString = {
    data: "",
    length: 0,
    type: "",
  };

  statusString: any[] = ["0", "3"]; smsSelectedRows: any; smsGroupSelected: any[] = []; selectedOption: any[] = [];

  /* items added on ngOnInit */
  bulkAddItems: MenuItem[];
  indexJSON = [];
  selectedRow: any = {
  };

  currentDirection = 'desc'; selectedRowGroup: any[] = []; componentPrefill: any = [];
  componentListObject: any = {}; emptyCustomComponent: any; componentRenderer: any = []; customComponentResponse: any = [];
  fetchingDataMessage: string = "Loading"; smsBtnToggle: boolean = false;

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

  isConverted: boolean = false; hasReceipt: boolean = false; isadmitted: boolean = false; notClosednAdmitted: boolean = false;
  isClosed: boolean = false; isAssignEnquiry: boolean = false;
  availableSMS: number = 0; smsDataLength: number = 0; isEnquiryAdmin: boolean = false;

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
  };


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


  headerArr: any[] = [
    { id: 'enquiry_no', title: 'Enquiry No.', filter: false, show: true },
    { id: 'enquiry_date', title: 'Enquiry Date', filter: false, show: true },
    { id: 'name', title: 'Name', filter: false, show: true },
    { id: 'phone', title: 'Contact No.', filter: false, show: true },
    { id: 'statusValue', title: 'Status', filter: false, show: true },
    { id: 'priority', title: 'Priority', filter: false, show: true },
    { id: 'follow_type', title: 'Follow type', filter: false, show: true },
    { id: 'followUpDate', title: 'Follow up Date', filter: false, show: true },
    { id: 'actions', title: 'Action', filter: false, show: true },
    { id: 'updateDate', title: 'Update Date', filter: false, show: true },
    { id: 'assigned_name', title: 'Assigned To', filter: false, show: true },
    { id: 'email', title: 'Email', filter: false, show: false },
    { id: 'Gender', title: 'Gender', filter: false, show: false },
    { id: 'standard', title: 'Standard', filter: false, show: false },
    { id: 'subjects', title: 'Subjects', filter: false, show: false }
  ];


  assignMultipleForm: any =
    {
      enqLi: [],/* array of institute enquiry ID */
      assigned_to: "" /* Id of assignee */
    };



  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* ===================== Declaration Fin ===================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */

  constructor(private enquire: FetchenquiryService, private prefill: FetchprefilldataService,
    private router: Router, private logger: Logger, private fb: FormBuilder,
    private pops: PopupHandlerService, private postdata: PostEnquiryDataService,
    private appC: AppComponent, private login: LoginService, private cd: ChangeDetectorRef) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */
  /* =========================================================================== */




  /* OnInit Function */
  ngOnInit() {

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';

    this.isEnquiryAdministrator();

    /* Model for toggle Menu Dropdown */
    this.myOptions = [
      { name: 'Email', id: 'email' },
      { name: 'Gender', id: 'Gender' },
      { name: 'Standard', id: 'standard' },
      { name: 'Subjects', id: 'subjects' }
    ];


    /* Load paginated enquiry data from server */
    this.busy = this.loadTableDatatoSource(this.instituteData);

    /* Fetch prefill data after table data load completes */
    this.FetchEnquiryPrefilledData();


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



    /* Fetch the status of message from  popup handler service */
    this.pops.currentMessage.subscribe(message => {
      if (message == 'sms') {
        this.smsServicesInvoked();
        this.message = message;
        this.smsSelectedRows = this.selectedRow.data;
      }
      else if (message == 'update') {
        this.prefill.fetchCommentsForEnquiry(this.selectedRow.data.institute_enquiry_id).subscribe(res => {
          this.updateFormData.priority = res.priority;
          this.updateFormData.follow_type = res.follow_type;
          this.updateFormData.statusValue = this.selectedRow.data.statusValue;
          this.updateFormData.followUpDate = moment(this.selectedRow.data.followUpDate).format('YYYY-MM-DD');
          this.updateFormComments = res.comments;
          this.updateFormCommentsOn = res.commentedOn;
          this.updateFormCommentsBy = res.commentedBy;
        });
        this.message = message;
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


    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    sessionStorage.setItem('displayBatchSize', this.displayBatchSize.toString());

  }





  ngOnDestroy() {
    this.sourceEnquiry = [];
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




  /* Load Table data with respect to the institute data provided */
  loadTableDatatoSource(obj) {

    this.fetchingDataMessage = "Loading";
    document.getElementById("bulk-drop").classList.add("hide");
    document.getElementById('headerCheckbox').checked = false;
    this.isAllSelected = false;

    this.sourceEnquiry = [];
    this.selectedRow = null;
    this.selectedRowGroup = [];

    /* start index of object passed is zero then create pagination */
    if (obj.start_index == 0) {
      return this.enquire.getAllEnquiry(obj).subscribe(
        data => {
          if (data.length != 0) {
            if (this.indexJSON.length != 0) {
              this.totalEnquiry = data[0].totalcount;
              this.indexJSON = [];
              this.setPageSize(this.totalEnquiry);
              data.forEach(el => {
                let obj = {
                  isSelected: false,
                  show: true,
                  data: el
                }
                this.sourceEnquiry.push(obj);
              });
              this.cd.markForCheck();
              return this.sourceEnquiry;
            }
            else {
              this.totalEnquiry = data[0].totalcount;
              this.indexJSON = [];
              this.setPageSize(this.totalEnquiry);
              data.forEach(el => {
                let obj = {
                  isSelected: false,
                  show: true,
                  data: el
                }
                this.sourceEnquiry.push(obj);
              });
              this.cd.markForCheck();
              return this.sourceEnquiry;
            }
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any enquiry for the specified query'
            }
            this.fetchingDataMessage = "No Record Found";
            this.appC.popToast(alert);
            this.totalEnquiry = data.length;
            this.indexJSON = [];
            this.setPageSize(this.totalEnquiry);
            this.cd.markForCheck();
          }
        });
    }
    else {
      return this.enquire.getAllEnquiry(obj).subscribe(data => {
        if (data.length != 0) {
          if (this.indexJSON.length != 0) {
            data.forEach(el => {
              let obj = {
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceEnquiry.push(obj);
            });
            this.cd.markForCheck();
            return this.sourceEnquiry;
          }
          else {
            data.forEach(el => {
              let obj = {
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceEnquiry.push(obj);
            });
            this.cd.markForCheck();
            return this.sourceEnquiry;
          }
        }
        else {
          let alert = {
            type: 'info',
            title: 'No Records Found',
            body: 'We did not find any enquiry for the specified query'
          }
          this.fetchingDataMessage = "No Record Found";
          this.appC.popToast(alert);
          this.totalEnquiry = data.length;
          this.indexJSON = [];
          this.setPageSize(this.totalEnquiry);
          this.cd.markForCheck();
        }
      });
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
  }







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




  /* if custom component is of type multielect then toggle the visibility of the dropdowm */
  multiselectVisible(elid) {
    let targetid = elid + "multi";
    if (document.getElementById(targetid).classList.contains('hide')) {
      document.getElementById(targetid).classList.remove('hide');
    }
    else {
      document.getElementById(targetid).classList.add('hide');
    }
  }






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
              if (el.selected.length != 0) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else if (el.selected.length == 0) {
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






  /* Function to toggle smart table column on click event */
  toggleOptionChange(opt) {
    this.headerArr = [
      { id: 'enquiry_no', title: 'Enquiry No.', filter: false, show: true },
      { id: 'enquiry_date', title: 'Enquiry Date', filter: false, show: true },
      { id: 'name', title: 'Name', filter: false, show: true },
      { id: 'phone', title: 'Contact No.', filter: false, show: true },
      { id: 'statusValue', title: 'Status', filter: false, show: true },
      { id: 'priority', title: 'Priority', filter: false, show: true },
      { id: 'follow_type', title: 'Follow type', filter: false, show: true },
      { id: 'followUpDate', title: 'Follow up Date', filter: false, show: true },
      { id: 'actions', title: 'Action', filter: false, show: true },
      { id: 'updateDate', title: 'Update Date', filter: false, show: true },
      { id: 'assigned_name', title: 'Assigned To', filter: false, show: true },
      { id: 'email', title: 'Email', filter: false, show: false },
      { id: 'Gender', title: 'Gender', filter: false, show: false },
      { id: 'standard', title: 'Standard', filter: false, show: false },
      { id: 'subjects', title: 'Subjects', filter: false, show: false }
    ];

    this.headerArr.forEach(head => {
      opt.forEach(o => {
        if (head.id == o) {
          if (head.show) {
          }
          else {
            this.selectedOption.push(o);
            head.show = !head.show;
          }
        }
      });
    });
  }





  /* Function to toggle table data on checkbox click */
  statusFilter(checkerObj) {

    //console.log(this.statusString);
    this.searchBarData = '';

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





  /* Function to search data on smart table */
  searchDatabase() {
    this.stats.All.checked = true;
    this.stats.Open.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Admitted.checked = false;
    this.stats.Registered.checked = false;
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
        enquireDateFrom: moment(this.searchBarDate).format('YYYY-MM-DD'),
        enquireDateTo: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
            enquireDateFrom: moment(this.searchBarDate).format('YYYY-MM-DD'),
            enquireDateTo: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
            enquireDateFrom: moment(this.searchBarDate).format('YYYY-MM-DD'),
            enquireDateTo: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
            enquireDateFrom: moment(this.searchBarDate).format('YYYY-MM-DD'),
            enquireDateTo: moment(this.searchBarDate).format('YYYY-MM-DD'),
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
    document.getElementById('adFilterOpen').classList.add('hide');
    document.getElementById('adFilterExitVisible').classList.add('hide')
    document.getElementById('adFilterExit').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
  }




  /* Function to close advanced filter */
  closeAdFilter() {
    document.getElementById('adFilterExitVisible').classList.remove('hide');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('adFilterOpen').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }




  /* Function to handle event on table row click*/
  rowClicked(row) {
    this.selectedRow = row;
    this.isConverted = this.selectedRow.data.status == 12 ? true : false;
    if ((this.selectedRow.data.status == 11) && (this.selectedRow.data.invoice_no != 0)) {
      this.hasReceipt = true;
      localStorage.setItem("institute_enquiry_id", this.selectedRow.data.institute_enquiry_id);
    }
    else {
      if (this.selectedRow.data.status == 0 || this.selectedRow.data.status == 3 || this.selectedRow.data.status == 2) {
        this.notClosednAdmitted = true;
        this.isadmitted = false;
        this.isClosed = false;
        this.hasReceipt = false;
      }
      else if (this.selectedRow.data.status == 11) {
        this.notClosednAdmitted = false;
        this.isadmitted = true;
        this.isClosed = false;
        this.hasReceipt = false;
      }
      else if (this.selectedRow.data.status == 1 || this.selectedRow.data.status == 12) {
        this.notClosednAdmitted = false;
        this.isadmitted = false;
        this.isClosed = true;
        this.hasReceipt = false;
      }
      localStorage.setItem("institute_enquiry_id", this.selectedRow.data.institute_enquiry_id);
    }
  }



  /* checkbox clicked event  */
  rowCheckBoxClick(state, id, no) {
    console.log("rowCheckBoxClick");
    if (state) {
      this.selectedRowGroup.push(this.sourceEnquiry[id]);
    }
    else {
      let index = this.selectedRowGroup.findIndex(i => i.data.enquiry_no == no);
      if (index !== -1) {
        this.selectedRowGroup.splice(index, 1);
      }

    }
    //console.log(this.selectedRowGroup);
  }





  toggleSelectAll(status) {
    /* If User has already selected some rows */
    if (this.selectedRowGroup.length != 0) {
      this.selectedRowGroup = [];
      if (status) {
        this.sourceEnquiry.forEach(el => {
          el.isSelected = true;
          this.selectedRowGroup.push(el);
        });
      }
      else {
        this.sourceEnquiry.forEach(el => {
          el.isSelected = false;
        });
        this.selectedRowGroup = [];
      }
    }
    /* If no rows have been selected */
    else {
      if (status) {
        this.sourceEnquiry.forEach(el => {
          el.isSelected = true;
          this.selectedRowGroup.push(el);
        });
      }
      else {
        this.sourceEnquiry.forEach(el => {
          el.isSelected = false;
        });
        this.selectedRowGroup = [];
      }
    }
  }




  /* Push the updated enquiry to server */
  pushUpdatedEnquiry() {
    this.updateFormData.comment = "Enquiry Updated. " + this.updateFormData.comment;
    this.postdata.updateEnquiryForm(this.selectedRow.data.institute_enquiry_id, this.updateFormData)
      .subscribe(res => {
        let msg = {
          type: 'success',
          title: 'Enquiry Updated',
          body: 'Your enquiry has been successfully submitted'
        }
        this.selectedRow.data.priority = this.updateFormData.priority;
        this.selectedRow.data.follow_type = this.updateFormData.follow_type;
        this.selectedRow.data.statusValue = this.updateFormData.statusValue;
        this.selectedRow.data.followUpDate = this.updateFormData.followUpDate;
        this.selectedRow.data.status = this.enqstatus.forEach(el => { if (el.data_value == this.updateFormData.statusValue) { return el.data_key; } });
        this.selectedRow.data.updateDate = moment().format();
        this.appC.popToast(msg);
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




  openUpdatePopUpCustom(row) {
    this.rowClicked(row);
    this.pops.changeMessage('update');
    this.prefill.fetchCommentsForEnquiry(this.selectedRow.data.institute_enquiry_id).subscribe(res => {
      this.updateFormData.priority = res.priority;
      this.updateFormData.follow_type = res.follow_type;
      this.updateFormData.statusValue = this.selectedRow.data.statusValue;
      this.updateFormData.followUpDate = moment(this.selectedRow.data.followUpDate).format('YYYY-MM-DD');
      this.updateFormComments = res.comments;
      this.updateFormCommentsOn = res.commentedOn;
      this.updateFormCommentsBy = res.commentedBy;
    });
    this.message = 'update';
  }




  /* update the enquiry id for enquiry update pop up */
  updateStatusForEnquiryUpdate(val) {
    this.enqstatus.forEach(el => {
      if (el.data_value == val) {
        this.updateFormData.status = el.data_key;
      }
    });
  }




  /* Delete Enquiry  */
  deleteEnquiry() {
    this.busy = this.postdata.deleteEnquiryById(this.selectedRow.data.institute_enquiry_id).subscribe(
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
    this.registrationForm.institute_enquiry_id = this.selectedRow.data.institute_enquiry_id.toString();
    this.registrationForm.paymentDate = moment(this.registrationForm.paymentDate).format('YYYY-MM-DD');
    this.postdata.updateRegisterationPayment(this.registrationForm).subscribe(
      res => {
        let alert = {
          type: 'success',
          title: 'Registration Fee Updated',
        }
        this.appC.popToast(alert);
        this.selectedRow.data.invoice_no = res.otherDetails.invoice_no;
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

    if ((this.selectedRowGroup != null || this.selectedRowGroup != undefined) && (this.selectedRowGroup.length != 0)) {
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




  /* Peform Delete Operation if access is OK */
  bulkDeleteEnquiries() {

    /* If Admin */
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == '') {

      /* Multi rows selected */
      if (this.selectedRowGroup.length != 0) {
        if (confirm('You are about to delete multiple enquiries')) {
          /* Check if user has selected any enquiry with status 11 or 12 */
          if (this.validateDeletable()) {
            let deleteString: string = '';
            this.selectedRowGroup.forEach(el => {
              deleteString = deleteString + ',' + el.data.institute_enquiry_id;
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
                deleteString = deleteString + ',' + el.data.institute_enquiry_id;
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




  /* Check if enquiry is deletable  */
  validateDeletable() {
    let passed = this.selectedRowGroup.every(isOpenEnquiry);
    function isOpenEnquiry(element, index, array) {
      return (element.data.status == 0);
    }

    return passed;
  }





  /* Bulk Assign popup open */
  bulkAssignEnquiriesOpen() {
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





  /* Bulk Assign popup close */
  bulkAssignEnquiriesClose() {
    this.isAssignEnquiry = false;
    this.assignMultipleForm = {
      enqLi: [],/* array of institute enquiry ID */
      assigned_to: "" /* Id of assignee */
    }
  }





  /* Bulk Assign popup operation */
  bulkAssignEnquiries() {

    let assigneeArr: any[] = [];
    this.selectedRowGroup.forEach(el => {
      assigneeArr.push(el.data.institute_enquiry_id);
      el.data.assigned_to = this.assignMultipleForm.assigned_to;
      el.data.assigned_name = this.getAssigneeName(this.assignMultipleForm.assigned_to);
    });
    this.assignMultipleForm.enqLi = assigneeArr;
    this.postdata.setEnquiryAssignee(this.assignMultipleForm).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Enquiries Assigned',
        }
        this.appC.popToast(msg);
        this.bulkAssignEnquiriesClose();
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



  /* Function to perform advanced filter and update table data */
  filterAdvanced() {

    this.stats.All.checked = true;
    this.stats.Open.checked = false;
    this.stats.Registered.checked = false;
    this.stats.Admitted.checked = false;
    this.stats.Registered.checked = false;
    this.statusString = [];
    document.getElementById('headerCheckbox').checked = false;

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

    this.busy = this.enquire.getAllEnquiry(this.advancedFilterForm).subscribe(
      data => {
        data.forEach(el => {
          let obj = {
            isSelected: false,
            show: true,
            data: el
          }
          this.sourceEnquiry.push(obj);
          this.cd.markForCheck();
          return this.sourceEnquiry;
        });
        /* pagination defination here */
        if (this.sourceEnquiry.length != 0) {
          this.totalEnquiry = data[0].totalcount;
          this.indexJSON = [];
          this.setPageSize(this.totalEnquiry);
          this.cd.markForCheck();
          this.closeAdFilter();
        }
        else {
          let alert = {
            type: 'info',
            title: 'No Records Found',
            body: 'We did not find any enquiry for the specified query'
          }
          this.fetchingDataMessage = "No Record Found";
          this.appC.popToast(alert);
          this.totalEnquiry = 0;
          this.indexJSON = [];
          this.setPageSize(this.totalEnquiry);
          this.cd.markForCheck();
          this.closeAdFilter();
        }
      },
      err => {
      }
    );
  }




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
      enqCustomLi: null
    };

    this.customComponents.forEach(el => {
      el.value = '';
    });
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
  }





  /* fetch subject when user selects any standard on select menu */
  fetchEnquirySubject() {
    if (this.advancedFilterForm.standard_id != null || this.advancedFilterForm.standard_id != '') {
      this.prefill.getEnqSubjects(this.advancedFilterForm.standard_id).subscribe(
        data => {
          this.enqSubject = data;
        }
      );
    }
    else {
      this.enqSubject = [];
    }
  }





  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.PageIndex++;
    this.fectchTableDataByPage(this.PageIndex);
    /* console.log(this.PageIndex);
    let startindex = this.displayBatchSize*(this.PageIndex-1);
    console.log(startindex);
    this.instituteData.start_index = startindex;
    if ((this.instituteData.start_index + this.instituteData.batch_size) < this.totalEnquiry) {
      this.instituteData.start_index = this.instituteData.start_index + this.instituteData.batch_size;
      this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
      this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
      this.instituteData.filtered_statuses = this.statusString.join(',');
      this.busy = this.loadTableDatatoSource(this.instituteData);
    } */
  }





  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.PageIndex--;
    this.fectchTableDataByPage(this.PageIndex);
    /* console.log(this.PageIndex);
    let startindex = this.displayBatchSize*(this.PageIndex-1);
    console.log(startindex);
    this.instituteData.start_index = startindex;
    if (this.instituteData.start_index > 0) {
      //this.instituteData.start_index = this.instituteData.start_index - this.instituteData.batch_size;
      this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
      this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
      this.instituteData.filtered_statuses = this.statusString.join(',');
      this.busy = this.loadTableDatatoSource(this.instituteData);
    } */
  }




  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    //console.log(startindex);
    this.instituteData.start_index = startindex;
    this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
    this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
    this.instituteData.filtered_statuses = this.statusString.join(',');
    this.busy = this.loadTableDatatoSource(this.instituteData);
  }




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





  /* Toggle DropDown Menu on Click */
  bulkActionFunctionOpen() {
    document.getElementById("bulk-drop").classList.remove("hide");
  }


  bulkActionFunctionClose() {
    document.getElementById("bulk-drop").classList.add("hide");
  }



  /* Function to store the data of Custom Component in to Base64 encoded array string */
  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
  }



  /* Fetch all the enquiries as xls file */
  downloadAllEnquiries() {

    this.busy = this.enquire.fetchAllEnquiryAsXls(this.instituteData).subscribe(
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
      }
    )
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
            this.newSmsString.length = 0;
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
      }
      else {
        /* Non unicode detected */
        //console.log(ch.charCodeAt(0));
        this.newSmsString.length = this.newSmsString.length + 1;
      }
    });
  }






  /* SMS button visibility */
  editSms() {
    this.smsBtnToggle = true;
  }






  /* Sms edit mode cancel */
  cancelSmsEdit() {
    this.smsBtnToggle = false;
    this.smsServicesInvoked();
  }





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
            userId.push(el.data.institute_enquiry_id);
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
          userId.push((this.selectedRow.data.institute_enquiry_id).toString());
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






  /* Convert enquiry to student */
  convertRow(ev) {
    localStorage.setItem('studentPrefill', JSON.stringify(ev));
    this.router.navigate(['student/add'])
    this.closePopup();
  }





  /* Download Receipt API */
  downloadReceiptPdf() {

    this.enquire.fetchReceiptPdf(this.selectedRow.data.invoice_no).subscribe(
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





  /* SMS search */
  onSearch(query: string = '') {

    this.smsPopSource.setFilter(
      [{
        field: 'message',
        search: query
      }], false
    )

  }





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




  /*  */
  getFollowUpColor(status): string {
    if (status != '') {
      if (moment(status).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
        return 'black';
      }
      else {
        return 'red';
      }
    }
    else {
      return 'black';
    }

  }



  /*  */
  sortTableById(id) {
    /* Custom server sided sorting */
    this.instituteData.sorted_by = id;
    this.instituteData.order_by = this.currentDirection == 'asc' ? 'desc' : 'asc';
    this.instituteData.filtered_statuses = this.statusString.join(',');
    this.busy = this.loadTableDatatoSource(this.instituteData);
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
