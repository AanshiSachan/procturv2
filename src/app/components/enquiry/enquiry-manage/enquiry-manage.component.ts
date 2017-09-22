import { Component, OnInit, ViewChild } from '@angular/core';
import { FetchenquiryService } from '../../../services/fetchenquiry.service';
import { Observable } from 'rxjs/Rx';
import { EnquiryCampaign } from '../../../model/enquirycampaign';
import 'rxjs/Rx';
import {Subscription} from 'rxjs';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import {MdDialog, MdDialogRef} from '@angular/material';
import {MdSnackBar} from '@angular/material';
import { CustomAddEnquiryComponent } from '../../custom/custom-add-enquiry/custom-add-enquiry.component';
import { CustomEditEnquiryComponent } from '../../custom/custom-edit-enquiry/custom-edit-enquiry.component';
import { ActionButtonComponent } from './action-button.component';
import { Router } from '@angular/router';
declare var require: any;
import { Logger } from '@nsalaun/ng-logger';
import { instituteInfo } from '../../../model/instituteinfo';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enquiry-manage',
  templateUrl: './enquiry-manage.component.html',
  styleUrls: ['./enquiry-manage.component.scss']
})

export class EnquiryManageComponent implements OnInit {

  AdFilter:boolean; rows: any = []; optionsModel = []; checkedOpt: any[]; myOptions: IMultiSelectOption[]; source: LocalDataSource; gridSelected:any; 
  busy: Subscription; selectedCol = []; check: boolean = true; disable: boolean = true; checkedStatus =[]; filtered = [];
  enqstatus: any = []; enqPriority: any = []; enqFollowType: any = []; enqAssignTo: any = []; enqStd: any = []; enqSub: any = []; enqScholarship: any = []; enqSub2: any = [];
  updateDate: any; adFilterForm: FormGroup; 

  formData: instituteInfo = {
    institute_id: 100123, 
    function_type: "manageSearchEnquiries", 
    username: "31469|0",
    password: "admin@123", 
    onLoad: 0, 
    name: "", 
    phone: "", 
    email: "", 
    enquiry_no: "", 
    priority: "", 
    filtered_statuses: "", 
    follow_type: "", 
    followUpDate: moment().format('YYYY-MM-DD'), 
    enquiry_date: "", 
    assigned_to: -1, 
    standard_id: -1, 
    subject_id: -1, 
    is_recent: "Y",
    filtered_slots: "", 
    isDashbord: "", 
    enquireDateFrom: null, 
    enquireDateTo: null,
    updateDate: null, 
    updateDateFrom: "", 
    updateDateTo: "", 
    pageNo: 1, 
    sizeLimit: 100,
  }

  stats = {
    All :       {value: 'All', prop: 'All', checked: true, disabled: false},
    Open :      {value: 'Open', prop: 'Open', checked: false, disabled: false}, 
    Registered: {value: 'Registered', prop: 'In Progress', checked: false, disabled: false}, 
    Admitted:   {value: 'Admitted', prop: 'Student Admitted', checked: false, disabled: false}, 
    Inactive :  {value: 'Inactive', prop: 'Converted', checked: false, disabled: false},
  };

  settings = {
    mode: 'external', hideSubHeader: false, selectMode: 'multi',
    actions: { add: false, edit: false, delete: false, columnTitle: '',},
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
      enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false },followUpTime: { title: 'Follow up Time', filter: false, show: false },followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false },filtered_statuses: { title: 'Filtered Status', filter: false, show: false },email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false}, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false },  name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false },  filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
      },
    pager: {
      display: true,
      perPage: 5,
    },
  };

  settingUpdater = {
    mode: 'external', hideSubHeader: false, selectMode: 'multi',
    actions: { add: false, edit: false, delete: false, columnTitle: '',},
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
      enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false },followUpTime: { title: 'Follow up Time', filter: false, show: false },followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false },filtered_statuses: { title: 'Filtered Status', filter: false, show: false },email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false}, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false },  name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false },  filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
    },
    pager: {
      display: true,
      perPage: 5,
    },
  };

  constructor(private enquire: FetchenquiryService, private router: Router, private logger: Logger, private adfilterFB: FormBuilder){
    this.adFilterForm = adfilterFB.group({
      
    })
  }
  
  ngOnInit() {
    this.busy = this.enquire.getAllEnquiry().map(data => {
      this.rows = data;
     }).subscribe(data => {
      this.source = new LocalDataSource(this.rows);
      this.source.refresh();
    })
    this.myOptions = [{ name: 'Enquiry ID', id: 'institute_enquiry_id'}, { name: 'Institute ID', id: 'institution_id' }, { name: 'Enquiry No', id: 'enquiry_no' }, { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' }, { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' }, { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' }, { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' }, { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' }, { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' }, { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }];
    this.myOptions.forEach  (el => 
      {
      if(this.settings.columns[el.id].show){
        this.optionsModel.push(el.id);
      }
    })
    this.FetchEnquiryPrefilledData();    
    this.logger.group("ngOnit");
    this.logger.log("initialized Http Calls for fetching form prefilled data and table Data");
    this.logger.log(this.optionsModel);
    this.logger.debug("Completed Http Calls");
    this.logger.groupEnd();
  }

  FetchEnquiryPrefilledData(){
    this.enquire.getEnqStatus().subscribe(
      data => {this.enqstatus = data;},
      err => { console.log(err); }
    );
    this.enquire.getEnqPriority().subscribe(
      data => { this.enqPriority = data; },
      err => { console.log(err); }
    );
    this.enquire.getFollowupType().subscribe(
      data => { this.enqFollowType = data },
      err => { console.log(err); }
    );
    this.enquire.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; },
      err => { console.log(err); }
    );
    this.enquire.getScholarPrefillData().subscribe(
      data => { 
        //console.log(data);
        data.forEach(el => {
          if(el.label == "Scholarship"){
            //console.log(el);
            this.enqScholarship = el.prefilled_data.split(',');
          }
          else if(el.label == "Subject2"){
            this.enqSub2 = el.prefilled_data.split(',');
          }
        })
      },
      err => { console.log(err); }
    );
    this.enquire.getEnqStardards().subscribe(
      data => { this.enqStd = data;},
      err => { console.log(err); }
    );
  }

  toggleOptionChange(ev){
    console.log(ev);
    console.log(this.optionsModel);
    this.settings = {
      mode: 'external', hideSubHeader: false, selectMode: 'multi',
      actions: { add: false, edit: false, delete: false, columnTitle: '',},
      columns: {
        enquiry_no: { title: 'Enquiry No.', filter: false, show: false }, enquiry_date: { title: 'Enquiry Date', filter: false, show: false }, name: { title: 'Student Name', filter: false, show: false }, phone: { title: 'Contact No.', filter: false, show: false }, priority: { title: 'Priority', filter: false, show: false }, follow_type: { title: 'Follow type', filter: false, show: false }, followUpDate: { title: 'Follow up Date', filter: false, show: false }, assigned_name: { title: 'Assigned To', filter: false, show: false }, standard: { title: 'Standard', filter: false, show: false }, subjects: { title: 'Subjects', filter: false, show: false }, action: { title: 'Action', filter: false, type: 'custom', renderComponent:  ActionButtonComponent },updateDate: { title: 'Update Date', filter: false, show: false },statusValue: { title: 'Status Value', filter: false, show: false },enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false },followUpTime: { title: 'Follow up Time', filter: false, show: false },followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false },filtered_statuses: { title: 'Filtered Status', filter: false, show: false },email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false}, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false },  name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false },  filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
      },
      pager: {
        display: true,
        perPage: 5,
      },
    };
    this.settingUpdater = Object.assign({}, this.settings);
    this.optionsModel.forEach(el => {
      this.settingUpdater.columns[el].show = true;
    })
    this.settings = Object.assign({}, this.settingUpdater);
  }

  statusFilter(checkerObj){
    if(this.stats.Open.checked === true || this.stats.Registered.checked === true || this.stats.Admitted.checked === true || this.stats.Inactive.checked === true){
      this.stats.All.checked = false;
      this.stats.All.disabled = true;    
      if(checkerObj.checked === true){
        this.checkedStatus.push(checkerObj.prop);
        let temp2 = []; 
        let temp = [];
        let arr = [];
        this.checkedStatus.forEach(el => { 
          temp2 = this.rows.filter(row => { 
            return row.statusValue === el }); 
            temp = temp2;
            arr = arr.concat(temp);
          });
          this.source = new LocalDataSource(arr);
          console.log(arr);
      }
      else if(checkerObj.checked === false){
        var index = this.checkedStatus.indexOf(checkerObj.prop);
        if (index > -1){
          this.checkedStatus.splice(index, 1);
        }
        let temp2 = []; 
        let temp = [];
        let arr = [];
        this.checkedStatus.forEach(el => { 
          temp2 = this.rows.filter(row => { 
            return row.statusValue === el }); 
            temp = temp2;
            arr = arr.concat(temp);
          });
          this.source = new LocalDataSource(arr);
          console.log(arr);
      } 
      }
    else if(this.stats.Open.checked === false && this.stats.Registered.checked === false && this.stats.Admitted.checked === false && this.stats.Inactive.checked === false){
      this.stats.All.disabled = false;
      this.stats.All.checked = true;
      this.checkedStatus = [];
      console.log("array emptied, now refresh data source");
      this.busy = this.enquire.getAllEnquiry().map(data => {
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
    if (query != '') {
      this.source.setFilter([
        { field: 'institute_enquiry_id', search: query }, { field: 'institution_id', search: query }, { field: 'enquiry_no', search: query }, { field: 'name', search: query }, { field: 'phone', search: query }, { field: 'email', search: query }
      ], false);
    }
  }

  openAdFilter(){
    this.AdFilter =  true;
    console.log(this.formData);
    //let instituteFormData = `institute_id=${this.instituteData.institute_id}&function_type=${this.instituteData.function_type}&username=${this.instituteData.username}&password=${this.instituteData.password}&onLoad=${this.instituteData.onLoad}&name=${this.instituteData.name}&phone=${this.instituteData.phone}&email=${this.instituteData.email}&enquiry=${this.instituteData.enquiry_no}&priority=${this.instituteData.priority}&filtered_statuses=${this.instituteData.filtered_statuses}&follow_type=${this.instituteData.follow_type}&followUpDate=${this.instituteData.followUpDate}&enquiry_date=${this.instituteData.enquiry_date}&assigned_to=${this.instituteData.assigned_to}&standard_id=${this.instituteData.standard_id}&subject_id=${this.instituteData.subject_id}&is_recent=${this.instituteData.is_recent}&filtered_slots=${this.instituteData.filtered_slots}&isDashbord=${this.instituteData.isDashbord}&enquireDateFrom=${this.instituteData.enquireDateFrom}&enquireDateTo=${this.instituteData.enquireDateTo}&updateDate=${this.instituteData.updateDate}&updateDateFrom=${this.instituteData.updateDateFrom}&updateDateTo=${this.instituteData.updateDateTo}&page=${this.instituteData.pageNo}&size=${this.instituteData.sizeLimit}`;
  }
  
  closeAdFilter(){
    this.AdFilter =  false;
  }
  
  refreshSource(){
    this.source.refresh();
    this.optionsModel = [];
    this.settings = {
      mode: 'external', hideSubHeader: false, selectMode: 'multi',
      actions: { add: false, edit: false, delete: false, columnTitle: '',},
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
        action: { title: 'Action', filter: false, type: 'custom', renderComponent:  ActionButtonComponent },
        updateDate: { title: 'Update Date', filter: false, show: true },
        statusValue: { title: 'Status Value', filter: false, show: true },
        enquiry_no_date: { title: 'Enquiry No. & Date', filter: false, show: false },followUpTime: { title: 'Follow up Time', filter: false, show: false },followUpDateTime: { title: 'Follow up dateTime', filter: false, show: false },filtered_statuses: { title: 'Filtered Status', filter: false, show: false },email: { title: 'Email', filter: false, show: false }, referred_by: { title: 'Reffered By', filter: false, show: false}, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false },  name_person: { title: 'Person Name', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false },  filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
      },
      pager: {
        display: true,
        perPage: 5,
      },
    };
    this.settingUpdater = Object.assign({}, this.settings);
  }

  onCreate(event){
  } 

  onDelete(event){
  } 

  onSave(event){ 
    /*     this.source.add() */
  }

  handleGridSelected(event) {
    this.gridSelected = event.selected;
  }

  filterAdvanced(event){
    console.log(event);
    if(this.validate(event)){
      /* Perform Filter Task  
          Perform Http Request and Send Data via Post
      */
    }
    else{
      console.log("Please revalidate the submitted data");
    }
  }

  validate(formdata): boolean{
       
    return false;
  }

  redirectToAdd(){
    this.router.navigate(['/enquiry/addEnquiry']);
  }
}
