import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';

import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';

import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { ActionButtonComponent } from './action-button.component';
import { instituteInfo } from '../../../model/instituteinfo';
import { FetchenquiryService } from '../../../services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PopupHandlerService } from '../../../services/popup-handler.service';


@Component({
  selector: 'app-enquiry-manage',
  templateUrl: './enquiry-manage.component.html',
  styleUrls: ['./enquiry-manage.component.scss']
})

export class EnquiryManageComponent implements OnInit{

  AdFilter: boolean;
  rows: any = [];
  optionsModel = [];
  checkedOpt: any[];
  myOptions: IMultiSelectOption[];
  source: LocalDataSource;
  busy: Subscription;
  checkedStatus = [];
  filtered = [];
  enqstatus: any = [];
  enqPriority: any = [];
  enqFollowType: any = [];
  enqAssignTo: any = [];
  enqStd: any = [];
  enqSubject: any = [];
  enqScholarship: any = [];
  enqSub2: any = [];
  adFilterForm: FormGroup;
  instituteData: instituteInfo = {
    institute_id: 100123, function_type: "manageSearchEnquiries", username: "31469|0",
    password: "admin@123", onLoad: 0, name: "", phone: "",
    email: "", enquiry_no: "", priority: "", filtered_statuses: "", follow_type: "",
    followUpDate: moment().format('YYYY-MM-DD'), enquiry_date: "", assigned_to: -1, standard_id: -1, subject_id: -1, is_recent: "Y",
    filtered_slots: "", isDashbord: "", enquireDateFrom: "", enquireDateTo: "",
    updateDate: "", updateDateFrom: "", updateDateTo: "",
    pageNo: 1, sizeLimit: 100,
  };
  today: number = Date.now();
  date: Date;
  stats = {
    All: { value: 'All', prop: 'All', checked: true, disabled: false },
    Open: { value: 'Open', prop: 'Open', checked: false, disabled: false },
    Registered: { value: 'Registered', prop: 'In Progress', checked: false, disabled: false },
    Admitted: { value: 'Admitted', prop: 'Student Admitted', checked: false, disabled: false },
    Inactive: { value: 'Inactive', prop: 'Converted', checked: false, disabled: false },
  };
  newItem = {
    EndTime: null,
  };
  message: string = '';
  rowData: any;
  settings = {
    mode: 'external', hideSubHeader: false,
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
      display: true,
      perPage: 10,
    }, 
  };
  advancedFilterForm: instituteInfo = {
    institute_id: 100123, function_type: "manageSearchEnquiries", username: "31469|0",
    password: "admin@123", onLoad: 0, name: "", phone: "",
    email: "", enquiry_no: "", priority: "", filtered_statuses: "", follow_type: "",
    followUpDate: moment().format('YYYY-MM-DD'), enquiry_date: "", assigned_to: -1, standard_id: -1, subject_id: -1, is_recent: "Y",
    filtered_slots: "", isDashbord: "", enquireDateFrom: "", enquireDateTo: "",
    updateDate: "", updateDateFrom: "", updateDateTo: "",
    pageNo: 1, sizeLimit: 100,
  };
  settingUpdater = {
    mode: 'external', hideSubHeader: false,
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
      display: true,
      perPage: 10,
    },
  };
  constructor(private enquire: FetchenquiryService, private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private fb: FormBuilder, private pops: PopupHandlerService) {
    this.AdFilter = false;
  }
  ngOnInit() {
    this.logger.group("ngOnInit Performed");
    this.logger.log("column static data loaded");
    this.myOptions = [{ name: 'Enquiry ID', id: 'institute_enquiry_id' }, { name: 'Institute ID', id: 'institution_id' }, { name: 'Enquiry No', id: 'enquiry_no' }, { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' }, { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' }, { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' }, { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' }, { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' }, { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' }, { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }];
    this.myOptions.forEach(el => {
      if (this.settings.columns[el.id].show) {
        this.optionsModel.push(el.id);
      }
    })
    this.busy = this.enquire.getAllEnquiry(this.instituteData).map(data => {
      this.rows = data;
    }).subscribe(data => {
      this.source = new LocalDataSource(this.rows);
      this.source.refresh();
    });

    this.logger.log(this.myOptions);
    this.FetchEnquiryPrefilledData();
    this.logger.log("Prefill data loaded, added data on filter open");
    this.logger.groupEnd();

    this.pops.currentMessage.subscribe(message => this.message = message);
  }
  FetchEnquiryPrefilledData() {
    this.prefill.getEnqStatus().subscribe(
      data => { this.enqstatus = data; },
      err => { console.log(err); }
    );
    this.prefill.getEnqPriority().subscribe(
      data => { this.enqPriority = data; },
      err => { console.log(err); }
    );
    this.prefill.getFollowupType().subscribe(
      data => { this.enqFollowType = data },
      err => { console.log(err); }
    );
    this.prefill.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; },
      err => { console.log(err); }
    );
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
    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; },
      err => { console.log(err); }
    );
  }
  toggleOptionChange(ev) {
    //console.log(ev);
    //console.log(this.optionsModel);
    this.settings = {
      mode: 'external', hideSubHeader: false,
      actions: { add: false, edit: false, delete: false, columnTitle: '', },
      columns: {
        enquiry_no: { title: 'Enquiry No.', filter: false, show: false }, enquiry_date: { title: 'Enquiry Date', filter: false, show: false }, name: { title: 'Student Name', filter: false, show: false }, phone: { title: 'Contact No.', filter: false, show: false }, priority: { title: 'Priority', filter: false, show: false }, follow_type: { title: 'Follow type', filter: false, show: false }, followUpDate: { title: 'Follow up Date', filter: false, show: false }, assigned_name: { title: 'Assigned To', filter: false, show: false }, standard: { title: 'Standard', filter: false, show: false }, subjects: { title: 'Subjects', filter: false, show: false }, action: { title: 'Action', filter: false, type: 'custom', renderComponent: ActionButtonComponent }, updateDate: { title: 'Update Date', filter: false, show: false }, statusValue: { title: 'Status Value', filter: false, show: false }, enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false }, followUpTime: { title: 'Follow up Time', filter: false, show: false }, followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false }, filtered_statuses: { title: 'Filtered Status', filter: false, show: false }, email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false }, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false }, name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false }, filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
      },
      pager: {
        display: true,
        perPage: 10,
      },
    };
    this.settingUpdater = Object.assign({}, this.settings);
    this.optionsModel.forEach(el => {
      this.settingUpdater.columns[el].show = true;
    })
    this.settings = Object.assign({}, this.settingUpdater);
  }
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
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn dropdown-button',
    fixedTitle: true,
    dynamicTitleMaxItems: 0,
    displayAllSelectedText: false
  };
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
  onSearch(query: string = '') {
    let searchData = this.source;
    if (query == '' || query == ' ' || query == null || query == undefined) {
      this.source = searchData;
    }
    else {
      searchData.setFilter([
        { field: 'name', search: query }, { field: 'phone', search: query }
      ], false);
    }
  }
  openAdFilter() {
    if(this.AdFilter === false){
      this.AdFilter = true;
      this.logger.group("Advanced filter opened");
      this.logger.log(this.enqstatus);
      this.logger.log(this.enqPriority);
      this.logger.log(this.enqAssignTo);
      this.logger.log(this.enqFollowType);
      this.logger.log(this.enqScholarship);
      this.logger.log(this.enqStd);
      this.logger.groupEnd();
    }
    else{
      this.AdFilter = false;
    }
  }
  closeAdFilter() {
    this.AdFilter = false;
  }
  refreshSource() {
    this.source.refresh();
    this.optionsModel = [];
    this.settings = {
      mode: 'external', hideSubHeader: false,
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
        display: true,
        perPage: 10,
      },
    };
    this.settingUpdater = Object.assign({}, this.settings);
  }
  onCreate(event) {
  }
  onDelete(event) {
  }
  onSave(event) {
  }
  rowClicked(rowD){
    this.rowData = rowD.data;
   // console.log(this.rowData);
  }
  filterAdvanced(){
    console.log(this.advancedFilterForm);
    this.busy = this.enquire.getAllEnquiry(this.advancedFilterForm).map(data => {
      this.rows = data;
    }).subscribe(data => {
      this.source = new LocalDataSource(this.rows);
      this.source.refresh();
    });
  }
  closePopup(){
    this.pops.changeMessage('');
  }
  fetchEnquirySubject(){
    this.prefill.getEnqSubjects(this.advancedFilterForm.standard_id).subscribe(
      data => { 
        this.enqSubject = data;
        console.log(this.enqSubject);
      },
      err => { console.log(err); }
    );
  }
}
