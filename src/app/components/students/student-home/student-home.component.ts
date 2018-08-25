import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { instituteInfo } from '../../../model/instituteinfo';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { MenuItem } from 'primeng/primeng';
import * as moment from 'moment';
import { LoginService } from '../../../services/login-services/login.service';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { WidgetService } from '../../../services/widget.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { StudentForm } from '../../../model/student-add-form';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {


  private enqstatus: any = []; private masterCourseList: any = []; private schoolList: any = []; private subjectList: any = []; private studentStatusList: any = []; private batchList: any = []; private standardList: any = []; private subCourseList: any = []; private customComponent: any = []; private studentDataSource: any[] = []; private selectedRowGroup: any[] = []; private optionsModel: any = null; private customComponents: any[] = []; private advancedFilter: boolean = false; private studentdisplaysize: number = 50; isConfirmBulkDelete: boolean; isNotifyStudent: boolean; isMarkLeave: boolean;
  private isAllSelected: boolean = false; private selectedRow: any; studentDetailsById: any; studentCustomComponent: any; today: any = Date.now(); searchBarData: any = null; bulkActionItems: MenuItem[]; isProfessional: boolean = false; currentDirection: string = 'asc'; isDeleteStudentPrompt: boolean = false; isAddComment: boolean = false; perPage: number = 10; PageIndex: number = 1; maxPageSize: number = 0; totalRow: number = 0; private slots: any[] = [];
  private selectedSlots: any[] = []; academicYear: any[] = []; defaultAcadYear: any; private slotIdArr: any[] = []; private selectedSlotsString: string = ''; loading_message: number = 1; private selectedSlotsID: string = ''; selectedRowCount: number = 0; isRippleLoad: boolean = false; isSideBar: boolean = false; isOptions: boolean = false;
  private editForm: any = { comments: "", institution_id: sessionStorage.getItem('institute_id') }; StudentSettings: ColumnSetting[]; leaveDataArray: any = []; sortBy: string = "student_name";
  @ViewChild('studentPage') studentPage: ElementRef; @ViewChild('mySidenav') mySidenav: ElementRef; @ViewChild('optMenu') optMenu: ElementRef; sizeArr: any[] = [50, 100, 250, 500, 1000];
  instituteData: instituteInfo = { school_id: -1, standard_id: -1, batch_id: -1, name: "", is_active_status: 1, mobile: "", language_inst_status: -1, subject_id: -1, slot_id: "", master_course_name: "", course_id: -1, start_index: 0, batch_size: this.studentdisplaysize, sorted_by: '', order_by: '' };
  advancedFilterForm: instituteInfo = { school_id: -1, standard_id: -1, batch_id: -1, name: "", is_active_status: 1, mobile: "", language_inst_status: -1, subject_id: -1, slot_id: "", master_course_name: "", course_id: -1, start_index: 0, batch_size: this.studentdisplaysize, sorted_by: '', order_by: '' };
  applyLeave = { student_id: '', start_date: moment().format("YYYY-MM-DD"), end_date: moment().format("YYYY-MM-DD"), reason: '' };
  sendNotification = { loginMessageChkbx: false, smsChkbx: true, emailChkbx: false, studentChkbx: true, parentChkbx: false, gaurdianChkbx: false, subjectMessage: '' }
  loginField = { checkBox: 0 }; messageList: any = []; selectedUserId: any = [];
  private studentAddFormData: StudentForm = { student_name: "", student_sex: "", student_email: "", student_phone: "", student_curr_addr: "", dob: "", doj: moment().format('YYYY-MM-DD'), school_name: "-1", student_class_key: "", parent_name: "", parent_email: "", parent_phone: "", guardian_name: "", guardian_email: "", guardian_phone: "", is_active: "Y", institution_id: sessionStorage.getItem('institute_id'), assignedBatches: [], assignedBatchescademicYearArray: [""], assignedCourse_Subject_FeeTemplateArray: [""], fee_type: 0, fee_due_day: 0, batchJoiningDates: [], comments: "", photo: null, enquiry_id: "", student_disp_id: "", student_manual_username: null, social_medium: -1, attendance_device_id: "", religion: "", standard_id: "-1", subject_id: "-1", slot_id: null, language_inst_status: "admitted", stuCustomLi: [] };
  private assignedBatchString: string = ''; studentbatchList: any[] = []; private isAssignBatch: boolean = false; isEdit: boolean = true;
  studentByIdcustomComponents: any[] = [];
  private subscriptionStudent: ISubscription;
  private subscriptionCustomComp: ISubscription;

  /* =================================================================================================== */
  /* =================================================================================================== */
  /* =================================================================================================== */
  /* =================================================================================================== */
  constructor(private prefill: FetchprefilldataService, private router: Router, private studentFetch: FetchStudentService, private login: LoginService, private appC: AppComponent, private studentPrefill: AddStudentPrefillService, private widgetService: WidgetService, private postService: PostStudentDataService, private actRoute: ActivatedRoute, private auth: AuthenticatorService) {
    this.actRoute.queryParams.subscribe(e => {
      if (e.id != null && e.id != undefined && e.id != '') {
        if (e.action == undefined || e.action == undefined || e.action == '') {
          this.router.navigate(['/view/student/edit/' + e.id]);
        }
        else {
          switch (e.action) {
            case 'studentEdit': {
              this.router.navigate(['/view/student/edit/' + e.id]);
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
        this.auth.institute_type.subscribe(
          res => {
            if (res == 'LANG') {
              this.isProfessional = true;
            } else {
              this.isProfessional = false;
            }
          }
        )
        if (this.isProfessional) {
          this.StudentSettings = [
            { primaryKey: 'student_disp_id', header: 'Student Id' },
            { primaryKey: 'student_name', header: 'Name' },
            { primaryKey: 'student_phone', header: 'Contact No' },
            { primaryKey: 'student_class', header: 'Class' },
            { primaryKey: 'batchesAssigned', header: 'Batch Assigned' }
          ];
        }
        else {
          this.StudentSettings = [
            { primaryKey: 'student_disp_id', header: 'Student Id' },
            { primaryKey: 'student_name', header: 'Name' },
            { primaryKey: 'student_phone', header: 'Contact No' },
            { primaryKey: 'student_class', header: 'Class' },
            { primaryKey: 'batchesAssigned', header: 'Course Assigned' }
          ];
        }
      }
    });
  }




  /* OnInit function to set toggle default columns and load student data for table*/
  /* =================================================================================================== */
  /* =================================================================================================== */
  ngOnInit() {
    this.isRippleLoad = true;
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.fetchStudentPrefill();
    this.loading_message = 3;
    this.studentDataSource = [];
    this.totalRow = this.studentDataSource.length;
    this.bulkActionItems = [
      {
        label: 'Send Notification', icon: 'far fa-bell', command: () => {
          this.notifySelectedStudent();
        }
      }
    ];
  }


  /* Fetch data from server and convert to custom array */
  /* =================================================================================================== */
  /* =================================================================================================== */
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
    localStorage.setItem('studentId', id);
    this.router.navigate(['/view/student/edit/' + id]);
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
          title: 'No Rows Selected',
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
          title: 'No Rows Selected',
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

    this.studentFetch.downloadStudentTableasXls(this.instituteData).subscribe(
      (res: any) => {
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
  /* =================================================================================================== */
  /* =================================================================================================== */
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

    this.studentPrefill.fetchCustomComponent().subscribe(data => {
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
      this.studentAddFormData = { student_name: "", student_sex: "", student_email: "", student_phone: "", student_curr_addr: "", dob: "", doj: moment().format('YYYY-MM-DD'), school_name: "-1", student_class_key: "", parent_name: "", parent_email: "", parent_phone: "", guardian_name: "", guardian_email: "", guardian_phone: "", is_active: "Y", institution_id: sessionStorage.getItem('institute_id'), assignedBatches: [], assignedBatchescademicYearArray: [""], assignedCourse_Subject_FeeTemplateArray: [""], fee_type: 0, fee_due_day: 0, batchJoiningDates: [], comments: "", photo: null, enquiry_id: "", student_disp_id: "", student_manual_username: null, social_medium: -1, attendance_device_id: "", religion: "", standard_id: "-1", subject_id: "-1", slot_id: null, language_inst_status: "admitted", stuCustomLi: [] };
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
                    value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value
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
                    value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value
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
    this.optMenu.nativeElement.classList.remove('shorted');
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
          title: 'Error',
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
    localStorage.setItem('studentId', event);
    this.router.navigate(['/view/student/edit/' + event]);
  }

  /* =================================================================================================== */
  /* =================================================================================================== */
  editInventory(e) {
    sessionStorage.setItem('editInv', "true");
    localStorage.setItem('studentId', e);
    this.router.navigate(['/view/student/edit/' + e]);
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
        title: 'Error',
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
      configuredMessage: false,
      message_id: messageSelected.messageId
    }

    this.widgetService.sendNotification(obj).subscribe(
      res => {
        //console.log(res);
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
            body: "Send Successfully"
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
    this.assignedBatchString = e.assignedBatchString;
    this.isAssignBatch = e.isAssignBatch;
    this.updateStudentDataOnServer();
  }

  updateStudentDataOnServer() {
    let customArr = [];

    this.studentByIdcustomComponents.forEach(el => {
      /* Not Checkbox and value not empty */
      if (el.value != '' && el.type != 2 && el.type != 5) {
        let obj = {
          component_id: el.id,
          enq_custom_id: el.data.enq_custom_id,
          enq_custom_value: el.value
        }
        customArr.push(obj);
      }
      /* Checkbox Custom Component */
      else if (el.type == 2) {
        if (el.value == "Y" || el.value == true) {
          let obj = {
            component_id: el.id,
            enq_custom_id: el.data.enq_custom_id,
            enq_custom_value: "Y"
          }
          customArr.push(obj);
        }
        else if (el.value == "N" || el.value == false) {
          let obj = {
            component_id: el.id,
            enq_custom_id: el.data.enq_custom_id,
            enq_custom_value: "N"
          }
          customArr.push(obj);
        }
      }
      /* Date Type Custom Component */
      else if (el.type == 5 && el.value != "" && el.value != null && el.value != "Invalid date") {
        let obj = {
          component_id: el.id,
          enq_custom_id: el.data.enq_custom_id,
          enq_custom_value: moment(el.value).format("YYYY-MM-DD")
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
        this.optMenu.nativeElement.classList.remove('shorted');
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

}
