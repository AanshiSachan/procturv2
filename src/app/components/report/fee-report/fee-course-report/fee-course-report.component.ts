import { Component, OnInit } from '@angular/core';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { DropData } from '../../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';

import * as moment from 'moment';

@Component({
  selector: 'app-fee-course-report',
  templateUrl: './fee-course-report.component.html',
  styleUrls: ['./fee-course-report.component.scss']
})
export class FeeCourseReportComponent implements OnInit {

  isFeeReceipt: boolean;
  isNextDueDetail: boolean;
  isFeepaymentHistory: boolean;
  isViewDetailReport: boolean;
  selectedFeeRecord: any;
  installmentList: any;
  isFilterReversed: boolean = true;
  isProfessional: boolean = false;

  feeSettings1: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'student_total_fees', header: 'Total Fee' },
    { primaryKey: 'student_toal_fees_paid', header: 'Amount Paid' },
    { primaryKey: 'total_balance_amt', header: 'Past Dues' },
    { primaryKey: 'student_latest_fee_due_date', header: 'Next Future Due Date' },
    { primaryKey: 'student_latest_fee_due_amount', header: 'Next Future Amount' },
    { primaryKey: 'student_latest_pdc', header: 'PDC Date' },
    { primaryKey: 'amount_still_payable', header: 'Amount Still Payable' }
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
    {
      key: 'detailed',
      header: 'View Detailed Report'
    },
    {
      key: 'history',
      header: 'Fee Payment History',
    },
    {
      key: 'nextDue',
      header: 'Next Due Details'
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
    is_fee_report_view: 1
  }

  isRippleLoad: boolean = false;

  due_type: any = '-1';

  search_value: any = '';

  standardList: any[] = [];

  subjectList: any[] = [];

  batchList: any[] = [];


  constructor(
    private login: LoginService,
    private appC: AppComponent,
    private getter: GetFeeService,
    private putter: PostFeeService
  ) {
    this.switchActiveView('fee');
  }



  /* ===================================================================================================== */
  /* ===================================================================================================== */
  /* ===================================================================================================== */
  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    this.fetchPrefillDetails();

    this.fetchFeeReportData();

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
  fetchFeeReportData() {

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
        console.log(err);
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
        console.log(err);
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
              is_fee_report_view: this.courseFetchForm.is_fee_report_view
            }
            console.log(obj);
            this.generateReport(obj);
          }
          else {

          }
        }
      }
    }
    /* Fetch by name or Dues Type */
    else {
      if (this.due_type == 'all_dues') {
        let obj: any = {
          from_date: '',
          to_date: '',
        }
        /* Name Detected */
        if (isNaN(this.search_value)) {
          obj.student_name = this.search_value;
          obj.contact_no = '';
        }
        /* Contact Number Detected */
        else {
          obj.contact_no = this.search_value;
          obj.student_name = '';
        }

        this.generateReport(obj);

      }
      else if (this.due_type == 'next_month_dues') {
        let obj: any = {
          from_date: '',
          to_date: '',
        }

        /* Name Detected */
        if (isNaN(this.search_value)) {
          obj.student_name = this.search_value;
          obj.contact_no = '';
        }
        /* Contact Number Detected */
        else {
          obj.contact_no = this.search_value;
          obj.student_name = '';
        }

      }
      else if (this.due_type == 'this_month_dues') {
        let obj: any = {
          from_date: '',
          to_date: '',
        }


        /* Name Detected */
        if (isNaN(this.search_value)) {
          obj.student_name = this.search_value;
          obj.contact_no = '';
        }
        /* Contact Number Detected */
        else {
          obj.contact_no = this.search_value;
          obj.student_name = '';
        }

      }
      else if (this.due_type == 'current_dues') {
        let obj: any = {
          from_date: '',
          to_date: '',
        }


        /* Name Detected */
        if (isNaN(this.search_value)) {
          obj.student_name = this.search_value;
          obj.contact_no = '';
        }
        /* Contact Number Detected */
        else {
          obj.contact_no = this.search_value;
          obj.student_name = '';
        }
      }
    }
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
    console.log(obj);

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
    console.log(obj);
    this.isRippleLoad = true;
    this.getter.getFeeReportData(obj).subscribe(
      res => {
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
        console.log(err);
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
          console.log(err);
        }
      )
    }
    else {

    }
  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  fetchBatchList() {
    this.courseFetchForm.batch_id = -1;
    this.isRippleLoad = true;
    if (this.isProfessional) {
      this.getter.getBatchDetails(this.courseFetchForm).subscribe(
        res => {
          this.isRippleLoad = false;
          this.batchList = res.batchLi;
        },
        err => {
          this.isRippleLoad = false;
          console.log(err);
        }
      )
    }
    else {

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

      }
    }
    else if (this.courseFetchForm.standard_id == '-1' && this.courseFetchForm.subject_id == '-1' && this.courseFetchForm.batch_id == '-1') {
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
    else if (action == 'Fee Payment History') {
      this.isFeepaymentHistory = true;
    }
    else if (action == 'Next Due Details') {
      this.isNextDueDetail = true;
    }
    else if (action == 'Fee Receipts') {
      this.isFeeReceipt = true;
    }

  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */

  /* ===================================================================================================== */
  /* ===================================================================================================== */



  /* ===================================================================================================== */
  /* ===================================================================================================== */

  /* ===================================================================================================== */
  /* ===================================================================================================== */



  /* ===================================================================================================== */
  /* ===================================================================================================== */

  /* ===================================================================================================== */
  /* ===================================================================================================== */



  /* ===================================================================================================== */
  /* ===================================================================================================== */

}
