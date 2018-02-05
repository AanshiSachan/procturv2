import { Component, OnInit, OnChanges } from '@angular/core';
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


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit, OnChanges {

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
  /* set true to see the sidebar */
  isSideBar: boolean = false;
  isOptions:boolean = false;
  private editForm: any = {
    comments: "",
    institution_id: sessionStorage.getItem('institute_id')
  }

  private headerArr: any = {
    student_disp_id: { id: 'student_disp_id', title: 'Student ID.', filter: false, show: true },
    student_name: { id: 'student_name', title: 'Student Name', filter: false, show: true },
    student_phone: { id: 'student_phone', title: 'Contact No.', filter: false, show: true },
    doj: { id: 'doj', title: 'Joining Date', filter: false, show: true },
    student_class: { id: 'student_class', title: 'Standard/Class', filter: false, show: true },
    parent_phone: { id: 'parent_phone', title: 'Parent Contact No.', filter: false, show: true },
    noOfBatchesAssigned: { id: 'noOfBatchesAssigned', title: 'Course Assigned', filter: false, show: true },
    student_email: { id: 'student_email', title: 'Student Email', filter: false, show: false },
    student_sex: { id: 'student_sex', title: 'Gender', filter: false, show: false },
    dob: { id: 'dob', title: 'Date Of Birth', filter: false, show: false },
    alternateEmailID: { id: 'alternateEmailID', title: 'Alternate Email', filter: false, show: false },
    guardian_email: { id: 'guardian_email', title: 'Guardian Email', filter: false, show: false },
    guardian_name: { id: 'guardian_name', title: 'Guardian Name', filter: false, show: false },
    guardian_phone: { id: 'guardian_phone', title: 'Guardian Phone', filter: false, show: false },
    parent_name: { id: 'parent_name', title: 'Parent Name', filter: false, show: false },
    parent_email: { id: 'parent_email', title: 'Parent Email', filter: false, show: false },
  };

  StudentSettings: ColumnSetting[] = [
    { primaryKey: 'student_disp_id', header: 'Student Id.' },
    { primaryKey: 'student_name', header: 'Name.' },
    { primaryKey: 'student_phone', header: 'Contact No.' },
    { primaryKey: 'doj', header: 'Date of Joining' },
    { primaryKey: 'student_class', header: 'Class' },
    { primaryKey: 'student_email', header: 'Email ID' },
    { primaryKey: 'noOfBatchesAssigned', header: 'Batch Assigned' }
  ];

  selectedOption: any = {
    student_email: { id: 'student_email', show: false },
    student_sex: { id: 'student_sex', show: false },
    dob: { id: 'dob', show: false },
    alternateEmailID: { id: 'alternateEmailID', show: false },
    guardian_email: { id: 'guardian_email', show: false },
    guardian_name: { id: 'guardian_name', show: false },
    guardian_phone: { id: 'guardian_phone', show: false },
    parent_name: { id: 'parent_name', show: false },
    parent_email: { id: 'parent_email', show: false },
  };


  myOptions: any[] = [
    { id: 'alternateEmailID', name: 'Alternate Email' },
    { id: 'dob', name: 'Date Of Birth' },
    { id: 'guardian_email', name: 'Guardian Email' },
    { id: 'guardian_name', name: 'Guardian Name' },
    { id: 'guardian_phone', name: 'Guardian Phone' },
    { id: 'student_sex', name: 'Gender' },
    { id: 'parent_name', name: 'Parent Name' },
    { id: 'parent_email', name: 'Parent Email' },
    { id: 'student_email', name: 'Student Email' }
  ]

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





  constructor(private prefill: FetchprefilldataService, private router: Router,
    private studentFetch: FetchStudentService, private login: LoginService,
    private appC: AppComponent, private studentPrefill: AddStudentPrefillService, private postService: PostStudentDataService) {
  }



  /* OnInit function to set toggle default columns and load student data for table*/
  ngOnInit() {

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.busy = this.loadTableDataSource(this.instituteData);
    this.busy = this.fetchStudentPrefill();
    this.myOptions = [
      { id: 'alternateEmailID', name: 'Alternate Email' },
      { id: 'dob', name: 'Date Of Birth' },
      { id: 'guardian_email', name: 'Guardian Email' },
      { id: 'guardian_name', name: 'Guardian Name' },
      { id: 'guardian_phone', name: 'Guardian Phone' },
      { id: 'student_sex', name: 'Gender' },
      { id: 'parent_name', name: 'Parent Name' },
      { id: 'parent_email', name: 'Parent Email' },
      { id: 'student_email', name: 'Student Email' },
      /* { id: 'student_phone', name: 'Contact No.' }, */
      /* { id: 'noOfBatchesAssigned', name: 'Course Assigned' }, */
      /* { id: 'doj', name: 'Joining Date' },
      { id: 'parent_phone', name: 'Parent Contact No.' }, */
      /* { id: 'student_class', name: 'Standard/Class' }, */
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
  }



  ngOnChanges() {

  }



  /* Fetch data from server and convert to custom array */
  loadTableDataSource(obj) {

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
            this.loading_message = 2;
            this.appC.popToast(alert);
            this.studentDataSource = [];
            this.totalRow = this.studentDataSource.length;
          }
        },
        err => {
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





  getDirection(): string {
    //console.log(this.currentDirection);
    if (this.currentDirection == "desc") {
      this.currentDirection = 'asc';
      return 'asc';
    }
    else if (this.currentDirection == 'asc') {
      this.currentDirection = 'desc';
      return 'desc';
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
    this.router.navigate(['/student/edit/'+id]);
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




  /* Toggle the status of the selected column the static column will not move and the user can toggle the rest */
  toggleOptionChange(bool, id) {
    if (bool) {
      this.selectedOption[id].show = true;
    }
    else {
      this.selectedOption[id].show = false;
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
        let obj = {
          component_id: el.id,
          enq_custom_value: el.value
        }
        tempCustomArr.push(obj);
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




  /* Store the prefill data for student add form component */
  fetchStudentPrefill() {


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
    this.masterCourseList.forEach(el => {
      if (el.master_course == course) {
        this.subCourseList = el.coursesList;
      }
    })
  }





  /* when the user select the master course then fetch course for the related */
  fetchCourseForMaster(id) {
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
    //console.log(id);
    this.instituteData.sorted_by = id;
    this.instituteData.order_by = this.getDirection();
    this.busy = this.loadTableDataSource(this.instituteData);
  }



  openSideBar(ev) {
    document.getElementById("student-side").style.width = "30%";
    document.getElementById("student-table").style.width = "70%";
    document.getElementById("paginator").style.width = "70%";
    document.getElementById("student-table").style.marginRight = "30%";
    document.getElementById("paginator").style.marginRight = "30%";    
    let id = ev.student_id;
    this.studentFetch.getStudentById(id).subscribe(
      res => {
        this.studentDetailsById = res;
        this.studentPrefill.fetchCustomComponentById(id).subscribe(
          cus => {
            this.studentCustomComponent = cus;
            this.isSideBar = true;
          }
        )
      }
    )
  }


  closeSideBar() {
    this.isSideBar = false;
    document.getElementById("student-side").style.width = "0";
    document.getElementById("student-table").style.width = "100%";
    document.getElementById("student-table").style.marginRight = "0";
    document.getElementById("paginator").style.width = "100%";
    document.getElementById("paginator").style.marginRight = "0";
  }
}
