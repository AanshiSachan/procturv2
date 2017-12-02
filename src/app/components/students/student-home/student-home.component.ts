import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { instituteInfo } from '../../../model/instituteinfo';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { MenuItem } from 'primeng/primeng';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import {AddStudentPrefillService} from '../../../services/student-services/add-student-prefill.service';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {

  /* Variable declaration */
  private rows: any = [];
  private enqstatus: any = [];
  private masterCourseList: any = [];
  private schoolList: any = [];
  private subjectList: any = [];
  private studentStatusList: any = [];
  private batchList: any = [];
  private standardList: any = [];
  private subCourseList: any = [];
  private customComponent: any = [];
  private myOptions: IMultiSelectOption[];
  private studentDataSource: any[] = [];
  private selectedRowGroup: any[] = [];
  private optionsModel: any = null;

  private advancedFilter: boolean = false;
  private studentdisplaysize: number = 50;
  private isAllSelected: boolean = false;
  private selectedRow: any;
  today: any = Date.now();
  busy: Subscription;
  busyPrefill: Subscription;
  searchBarData: any = null;
  PageIndex: number = 0;
  maxPageSize: number = 0;
  totalRow: number = 0;
  sizeArr: any[] = [50, 100, 250, 500, 1000];
  bulkActionItems: MenuItem[];
  indexJSON: any[] = [];
  isProfessional: boolean = false;
  selectedOption: any[] = [];


  private headerArr: any[] = [
    { id: 'student_disp_id', title: 'Student ID.', filter: false, show: true },
    { id: 'student_name', title: 'Student Name', filter: false, show: true },
    { id: 'student_phone', title: 'Contact No.', filter: false, show: true },
    { id: 'doj', title: 'Joining Date', filter: false, show: true },
    { id: 'student_class', title: 'Standard/Class', filter: false, show: true },
    { id: 'parent_phone', title: 'Parent Contact No.', filter: false, show: true },
    { id: 'noOfBatchesAssigned', title: 'Course Assigned', filter: false, show: true },
    { id: 'student_email', title: 'Student Email', filter: false, show: false },
    { id: 'student_sex', title: 'Gender', filter: false, show: false },
    { id: 'dob', title: 'Date Of Birth', filter: false, show: false },
    { id: 'alternateEmailID', title: 'Alternate Email', filter: false, show: false },
    { id: 'guardian_email', title: 'Guardian Email', filter: false, show: false },
    { id: 'guardian_name', title: 'Guardian Name', filter: false, show: false },
    { id: 'guardian_phone', title: 'Guardian Phone', filter: false, show: false },
    { id: 'parent_name', title: 'Parent Name', filter: false, show: false },
    { id: 'parent_email', title: 'Parent Email', filter: false, show: false },
  ];

  private headerClone: any[] = [
    { id: 'student_disp_id', title: 'Student ID.', filter: false, show: true },
    { id: 'student_name', title: 'Student Name', filter: false, show: true },
    { id: 'student_phone', title: 'Contact No.', filter: false, show: true },
    { id: 'doj', title: 'Joining Date', filter: false, show: true },
    { id: 'student_class', title: 'Standard/Class', filter: false, show: true },
    { id: 'parent_phone', title: 'Parent Contact No.', filter: false, show: true },
    { id: 'noOfBatchesAssigned', title: 'Course Assigned', filter: false, show: true },
    { id: 'student_email', title: 'Student Email', filter: false, show: false },
    { id: 'student_sex', title: 'Gender', filter: false, show: false },
    { id: 'dob', title: 'Date Of Birth', filter: false, show: false },
    { id: 'alternateEmailID', title: 'Alternate Email', filter: false, show: false },
    { id: 'guardian_email', title: 'Guardian Email', filter: false, show: false },
    { id: 'guardian_name', title: 'Guardian Name', filter: false, show: false },
    { id: 'guardian_phone', title: 'Guardian Phone', filter: false, show: false },
    { id: 'parent_name', title: 'Parent Name', filter: false, show: false },
    { id: 'parent_email', title: 'Parent Email', filter: false, show: false },
  ];



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

  advancedFilterForm: instituteInfo = {
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
    batch_size: this.studentdisplaysize
  }


  constructor(private prefill: FetchprefilldataService, private router: Router,
    private studentFetch: FetchStudentService, private login: LoginService,
    private appC: AppComponent, private studentPrefill:AddStudentPrefillService) {


  }



  /* OnInit function to set toggle default columns and load student data for table*/
  ngOnInit() {

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    console.log(this.isProfessional);
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));

    this.login.changeNameStatus(sessionStorage.getItem('name'));

    sessionStorage.setItem('studentdisplaysize', this.studentdisplaysize.toString());

    this.busy = this.loadTableDataSource(this.instituteData);

    this.myOptions = [
      { id: 'alternateEmailID', name: 'Alternate Email' },
      /* { id: 'student_phone', name: 'Contact No.' }, */
      /* { id: 'noOfBatchesAssigned', name: 'Course Assigned' }, */
      { id: 'dob', name: 'Date Of Birth' },
      { id: 'guardian_email', name: 'Guardian Email' },
      { id: 'guardian_name', name: 'Guardian Name' },
      { id: 'guardian_phone', name: 'Guardian Phone' },
      { id: 'student_sex', name: 'Gender' },
      /* { id: 'doj', name: 'Joining Date' },
      { id: 'parent_phone', name: 'Parent Contact No.' }, */
      { id: 'parent_name', name: 'Parent Name' },
      { id: 'parent_email', name: 'Parent Email' },
      /* { id: 'student_class', name: 'Standard/Class' }, */
      { id: 'student_email', name: 'Student Email' },
      /* { id: 'student_disp_id', name: 'Student ID.' },
      { id: 'student_name', name: 'Student Name' }, */
    ];

    this.bulkActionItems = [
      {
        label: 'Bulk Action 2', icon: 'fa-trash-o', command: () => {
          this.bulkActionPerformer(2);
        }
      }
    ];

    this.fetchStudentPrefill();

  }






  /* Fetch data from server and convert to custom array */
  loadTableDataSource(instituteData) {
    this.studentDataSource = [];
    this.selectedRow = null;
    this.selectedRowGroup = [];
    return this.studentFetch.fetchAllStudentDetails(instituteData).subscribe(
      res => {
        if (instituteData.start_index == 0) {
          this.totalRow = res[0].student_count;
          this.setPageSize(this.totalRow);
          res.forEach(el => {
            let obj = {
              isSelected: false,
              show: true,
              data: el
            }
            this.studentDataSource.push(obj);
          });
        }
        else {
          res.forEach(el => {
            let obj = {
              isSelected: false,
              show: true,
              data: el
            }
            this.studentDataSource.push(obj);
          });
        }
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
        end_index: start + (this.studentdisplaysize - 1)
      }
      this.indexJSON.push(index);
      start = start + this.studentdisplaysize;
    }
    //document.getElementById('page1').classList.add('active');
  }




  fectchTableDataByPage(index) {
    this.instituteData.start_index = index.start_index;
    //this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
    //this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
    //sessionStorage.setItem('pageI', index.value);
    this.busy = this.loadTableDataSource(this.instituteData);
  }




  /* When user click on a row add class 
    selected and check that row */
  rowclicked(row) {
    //someArray = someArray.filter(person => person.name != 'John'); */
    //console.log("row clicked");
    this.selectedRow = row;
  }




  rowCheckBoxClick(row) {
    if (row.isSelected) {
      this.selectedRowGroup.push(row);
    }
    else {
      this.selectedRowGroup = this.selectedRowGroup.filter(el => el.data.student_id != row.data.student_id);
    }
  }




  editStudent(row) {
    console.log(row);
  }




  editComment(row) {
    console.log(row);
  }



  deleteStudent(row) {
    console.log('row deleted');
  }




  bulkActionPerformer(id) {

    if (id == 1) {
      if (this.selectedRowGroup.length != 0) {
        console.log('bulk action' + id + 'selected');
        console.log(this.selectedRowGroup);
      }
      else {
        let msg = {
          type: 'warning',
          title: 'No Rows Selected',
          body: 'Please select atleast one row to perform bulk action'
        }
        this.appC.popToast(msg);
      }
    }
    else if (id == 2) {
      if (this.selectedRowGroup.length != 0) {
        console.log('bulk action' + id + 'selected');
      }
      else {
        let msg = {
          type: 'warning',
          title: 'No Rows Selected',
          body: 'Please select atleast one row to perform bulk action'
        }
        this.appC.popToast(msg);
      }
    }
  }



  toggleOptionChange(opt) {
    this.headerArr = [
      { id: 'student_disp_id', title: 'Student ID.', filter: false, show: true },
      { id: 'student_name', title: 'Student Name', filter: false, show: true },
      { id: 'student_phone', title: 'Contact No.', filter: false, show: true },
      { id: 'doj', title: 'Joining Date', filter: false, show: true },
      { id: 'student_class', title: 'Standard/Class', filter: false, show: true },
      { id: 'parent_phone', title: 'Parent Contact No.', filter: false, show: true },
      { id: 'noOfBatchesAssigned', title: 'Course Assigned', filter: false, show: true },
      { id: 'student_email', title: 'Student Email', filter: false, show: false },
      { id: 'student_sex', title: 'Gender', filter: false, show: false },
      { id: 'dob', title: 'Date Of Birth', filter: false, show: false },
      { id: 'alternateEmailID', title: 'Alternate Email', filter: false, show: false },
      { id: 'guardian_email', title: 'Guardian Email', filter: false, show: false },
      { id: 'guardian_name', title: 'Guardian Name', filter: false, show: false },
      { id: 'guardian_phone', title: 'Guardian Phone', filter: false, show: false },
      { id: 'parent_name', title: 'Parent Name', filter: false, show: false },
      { id: 'parent_email', title: 'Parent Email', filter: false, show: false },
    ];
    //this.headerClone = this.headerArr;
    this.headerArr.forEach(head => {
      opt.forEach(o => {
        if (head.id == o) {
          if (head.show) {
            console.log("remove from header list");
          }
          else {
            this.selectedOption.push(o);
            head.show = !head.show;
          }
        }
      });
    });
  }




  /* Function to open advanced filter */
  openAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
    document.getElementById('adFilterOpen').classList.add('hide');
    document.getElementById('adFilterExit').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
  }




  /* Function to close advanced filter */
  closeAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.remove('hasFilter');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('adFilterOpen').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }




  toggleSelectAll(status) {

    if (status) {
      /* let checkNode = document.getElementsByClassName('tbodycheck');

      [].forEach.call(checkNode, function (el) {
        el.checked = true;
      });
      this.selectedRowGroup = this.studentDataSource; */
      this.studentDataSource.forEach(el => {
        el.isSelected = true;
      });
    }
    else {
      /* let checkNode = document.getElementsByClassName('tbodycheck');

      [].forEach.call(checkNode, function (el) {
        el.checked = false;
      });

      this.selectedRowGroup = []; */
      this.studentDataSource.forEach(el => {
        el.isSelected = false;
      });
    }
  }




  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.studentdisplaysize = parseInt(num);
    this.bulkActionFunction();
    sessionStorage.setItem('displayBatchSize', num);
    this.instituteData.batch_size = this.studentdisplaysize;
    this.instituteData.start_index = 0;
    this.studentDataSource = [];
    this.busy = this.studentFetch.fetchAllStudentDetails(this.instituteData).subscribe(
      res => {
        res.forEach(el => {
          let obj = {
            isSelected: false,
            show: true,
            data: el
          }
          this.studentDataSource.push(obj);
          //console.log(res);
          //this.totalEnquiry = res[0].totalcount;
        });


        /* this.sourceEnquiry = new LocalDataSource(this.rows);
        this.totalEnquiry = this.rows[0].totalcount;
        this.indexJSON = [];
        this.setPageSize(this.totalEnquiry);
        this.sourceEnquiry.refresh(); */
      },
      err => { }
    );
  }




  /* Toggle page size menu on Click */
  bulkActionFunction() {
    document.getElementById("bulk-drop").classList.toggle("show");
  }




  downloadAllStudent() {
    let data = {
      school_id: -1,
      standard_id: -1,
      filtered_slots: "",
      batch_id: -1,
      subject_id: -1,
      name: "",
      language_inst_status: null,
      is_active_status: "1",
      mobile: "",
      master_course_name: "-1",
      course_id: -1
    }

    this.busy = this.studentFetch.downloadStudentTableasXls(data).subscribe(
      res => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('student_download');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Download XLS',
          body: 'Please check your internet connection, else contact proctur support'
        }
        this.appC.popToast(msg);
      }
    );
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



  fetchStudentPrefill(){


    let standard = this.prefill.getEnqStardards().subscribe(data => {
      this.standardList = data;
      //console.log(data);
    });

    this.prefill.getSchoolDetails().subscribe(data => {
      this.schoolList = data;
      //console.log(data);
    });

    let batch = this.studentPrefill.fetchBatchDetails().subscribe(data => {
      this.batchList = data;
      //console.log(data);
    });

    this.studentPrefill.fetchLangStudentStatus().subscribe(data => {
      this.studentStatusList = data;
      //console.log(data);
    });

    this.studentPrefill.fetchMasterCourse().subscribe(data => {
      this.masterCourseList = data;
      //console.log(data);
    });

  } 


  updateSubCourse(course){
    this.masterCourseList.forEach(el=> {
      if(el.master_course == course){
        this.subCourseList = el.coursesList;
      }
    })
  }


  fetchCourseForMaster(id){
    this.studentPrefill.fetchCourseList(id).subscribe(
      res=>{
        this.subjectList = res;
      }
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
 
    }


    advancedSearch(){
      this.instituteData = this.advancedFilterForm;
      this.busy = this.loadTableDataSource(this.instituteData);
    }  

    updateIsActive(ev){
      console.log(ev);
    }

}
