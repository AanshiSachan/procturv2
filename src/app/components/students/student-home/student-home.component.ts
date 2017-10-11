import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';


import { instituteInfo } from '../../../model/instituteinfo';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';


import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
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
    mode: 'external', hideSubHeader: false,
    actions: { add: false, edit: false, delete: false, columnTitle: '', },
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


  /* Fetch next set of paginated data */
  fetchNext(){
    if(this.instituteData.start_index >=0){
      this.instituteData.start_index = this.instituteData.start_index +this.instituteData.batch_size +1;
      console.log(this.instituteData.start_index);
    }
  }

   /* Fetch previous set of paginated data */
  fetchPrevious(){
    if(this.instituteData.start_index > 0){
      this.instituteData.start_index = this.instituteData.start_index -this.instituteData.batch_size -1;
      console.log(this.instituteData.start_index);
    }

  }

}
