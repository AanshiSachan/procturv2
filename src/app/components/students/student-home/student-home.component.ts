import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';


import { instituteInfo } from '../../../model/instituteinfo';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';


import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from '../../../../assets/imported_modules/ng2-smart-table';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {

  /* Variable declaration */
  private rows: any = [];
  private optionsModel = [];
  private checkedOpt: any[];
  private myOptions: IMultiSelectOption[];
  private source: LocalDataSource;
  studentLoader: Subscription;
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
  private advancedFilter: boolean = false;
  private selectedRow: any;
  private selectedRowGroup:any;
  private displayBatchSize: number = 5;

  /* Model for institute Data for fetching student enquiry */
  instituteData: instituteInfo = {
    institute_id: 100123,
    function_type: "student_filter_wise",
    username: "31469|0",
    password: "admin@123",
    school: -1,
    standard_id: -1,
    batch_id: -1,
    is_load: "",
    name: "",
    is_active: 1,
    mobile: "",
    language_inst_status: "",
    subject_id: -1,
    slot_id: "",
    master_course_name: "",
    course_id: -1,
    start_index: 0,
    batch_size: 10,
  };

  /* Default Setting for ng2-smart-table */
  settings = {
    mode: 'inline', hideSubHeader: false, selectMode: 'multi',
    actions: { add: false, edit: true, delete: true, columnTitle: '', },
    columns: {
      student_id: {
        title: 'ID',
        filter: false, show: true
      },
      student_name: {
        title: 'Full Name',
        filter: false, show: true
      },
      student_phone: {
        title: 'Student\'s Contact',
        filter: false, show: true
      },
      doj: {
        title: 'Joining Date',
        filter: false, show: true
      },
      student_class: {
        title: 'Class',
        filter: false, show: true
      },
      parent_phone: {
        title: 'Parent\'s Contact',
        filter: false, show: true
      },
      is_active: {
        title: 'Is Active',
        filter: false, show: true
      },
      student_email: {
        title: 'Email',
        filter: false, show: true
      }
    },
    pager: {
      display: false,
    },
  };


  constructor(private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private studentFetch: FetchStudentService) { }


  /* OnInit function to set toggle default columns and load student data for table*/
  ngOnInit() {
    this.myOptions = [{ name: 'Enquiry ID', id: 'institute_enquiry_id' }, { name: 'Institute ID', id: 'institution_id' }, { name: 'Enquiry No', id: 'enquiry_no' }, { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' }, { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' }, { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' }, { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' }, { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' }, { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' }, { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }];

    this.studentLoader = this.studentFetch.fetchAllStudentDetails(this.instituteData).map(data => {
      this.rows = data;
    }).subscribe(data => {
      this.source = new LocalDataSource(this.rows);
      this.source.refresh();
    });
  }


  /* Function to toggle Advanced filter Visibility */
  openAdvancedFilter() {
    this.advancedFilter = true;
  }
  closeAdvancedFilter() {
    this.advancedFilter = false;
  }


  /* Data Table Functions */

  /* Function to select user data on click */
  rowSelected(ev) {

    /* If all records are not selected then check for true/false status */
    if (ev.data != null) {

      /* If true, that is multiple option have been checked but not all */
      if (ev.isSelected) {
        let allSelected = ev.selected;
        let currentSelected = ev.data;
        this.selectedRow = currentSelected;
        this.selectedRowGroup = allSelected;
      }

      /* If false, that is only a single input has been selected */
      else {
        this.selectedRow = ev.data;
      }
    }

    /* All records in the page have been selected */
    else {
      this.selectedRowGroup = ev.selected;
    }
    
  }



  /* Batch Size Update Function */
  updateTableBatchSize(ev){
    console.log(ev);
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
