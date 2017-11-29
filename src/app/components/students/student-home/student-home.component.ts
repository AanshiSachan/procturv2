import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';

import { instituteInfo } from '../../../model/instituteinfo';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';


import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import * as moment from 'moment';
import { LoginService } from '../../../services/login-services/login.service';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {

  /* Variable declaration */
  private rows: any = [];
  private enqstatus: any = [];
  private enqPriority: any = [];
  private enqFollowType: any = [];
  private enqAssignTo: any = [];
  private enqStd: any = [];
  private enqSubject: any = [];
  private enqScholarship: any = [];
  private enqSub2: any = [];
  private advancedFilter: boolean = false;
  private studentdisplaysize: number = 50;
  studentDataSource: any[] = [];
  isAllSelected: boolean = false;
  selectedRow: any;
  selectedRowGroup: any[] = [];


  /* Model for institute Data for fetching student enquiry */
  instituteData: instituteInfo = {
    school_id: -1,
    standard_id: -1,
    batch_id: -1,
    name: "",
    is_active_status: 1,
    mobile: "",
    language_inst_status: -1,
    subject_id: -1,
    slot_id: "",
    master_course_name: "",
    course_id: -1,
    start_index: 0,
    batch_size: this.studentdisplaysize,
  };


  constructor(private prefill: FetchprefilldataService, private router: Router,
    private studentFetch: FetchStudentService, private login: LoginService, private appC: AppComponent) {

  }



  /* OnInit function to set toggle default columns and load student data for table*/
  ngOnInit() {

    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    sessionStorage.setItem('studentdisplaysize', this.studentdisplaysize.toString());

    this.loadTableDataSource(this.instituteData);
  }












  /* Fetch data from server and convert to custom array */
  loadTableDataSource(instituteData) {

    this.studentFetch.fetchAllStudentDetails(instituteData).subscribe(
      res => {
        res.forEach(el => {
          let obj = {
            isSelected: false,
            show: true,
            data: el
          }
          this.studentDataSource.push(obj);
        });
      },
      err => {
        let alert = {
          type: 'error',
          title: 'Failed To Fetch Student List',
          body: 'please check your internet connnection or try again'
        }
        this.appC.popToast(alert);
      }
    );
  }


  /* When user click on a row add class 
    selected and check that row */
  rowclicked(row, id) {
    console.log(id)
  }


  toggleSelectAll(status) {

    if (status) {
      /* let checkNode = document.getElementsByClassName('tbodycheck');

      [].forEach.call(checkNode, function (el) {
        el.checked = true;
      });
      this.selectedRowGroup = this.studentDataSource; */
      this.studentDataSource.forEach(el=> {
        el.isSelected = true;
      });
    }
    else {
      /* let checkNode = document.getElementsByClassName('tbodycheck');

      [].forEach.call(checkNode, function (el) {
        el.checked = false;
      });

      this.selectedRowGroup = []; */
      this.studentDataSource.forEach(el=> {
        el.isSelected = false;
      });
    }
  }


  /* Function to toggle Advanced filter Visibility */
  openAdvancedFilter() {
    this.advancedFilter = true;
  }



  closeAdvancedFilter() {
    this.advancedFilter = false;
  }



  /* Batch Size Update Function */
  updateTableBatchSize(ev) {
    console.log(ev);
  }


}
