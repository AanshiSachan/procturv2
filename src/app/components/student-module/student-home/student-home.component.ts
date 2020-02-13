import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { instituteInfo } from '../../../model/instituteinfo';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { MenuItem } from 'primeng/primeng';
import * as moment from 'moment';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { WidgetService } from '../../../services/widget.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { StudentForm } from '../../../model/student-add-form';
import { ISubscription } from "rxjs/Subscription";
import { CommonServiceFactory } from '../../../services/common-service';
import { ProductService } from '../../../services/products.service';
var jsPDF = require('jspdf');
import { HttpService } from '../../../services/http.service';
declare var $;

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {

  private subscriptionStudent: ISubscription;
  private subscriptionCustomComp: ISubscription;
  @ViewChild('studentPage') studentPage: ElementRef;
  @ViewChild('mySidenav') mySidenav: ElementRef;
  @ViewChild('optMenu') optMenu: ElementRef;

  sizeArr: any[] = [50, 100, 250, 500, 1000];
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
  bulkActionItems: MenuItem[];
  private slots: any[] = [];
  private selectedSlots: any[] = [];
  academicYear: any[] = [];
  defaultAcadYear: any;
  private slotIdArr: any[] = [];
  StudentSettings: ColumnSetting[];
  leaveDataArray: any = [];
  messageList: any = [];
  selectedUserId: any = [];
  studentbatchList: any[] = [];
  studentByIdcustomComponents: any[] = [];

  private studentdisplaysize: number = 100;
  perPage: number = 10;
  PageIndex: number = 1;
  maxPageSize: number = 0;
  totalRow: number = 0;
  selectedRowCount: number = 0;
  loading_message: number = 1;
  paymentMode: number = 0;
  isConfirmBulkDelete: boolean;
  isNotifyStudent: boolean;
  isMarkLeave: boolean;
  isShareDetails: boolean = false;
  private advancedFilter: boolean = false;
  private isAllSelected: boolean = false;
  isDeleteStudentPrompt: boolean = false;
  isProfessional: boolean = false;
  isAddComment: boolean = false;
  isRippleLoad: boolean = false;
  isSideBar: boolean = false;
  isOptions: boolean = false;
  private isAssignBatch: boolean = false;
  isEdit: boolean = true;
  private selectedRow: any;
  studentDetailsById: any;
  studentCustomComponent: any; today: any = Date.now();
  searchBarData: any = null;
  private selectedSlotsID: string = '';
  private selectedSlotsString: string = '';
  private assignedBatchString: string = '';
  currentDirection: string = 'asc';
  sortBy: string = "student_name";
  downloadStudentReportAccess: boolean = false;


  private editForm: any = {
    comments: "",
    institution_id: sessionStorage.getItem('institute_id')
  };

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
    order_by: '',
    doa_from_date: moment().format('YYYY-MM-DD'),
    doa_to_date: moment().format('YYYY-MM-DD')
  };

  advancedFilterForm: instituteInfo = {
    school_id: -1,
    standard_id: -1,
    batch_id: -1,
    name: "",
    is_active_status: 1,
    mobile: "",
    language_inst_status: -1,
    subject_id: -1, slot_id: "",
    master_course_name: "",
    course_id: -1,
    start_index: 0,
    batch_size: this.studentdisplaysize,
    sorted_by: '',
    order_by: '',
    doa_from_date: moment().format('YYYY-MM-DD'),
    doa_to_date: moment().format('YYYY-MM-DD')
  };

  applyLeave = {
    student_id: '',
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    reason: ''
  };

  sendNotification = {
    loginMessageChkbx: false,
    smsChkbx: true,
    emailChkbx: false,
    studentChkbx: true,
    parentChkbx: false,
    gaurdianChkbx: false,
    subjectMessage: ''
  }
  loginField = { checkBox: 0 };

  studentData: any = {
    studentName: '',
    batchName: '',
    projectName: '',
    dateFrom: '',
    dateTo: '',
    trainingLocation: ''
  };

  @ViewChild('content') content: ElementRef;

  private studentAddFormData: StudentForm = {
    student_name: "",
    student_sex: "",
    student_email: "",
    student_phone: "",
    student_curr_addr: "",
    dob: "",
    doj: moment().format('YYYY-MM-DD'),
    school_name: "-1",
    student_class_key: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
    is_active: "Y",
    institution_id: sessionStorage.getItem('institute_id'),
    assignedBatches: [],
    assignedBatchescademicYearArray: [""],
    assignedCourse_Subject_FeeTemplateArray: [""],
    fee_type: 0,
    fee_due_day: 0,
    batchJoiningDates: [],
    comments: "",
    photo: null,
    enquiry_id: "",
    student_disp_id: "",
    student_manual_username: null,
    social_medium: -1,
    attendance_device_id: "",
    religion: "",
    standard_id: "-1",
    subject_id: "-1",
    slot_id: null,
    language_inst_status: "admitted",
    stuCustomLi: [],
    deleteCourse_SubjectUnPaidFeeSchedules: false
  };
  assignedStandard = "-1";
  /* =================================================================================================== */
  constructor(private prefill: FetchprefilldataService,
    private router: Router,
    private studentFetch: FetchStudentService,
    private appC: AppComponent,
    private studentPrefill: AddStudentPrefillService,
    private widgetService: WidgetService,
    private postService: PostStudentDataService,
    private actRoute: ActivatedRoute,
    private auth: AuthenticatorService,
    private _commService: CommonServiceFactory,
    private http: ProductService,
    private http_service: HttpService
  ) {

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.actRoute.queryParams.subscribe(e => {
      if (e.id != null && e.id != undefined && e.id != '') {
        if (e.action == undefined || e.action == undefined || e.action == '') {
          this.router.navigate(['/view/students/edit/' + e.id]);
        }
        else {
          switch (e.action) {
            case 'studentEdit': {
              this.router.navigate(['/view/students/edit/' + e.id]);
              break;
            }
            case 'studentFee': {
              this.editFeePDCDetails(e.id);
              break;
            }
            case 'studentInventory': {
              this.editInventory(e.id);
              break;
            }
            case 'studentLeave': {
              //console.log(e);
              break;
            }
            case 'studentDelete': {
              //console.log(e);
              break;
            }
          }
        }
      }
      else {
        if (this.isProfessional) {
          this.StudentSettings = [
            { primaryKey: 'student_disp_id', header: 'Student Id' },
            { primaryKey: 'student_name', header: 'Name' },
            { primaryKey: 'student_phone', header: 'Contact No' },
            { primaryKey: 'student_class', header: 'Master Course' },
            { primaryKey: 'batchesAssigned', header: 'Batch Assigned' }
          ];
        }
        else {
          this.StudentSettings = [
            { primaryKey: 'student_disp_id', header: 'Student Id' },
            { primaryKey: 'student_name', header: 'Name' },
            { primaryKey: 'student_phone', header: 'Contact No' },
            { primaryKey: 'student_class', header: 'Standard' },
            { primaryKey: 'batchesAssigned', header: 'Course Assigned' }
          ];
        }
      }
    });
  }

  /* OnInit function to set toggle default columns and load student data for table*/
  /* =================================================================================================== */
  ngOnInit() {
    this.isRippleLoad = true;
    this.fetchStudentPrefill();
    this.loading_message = 3;
    this.studentDataSource = [];
    this.totalRow = this.studentDataSource.length;
    this.bulkActionItems = [
      {
        label: 'Send Notification', icon: 'far fa-bell', command: () => {
          this.notifySelectedStudent();
        }
      },
      {
        label: 'Admission Form', icon: 'fa fa-address-card', command: () => {
          this.downloadStudentAdmissionForm();
        }
      }, {
        label: 'Fee Installment', icon: 'fa fa-dollar', command: () => {
          this.studentFeeInstallment(-1) // because fee install ment at multiple student has some issues
          // this.isShareDetails = true;
        }
      },
      {
        label: 'Download ID card', icon: 'fa fa-download', command: () => {
          this.downloadStudentIDCard() // because fee install ment at multiple student has some issues
          // this.isShareDetails = true;
        }
      },
      {
        label: 'Assign Standard', icon: 'fa fa-users', command: () => {
          $('#assignStandard').modal('show');
        }
      }
    ];
    this.checkDownloadRoleAccess();
  }

  // Assign standard to multiple students at single time. -- Developed by Swapnil
  assignStandard(){
    if(this.assignedStandard != "-1"){
      if (confirm("Are you sure you want to assign the standard?")) {
        let studentArray = {};
        for (let index = 0; index < this.selectedRowGroup.length; index++) {
          studentArray[this.selectedRowGroup[index]] = true
        }
        let obj = {
          "institute_id": sessionStorage.getItem('institute_id'),
          "studentArray": studentArray
        }
        let url = `/api/v1/students/${this.assignedStandard}/assignStandard`;
        this.isRippleLoad = true;
        this.http_service.postData(url,obj).subscribe(
          (data: any) => {
            let alert = {
              type: 'success',
              title: '',
              body: 'Standard updated successfully'
            }
            this.appC.popToast(alert);
            this.isRippleLoad = false;
            this.assignedStandard = "-1";
            this.loadTableDataSource(this.instituteData);
            $('#assignStandard').modal('hide');
          },
          (error: any) => {
            this.isRippleLoad = false;
            let alert = {
              type: 'error',
              title: '',
              body: error
            }
            this.appC.popToast(alert);
          }
        )
      }
    }
    else{
      let alert = {
        type: 'info',
        title: '',
        body: 'Please select standard'
      }
      this.appC.popToast(alert);
    }
  }

  checkDownloadRoleAccess() {
    if(sessionStorage.getItem('downloadStudentReportAccess')=='true'){
        this.downloadStudentReportAccess = true;
    }else{
      this.bulkActionItems.splice(3,1);
    }
}

  /* Fetch data from server and convert to custom array */
  loadTableDataSource(obj) {
    console.log(obj);
    this.isRippleLoad = true;
    this.selectedRow = null;
    this.selectedRowGroup = [];
    this.closeSideBar();
    this.loading_message = 1;
    this.isAllSelected = false;
    if (obj.start_index == 0) {
      return this.studentFetch.fetchAllStudentDetails(obj).subscribe(
        res => {
          this.isRippleLoad = false;
          /* records */
          if (res.length != 0) {
            this.totalRow = res[0].total_student_count;
          //  this._commService.contactNoPatternChange(res);
           this.contactNoPatternChange(res);
            this.studentDataSource = res;
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any student for the specified query'
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
            //this._commService.contactNoPatternChange(res);
            this.contactNoPatternChange(res);
            this.studentDataSource = res;
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any student for the specified query'
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

  contactNoPatternChange(list) {
    if(sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin') { // if user is admin
    if(sessionStorage.getItem('permissions') != null && sessionStorage.getItem('permissions') != ''){
        var permissions = JSON.parse(sessionStorage.getItem('permissions'));
        if(!permissions.includes('726')){
            list.forEach(el =>{
            var countryCode = el.student_phone.split('-')[0];
            var phnNo = el.student_phone.split('-')[1];
            var result;
            if(phnNo.length > 4){
            result = phnNo.replace(/\d{4}$/, 'XXXX');
            }
            else {
            result = phnNo.replace(/\d{1}$/, 'X');
            }
            el.student_phone = countryCode + '-' + result;
        })
        }
    }
    }
}

  downloadStudentIDCard() {
    console.log(this.selectedUserId)
    let studentId = this.getListOfIds(this.selectedRowGroup).split(',');
    const url = '/admit-card/download';
    this.isRippleLoad = true;
    this.postService.stdPostData(url, studentId).subscribe(
      (res: any) => {
        console.log(res);
        this.isRippleLoad = false;
        if (res) {
          let resp = res.response;
          if (resp.document != "") {
            let byteArr = this._commService.convertBase64ToArray(resp.document);
            let fileName = 'card.pdf'; //res.docTitle;
            let file = new Blob([byteArr], { type: 'application/pdf;charset=utf-8;' });
            let url = URL.createObjectURL(file);
            let dwldLink = document.getElementById('downloadFileClick1');
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", fileName);
            document.body.appendChild(dwldLink);
            dwldLink.click();
          }
          else {
            this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
          }
        } else {
          this.isRippleLoad = false;
          this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
        }
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )

  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getDirection(e) {
    //console.log(this.currentDirection);
    if (e) {
      this.currentDirection = 'asc';

    }
    else {
      this.currentDirection = 'desc';

    }
  }


  /* fetch the data from server based on specific page number by converting the index into start_index */
  /* =================================================================================================== */
  /* =================================================================================================== */
  fectchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
    this.instituteData.start_index = startindex;
    //this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
    //this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
    //this.instituteData.filtered_statuses = this.statusString.join(',');
    this.loadTableDataSource(this.instituteData);
  }

  /* Fetch next set of data from server and update table */
  /* =================================================================================================== */
  /* =================================================================================================== */
  fetchNext() {
    this.PageIndex++;
    this.fectchTableDataByPage(this.PageIndex);
  }

  /* Fetch previous set of data from server and update table */
  /* =================================================================================================== */
  /* =================================================================================================== */
  fetchPrevious() {
    this.PageIndex--;
    this.fectchTableDataByPage(this.PageIndex);
  }

  /* navigate the user to edit page for the specific student */
  /* =================================================================================================== */
  /* =================================================================================================== */
  editStudent(id) {
    this.router.navigate(['/view/students/edit/' + id]);
  }

  /* Delete the student selected or archieve the student selected */
  /* =================================================================================================== */
  /* =================================================================================================== */
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
        this.loadTableDataSource(this.instituteData);
      }
    );
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  confirmDeleteBulk() {
    this.isConfirmBulkDelete = true;
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  cancelDeleteBulk() {
    this.isConfirmBulkDelete = false;
  }


  /* =================================================================================================== */
  /* =================================================================================================== */
  deleteBulkStudent() {
    //console.log(this.selectedRowGroup);
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  deleteStudentOpen(row) {
    this.selectedRow = row;
    if (this.selectedRow.noOfBatchesAssigned == 0) {
      this.isDeleteStudentPrompt = true;
    }
    else {
      let msg = {
        type: 'error',
        title: "Unable to Delete Student",
        body: "Requested student cannot be deleted as he/she has been assigned to a batch/course"
      }
      this.appC.popToast(msg);
    }

  }


  /* =================================================================================================== */
  /* =================================================================================================== */
  closeDeletePopup() {
    this.isDeleteStudentPrompt = false;
  }


  /* Perform the bulk action for checcked row on basis of the id of selected LI */
  /* =================================================================================================== */
  /* =================================================================================================== */
  bulkActionPerformer(id) {

    if (id == 1) {
      if (this.selectedRowGroup.length != 0) {
        //console.log('bulk action' + id + 'selected');
        //console.log(this.selectedRowGroup);
      }
      else {
        let msg = {
          type: 'warning',
          title: '',
          body: 'Please select atleast one row to perform bulk action'
        }
        this.appC.popToast(msg);
      }
    }
    else if (id == 2) {
      if (this.selectedRowGroup.length != 0) {
        //console.log('bulk action' + id + 'selected');
      }
      else {
        let msg = {
          type: 'warning',
          title: '',
          body: 'Please select atleast one row to perform bulk action'
        }
        this.appC.popToast(msg);
      }
    }
  }

  /* Function to open advanced filter */
  /* =================================================================================================== */
  /* =================================================================================================== */
  openAdFilter() {
    this.closeSideBar();
    //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
    document.getElementById('adFilterOpen').classList.add('hide');
    document.getElementById('basic-search').classList.add('hide');
    document.getElementById('adFilterExit').classList.remove('hide');
    // document.getElementById('black-bg').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
  }

  /* Function to close advanced filter */
  /* =================================================================================================== */
  /* =================================================================================================== */
  closeAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.remove('hasFilter');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('basic-search').classList.remove('hide');
    document.getElementById('adFilterOpen').classList.remove('hide');
    // document.getElementById('black-bg').classList.add('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }

  /* update the advanced filter forn */
  /* =================================================================================================== */
  /* =================================================================================================== */
  advancedSearch() {
    let tempCustomArr: any[] = [];
    this.customComponents.forEach(el => {
      //console.log(el);
      if (el.is_searchable == 'Y' && el.value != "") {
        if (el.type == 5 && el.value != "" && el.value != null && el.value != "Invalid date") {
          let obj = {
            component_id: el.id,
            enq_custom_value: moment(el.value).format("YYYY-MM-DD")
          }
          tempCustomArr.push(obj);
        }
        else {
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

    if (moment(this.advancedFilterForm.doa_from_date).format('YYYY-MM-DD') > moment(this.advancedFilterForm.doa_to_date).format('YYYY-MM-DD')) {
      this.appC.popToast({ type: "error", title: "", body: "From date cannot be greater than to date" })
      return false;
    }
    else {
      this.advancedFilterForm.doa_from_date = this._commService.sourceValueCheck(this.advancedFilterForm.doa_from_date) ? '' : moment(this.advancedFilterForm.doa_from_date).format('YYYY-MM-DD');
      this.advancedFilterForm.doa_to_date = this._commService.sourceValueCheck(this.advancedFilterForm.doa_to_date) ? '' : moment(this.advancedFilterForm.doa_to_date).format('YYYY-MM-DD');
    }


    this.advancedFilterForm.is_active_status = parseInt(this.advancedFilterForm.is_active_status);
    this.instituteData = this.advancedFilterForm;
    this.PageIndex = 1;
    this.instituteData.start_index = 0;
    this.loadTableDataSource(this.instituteData);
    this.closeAdFilter();
  }

  /* If the user select the top checkbox and update its status, all the rows are selectedd or unselected on this basis*/
  /* =================================================================================================== */
  /* =================================================================================================== */
  /* Fetches Data as per the user selected batch size */
  /* =================================================================================================== */
  /* =================================================================================================== */
  updateTableBatchSize(num) {
    this.PageIndex = 1;
    this.studentdisplaysize = parseInt(num);
    this.bulkActionFunction();
    this.instituteData.batch_size = this.studentdisplaysize;
    this.PageIndex = 1;
    this.instituteData.start_index = 0;
    this.studentDataSource = [];
    this.isRippleLoad = true;
    this.studentFetch.fetchAllStudentDetails(this.instituteData).subscribe(
      res => {
        this.isRippleLoad = false;
        if (res.length != 0) {
          this.totalRow = res[0].total_student_count;
          this.studentDataSource = res;
        }
        else {
          let alert = {
            type: 'info',
            title: 'No Records Found',
            body: 'We did not find any student for the specified query'
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
  /* =================================================================================================== */
  /* =================================================================================================== */
  bulkActionFunction() {
    document.getElementById("bulk-drop").classList.toggle("show");
  }

  /* Download the records for student as per the set institute data */
  /* =================================================================================================== */
  /* =================================================================================================== */
  downloadAllStudent() {
    let data = {
      school_id: this.instituteData.school_id,
      standard_id: this.instituteData.standard_id,
      filtered_slots: this.instituteData.filtered_slots,
      batch_id: this.instituteData.batch_id,
      subject_id: this.instituteData.subject_id,
      name: "",
      language_inst_status: this.instituteData.language_inst_status,
      is_active_status: this.instituteData.is_active_status,
      mobile: "",
      master_course_name: this.instituteData.master_course_name,
      course_id: this.instituteData.course_id
    }

    this.isRippleLoad = true;
    this.studentFetch.downloadStudentTableasXls(data).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        let byteArr = this._commService.convertBase64ToArray(res.document);
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
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: 'Failed To Download XLS',
          body: err.error.message
        }
        this.appC.popToast(msg);
      }
    );
  }

  /* Store the prefill data for student add form component */
  /* =================================================================================================== */
  /* =================================================================================================== */
  fetchStudentPrefill() {

    this.isRippleLoad = false;

    this.prefill.getEnqStardards().subscribe(data => {
      this.standardList = data;
      //console.log(data);
    });

    this.prefill.getSchoolDetails().subscribe(data => {
      this.schoolList = data;
      //console.log(data);
    });

    this.studentPrefill.fetchBatchDetails().subscribe(data => {
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

    this.prefill.getAllFinancialYear().subscribe(
      (data: any) => {
        this.academicYear = data;
        this.academicYear.forEach(e => {
          if (e.default_academic_year == 1) {
            this.defaultAcadYear = e.inst_acad_year_id;
          }
        });
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    )

    let id = ''
    this.studentPrefill.fetchCustomComponent(id).subscribe(data => {
      if (data != null) {
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
          if (el.type == 4) {
            obj = {
              data: el,
              id: el.component_id,
              is_required: el.is_required,
              is_searchable: el.is_searchable,
              label: el.label,
              prefilled_data: this.createPrefilledDataType4(el.prefilled_data.split(','), el.enq_custom_value.split(','), el.defaultValue.split(',')),
              selected: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? this.getDefaultArr(el.defaultValue) : el.enq_custom_value.split(','),
              selectedString: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
              type: el.type,
              value: el.enq_custom_value
            }
          }
          if (el.type == 3) {
            obj = {
              data: el,
              id: el.component_id,
              is_required: el.is_required,
              is_searchable: el.is_searchable,
              label: el.label,
              prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
              selected: [],
              selectedString: "",
              type: el.type,
              value: el.enq_custom_value
            }
          }
          if (el.type == 2) {
            obj = {
              data: el,
              id: el.component_id,
              is_required: el.is_required,
              is_searchable: el.is_searchable,
              label: el.label,
              prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
              selected: [],
              selectedString: '',
              type: el.type,
              value: el.enq_custom_value == "" ? false : true,
            }
          }
          else if (el.type != 2 && el.type != 4 && el.type != 3) {
            obj = {
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
          }
          this.customComponents.push(obj);
        });
      }
    });

  }


  /* =================================================================================================== */
  /* =================================================================================================== */
  getDefaultArr(d): any[] {
    let a: any[] = [];
    a.push(d);
    return a;
  }


  /* =================================================================================================== */
  /* =================================================================================================== */
  createPrefilledDataType4(dataArr: any[], selected: any[], def: any[]): any[] {
    let customPrefilled: any[] = [];
    if (selected.length != 0 && selected[0] != "") {
      dataArr.forEach(el => {
        let obj = {
          data: el,
          checked: selected.includes(el)
        }
        customPrefilled.push(obj);
      });
    }
    else {
      dataArr.forEach(el => {
        let obj = {
          data: el,
          checked: def.indexOf(el) != -1
        }
        customPrefilled.push(obj);
      });
    }
    return customPrefilled;
  }

  /* Custom Compoenent array creater */
  /* =================================================================================================== */
  /* =================================================================================================== */
  createPrefilledData(dataArr: any[]): any[] {
    let customPrefilled: any[] = [];
    dataArr.forEach(el => {
      let obj = {
        data: el.toLowerCase(),
        checked: false
      }
      customPrefilled.push(obj);
    });

    return customPrefilled;
  }

  /* if custom component is of type multielect then toggle the visibility of the dropdowm */
  /* =================================================================================================== */
  /* =================================================================================================== */
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
  /* =================================================================================================== */
  /* =================================================================================================== */
  updateMultiSelect(data, id) {
    this.customComponents.forEach(el => {
      if (el.id == id) {
        let x = []
        let y = el.prefilled_data;
        y.forEach(e => {
          if (e.checked) {
            x.push(e.data)
          }
        });
        el.selected = x;
        el.selectedString = el.selected.join(',');
        el.value = el.selectedString;
      }
    });
  }

  /* When user select the master course or standard then fetch the sub or sub course for them */
  /* =================================================================================================== */
  /* =================================================================================================== */
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
  /* =================================================================================================== */
  /* =================================================================================================== */
  fetchCourseForMaster(id) {
    this.advancedFilterForm.subject_id = '-1';
    this.subjectList = [];
    this.studentPrefill.fetchCourseList(id).subscribe(
      res => {
        this.subjectList = res;
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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

  /* =================================================================================================== */
  /* =================================================================================================== */
  searchDatabase() {
    this.PageIndex = 1;
    this.instituteData.start_index = 0;
    /* If User has entered an empty value needs to be informed */
    if (this.searchBarData == '' || this.searchBarData == ' ' || this.searchBarData == null || this.searchBarData == undefined) {
      this.instituteData = { school_id: -1, standard_id: -1, batch_id: -1, name: '', is_active_status: 1, mobile: "", language_inst_status: -1, subject_id: -1, slot_id: "", master_course_name: "", course_id: -1, start_index: 0, batch_size: this.studentdisplaysize, sorted_by: '', order_by: '' };
      this.loadTableDataSource(this.instituteData);
    }
    /* valid input detected, check for type of input */
    else {
      /* If input is of type string then validate string validity*/
      if (isNaN(this.searchBarData)) {
        this.instituteData = { school_id: -1, standard_id: -1, batch_id: -1, name: this.searchBarData, is_active_status: 1, mobile: "", language_inst_status: -1, subject_id: -1, slot_id: "", master_course_name: "", course_id: -1, start_index: 0, batch_size: this.studentdisplaysize, sorted_by: '', order_by: '' };
        this.loadTableDataSource(this.instituteData);
      }/* If not string then use the data as a number*/
      else {
        this.instituteData = { school_id: -1, standard_id: -1, batch_id: -1, name: '', is_active_status: 1, mobile: this.searchBarData, language_inst_status: -1, subject_id: -1, slot_id: "", master_course_name: "", course_id: -1, start_index: 0, batch_size: this.studentdisplaysize, sorted_by: '', order_by: '' };
        this.loadTableDataSource(this.instituteData);
      }

    }
  }

  /* update the latest comment for the selected student */
  /* =================================================================================================== */
  /* =================================================================================================== */
  openEditComment(row) {
    this.selectedRow = row;
    this.isAddComment = true;
  }

  /* update the latest comment for the selected student */
  /* =================================================================================================== */
  /* =================================================================================================== */
  closeEditComment() {
    this.isAddComment = false;
  }

  /* update the latest comment for the selected student */
  /* =================================================================================================== */
  /* =================================================================================================== */
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

  /* =================================================================================================== */
  /* =================================================================================================== */
  getMin(): number {
    return ((this.studentdisplaysize * this.PageIndex) - this.studentdisplaysize) + 1;
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getMax(): number {
    if (this.studentDataSource.length != 0) {
      let max = this.studentdisplaysize * this.PageIndex;
      if (max > this.totalRow) {
        max = this.totalRow;
      }
      return max;
    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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

  /* =================================================================================================== */
  /* =================================================================================================== */
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

  /* =================================================================================================== */
  /* =================================================================================================== */
  getSelected(ev) {
    this.selectedRowGroup = ev;
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getSelectedUserIDS(ev) {
    this.selectedUserId = ev;
    sessionStorage.removeItem('global_search_edit_student');
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getRowCount(ev) {
    //console.log(ev);
    this.selectedRowCount = ev;
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  userRowSelect(ev) {
    if (ev != null) {
      this.studentAddFormData = { student_name: "", student_sex: "", student_email: "", student_phone: "", student_curr_addr: "", dob: "", doj: moment().format('YYYY-MM-DD'), school_name: "-1", student_class_key: "", parent_name: "", parent_email: "", parent_phone: "", guardian_name: "", guardian_email: "", guardian_phone: "", is_active: "Y", institution_id: sessionStorage.getItem('institute_id'), assignedBatches: [], assignedBatchescademicYearArray: [""], assignedCourse_Subject_FeeTemplateArray: [""], fee_type: 0, fee_due_day: 0, batchJoiningDates: [], comments: "", photo: null, enquiry_id: "", student_disp_id: "", student_manual_username: null, social_medium: -1, attendance_device_id: "", religion: "", standard_id: "-1", subject_id: "-1", slot_id: null, language_inst_status: "admitted", stuCustomLi: [], deleteCourse_SubjectUnPaidFeeSchedules: false };
      this.openSideBar(ev);
      this.selectedRow = ev;
    }
    if (this.isSideBar) {
      this.subscriptionStudent.unsubscribe();
      this.subscriptionCustomComp.unsubscribe();
    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  sortTableById(id) {
    this.sortBy = id;
    //console.log(id);
    if (id != 'batchesAssigned') {
      this.instituteData.sorted_by = id;
      this.instituteData.order_by = this.currentDirection;
      this.PageIndex = 1;
      this.instituteData.start_index = 0;
      this.loadTableDataSource(this.instituteData);
    }
  }


  /* =================================================================================================== */
  /* =================================================================================================== */
  openSideBar(ev) {
    let mySidenavWidth = '27%';
    if (window.innerWidth < 768)
      mySidenavWidth = '100%';
    this.studentPage.nativeElement.style.width = "70%";
    this.studentPage.nativeElement.style.marginRight = mySidenavWidth;
    this.mySidenav.nativeElement.style.width = mySidenavWidth;
    this.mySidenav.nativeElement.style.display = 'block';
    // this.optMenu.nativeElement.classList.add('shorted');
    let id = ev.student_id;
    this.isSideBar = false;
    this.isRippleLoad = true;
    this.studentByIdcustomComponents = [];
    this.subscriptionStudent = this.studentFetch.getStudentById(id).subscribe(
      (res: any) => {
        this.studentDetailsById = res;
        this.studentAddFormData = res;
        this.studentAddFormData.student_class = res.student_class_key;
        this.subscriptionCustomComp = this.studentPrefill.fetchCustomComponentById(id).subscribe(
          cus => {
            if (cus != null) {
              this.studentCustomComponent = cus;
              cus.forEach(el => {
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
                  value: el.enq_custom_value,
                  comp_length: el.comp_length
                }
                if (el.type == 4) {
                  obj = {
                    data: el,
                    id: el.component_id,
                    is_required: el.is_required,
                    is_searchable: el.is_searchable,
                    label: el.label,
                    prefilled_data: this.createPrefilledDataType4(el.prefilled_data.split(','), el.enq_custom_value.split(','), el.defaultValue.split(',')),
                    selected: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? this.getDefaultArr(el.defaultValue) : el.enq_custom_value.split(','),
                    selectedString: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
                    type: el.type,
                    value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
                    comp_length: el.comp_length
                  }
                }
                if (el.type == 3) {
                  obj = {
                    data: el,
                    id: el.component_id,
                    is_required: el.is_required,
                    is_searchable: el.is_searchable,
                    label: el.label,
                    prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
                    selected: [],
                    selectedString: "",
                    type: el.type,
                    value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
                    comp_length: el.comp_length
                  }
                }
                if (el.type == 2) {
                  obj = {
                    data: el,
                    id: el.component_id,
                    is_required: el.is_required,
                    is_searchable: el.is_searchable,
                    label: el.label,
                    prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
                    selected: [],
                    selectedString: '',
                    type: el.type,
                    value: this.getCustomComponentCheckboxValue(el.enq_custom_value),
                    comp_length: el.comp_length
                  }
                }
                else if (el.type != 2 && el.type != 4 && el.type != 3) {
                  obj = {
                    data: el,
                    id: el.component_id,
                    is_required: el.is_required,
                    is_searchable: el.is_searchable,
                    label: el.label,
                    prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
                    selected: [],
                    selectedString: '',
                    type: el.type,
                    value: el.enq_custom_value,
                    comp_length: el.comp_length
                  }
                }
                this.studentByIdcustomComponents.push(obj);
              });
              this.studentBatchDetailsLoader(id);
            }
            else {
              this.studentBatchDetailsLoader(id);
            }
          },
          err => {
            this.isRippleLoad = false;
          }
        )
      }
    );
  }

  /* ============================================================================================================================ */
  getCustomComponentCheckboxValue(e): boolean {
    if (e == 'Y') {
      return true;
    }
    else {
      return false;
    }
  }

  /* ============================================================================================================================ */

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getAssignDate(e): string {
    if (e == '' || e == null) {
      return moment().format('YYYY-MM-DD')
    }
    else {
      return moment(e).format('YYYY-MM-DD')
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateAssignedBatches(arr: any[]) {
    let batchString: any[] = [];
    this.studentAddFormData.assignedBatches = [];
    this.studentAddFormData.batchJoiningDates = [];
    this.studentAddFormData.assignedBatchescademicYearArray = [""];
    this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = [""];
    let temp: any[] = [];
    let tempDate: any[] = [];
    arr.forEach(el => {
      if (el.isSelected) {
        if (this.isProfessional) {
          temp.push(el.data.batch_id.toString());
          tempDate.push(moment(el.assignDate).format('YYYY-MM-DD'));
          batchString.push(el.data.batch_name);
          this.studentAddFormData.assignedBatchescademicYearArray.push(el.data.academic_year_id);
          this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray.push(el.data.selected_fee_template_id);
        }
        else {
          temp.push(el.data.course_id.toString());
          tempDate.push(moment(el.assignDate).format('YYYY-MM-DD'));
          batchString.push(el.data.course_name);
          this.studentAddFormData.assignedBatchescademicYearArray.push(el.data.academic_year_id);
          this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray.push(el.data.selected_fee_template_id);
        }
      }
    });
    this.studentAddFormData.assignedBatches = temp;
    this.studentAddFormData.batchJoiningDates = tempDate;
    this.assignedBatchString = batchString.join(',');
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  studentBatchDetailsLoader(id) {
    /* For Batch Model Fetch the Student Batches */
    if (this.isProfessional) {
      /* Fetching the student Slots */
      this.studentPrefill.fetchStudentBatchDetails(id).subscribe(
        data => {
          this.studentbatchList = [];
          data.forEach(el => {

            /*
              if batch is not havng any templete by selected by default then we select the
              default template provided for the selected course
             */
            if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
              el.feeTemplateList.forEach(e => {
                if (e.is_default == 1) {
                  el.selected_fee_template_id = e.template_id;
                }
              })
            }

            /*
            If the user has selected any fee template be previous interaction then we do not apply any template for the user
            */
            if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id != -1) {
              // el.feeTemplateList.forEach(e => {
              //   if (e.is_default == 1) {
              //     el.selected_fee_template_id = e.template_id;
              //   }
              // })
            }

            /*
               If the user has not selected any academic year than we set the academic for the selected user by default
            */
            if (el.academic_year_id == '-1') {
              el.academic_year_id = this.defaultAcadYear;
            }


            let obj = {
              isSelected: el.isAssigned == "Y" ? true : false,
              data: el,
              assignDate: this.getAssignDate(el.created_date)
            }

            this.studentbatchList.push(obj);
          });

          this.updateAssignedBatches(this.studentbatchList);

          this.isRippleLoad = false;
          this.isSideBar = true;
        },
        err => {
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
          //alert("Error Fetching Student Batch");
        }
      );
    }
    /* For Course Model fetch the Student Courses */
    else {
      this.studentPrefill.fetchStudentCourseDetails(id, '-1').subscribe(
        res => {
          this.studentbatchList = [];
          if (res != null) {
            if (res.coursesList != null && res.coursesList.length > 0) {
              res.coursesList.forEach(el => {
                if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
                  el.feeTemplateList.forEach(e => {
                    if (e.is_default == 1) {
                      el.selected_fee_template_id = e.template_id;
                    }
                  })
                }
                if (el.academic_year_id == '-1') {
                  el.academic_year_id = this.defaultAcadYear;
                }
                let obj = {
                  isSelected: el.isAssigned == "Y" ? true : false,
                  data: el,
                  assignDate: this.getAssignDate(el.created_date)
                }
                this.studentbatchList.push(obj);
                this.updateAssignedBatches(this.studentbatchList);
              });
            }
          }
          this.isRippleLoad = false;
          this.isSideBar = true;
        },
        err => {
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
        }
      );

    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  closeSideBar() {
    this.isSideBar = false;
    this.studentPage.nativeElement.style.width = "100%";
    this.studentPage.nativeElement.style.marginRight = "0";
    this.mySidenav.nativeElement.style.width = "0";
    this.mySidenav.nativeElement.style.display = 'none';
    // this.optMenu.nativeElement.classList.remove('shorted');
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  markStudentLeave(event) {
    this.applyLeave.student_id = event;
    this.isMarkLeave = true;
    this.fetchLEaveData();
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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
        //console.log(err);
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  closeMarkLeave() {
    this.isMarkLeave = false;
    this.applyLeave = {
      student_id: '',
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      reason: ''
    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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

  /* =================================================================================================== */
  /* =================================================================================================== */
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
        //console.log(err);
        this.isRippleLoad = false;
        let msg = {
          type: 'error',
          title: '',
          body: JSON.parse(err._body).message
        }
        this.appC.popToast(msg);
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  deletePerticularLeave(row) {
    //console.log(row);
    this.studentFetch.cancelLeaveOfDay(row.leave_id).subscribe(
      res => {
        //console.log(res);
        let msg = {
          type: 'success',
          title: 'Leave Removed',
          body: 'Leave removed for dates successfull'
        }
        this.appC.popToast(msg);
        this.fetchLEaveData();
      },
      err => {
        //console.log(err);
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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

  /* =================================================================================================== */
  /* =================================================================================================== */
  editFeePDCDetails(event) {
    sessionStorage.setItem('editPdc', "true");
    this.router.navigate(['/view/students/edit/' + event]);
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  editInventory(e) {
    sessionStorage.setItem('editInv', "true");
    this.router.navigate(['/view/students/edit/' + e]);
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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

  /* =================================================================================================== */
  /* =================================================================================================== */
  closeNotifyStudent() {
    this.isNotifyStudent = false;
  }

  // SEND NOTIFICATION POPUP
  /* =================================================================================================== */
  /* =================================================================================================== */
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
        //console.log(err);
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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
        //console.log(err);
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getDeliveryModeValue() {
    if (this.sendNotification.smsChkbx == true && this.sendNotification.emailChkbx == true) {
      return 2;
    } else if (this.sendNotification.smsChkbx == true && this.sendNotification.emailChkbx == false) {
      return 0;
    } else if (this.sendNotification.smsChkbx == false && this.sendNotification.emailChkbx == true) {
      return 1;
    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  validateAllFields() {
    if (this.sendNotification.smsChkbx == false && this.sendNotification.emailChkbx == false) {
      let msg = {
        type: 'error',
        title: '',
        body: "Please select Delivery Mode(SMS , Email)"
      };
      this.appC.popToast(msg);
      return false;
    }

    if (this.sendNotification.emailChkbx == true) {
      if (this.sendNotification.subjectMessage.trim() == "" || this.sendNotification.subjectMessage.trim() == null) {
        let msg = {
          type: 'error',
          title: '',
          body: "Please enter Email Subject"
        };
        this.appC.popToast(msg);
        return false;
      }
    }

    if ((this.sendNotification.studentChkbx == false) && (this.sendNotification.parentChkbx == false) && (this.sendNotification.gaurdianChkbx == false)) {
      let msg = {
        type: 'error',
        title: '',
        body: "Please correct option in Send SMS To.."
      };
      this.appC.popToast(msg);
      return false;
    }

  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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
        title: '',
        body: "Please select message"
      };
      this.appC.popToast(msg);
      return false;
    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getDestinationValue() {
    if (this.sendNotification.studentChkbx == true && this.sendNotification.parentChkbx == false && this.sendNotification.gaurdianChkbx == false) {
      return 0;
    } else if (this.sendNotification.studentChkbx == false && this.sendNotification.parentChkbx == true && this.sendNotification.gaurdianChkbx == false) {
      return 1;
    } else if (this.sendNotification.studentChkbx == false && this.sendNotification.parentChkbx == false && this.sendNotification.gaurdianChkbx == true) {
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

  /* =================================================================================================== */
  /* =================================================================================================== */
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
      configuredMessage: true,
      message_id: messageSelected.messageId
    }

    this.widgetService.sendNotification(obj).subscribe(
      res => {
        //console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Sent successfully"
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
        //console.log(err);
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
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
        //console.log(res);
        let msg = {
          type: 'success',
          title: 'Message',
          body: "Sent successfully"
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
        //console.log(err);
      }
    )
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  sendSmsForApp(value) {
    if (confirm("Are you sure you want to send SMS to selected users?")) {
      let obj = {
        app_sms_type: Number(value),
        studentArray: this.selectedRowGroup,
        userArray: this.selectedUserId,
        user_role: this.loginField.checkBox
      }
      this.widgetService.smsForAddDownload(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Message',
            body: "Sent successfully"
          };
          this.appC.popToast(msg);
        },
        err => {
          let msg = {
            type: 'error',
            title: 'error',
            body: err.message
          };
          this.appC.popToast(msg);
        }
      )

    }
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getListOfIds(data) {
    return data.join(',');
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  getLeaveNumber(data) {
    return moment(data.end_date).diff(moment(data.start_date), 'days') + 1
  }
  /* =================================================================================================== */
  /* =================================================================================================== */
  /* Open batch assign popup */
  openAssignBatch(e) {
    this.isAssignBatch = true;
  }

  showToggleLoader($event) {
    this.isRippleLoad = $event;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* close batch assign popup */
  closeBatchAssign() {
    /* batch has been already selected */
    if (this.studentAddFormData.assignedBatches != null && this.studentAddFormData.assignedBatches.length != 0) {
      for (let i in this.studentbatchList) {
        if (this.isProfessional) {
          /* course has been assigned */
          if (this.studentAddFormData.assignedBatches.includes(this.studentbatchList[i].data.batch_id.toString())) {
            this.studentbatchList[i].isSelected = true;
          }
          else {
            this.studentbatchList[i].isSelected = false;
          }
        }
        else {
          /* course has been assigned */
          if (this.studentAddFormData.assignedBatches.includes(this.studentbatchList[i].data.course_id.toString())) {
            this.studentbatchList[i].isSelected = true;
          }
          else {
            this.studentbatchList[i].isSelected = false;
          }
        }
      }
      this.isAssignBatch = false;
    }
    else if (this.studentAddFormData.assignedBatches == null || this.studentAddFormData.assignedBatches.length == 0) {
      for (let i in this.studentbatchList) {
        this.studentbatchList[i].isSelected = false;
      }
      this.isAssignBatch = false;
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getassignedBatchList(e) {
    this.studentAddFormData.assignedBatches = e.assignedBatches;
    this.studentAddFormData.batchJoiningDates = e.batchJoiningDates;
    this.studentAddFormData.assignedBatchescademicYearArray = e.assignedBatchescademicYearArray;
    this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = e.assignedCourse_Subject_FeeTemplateArray;
    this.studentAddFormData.deleteCourse_SubjectUnPaidFeeSchedules = e.deleteCourse_SubjectUnPaidFeeSchedules;
    this.assignedBatchString = e.assignedBatchString;
    this.isAssignBatch = e.isAssignBatch;
    this.updateStudentDataOnServer();
  }

  updateStudentDataOnServer() {
    let customArr = [];

    this.studentByIdcustomComponents.forEach(el => {
      let max_length = el.comp_length == 0 ? 100 : el.comp_length;
      /* Not Checkbox and value not empty */
      if (el.value != '' && el.type != 2 && el.type != 5) {

        let obj = {
          component_id: el.id,
          enq_custom_id: el.data.enq_custom_id,
          enq_custom_value: el.value,
          type: el.type,
          value: el.enq_custom_value,
          label: el.label,
          comp_length: max_length
        }
        customArr.push(obj);
      }
      /* Checkbox Custom Component */
      else if (el.type == 2) {
        if (el.value == "Y" || el.value == true) {
          let obj = {
            component_id: el.id,
            enq_custom_id: el.data.enq_custom_id,
            enq_custom_value: "Y",
            type: el.type,
            value: el.enq_custom_value,
            label: el.label,
            comp_length: max_length
          }
          customArr.push(obj);
        }
        else if (el.value == "N" || el.value == false) {
          let obj = {
            component_id: el.id,
            enq_custom_id: el.data.enq_custom_id,
            enq_custom_value: "N",
            type: el.type,
            value: el.enq_custom_value,
            label: el.label,
            comp_length: max_length
          }
          customArr.push(obj);
        }
      }
      /* Date Type Custom Component */
      else if (el.type == 5 && el.value != "" && el.value != null && el.value != "Invalid date") {
        let obj = {
          component_id: el.id,
          enq_custom_id: el.data.enq_custom_id,
          enq_custom_value: moment(el.value).format("YYYY-MM-DD"),
          type: el.type,
          value: el.enq_custom_value,
          label: el.label,
          comp_length: max_length
        }
        customArr.push(obj);
      }

    });

    /* Get slot data and store on form */
    this.studentAddFormData.slot_id = this.selectedSlotsID;
    this.studentAddFormData.stuCustomLi = customArr;

    if (this.studentAddFormData.assignedBatches == null || this.studentAddFormData.assignedBatches.length == 0) {
      this.studentAddFormData.assignedBatches = null
      this.studentAddFormData.assignedBatchescademicYearArray = null;
      this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = null;
    }

    this.postService.quickEditStudent(this.studentAddFormData, this.selectedRow.student_id).subscribe(
      (res: any) => {
        console.log(res);
        let alert = {
          type: 'success',
          title: 'Student Details Updated',
          body: ''
        }
        this.appC.popToast(alert);
        this.isSideBar = false;
        this.studentPage.nativeElement.style.width = "100%";
        this.studentPage.nativeElement.style.marginRight = "0";
        this.mySidenav.nativeElement.style.width = "0";
        this.mySidenav.nativeElement.style.display = 'none';
        // this.optMenu.nativeElement.classList.remove('shorted');
        this.searchDatabase();
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    );
  }

  downloadStudentAdmissionForm() {
    let obj: any = {
      studentIds: this.selectedRowGroup.join(',')
    };
    this.isRippleLoad = true;
    this.postService.downloadAdmissionForm(obj).subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        let byteArr = this._commService.convertBase64ToArray(res.document);
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('hiddenAnchorTag');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
      },
      err => {
        this.isRippleLoad = false;
        this._commService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  //get all selected studnet fee installment
  studentFeeInstallment(userType) {
    console.log('studentFeeInstallment');
    let object = {
      student_ids: this.selectedRowGroup.toString(),// string by ids common seperated
      institution_id: '',
      sendEmail: userType,
    }
    if (userType == 1) {
      object['user_role'] = this.paymentMode;
    }
    this.isRippleLoad = true;

    this.postService.getFeeInstallments(object).subscribe((res: any) => {
      this.isRippleLoad = false;
      if (userType == -1) {
        let byteArr = this._commService.convertBase64ToArray(res.document);
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('hiddenAnchorTag2');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
      }
      else {
        this.isShareDetails = false;
        let obj = {
          type: 'success',
          title: "Mails send successfully",
          body: ""
        }
        this.appC.popToast(obj);
      }
    },
      (err) => {
        this.isRippleLoad = false;
        this._commService.showErrorMessage('error', '', err.error.message);
      })
  }

  getCertificateData(event) {
    // this.certificate = true;
    this.isRippleLoad = true;
    let url = `/api/v1/students/studentCertificateDetails/?studentId=${event}`;
    this.http.getCertificateData(url).subscribe(
      (res: any) => {
        this.studentData = res;
        if (this.studentData.dateFrom != null) {
          this.studentData.dateFrom = moment(this.studentData.dateFrom).format('DD-MM-YYYY');
        }
        if (this.studentData.dateTo != null) {
          this.studentData.dateTo = moment(this.studentData.dateTo).format('DD-MM-YYYY');
        }
        setTimeout(() => {
          this.printDiv();
        }, 2000);
        this.isRippleLoad = false;
      },
      err => {
        console.log(err);
      }
    )
  }

  printDiv() {
    document.getElementById('dvContainer').className = 'outer-container';
    const doc = new jsPDF('l', 'in', 'a4');
    console.log(doc);
    doc.internal.scaleFactor = 1;

    // window.html2pdf(this.content.nativeElement, pdf, function (doc) {
    //   doc.save('certificate.pdf');
    // });

    doc.addHTML(this.content.nativeElement, function () {
      doc.save("certificate.pdf");
    });
    document.getElementById('dvContainer').className = 'hide';
  }
}
