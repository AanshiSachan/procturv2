import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
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
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { WidgetService } from '../../../services/widget.service';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit, OnChanges {

  isNotifyStudent: boolean;
  isMarkLeave: boolean;
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
  private studentDataSource: any[] = [];
  private selectedRowGroup: any[] = [];
  private optionsModel: any = null;
  private customComponents: any[] = [];
  private advancedFilter: boolean = false;
  private studentdisplaysize: number = 50;
  private isAllSelected: boolean = false;
  private selectedRow: any;
  studentDetailsById: any;
  studentCustomComponent: any;
  today: any = Date.now();
  busy: Subscription;
  busyPrefill: Subscription;
  searchBarData: any = null;
  sizeArr: any[] = [50, 100, 250, 500, 1000];
  bulkActionItems: MenuItem[];
  indexJSON: any[] = [];
  isProfessional: boolean = false;
  currentDirection: string = 'asc';
  isDeleteStudentPrompt: boolean = false;
  isAddComment: boolean = false;
  perPage: number = 10;
  PageIndex: number = 1;
  maxPageSize: number = 0;
  totalRow: number = 0;
  private slots: any[] = [];
  private selectedSlots: any[] = [];
  private slotIdArr: any[] = [];
  private selectedSlotsString: string = '';
  loading_message: number = 1;
  private selectedSlotsID: string = '';
  selectedRowCount: number = 0;
  isRippleLoad: boolean = false;
  /* set true to see the sidebar */
  isSideBar: boolean = false;
  isOptions: boolean = false;
  private editForm: any = {
    comments: "",
    institution_id: sessionStorage.getItem('institute_id')
  }

  StudentSettings: ColumnSetting[];

  @ViewChild('studentPage') studentPage: ElementRef;
  @ViewChild('mySidenav') mySidenav: ElementRef;
  @ViewChild('optMenu') optMenu: ElementRef;

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
    sorted_by: '',
    order_by: ''
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
    batch_size: this.studentdisplaysize,
    sorted_by: '',
    order_by: ''
  }
  leaveDataArray: any = [];
  applyLeave = {
    student_id: '',
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    reason: ''
  }

  sortBy: string = "student_name";

  constructor(private prefill: FetchprefilldataService, private router: Router,
    private studentFetch: FetchStudentService, private login: LoginService,
    private appC: AppComponent, private studentPrefill: AddStudentPrefillService,
    private widgetService: WidgetService,
    private postService: PostStudentDataService) {

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';

    if (this.isProfessional) {
      this.StudentSettings = [
        { primaryKey: 'student_disp_id', header: 'Student Id.' },
        { primaryKey: 'student_name', header: 'Name.' },
        { primaryKey: 'student_phone', header: 'Contact No.' },
        { primaryKey: 'student_class', header: 'Class' },
        { primaryKey: 'noOfBatchesAssigned', header: 'Batch Assigned' }
      ];
    }
    else {
      this.StudentSettings = [
        { primaryKey: 'student_disp_id', header: 'Student Id.' },
        { primaryKey: 'student_name', header: 'Name.' },
        { primaryKey: 'student_phone', header: 'Contact No.' },
        { primaryKey: 'student_class', header: 'Class' },
        { primaryKey: 'noOfBatchesAssigned', header: 'Course Assigned' }
      ];
    }
  }

  /* OnInit function to set toggle default columns and load student data for table*/
  ngOnInit() {
    this.isRippleLoad = true;
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    //this.busy = this.loadTableDataSource(this.instituteData);
    this.fetchStudentPrefill();
    this.loading_message = 3;            
    this.studentDataSource = [];
    this.totalRow = this.studentDataSource.length;
    this.bulkActionItems = [
      // {
      //   label: 'Mark Leave', icon: 'fas fa-exclamation', command: () => {
      //     this.markLeave();
      //   }
      // },
      {
        label: 'Send Notification', icon: 'far fa-bell', command: () => {
          this.notifySelectedStudent();
        }
      }
    ];
  }

  ngOnChanges() { }

  /* Fetch data from server and convert to custom array */
  loadTableDataSource(obj) {
    this.isRippleLoad = true;
    this.selectedRow = null;
    this.selectedRowGroup = [];
    this.closeSideBar();
    this.loading_message = 1;
    this.isAllSelected = false;
    //console.log("start index at launch" +obj.start_index);
    if (obj.start_index == 0) {
      //console.log("start index 0");
      return this.studentFetch.fetchAllStudentDetails(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          /* records */
          if (res.length != 0) {
            //console.log("data found");
            this.totalRow = res[0].total_student_count;
            //console.log(this.totalRow);
            this.studentDataSource = res;
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any enquiry for the specified query'
            }
            this.appC.popToast(alert);
            this.loading_message = 2;            
            this.studentDataSource = [];
            this.totalRow = this.studentDataSource.length;
          }
        },
        err => {
          this.isRippleLoad = false;
          let alert = {
            type: 'error',
            title: 'Failed To Fetch Student List',
            body: 'please check your internet connnection or try again'
          }
          this.loading_message = 2;
          this.studentDataSource = [];
          this.totalRow = 0;
          this.appC.popToast(alert);
        }
      )
    }
    else {
      //console.log("start index not zero" +obj.start_index);
      return this.studentFetch.fetchAllStudentDetails(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          if (res.length != 0) {
            this.studentDataSource = res;
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any enquiry for the specified query'
            }
            this.loading_message = 2;
            this.studentDataSource = [];
            this.appC.popToast(alert);
            //this.totalRow = 0;            
            this.studentDataSource = res;
          }
        },
        err => {
          this.isRippleLoad = false;
          let alert = {
            type: 'error',
            title: 'Failed To Fetch Student List',
            body: 'please check your internet connnection or try again'
          }
          this.appC.popToast(alert);
          this.studentDataSource = [];
          this.loading_message = 2;
        }
      )
    }



  }

  getDirection(e){
    //console.log(this.currentDirection);
    if (e) {
      this.currentDirection = 'asc';
      
    }
    else  {
      this.currentDirection = 'desc';
      
    }
  }
  

  /* fetch the data from server based on specific page number by converting the index into start_index */
  fectchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
    this.instituteData.start_index = startindex;
    //this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
    //this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
    //this.instituteData.filtered_statuses = this.statusString.join(',');
    this.busy = this.loadTableDataSource(this.instituteData);
  }

  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.PageIndex++;
    this.fectchTableDataByPage(this.PageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.PageIndex--;
    this.fectchTableDataByPage(this.PageIndex);
  }

  /* When user click on a row add class 
    selected and check that row */
  rowclicked(row) {
    this.selectedRow = row;
  }

  /* update the checked status of the user selected rows checkbox on click */
  rowCheckBoxClick(state, id, no) {
    this.studentDataSource[id].isSelected = state;
    let index = this.selectedRowGroup.findIndex(i => i.data.enquiry_no == no);
    if (index !== -1) {
      if (!state) {
        this.selectedRowGroup.splice(index, 1);
        this.isAllSelected = false;
      }
    }
    else {
      if (state) {
        this.selectedRowGroup.push(this.studentDataSource[id]);
      }
    }
  }

  /* navigate the user to edit page for the specific student */
  editStudent(id) {
    localStorage.setItem('studentId', id);
    this.router.navigate(['/student/edit/' + id]);
  }

  /* Delete the student selected or archieve the student selected */
  deleteStudent(id) {

    let obj = {
      studentIds: this.selectedRow.student_id.toString(),
      studentAlumniArrayString: "Y"
    }
    this.postService.archieveStudents(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Record Deleted',
          body: 'Requested record has been removed from student list'
        }
        this.closeSideBar();
        this.appC.popToast(msg);
        this.closeDeletePopup();
        this.busy = this.loadTableDataSource(this.instituteData);
      }
    );
  }

  deleteStudentOpen(row) {
    this.selectedRow = row;
    this.isDeleteStudentPrompt = true;
  }

  closeDeletePopup() {
    this.isDeleteStudentPrompt = false;
  }

  /* Perform the bulk action for checcked row on basis of the id of selected LI */
  bulkActionPerformer(id) {

    if (id == 1) {
      if (this.selectedRowGroup.length != 0) {
        //console.log('bulk action' + id + 'selected');
        //console.log(this.selectedRowGroup);
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

  /* Function to open advanced filter */
  openAdFilter() {
    this.closeSideBar();
    //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
    document.getElementById('adFilterOpen').classList.add('hide');
    document.getElementById('basic-search').classList.add('hide');
    document.getElementById('adFilterExit').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
  }

  /* Function to close advanced filter */
  closeAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.remove('hasFilter');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('basic-search').classList.remove('hide');
    document.getElementById('adFilterOpen').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }

  /* update the advanced filter forn */
  advancedSearch() {

    let tempCustomArr: any[] = [];

    this.customComponents.forEach(el => {
      //console.log(el);
      if (el.is_searchable == 'Y' && el.value != "") {
        if(el.type == 5 && el.value != "" && el.value != null && el.value != "Invalid date"){
          let obj = {
            component_id: el.id,
            enq_custom_value: moment(el.value).format("YYYY-MM-DD")
          }
          tempCustomArr.push(obj);
        }
        else{
          let obj = {
            component_id: el.id,
            enq_custom_value: el.value
          }
          tempCustomArr.push(obj);
        }
      }
    });

    if (tempCustomArr.length != 0) {
      this.advancedFilterForm.stuCustomLi = tempCustomArr;
    }

    this.advancedFilterForm.is_active_status = parseInt(this.advancedFilterForm.is_active_status);
    this.instituteData = this.advancedFilterForm;
    this.busy = this.loadTableDataSource(this.instituteData);
    this.closeAdFilter();
  }

  /* If the user select the top checkbox and update its status, all the rows are selectedd or unselected on this basis*/
  toggleSelectAll(status) {

    let len = this.studentDataSource.length;

    if (status) {
      this.selectedRowGroup = [];
      for (var i = 0; i < len; i++) {
        document.getElementById('check' + i).checked = true;
        this.selectedRowGroup.push(this.studentDataSource[i]);
      }
    }
    else {
      this.selectedRowGroup = [];
      for (var i = 0; i < len; i++) {
        document.getElementById('check' + i).checked = false;
      }
    }

  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.studentdisplaysize = parseInt(num);
    this.bulkActionFunction();
    this.instituteData.batch_size = this.studentdisplaysize;
    this.instituteData.start_index = 0;
    this.studentDataSource = [];
    this.isRippleLoad = true;
    this.busy = this.studentFetch.fetchAllStudentDetails(this.instituteData).subscribe(
      res => {
        this.isRippleLoad = false;
        if (res.length != 0) {
          //console.log("data found");
          this.totalRow = res[0].total_student_count;
          //console.log(this.totalRow);
          this.studentDataSource = res;
        }
        else {
          let alert = {
            type: 'info',
            title: 'No Records Found',
            body: 'We did not find any enquiry for the specified query'
          }
          this.loading_message = 2;
          this.appC.popToast(alert);
          this.studentDataSource = [];
          this.totalRow = this.studentDataSource.length;
        }
      },
      err => {
        this.isRippleLoad = false;
      }
    );
  }

  /* Toggle page size menu on Click */
  bulkActionFunction() {
    document.getElementById("bulk-drop").classList.toggle("show");
  }

  /* Download the records for student as per the set institute data */
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

    this.busy = this.studentFetch.downloadStudentTableasXls(this.instituteData).subscribe(
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

  /* Store the prefill data for student add form component */
  fetchStudentPrefill() {
    this.isRippleLoad = false;
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
    });

    this.studentPrefill.fetchLangStudentStatus().subscribe(data => {
      this.studentStatusList = data;
    });

    this.studentPrefill.fetchMasterCourse().subscribe(data => {
      this.masterCourseList = data;
    });

    if (this.isProfessional) {
      this.getSlots();
    }

    if (standard != null) {
      let customComp = this.studentPrefill.fetchCustomComponent().subscribe(data => {
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
      });
      //console.log(this.customComponents);
      return customComp;
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
    if (elid != null && elid != '') {
      if (document.getElementById(targetid).classList.contains('hide')) {
        document.getElementById(targetid).classList.remove('hide');
      }
      else {
        document.getElementById(targetid).classList.add('hide');
      }
    }
  }

  /* if custom component is of type multielect then update the selected or unselected data*/
  updateMultiSelect(data, id) {

    this.customComponents.forEach(el => {
      if (el.id == id) {
        el.prefilled_data.forEach(com => {
          if (com.data == data.data) {
            if (com.checked) {
              el.selected.push(com.data);
              if (el.selected.length != 0) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              el.selectedString = el.selected.join(',');
              el.value = el.selectedString;

            }
            else {
              if (el.selected.length > 1) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else if (el.selected.length == 0) {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              else if (el.selected.length == 1) {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              var index = el.selected.indexOf(data.data);
              if (index > -1) {
                el.selected.splice(index, 1);
              }
              el.selectedString = el.selected.join(',');
              el.value = el.selectedString;
            }
          }
        });
      }
    });

  }

  /* When user select the master course or standard then fetch the sub or sub course for them */
  updateSubCourse(course) {
    this.advancedFilterForm.course_id = '-1';
    this.subCourseList = [];
    this.masterCourseList.forEach(el => {
      if (el.master_course == course) {
        this.subCourseList = el.coursesList;
      }
    })
  }

  /* when the user select the master course then fetch course for the related */
  fetchCourseForMaster(id) {
    debugger;
    this.advancedFilterForm.subject_id = '-1';
    this.subjectList = [];
    this.studentPrefill.fetchCourseList(id).subscribe(
      res => {
        this.subjectList = res;
      }
    )
  }

  /* Customiized click detection strategy */
  inputClicked(ev) {
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

  clearAdvancedFilterForm() {

    this.advancedFilterForm = {
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

    this.customComponents.forEach(el => {
      //console.log(el);
      el.selectedString = '';
      el.selected = [];
      el.value = '';
    });

  }

  searchDatabase() {
    /* If User has entered an empty value needs to be informed */
    if (this.searchBarData == '' || this.searchBarData == ' ' || this.searchBarData == null || this.searchBarData == undefined) {
      this.instituteData = {
        school_id: -1,
        standard_id: -1,
        batch_id: -1,
        name: '',
        is_active_status: 1,
        mobile: "",
        language_inst_status: -1,
        subject_id: -1,
        slot_id: "",
        master_course_name: "",
        course_id: -1,
        start_index: 0,
        batch_size: this.studentdisplaysize,
        sorted_by: '',
        order_by: ''
      };
      this.busy = this.loadTableDataSource(this.instituteData);
    }/* valid input detected, check for type of input */
    else {
      /* If input is of type string then validate string validity*/
      if (isNaN(this.searchBarData)) {
        this.instituteData = {
          school_id: -1,
          standard_id: -1,
          batch_id: -1,
          name: this.searchBarData,
          is_active_status: 1,
          mobile: "",
          language_inst_status: -1,
          subject_id: -1,
          slot_id: "",
          master_course_name: "",
          course_id: -1,
          start_index: 0,
          batch_size: this.studentdisplaysize,
          sorted_by: '',
          order_by: ''
        };
        this.busy = this.loadTableDataSource(this.instituteData);
      }/* If not string then use the data as a number*/
      else {
        this.instituteData = {
          school_id: -1,
          standard_id: -1,
          batch_id: -1,
          name: '',
          is_active_status: 1,
          mobile: this.searchBarData,
          language_inst_status: -1,
          subject_id: -1,
          slot_id: "",
          master_course_name: "",
          course_id: -1,
          start_index: 0,
          batch_size: this.studentdisplaysize,
          sorted_by: '',
          order_by: ''
        };
        this.busy = this.loadTableDataSource(this.instituteData);
      }

    }
  }

  /* update the latest comment for the selected student */
  openEditComment(row) {
    this.selectedRow = row;
    this.isAddComment = true;
  }

  /* update the latest comment for the selected student */
  closeEditComment() {
    this.isAddComment = false;
  }

  /* update the latest comment for the selected student */
  updateComment() {

    this.editForm.comments = this.selectedRow.comments;

    this.postService.updateComment(this.editForm, this.selectedRow.student_id).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Comment Added'
        }
        this.appC.popToast(msg);
        this.editForm.comments = '';
        this.closeEditComment();
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Add Comment',
          body: 'Please check your internet connection, if the issue persist contact proctur support'
        }
        this.appC.popToast(msg);

      }
    )
  }

  getMin(): number {
    return ((this.studentdisplaysize * this.PageIndex) - this.studentdisplaysize) + 1;
  }

  getMax(): number {
    if (this.studentDataSource.length != 0) {
      let max = this.studentdisplaysize * this.PageIndex;
      if (max > this.totalRow) {
        max = this.totalRow;
      }
      return max;
    }
  }

  getSlots() {
    return this.studentPrefill.fetchSlots().subscribe(
      res => {
        res.forEach(el => {
          let obj = {
            label: el.slot_name,
            value: el,
            status: false
          }
          this.slots.push(obj);
        });
        // console.log(this.slots);
      },
      err => { }
    )
  }

  updateSlotSelected(data) {
    /* slot checked */
    if (data.status) {
      this.slotIdArr.push(data.value.slot_id);
      this.selectedSlots.push(data.value.slot_name);
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      this.selectedSlotsID = this.slotIdArr.join(',')
      this.selectedSlotsString = this.selectedSlots.join(',');
      this.advancedFilterForm.filtered_slots = this.selectedSlotsID;
    }
    /* slot unchecked */
    else {
      if (this.selectedSlots.length < 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else if (this.selectedSlots.length == 0) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      else if (this.selectedSlots.length == 1) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      var index = this.selectedSlots.indexOf(data.value.slot_name);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
      this.selectedSlotsString = this.selectedSlots.join(',');

      var index2 = this.slotIdArr.indexOf(data.value.slot_id);
      if (index2 > -1) {
        this.slotIdArr.splice(index, 1);
      }
      this.selectedSlotsID = this.slotIdArr.join(',');
      this.advancedFilterForm.filtered_slots = this.selectedSlotsID;
    }

  }

  getSelected(ev) {
    //console.log(ev);
    this.selectedRowGroup = ev;
  }

  getSelectedUserIDS(ev) {
    this.selectedUserId = ev;
  }

  getRowCount(ev) {
    //console.log(ev);
    this.selectedRowCount = ev;
  }

  userRowSelect(ev) {
    if (ev != null) {
      this.openSideBar(ev);
      this.selectedRow = ev;
    }
  }

  sortTableById(id) {
    this.sortBy = id;
    //console.log(id);
    if (id != 'noOfBatchesAssigned') {
      this.instituteData.sorted_by = id;
      this.instituteData.order_by = this.currentDirection;
      this.busy = this.loadTableDataSource(this.instituteData);
    }
  }

  openSideBar(ev) {
    let mySidenavWidth = '29%';
    if (window.innerWidth < 768)
      mySidenavWidth = '100%';
    this.studentPage.nativeElement.style.width = "70%";
    this.studentPage.nativeElement.style.marginRight = mySidenavWidth;
    this.mySidenav.nativeElement.style.width = mySidenavWidth;
    this.mySidenav.nativeElement.style.display = 'block';
    this.optMenu.nativeElement.classList.add('shorted');
    let id = ev.student_id;
    this.isSideBar = false;
    this.isRippleLoad = true;
    this.studentFetch.getStudentById(id).subscribe(
      res => {
        this.studentDetailsById = res;
        this.studentPrefill.fetchCustomComponentById(id).subscribe(
          cus => {
            this.isRippleLoad = false;
            this.studentCustomComponent = cus;
            this.isSideBar = true;
          }
        )
      }
    );
  }


  closeSideBar() {
    this.isSideBar = false;
    this.studentPage.nativeElement.style.width = "100%";
    this.studentPage.nativeElement.style.marginRight = "0";
    this.mySidenav.nativeElement.style.width = "0";
    this.mySidenav.nativeElement.style.display = 'none';
    this.optMenu.nativeElement.classList.remove('shorted');
  }

  // markLeave() {
  //   this.isMarkLeave = true;
  // }

  markStudentLeave(event) {
    this.applyLeave.student_id = event;
    this.isMarkLeave = true;
    this.fetchLEaveData();
  }

  fetchLEaveData() {
    this.leaveDataArray = [];
    this.isRippleLoad = true;
    this.studentFetch.getStudentLeaveData(this.applyLeave.student_id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.leaveDataArray = res;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  closeMarkLeave() {
    this.isMarkLeave = false;
    this.applyLeave = {
      student_id: '',
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      reason: ''
    }
  }

  checkDatesSelection() {
    let currentDate: any = moment();
    let start_date: any = moment(this.applyLeave.start_date);
    let end_date: any = moment(this.applyLeave.end_date);
    let startDiff = start_date.diff(currentDate);
    let btwDiff = end_date.diff(start_date);
    if (startDiff > 0 && btwDiff >= 0) {
      return true;
    } else {

      let msg = {
        type: 'error',
        title: 'Date Selection',
        body: 'Please select future dates for Start and End date'
      }
      this.appC.popToast(msg);
      return false;
    }
  }

  updateMarkLeave() {
    let check = this.checkDatesSelection();
    if (check == false) {
      return
    }
    let obj = {
      student_id: this.applyLeave.student_id,
      start_date: moment(this.applyLeave.start_date).format("YYYY-MM-DD"),
      end_date: moment(this.applyLeave.end_date).format("YYYY-MM-DD"),
      reason: this.applyLeave.reason
    }
    this.isRippleLoad = true;
    this.studentFetch.markLeaveForDays(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        let msg = {
          type: 'success',
          title: 'Leave Applied',
          body: 'Leave applied for dates successfull'
        }
        this.appC.popToast(msg);
        this.fetchLEaveData();
      },
      err => {
        console.log(err);
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Error',
          body: JSON.parse(err._body).message
        }
        this.appC.popToast(msg);
      }
    )
  }

  deletePerticularLeave(row) {
    console.log(row);
    this.studentFetch.cancelLeaveOfDay(row.leave_id).subscribe(
      res => {
        console.log(res);
        let msg = {
          type: 'success',
          title: 'Leave Removed',
          body: 'Leave removed for dates successfull'
        }
        this.appC.popToast(msg);
        this.fetchLEaveData();
      },
      err => {
        console.log(err);
      }
    )
  }

  showDeleteBtn(data) {
    let currentDate = moment();
    let startDate = moment(data.start_date);
    let diff = startDate.diff(currentDate);
    if (diff > 0) {
      return false;
    } else {
      return true;
    }
  }

  editFeePDCDetails(event) {
    sessionStorage.setItem('editPdc', "true");
    localStorage.setItem('studentId', event);
    this.router.navigate(['/student/edit/' + event]);
  }

  notifySelectedStudent() {
    this.isNotifyStudent = true;
    this.getAllMessageFromServer();
    this.sendNotification = {
      loginMessageChkbx: false,
      smsChkbx: true,
      emailChkbx: false,
      studentChkbx: true,
      parentChkbx: false,
      gaurdianChkbx: false,
      subjectMessage: ''
    }
    this.loginField = {
      checkBox: 0
    }
  }

  closeNotifyStudent() {
    this.isNotifyStudent = false;
  }

  // SEND NOTIFICATION POPUP

  sendNotification = {
    loginMessageChkbx: false,
    smsChkbx: true,
    emailChkbx: false,
    studentChkbx: true,
    parentChkbx: false,
    gaurdianChkbx: false,
    subjectMessage: ''
  }
  loginField = {
    checkBox: 0
  }
  messageList: any = [];
  selectedUserId: any = [];

  getAllMessageFromServer() {
    this.messageList = [];
    this.isRippleLoad = true;
    let obj = {
      from_date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
      status: 1,
      to_date: moment().format("YYYY-MM-DD")
    }
    this.widgetService.getMessageList(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageList = this.addKeys(res, false);
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  getAllSavedMessages() {
    this.isRippleLoad = true;
    this.messageList = [];
    this.widgetService.getMessageList({ status: 1 }).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageList = this.addKeys(res, false);
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  getDeliveryModeValue() {
    if (this.sendNotification.smsChkbx == true && this.sendNotification.emailChkbx == true) {
      return 2;
    } else if (this.sendNotification.smsChkbx == true && this.sendNotification.emailChkbx == false) {
      return 0;
    } else if (this.sendNotification.smsChkbx == false && this.sendNotification.emailChkbx == true) {
      return 1;
    }
  }

  validateAllFields() {
    if (this.sendNotification.smsChkbx == false && this.sendNotification.emailChkbx == false) {
      let msg = {
        type: 'error',
        title: 'Error',
        body: "Please select Delivery Mode(SMS , Email)"
      };
      this.appC.popToast(msg);
      return false;
    }

    if (this.sendNotification.emailChkbx == true) {
      if (this.sendNotification.subjectMessage.trim() == "" || this.sendNotification.subjectMessage.trim() == null) {
        let msg = {
          type: 'error',
          title: 'Error',
          body: "Please provide Email Subject"
        };
        this.appC.popToast(msg);
        return false;
      }
    }

    if ((this.sendNotification.studentChkbx == false) && (this.sendNotification.parentChkbx == false) && (this.sendNotification.gaurdianChkbx == false)) {
      let msg = {
        type: 'error',
        title: 'Error',
        body: "Please correct option in Send SMS To.."
      };
      this.appC.popToast(msg);
      return false;
    }

  }

  getNotificationMessage() {
    let count = 0;
    for (let t = 0; t < this.messageList.length; t++) {
      if (this.messageList[t].assigned == true) {
        return {
          message: this.messageList[t].message, messageId: this.messageList[t].message_id
        };
      } else {
        count++;
      }
    }
    if (this.messageList.length == count) {
      let msg = {
        type: 'error',
        title: 'Error',
        body: "Please select message"
      };
      this.appC.popToast(msg);
      return false;
    }
  }

  getDestinationValue() {
    if (this.sendNotification.studentChkbx == true && this.sendNotification.parentChkbx == false && this.sendNotification.gaurdianChkbx == false) {
      return 0;
    } else if (this.sendNotification.studentChkbx == false && this.sendNotification.parentChkbx == true && this.sendNotification.gaurdianChkbx == false) {
      return 1;
    } else if (this.sendNotification.studentChkbx = false && this.sendNotification.parentChkbx == false && this.sendNotification.gaurdianChkbx == true) {
      return 3;
    } else if (this.sendNotification.studentChkbx && this.sendNotification.parentChkbx && this.sendNotification.gaurdianChkbx == false) {
      return 2;
    } else if (this.sendNotification.studentChkbx && this.sendNotification.gaurdianChkbx && this.sendNotification.parentChkbx == false) {
      return 5;
    } else if (this.sendNotification.parentChkbx && this.sendNotification.gaurdianChkbx && this.sendNotification.studentChkbx == false) {
      return 6;
    }
    else if (this.sendNotification.studentChkbx && this.sendNotification.parentChkbx && this.sendNotification.gaurdianChkbx) {
      return 4;
    }
  }

  sendNotificationMessage() {
    let check = this.validateAllFields();
    if (check === false) {
      return false;
    }
    let messageSelected = this.getNotificationMessage();
    if (messageSelected === false) {
      return;
    }
    let obj = {
      delivery_mode: Number(this.getDeliveryModeValue()),
      notifn_message: messageSelected.message,
      notifn_subject: this.sendNotification.subjectMessage.trim(),
      destination: Number(this.getDestinationValue()),
      student_ids: this.getListOfIds(this.selectedRowGroup),
      batch_id: '-1',
      cancel_date: '',
      isEnquiry_notifn: 0,
      isAlumniSMS: 0,
      isTeacherSMS: 0,
      configuredMessage: false,
      message_id: messageSelected.messageId
    }

    this.widgetService.sendNotification(obj).subscribe(
      res => {
        console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Send Successfully"
        };
        this.appC.popToast(msg);
      },
      err => {
        let msg = {
          type: 'error',
          title: 'error',
          body: err.error.message
        };
        this.appC.popToast(msg);
        console.log(err);
      }
    )
  }

  sendPushNotification() {
    let messageSelected = this.getNotificationMessage();
    if (messageSelected === false) {
      return;
    }
    let obj = {
      notifn_message: messageSelected.message,
      message_id: messageSelected.messageId,
      student_ids: this.getListOfIds(this.selectedRowGroup),
    }
    this.widgetService.sendPushNotificationToServer(obj).subscribe(
      res => {
        console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Send Successfully"
        };
        this.appC.popToast(msg);
      },
      err => {
        let msg = {
          type: 'error',
          title: 'error',
          body: err.error.message
        };
        this.appC.popToast(msg);
        console.log(err);
      }
    )
  }

  sendSmsForApp(value) {
    if (confirm("Are you sure you want to send SMS to selected users?")) {
      let obj = {
        app_sms_type: Number(value),
        studentArray: this.getListOfIds(this.selectedRowGroup),
        userArray: this.getListOfIds(this.selectedUserId),
        user_role: this.loginField.checkBox
      }
      this.widgetService.smsForAddDownload(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Message',
            body: "Send Successfully"
          };
          this.appC.popToast(msg);
        },
        err => {
          let msg = {
            type: 'error',
            title: 'error',
            body: err.error.message
          };
          this.appC.popToast(msg);
          console.log(err);
        }
      )

    }
  }

  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }

  getListOfIds(data) {
    return data.join(',');
  }

  getLeaveNumber(data) {
    return moment(data.end_date).diff(moment(data.start_date), 'days') + 1
  }

}
