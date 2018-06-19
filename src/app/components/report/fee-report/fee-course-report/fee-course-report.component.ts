import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { DropData } from '../../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';
import { MenuItem } from 'primeng/primeng';
import * as moment from 'moment';
import { ExcelService } from '../../../../services/excel.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-fee-course-report',
  templateUrl: './fee-course-report.component.html',
  styleUrls: ['./fee-course-report.component.scss']
})
export class FeeCourseReportComponent implements OnInit {

  selectedRecordsList: any[] = [];
  reportSource: any[] = [];
  bulkAddItems: MenuItem[];
  isCustomDate: boolean;
  isFeeReceipt: boolean;
  isNextDueDetail: boolean;
  isFeepaymentHistory: boolean;
  isViewDetailReport: boolean;
  selectedFeeRecord: any;
  installmentList: any;
  isFilterReversed: boolean = true;
  isProfessional: boolean = false;
  dataStatus: number = 3;

  feeSettings1: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'student_total_fees', header: 'Total Fee' },
    { primaryKey: 'student_toal_fees_paid', header: 'Amount Paid' },
    { primaryKey: 'total_balance_amt', header: 'Past Dues' },
    { primaryKey: 'student_latest_fee_due_date', header: 'Next Due Date' },
    { primaryKey: 'student_latest_fee_due_amount', header: 'Next Due Amount' },
    { primaryKey: 'student_latest_pdc', header: 'PDC Date' },
    { primaryKey: 'amount_still_payable', header: 'Balance Amount' }
  ];

  feeSettings2: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'student_phone', header: 'Contact No.' },
    { primaryKey: 'student_class', header: 'Standard/Class' },
    { primaryKey: 'total_initial_amount', header: 'Fees Amount' },
    { primaryKey: 'total_tax_applied', header: 'Tax' },
    { primaryKey: 'total_amount_after_discount_after_tax', header: 'Fees Dues Incl Tax' },
    { primaryKey: 'total_amt_paid', header: 'Amount Paid' },
    { primaryKey: 'total_balance_amt', header: 'Amount Balance' }
  ];

  feeDataSource1: any[] = [];

  feeDataSource2: any[] = [];

  menuOptions: DropData[] = [
    /* {
      key: 'detailed',
      header: 'View Detailed Report'
    }, */
    {
      key: 'history',
      header: 'Dues Info',
    },
    {
      key: 'receipt',
      header: 'Fee Receipts',
    }
  ];

  courseFetchForm: any = {
    standard_id: -1,
    subject_id: -1,
    batch_id: -1,
    student_name: '',
    from_date: '',
    to_date: '',
    master_course_name: -1,
    course_id: -1,
    contact_no: '',
    type: '0',
    installment_id: -1,
    is_fee_report_view: 1,
    academic_year_id: []
  }

  isRippleLoad: boolean = false;

  // due_type: any = '-1';

  search_value: any = '';

  standardList: any[] = [];

  subjectList: any[] = [];

  batchList: any[] = [];

  userInput: string = ''

  helpMsg: string = "We can filter data either by selecting master course/ course/ batch or by selecting dues along with date range filter."

  @ViewChild('form') form: any;

  getAllAcademic:any[] = []

  constructor(
    private excelService: ExcelService,
    private login: LoginService,
    private appC: AppComponent,
    private getter: GetFeeService,
    private putter: PostFeeService,
    private auth: AuthenticatorService
  ) {
    this.switchActiveView('fee');
  }



  /* ===================================================================================================== */
  /* ===================================================================================================== */
  /* ===================================================================================================== */
  ngOnInit() {
    this.getAcademicYear();
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    this.fetchPrefillDetails();

    this.bulkAddItems = [
      {
        label: 'Send SMS', icon: 'fa-envelope-o', command: () => {
          this.sendBulkSms();
        }
      },
      {
        label: 'Send Fine SMS', icon: 'fa-envelope-o', command: () => {
          this.sendBulkFineSms();
        }
      }
    ];

    this.form.valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(data => {
        this.searchDB();
      });

  }

  getAcademicYear() {
    this.getter.getAcademicYear().subscribe(
      (res: any) => {
        this.getAllAcademic = res;
      },
      (error: any) => {

      }
    )
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  fetchPrefillDetails() {
    this.getBatchCourseDetails();

    this.fetchInstallmentData();
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  fetchInstallmentData() {
    this.getter.getinstallmentData().subscribe(
      res => {
        this.installmentList = res;
      },
      err => {

      }
    )
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  batchSelected() {

    this.isCustomDate = false;
    this.courseFetchForm.from_date = '';
    this.courseFetchForm.to_date = '';
    this.courseFetchForm.type = "0";
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  getBatchCourseDetails() {
    if (this.isProfessional) {
      this.updateMasterCourseBatch();
    }
    else {
      this.updateMasterCourse();
    }
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  updateMasterCourseBatch() {
    this.isRippleLoad = true;
    this.getter.getBatchDetails(this.courseFetchForm).subscribe(
      res => {
        this.isRippleLoad = false;
        this.batchList = res.batchLi;
        this.standardList = res.standardLi;
        this.subjectList = [];
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
      }
    )
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  updateMasterCourse() {
    this.isRippleLoad = true;
    this.getter.getMasterCourses().subscribe(
      res => {
        this.isRippleLoad = false;
        this.standardList = res;
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
      }
    )
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  fetchFeeDetails() {
    /* Fetch By Master Course and Other Details */
    if (this.isFilterReversed) {
      /* Checks if user has filled the form correctly and selected a batch or master course course */
      if (this.courseFormValidator()) {
        if (this.dateRangeValid()) {
          if (this.isProfessional) {
            let obj = {
              standard_id: this.courseFetchForm.standard_id,
              batch_id: this.courseFetchForm.batch_id,
              type: this.courseFetchForm.type,
              from_date: moment(this.courseFetchForm.from_date).format('YYYY-MM-DD'),
              to_date: moment(this.courseFetchForm.to_date).format('YYYY-MM-DD'),
              installment_id: this.courseFetchForm.installment_id,
              subject_id: this.courseFetchForm.subject_id,
              master_course_name: this.courseFetchForm.master_course_name,
              course_id: this.courseFetchForm.course_id,
              student_name: this.courseFetchForm.student_name,
              contact_no: this.courseFetchForm.contact_no,
              is_fee_report_view: this.courseFetchForm.is_fee_report_view,
              academic_year_id:this.courseFetchForm.academic_year_id

            }
            //console.log(obj);
            this.generateReport(obj);
          }
          else {
            let obj = {
              standard_id: this.courseFetchForm.master_course_name,
              batch_id: this.courseFetchForm.batch_id,
              type: this.courseFetchForm.type,
              from_date: moment(this.courseFetchForm.from_date).format('YYYY-MM-DD'),
              to_date: moment(this.courseFetchForm.to_date).format('YYYY-MM-DD'),
              installment_id: this.courseFetchForm.installment_id,
              subject_id: this.courseFetchForm.course_id,
              master_course_name: this.courseFetchForm.standard_id,
              course_id: this.courseFetchForm.subject_id,
              student_name: this.courseFetchForm.student_name,
              contact_no: this.courseFetchForm.contact_no,
              is_fee_report_view: this.courseFetchForm.is_fee_report_view,
              academic_year_id:this.courseFetchForm.academic_year_id

            }
            //console.log(obj);
            this.generateReport(obj);
          }
        }
      }
    }
    /* Fetch by name or Dues Type */
    // else {
    //   if (this.due_type == 'all_dues') {
    //     let obj: any = {
    //       from_date: '',
    //       to_date: '',
    //     }
    //     /* Name Detected */
    //     if (isNaN(this.search_value)) {
    //       obj.student_name = this.search_value;
    //       obj.contact_no = '';
    //     }
    //     /* Contact Number Detected */
    //     else {
    //       obj.contact_no = this.search_value;
    //       obj.student_name = '';
    //     }

    //     this.generateReport(obj);

    //   }
    //   else if (this.due_type == 'next_month_dues') {
    //     let obj: any = {
    //       from_date: '',
    //       to_date: '',
    //     }

    //     /* Name Detected */
    //     if (isNaN(this.search_value)) {
    //       obj.student_name = this.search_value;
    //       obj.contact_no = '';
    //     }
    //     /* Contact Number Detected */
    //     else {
    //       obj.contact_no = this.search_value;
    //       obj.student_name = '';
    //     }

    //   }
    //   else if (this.due_type == 'this_month_dues') {
    //     let obj: any = {
    //       from_date: '',
    //       to_date: '',
    //     }


    //     /* Name Detected */
    //     if (isNaN(this.search_value)) {
    //       obj.student_name = this.search_value;
    //       obj.contact_no = '';
    //     }
    //     /* Contact Number Detected */
    //     else {
    //       obj.contact_no = this.search_value;
    //       obj.student_name = '';
    //     }

    //   }
    //   else if (this.due_type == 'current_dues') {
    //     let obj: any = {
    //       from_date: '',
    //       to_date: '',
    //     }


    //     /* Name Detected */
    //     if (isNaN(this.search_value)) {
    //       obj.student_name = this.search_value;
    //       obj.contact_no = '';
    //     }
    //     /* Contact Number Detected */
    //     else {
    //       obj.contact_no = this.search_value;
    //       obj.student_name = '';
    //     }
    //   }
    // }
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  dateRangeValid(): boolean {

    if (this.courseFetchForm.from_date == '' && this.courseFetchForm.to_date == '') {
      return true;
    }
    else if (this.courseFetchForm.from_date != '' && this.courseFetchForm.to_date != '' && this.courseFetchForm.from_date != 'Invalid date' && this.courseFetchForm.to_date != 'Invalid date') {
      let to = moment(this.courseFetchForm.to_date);
      let from = moment(this.courseFetchForm.from_date);

      let d = to.diff(from, 'days');
      if (d >= 0) {
        return true;
      }
      else {
        let obj = {
          type: 'error',
          title: 'From date cannot be more than to date',
          body: ''
        }
        this.appC.popToast(obj);
        return false;
      }
    }

  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  generateReport(obj) {
    //console.log(obj);

    if (obj.from_date == 'Invalid date' || obj.from_date == '') {
      obj.from_date = '';
    }
    if (obj.to_date == 'Invalid date' || obj.to_date == '') {
      obj.to_date = '';
    }
    if (obj.from_date != 'Invalid date' && obj.from_date != '') {
      moment(obj.from_date).format('YYYY-MM-DD');
    }
    if (obj.to_date != 'Invalid date' && obj.to_date != '') {
      moment(obj.to_date).format('YYYY-MM-DD');
    }
    //console.log(obj);
    this.isRippleLoad = true;
    this.dataStatus = 1;
    this.getter.getFeeReportData(obj).subscribe(
      res => {
        if (res.length == 0) {
          this.dataStatus = 2;
        }
        this.reportSource = res;
        this.isRippleLoad = false;
        if (this.isFilterReversed) {
          this.feeDataSource1 = res;
        }
        else {
          this.feeDataSource2 = res;
        }
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
      }
    )
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  openAdFilter() {
    this.isRippleLoad = true;
    this.isFilterReversed = !this.isFilterReversed;
    this.isRippleLoad = false;
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  switchActiveView(id) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('attendance').classList.remove('active');
    document.getElementById('sms').classList.remove('active');
    document.getElementById('fee').classList.remove('active');
    document.getElementById('exam').classList.remove('active');
    document.getElementById('report').classList.remove('active');
    document.getElementById('time').classList.remove('active');
    document.getElementById('email').classList.remove('active');
    document.getElementById('profit').classList.remove('active');
    switch (id) {
      case 'home': { document.getElementById('home').classList.add('active'); break; }
      case 'attendance': { document.getElementById('attendance').classList.add('active'); break; }
      case 'sms': { document.getElementById('sms').classList.add('active'); break; }
      case 'fee': { document.getElementById('fee').classList.add('active'); break; }
      case 'exam': { document.getElementById('exam').classList.add('active'); break; }
      case 'report': { document.getElementById('report').classList.add('active'); break; }
      case 'time': { document.getElementById('time').classList.add('active'); break; }
      case 'email': { document.getElementById('email').classList.add('active'); break; }
      case 'profit': { document.getElementById('profit').classList.add('active'); break; }
    }
  }


  /* ===================================================================================================== */
  /* ===================================================================================================== */
  fetchSubjectList() {
    this.courseFetchForm.subject_id = -1;
    this.courseFetchForm.batch_id = -1;
    this.isCustomDate = false;
    this.courseFetchForm.from_date = '';
    this.courseFetchForm.to_date = '';
    this.courseFetchForm.type = "0";

    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.getter.getBatchDetails(this.courseFetchForm).subscribe(
        res => {
          this.isRippleLoad = false;
          this.batchList = res.batchLi;
          this.subjectList = res.subjectLi;
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
        }
      )
    }
    else {
      let id = this.courseFetchForm.standard_id.replace(/ /g, "%20");
      this.getter.getCourseData(id).subscribe(
        res => {
          this.isRippleLoad = false;
          this.batchList = [];
          this.subjectList = res.coursesList;
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
        }
      )
    }
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  fetchBatchList() {
    this.courseFetchForm.batch_id = -1;

    this.isCustomDate = false;
    this.courseFetchForm.from_date = '';
    this.courseFetchForm.to_date = '';
    this.courseFetchForm.type = "0";
    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.getter.getBatchDetails(this.courseFetchForm).subscribe(
        res => {
          this.isRippleLoad = false;
          this.batchList = res.batchLi;
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
        }
      )
    }
    else {
      this.getter.getBatchDetails(this.courseFetchForm).subscribe(
        res => {
          this.isRippleLoad = false;
          this.batchList = res.batchLi;
        },
        err => {
          this.isRippleLoad = false;
          //console.log(err);
        }
      )
    }
  }
  /* ===================================================================================================== */
  /* ===================================================================================================== */
  courseFormValidator(): boolean {
    /* If user has selected master course then he has to select the course and batch id as well */
    if (this.courseFetchForm.standard_id != '-1') {
      /* For professional model */
      if (this.isProfessional) {
        /* if user has selected a course then check for batch Id else throw error */
        if (this.courseFetchForm.subject_id != '-1') {
          /* all set batch selected correctly */
          if (this.courseFetchForm.batch_id != '-1') {
            return true;
          }
          else {
            let obj = {
              type: 'error',
              title: 'Batch not Selected',
              body: 'Please select a valid batch for the selected course'
            }
            this.appC.popToast(obj);
            return false;
          }
        }
        /* master course selected course not selected then throw error */
        else {
          let obj = {
            type: 'error',
            title: 'Course not Selected',
            body: 'Please select a valid course for the selected master course'
          }
          this.appC.popToast(obj);
          return false;
        }
      }
      /* for acad model */
      else {
        if (this.courseFetchForm.standard_id != '-1' && this.courseFetchForm.subject_id != '-1') {
          return true;
        }
        else {
          return false;
        }
      }
    }
    else if (this.courseFetchForm.standard_id == '-1' && this.courseFetchForm.subject_id == '-1' && this.courseFetchForm.batch_id == '-1') {
      return true;
    }
    else if (this.courseFetchForm.standard_id == '-1' && this.courseFetchForm.subject_id == '-1' && this.courseFetchForm.batch_id != '-1') {
      return true;
    }
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  validateFutureDate(id: string) {

    let today = moment(new Date());

    if (id == 'from') {
      let selected = moment(this.courseFetchForm.from_date);
      let v = today.diff(selected, 'days');
      if (v < 0) {
        let obj = {
          type: 'info',
          title: 'Future date cannot be selected',
          body: ''
        }
        this.appC.popToast(obj);
        this.courseFetchForm.from_date = moment(new Date()).format('DD-MMM-YYYY');
      }
    }

    else if (id == 'to') {
      let selected = moment(this.courseFetchForm.to_date);
      let v = today.diff(selected, 'days');
      if (v < 0) {

        let obj = {
          type: 'info',
          title: 'Future date cannot be selected',
          body: ''
        }
        this.appC.popToast(obj);
        this.courseFetchForm.to_date = moment(new Date()).format('DD-MMM-YYYY');
      }

    }

  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  optionSelected(e) {
    let action = e.action._value;
    this.selectedFeeRecord = e.data;
    this.performAction(action);
  }
  /* ===================================================================================================== */
  /* ===================================================================================================== */
  performAction(action) {

    if (action == 'View Detailed Report') {
      this.isViewDetailReport = true;
    }
    else if (action == 'Dues Info') {
      this.isFeepaymentHistory = true;
    }
    else if (action == 'Fee Receipts') {
      this.isFeeReceipt = true;
    }

  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  closePopup(e) {
    this.isFeeReceipt = false;
    this.isFeepaymentHistory = false;
    this.isNextDueDetail = false;
    this.isViewDetailReport = false;
  }
  /* ===================================================================================================== */
  /* ===================================================================================================== */
  // dateRangeChanges(e) {
  //   this.isCustomDate = false;
  //   this.courseFetchForm.standard_id = '-1';
  //   this.courseFetchForm.subject_id = '-1';
  //   this.courseFetchForm.batch_id = '-1';
  //   if (this.due_type == 'all_dues') {
  //     this.getBatchCourseDetails();
  //     this.courseFetchForm.from_date = '';
  //     this.courseFetchForm.to_date = '';
  //     this.courseFetchForm.type = "0";
  //   }

  //   else if (this.due_type == 'next_month_dues') {
  //     let begin = moment().add(1, 'M').format("YYYY-MM-01");
  //     let end = moment().add(1, 'M').format("YYYY-MM-") + moment().add(1, 'M').daysInMonth();

  //     this.courseFetchForm.from_date = begin;
  //     this.courseFetchForm.to_date = end;
  //     this.courseFetchForm.type = "1";
  //   }

  //   else if (this.due_type == 'this_month_dues') {
  //     let begin = moment().format("YYYY-MM-01");
  //     let end = moment().format("YYYY-MM-") + moment().daysInMonth();
  //     this.courseFetchForm.from_date = begin;
  //     this.courseFetchForm.to_date = end;
  //     this.courseFetchForm.type = "1";
  //   }

  //   else if (this.due_type == 'current_dues') {
  //     this.courseFetchForm.from_date = moment(new Date()).format("YYYY-MM-DD");
  //     this.courseFetchForm.to_date = moment(new Date()).format("YYYY-MM-DD");
  //     this.courseFetchForm.type = "1";
  //   }
  //   else if (this.due_type == 'custom') {
  //     this.courseFetchForm.from_date = '';
  //     this.courseFetchForm.to_date = '';
  //     this.courseFetchForm.type = "1";
  //     this.isCustomDate = true;
  //   }
  //   else if (this.due_type == '-1') {
  //     this.getBatchCourseDetails();
  //     this.courseFetchForm.type = "0";
  //     this.isCustomDate = false;
  //   }

  // }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  searchDB() {
    //console.log(this.userInput);

    if (this.userInput.trim() != '') {
      let temp: any[] = this.reportSource.filter(e => {
        return this.findMatch(e)
      });

      if (temp.length != 0) {
        this.feeDataSource1 = temp;
      }
      else {
        this.feeDataSource1 = temp;
        this.dataStatus = 2;
      }
    }
    else {
      this.feeDataSource1 = this.reportSource;
    }
  }


  exportToExcel(event) {
    this.excelService.exportAsExcelFile(
      this.feeDataSource1,
      'persons'
    )
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  findMatch(e): boolean {
    let temp = false;

    for (let key in e) {
      if (String(e[key]).toLowerCase().includes(this.userInput.toLowerCase())) {
        temp = true;
        break;
      }
    }

    return temp;
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  selectedRecords(rec) {
    this.selectedRecordsList = rec;
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  sendBulkSms() {
    if (confirm("Are you sure u want to send Fee Dues SMS to the selected students?")) {
      let arr: any[] = this.selectedRecordsList.map(e => {
        return e.student_id;
      });
      let obj = {
        delivery_mode: 0,
        institution_id: '',
        student_ids: arr.join(',')
      }
      this.putter.sendBulkSMS(obj).subscribe(
        res => {
          let obj = {
            type: 'success',
            title: 'SMS Sent',
            body: ""
          }
          this.appC.popToast(obj);
        },
        err => {
          let obj = {
            type: 'error',
            title: 'An Error Occured',
            body: err.error.message
          }
          this.appC.popToast(obj);
        }
      );
    }
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  sendBulkFineSms() {
    if (confirm("Are you sure u want to send Fine SMS to the selected students?")) {
      let arr: any[] = this.selectedRecordsList.map(e => {
        return e.student_id;
      });

      let obj = {
        delivery_mode: 0,
        institution_id: '',
        student_ids: arr.join(',')
      }

      this.putter.sendBulkFineSMS(obj).subscribe(
        res => {
          let obj = {
            type: 'success',
            title: 'SMS Sent',
            body: ""
          }
          this.appC.popToast(obj);
        },
        err => {
          let obj = {
            type: 'error',
            title: 'An Error Occured',
            body: err.error.message
          }
          this.appC.popToast(obj);
        }
      );
    }
  }

}
