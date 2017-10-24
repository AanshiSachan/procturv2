import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { ActionButtonComponent } from './action-button.component';
import { instituteInfo } from '../../../model/instituteinfo';
import { updateEnquiryForm } from '../../../model/update-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';


/* Third party imports */
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from '../../../../ng2-smart-table';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';


@Component({
  selector: 'app-enquiry-manage',
  templateUrl: './enquiry-manage.component.html',
  styleUrls: ['./enquiry-manage.component.scss']
})

export class EnquiryManageComponent implements OnInit {

  /* Variable Declaration */

  private AdFilter: boolean = false;

  private rows: any = [];

  private optionsModel = [];

  private checkedOpt: any[];

  private myOptions: IMultiSelectOption[];

  private source: LocalDataSource;

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

  today: number = Date.now();

  date: Date;

  searchBarData: any = null;

  displayBatchSize: number = 5;

  incrementFlag: boolean = true;

  updateFormComments: any = [];

  updateFormCommentsBy: any = [];

  updateFormCommentsOn: any = [];

  PageIndex: number = 0;

  maxPageSize: number = 0;

  pageArray: any = [];

  totalEnquiry: number = 0;

  isProfessional: boolean = false;

  isActionDisabled: boolean = false;

  private selectedRow:any;
  private selectedRowGroup:any;

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
    //onLoad: 0,
    // filtered_statuses: ""
  };


  /* Model for Enquiry Update Popup Form */
  updateFormData: updateEnquiryForm = {
    comment: "",
    status: "",
    institution_id: "100123",
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


  /* Variable to handdle popups */
  message: string = '';


  /* Variable to store JSON.stringify value and update service for multi-component communication */
  selectedRowJson: string = '';




  /* Default Settings for ng2-smart-table */
  settings = {
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


  /* Form for advanced filter  */
  advancedFilterForm: instituteInfo = {
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
    //onLoad: 0,
    // filtered_statuses: ""
  };


  /* Clone for ng2-smart-table setting that can be updated and assigned on toggle */
  settingUpdater = {
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


  /* ===========================  ====================================== */
  constructor(private enquire: FetchenquiryService, private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private fb: FormBuilder, private pops: PopupHandlerService, private postdata: PostEnquiryDataService) { }


  /* OnInit Function */
  ngOnInit() {

    /* Model for toggle Menu Dropdown */
    this.myOptions = [{ name: 'Enquiry ID', id: 'institute_enquiry_id' }, { name: 'Institute ID', id: 'institution_id' }, { name: 'Enquiry No', id: 'enquiry_no' }, { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' }, { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' }, { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' }, { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' }, { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' }, { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' }, { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }];

    /* If show attribute on table settings, set the checked value on dropdown menu  */
    this.myOptions.forEach(el => {
      if (this.settings.columns[el.id].show) {
        this.optionsModel.push(el.id);
      }
    })

    /* Load paginated enquiry data from server */
    this.busy = this.loadTableDatatoSource(this.instituteData);

    //this.logger.log(this.myOptions);

    /* Fetch prefill data after table data load completes */
    this.FetchEnquiryPrefilledData();

    /* Fetch the status of message from  popup handler service */
    this.pops.currentMessage.subscribe(message => this.message = message);
    this.pops.currentRowJson.subscribe(data => this.selectedRowJson = data);
    this.pops.currentActionValue.subscribe(data => this.isActionDisabled = data);
  }



  /* Function to convert all select-option tag to ul-li 
  convertSelectToUl() {

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




  /* Load Table data with respect to the institute data provided */
  loadTableDatatoSource(obj) {

    /* If start_index is zero then fetch table data and set page size for paginator */
    if (obj.start_index === 0) {
      document.getElementById('previous').classList.add('hide');
      return this.enquire.getAllEnquiry(obj).map(data => {
        this.rows = data;
      }).subscribe(data => {
        this.source = new LocalDataSource(this.rows);
        this.totalEnquiry = this.rows[0].totalcount;
        this.setPageSize(this.rows[0].totalcount);
        this.pageArray = Array(this.maxPageSize).fill(1).map((x, i) => i);
        //console.log(this.pageArray);
        //console.log(this.maxPageSize);
      });
    }
    /* simply returns data obtained from server */
    else {
      return this.enquire.getAllEnquiry(obj).map(data => {
        this.rows = data;
      }).subscribe(data => {
        this.source = new LocalDataSource(this.rows);
      });
    }
  }



  /* Set Max Page Size for Paginator */
  setPageSize(num) {
    this.maxPageSize = Math.round(num / this.instituteData.batch_size);
  }

  /* Function to fetch prefill data for advanced filter */
  FetchEnquiryPrefilledData() {
    /* Status */
    this.prefill.getEnqStatus().subscribe(
      data => { this.enqstatus = data; },
      err => { console.log(err); }
    );
    /* Priority */
    this.prefill.getEnqPriority().subscribe(
      data => { this.enqPriority = data; },
      err => { console.log(err); }
    );
    /* FollowUp Type */
    this.prefill.getFollowupType().subscribe(
      data => { this.enqFollowType = data },
      err => { console.log(err); }
    );
    /* Assign To */
    this.prefill.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; },
      err => { console.log(err); }
    );
    /* Scholarship */
    this.prefill.getScholarPrefillData().subscribe(
      data => {
        //console.log(data);
        data.forEach(el => {
          if (el.label == "Scholarship") {
            //console.log(el);
            this.enqScholarship = el.prefilled_data.split(',');
          }
          else if (el.label == "Subject2") {
            this.enqSub2 = el.prefilled_data.split(',');
          }
        })
      },
      err => { console.log(err); }
    );
    /* Standard */
    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; },
      err => { console.log(err); }
    );
    /* Payment Modes */
    this.prefill.fetchPaymentModes().subscribe(
      data => { this.paymentMode = data; },
      err => { alert("error loading payment modes"); }
    )
  }


  /* Function to toggle smart table column on click event */
  toggleOptionChange(ev) {

    this.settings = {
      selectMode: 'multi', mode: 'external', hideSubHeader: false,
      actions: { add: false, edit: false, delete: false, columnTitle: '', },
      columns: {
        enquiry_no: { title: 'Enquiry No.', filter: false, show: false }, enquiry_date: { title: 'Enquiry Date', filter: false, show: false }, name: { title: 'Student Name', filter: false, show: false }, phone: { title: 'Contact No.', filter: false, show: false }, priority: { title: 'Priority', filter: false, show: false }, follow_type: { title: 'Follow type', filter: false, show: false }, followUpDate: { title: 'Follow up Date', filter: false, show: false }, assigned_name: { title: 'Assigned To', filter: false, show: false }, standard: { title: 'Standard', filter: false, show: false }, subjects: { title: 'Subjects', filter: false, show: false }, action: { title: 'Action', filter: false, type: 'custom', renderComponent: ActionButtonComponent }, updateDate: { title: 'Update Date', filter: false, show: false }, statusValue: { title: 'Status Value', filter: false, show: false }, enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false }, followUpTime: { title: 'Follow up Time', filter: false, show: false }, followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false }, filtered_statuses: { title: 'Filtered Status', filter: false, show: false }, email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false }, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false }, name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false }, filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
      },
      pager: {
        display: false
      },
    };
    this.settingUpdater = Object.assign({}, this.settings);
    this.optionsModel.forEach(el => {
      this.settingUpdater.columns[el].show = true;
    })
    this.settings = Object.assign({}, this.settingUpdater);
  }


  /* Function to toggle table data on checkbox click */
  statusFilter(checkerObj) {
    if (this.stats.Open.checked === true || this.stats.Registered.checked === true || this.stats.Admitted.checked === true || this.stats.Inactive.checked === true) {
      this.stats.All.checked = false;
      this.stats.All.disabled = true;
      if (checkerObj.checked === true) {
        this.checkedStatus.push(checkerObj.prop);
        let temp2 = [];
        let temp = [];
        let arr = [];
        this.checkedStatus.forEach(el => {
          temp2 = this.rows.filter(row => {
            return row.statusValue === el
          });
          temp = temp2;
          arr = arr.concat(temp);
        });
        this.source = new LocalDataSource(arr);
        console.log(arr);
      }
      else if (checkerObj.checked === false) {
        var index = this.checkedStatus.indexOf(checkerObj.prop);
        if (index > -1) {
          this.checkedStatus.splice(index, 1);
        }
        let temp2 = [];
        let temp = [];
        let arr = [];
        this.checkedStatus.forEach(el => {
          temp2 = this.rows.filter(row => {
            return row.statusValue === el
          });
          temp = temp2;
          arr = arr.concat(temp);
        });
        this.source = new LocalDataSource(arr);
        console.log(arr);
      }
    }
    else if (this.stats.Open.checked === false && this.stats.Registered.checked === false && this.stats.Admitted.checked === false && this.stats.Inactive.checked === false) {
      this.stats.All.disabled = false;
      this.stats.All.checked = true;
      this.checkedStatus = [];
      console.log("array emptied, now refresh data source");
      this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
        this.rows = data;
      }).subscribe(data => {
        this.source = new LocalDataSource(this.rows);
        this.source.refresh();
      })
    }
  }



  /* Function to search data on smart table */
  searchDatabase() {
    if (this.searchBarData === "" || this.searchBarData === " " || this.searchBarData === null) {
      alert("Please enter a valid input");
      this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
        this.rows = data;
      }).subscribe(data => {
        this.source = new LocalDataSource(this.rows);
        this.source.refresh();
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
          };
          tempFormData.name = this.searchBarData
          this.busy = this.enquire.getAllEnquiry(tempFormData).map(data => {
            this.rows = data;
          }).subscribe(data => {
            this.source = new LocalDataSource(this.rows);
            this.source.refresh();
          });
        }
        else {
          alert("please enter a valid name");
        }
      }
      /* Number detected */
      else {
        if (this.validateNumber(this.searchBarData) + "not valid") {
          let tempFormData = {
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
          };
          tempFormData.phone = this.searchBarData
          this.busy = this.enquire.getAllEnquiry(tempFormData).map(data => {
            this.rows = data;
          }).subscribe(data => {
            this.source = new LocalDataSource(this.rows);
            this.source.refresh();
          });
        }
        else {
          alert("please enter a valid number");
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
    if (this.AdFilter === false) {
      this.AdFilter = true;
      this.logger.group("Advanced filter opened");
      this.logger.log(this.enqstatus);
      this.logger.log(this.enqPriority);
      this.logger.log(this.enqAssignTo);
      this.logger.log(this.enqFollowType);
      this.logger.log(this.enqScholarship);
      this.logger.log(this.enqStd);
      this.logger.groupEnd();
      //this.convertSelectToUl();
    }
    else {
      this.AdFilter = false;
    }
  }


  /* Function to close advanced filter */
  closeAdFilter() {
    this.AdFilter = false;
  }


  /* Function to handle event on table row click*/
  rowClicked(ev) {


    /* If all records are not selected then check for true/false status */
    if (ev.data != null) {
      /* If true, that is multiple option have been checked but not all */
      if (ev.isSelected) {
        let allSelected = ev.selected;
        let currentSelected = ev.data;
        this.selectedRow = currentSelected;
        this.selectedRowGroup = allSelected;
        console.log(this.selectedRow);
        console.log("all selected Rows");
        console.log(this.selectedRowGroup);
        this.pops.changeRowData(JSON.stringify(this.selectedRow));
        this.prefill.fetchCommentsForEnquiry(this.selectedRow.institute_enquiry_id).subscribe(res => {
          this.updateFormComments = res.comments;
          this.updateFormCommentsOn = res.commentedOn;
          this.updateFormCommentsBy = res.commentedBy;
        });
        
      }
      /* If false, that is only a single input has been selected */
      else {
        console.log(ev);
        this.selectedRow = ev.data;
        this.pops.changeRowData(JSON.stringify(this.selectedRow));
        this.prefill.fetchCommentsForEnquiry(this.selectedRow.institute_enquiry_id).subscribe(res => {
          this.updateFormComments = res.comments;
          this.updateFormCommentsOn = res.commentedOn;
          this.updateFormCommentsBy = res.commentedBy;
        });
      }
    }
    /* All records in the page have been selected */
    else {
      console.log(ev);
      this.selectedRowGroup = ev.selected;
    }
  }


  /* Push the updated enquiry to server */
  pushUpdatedEnquiry() {
    this.updateFormData.priority = this.selectedRow.statusValue;
    this.updateFormData.follow_type = this.selectedRow.follow_type;
    this.updateFormData.status = this.selectedRow.status.toString();
    this.updateFormData.followUpDate = moment(this.selectedRow.followUpDate).format('YYYY-MM-DD');
    this.updateFormData.comment = "Enquiry Updated. " + this.updateFormData.comment;
    console.log(this.updateFormData);
    this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData).subscribe(res => {
      alert('data updated' + res);
      this.closePopup();
    })
  }


  /* Delete Enquiry  */
  DeleteEnquiry() {
    console.log(this.selectedRow);
    this.postdata.deleteEnquiryById(this.selectedRow.institute_enquiry_id).subscribe(
      res => { alert("Enquiry Has been Deleted"); this.closePopup(); this.busy = this.loadTableDatatoSource(this.instituteData); },
      err => { alert("admitted/converted/registered enquiry cannot be deleted" + err.message); this.closePopup(); this.busy = this.loadTableDatatoSource(this.instituteData); }
    )
  }


  /* Make Registration Payment Data update */
  registerPayment() {
    this.registrationForm.institute_enquiry_id = this.selectedRow.institute_enquiry_id.toString();
    this.postdata.updateRegisterationPayment(this.registrationForm).subscribe(
      res => { alert("registration added" + res) },
      err => { alert("err" + err) }
    );
  }



  /* Function to perform advanced filter and update table data */
  filterAdvanced() {
    console.log(this.advancedFilterForm);
    this.busy = this.enquire.getAllEnquiry(this.advancedFilterForm).map(data => {
      this.rows = data;
    }).subscribe(data => {
      this.source = new LocalDataSource(this.rows);
      this.source.refresh();
    });
  }



  /* common function to close popups */
  closePopup() {
    this.pops.changeMessage('');
  }



  /* fetch subject when user selects any standard on select menu */
  fetchEnquirySubject() {
    this.prefill.getEnqSubjects(this.advancedFilterForm.standard_id).subscribe(
      data => {
        this.enqSubject = data;
        console.log(this.enqSubject);
      },
      err => { console.log(err); }
    );
  }

  /* Fetch next set of data from server and update table */
  fetchNext() {

    /* Fetch Next Set of information only when start index is greater than or equal to zero */
    if (this.instituteData.start_index >= 0) {

      this.instituteData.start_index = this.incrementStartIndex();
      console.log(this.instituteData.start_index);
      this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
        this.rows = data;
      }).subscribe(data => {
        if (this.rows.length > 0) {
          this.source = new LocalDataSource(this.rows);
          document.getElementById('previous').classList.remove('hide');
        }
        else {
          document.getElementById('next').classList.add('hide');
          this.incrementFlag = false;
        }
      });
    }
  }




  incrementStartIndex() {
    if (this.incrementFlag) {
      return this.instituteData.start_index + this.instituteData.batch_size + 1;
    }
    else {
      return this.instituteData.start_index;
    }
  }



  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    if (this.instituteData.start_index > this.instituteData.batch_size) {
      this.incrementFlag = true;
      document.getElementById('next').classList.remove('hide');
      this.instituteData.start_index = this.instituteData.start_index - this.instituteData.batch_size - 1;
      this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
        this.rows = data;
      }).subscribe(data => {
        this.source = new LocalDataSource(this.rows);
      });
    }
    else {
      document.getElementById('previous').classList.remove('hide');
    }
  }



  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.displayBatchSize = parseInt(num);
    this.instituteData.batch_size = this.displayBatchSize;
    this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
      this.rows = data;
    }).subscribe(data => {
      this.source = new LocalDataSource(this.rows);
      this.source.refresh();
    });
  }




  /* Fetch Table Data as per Page Number */
  fetchDataByPage(pid) {
    console.log(pid);
  }


  /* Toggle DropDown Menu on Click */
  bulkActionFunction() {
    document.getElementById("bulk-drop").classList.toggle("show");
  }



  // Function to close the open menu if the user clicks outside of them
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    /* Hide Bulk-action dropdown on click outside button */
    if (!this.validateElementForId(event.target, "bulk-action")) {
      var dropdowns = document.getElementsByClassName("bulk-dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }

    /* Future Purpose */
  }


  validateElementForId(HTMLElement, id: string): boolean {
    if (HTMLElement.id === id) {
      return true;
    }
  }

}
