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

@Component({
  selector: 'app-enquiry-manage',
  templateUrl: './enquiry-manage.component.html',
  styleUrls: ['./enquiry-manage.component.css']
})

export class EnquiryManageComponent implements OnInit {

  AdFilter:boolean; rows: any = []; optionsModel: any[]; checkedOpt: any[]; myOptions: IMultiSelectOption[]; source: LocalDataSource; gridSelected:any; busy: Subscription; selectedCol = [];
  
  stats = {
    All :       {value: 'All', prop: 'All', checked: true, disabled: false},
    Open :      {value: 'Open', prop: 'Open', checked: false, disabled: false}, 
    Registered: {value: 'Registered', prop: 'In Progress', checked: false, disabled: false}, 
    Admitted:   {value: 'Admitted', prop: 'Student Admitted', checked: false, disabled: false}, 
    Inactive :  {value: 'Inactive', prop: 'Converted', checked: false, disabled: false},
  };

  check: boolean = true; disable: boolean = true;
  checkedStatus =[];
  filtered = [];

  Status = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

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
      display: false,
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
      display: false,
    },
  };

  constructor(private enquire: FetchenquiryService, private dialog: MdDialog, public snackBar: MdSnackBar, private router: Router, private logger: Logger){
  }
  
  ngOnInit() {
    this.busy = this.enquire.getAllEnquiry().map(data => {
      this.rows = data;
     }).subscribe(data => {
      this.source = new LocalDataSource(this.rows);
      this.source.refresh();
    })
    
    this.myOptions = [{ name: 'Enquiry ID', id: 'institute_enquiry_id'}, { name: 'Institute ID', id: 'institution_id' }, { name: 'Enquiry No', id: 'enquiry_no' }, { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' }, { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' }, { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' }, { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' }, { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' }, { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' }, { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }];
  }

  toggleOptionChange(ev){
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
        display: false,
      },
    };
    this.settingUpdater = Object.assign({}, this.settings);
    ev.forEach(el => {
      this.settingUpdater.columns[el].show = !this.settingUpdater.columns[el].show;
      this.snackBar.open(this.settingUpdater.columns[el].title, "Updated", {
        duration: 1000,
        });
    })
    this.settings = Object.assign({}, this.settingUpdater);
  }

  toggle(ele) {
    console.log(ele);
    this.settingUpdater.columns[ele].show = !this.settingUpdater.columns[ele].show;
    this.settings = Object.assign({}, this.settingUpdater);
    this.snackBar.open(this.settingUpdater.columns[ele].title, "Updated", {
    duration: 1000,
    });
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
        display: false,
      },
    };
    this.settingUpdater = Object.assign({}, this.settings);
    this.snackBar.open("Table Refreshed", "", {
      duration: 1000,
    });
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

}
