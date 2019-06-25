import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { DropData } from '../../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import * as moment from 'moment';
import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';
import { ExcelService } from '../../../../services/excel.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ExportToPdfService } from '../../../../services/export-to-pdf.service';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-fee-course-report',
  templateUrl: './fee-course-report.component.html',
  styleUrls: ['./fee-course-report.component.scss']
})
export class FeeCourseReportComponent implements OnInit {

  @ViewChild('form') form: any;
  feeDataSource1: any[] = [];
  feeDataSource2: any[] = [];
  standardList: any[] = [];
  subjectList: any[] = [];
  batchList: any[] = [];
  getAllAcademic: any[] = [];
  selectedRecordsList: any[] = [];
  reportSource: any[] = [];
  masterId: any;
  dataStatus: number = 3;
  userInput: string = '';
  search_value: any = '';
  isCustomDate: boolean;
  isFeeReceipt: boolean;
  isNextDueDetail: boolean;
  isFeepaymentHistory: boolean;
  isViewDetailReport: boolean;
  selectedFeeRecord: any;
  installmentList: any;
  isFilterReversed: boolean = true;
  isProfessional: boolean = false;
  isRippleLoad: boolean = false;
  isCourseSelected: boolean = false;
  private slotIdArr: any[] = [];
  private selectedSlots: any[] = [];
  private selectedSlotsString: string = '';
  private selectedSlotsID: string = ''
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
    academic_year_id: ""
  }

  helpMsg: string = "Active Student fee details are based on Master Course/Course and academic year filter applied."

  constructor(
    private excelService: ExcelService,
    private _msgService: MessageShowService,
    private getter: GetFeeService,
    private putter: PostFeeService,
    private auth: AuthenticatorService,
    private pdf: ExportToPdfService
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
    this.fetchPrefillDetails();

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

  /* =================================================================================================== */
  /* =================================================================================================== */
  updateSlotSelected(data) {
    /* slot checked */
    if (data.status) {
      this.slotIdArr.push(data.inst_acad_year_id);
      this.selectedSlots.push(data.inst_acad_year);
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      this.selectedSlotsID = this.slotIdArr.join(',')
      this.selectedSlotsString = this.selectedSlots.join(',');
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
      var index = this.selectedSlots.indexOf(data.inst_acad_year);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
      this.selectedSlotsString = this.selectedSlots.join(',');
      var index2 = this.slotIdArr.indexOf(data.inst_acad_year_id);
      if (index2 > -1) {
        this.slotIdArr.splice(index, 1);
      }
      this.selectedSlotsID = this.slotIdArr.join(',');
    }

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
  batchSelected($event) {

    this.isCustomDate = false;
    this.courseFetchForm.from_date = '';
    this.courseFetchForm.to_date = '';
    this.applyAcademicYear($event);
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

    if (this.isProfessional && (
      this.courseFetchForm.batch_id == '-1' &&
      this.courseFetchForm.standard_id == '-1')) {
      this._msgService.showErrorMessage("error", '', "Please select master course or batch");
      return;
    }
    if ((!this.isProfessional) && (this.courseFetchForm.standard_id == '-1')) {
      this._msgService.showErrorMessage("error", '', "Please select master course");
      return;
    }
    // arr.push(this.courseFetchForm.academic_year_id);
    /* Fetch By Master Course and Other Details */
    if (this.isFilterReversed) {
      /* Checks if user has filled the form correctly and selected a batch or master course course */
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
            academic_year_id: this.slotIdArr,
            is_AssignedCourseBatchFees: 'Y'
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
            academic_year_id: this.slotIdArr,
            is_AssignedCourseBatchFees: 'Y'
          }
          //console.log(obj);
          this.generateReport(obj);
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
        ;
        this._msgService.showErrorMessage("error", '', "From date cannot be more than to date");
        return false;
      }
    }

  }

  /* ===================================================================================================== */
  /* ===================================================================================================== */
  generateReport(obj) {
    //console.log(obj);
    this.feeDataSource1 = [];
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


  // changed by laxmi
  switchActiveView(id) {
    let classArray = ['home', 'attendance', 'sms', 'fee', 'exam', 'report', 'time', 'email', 'profit'];

    classArray.forEach((classname) => {
      document.getElementById(classname).classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
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
    this.applyAcademicYear('-1');
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

  applyAcademicYear(course_id) {
    this.isCourseSelected = false;
    this.selectedSlotsString = "";
    this.selectedSlots = [];
    if (course_id != '-1') {
      this.isCourseSelected = true;
      this.subjectList.forEach(element => {
        if (element.course_id == Number(course_id)) {
          if (element.academic_year_id != '-1') {
            this.getAllAcademic.forEach((object) => {// get selected academic year of course
              if (Number(element.academic_year_id) == object.inst_acad_year_id) {
                object.status = true;
                this.updateSlotSelected(object);
              }
            })
          }
        }
      });
    } else {
      this.getAllAcademic.forEach((object) => {// get selected academic year of course
        object.status = false;
      });
    }

  }
  /* ===================================================================================================== */
  /* ===================================================================================================== */
  fetchBatchList($event) {
    this.courseFetchForm.batch_id = -1;
    this.isCustomDate = false;
    this.courseFetchForm.from_date = '';
    this.courseFetchForm.to_date = '';
    this.courseFetchForm.type = "0";
    this.selectedSlotsString = "";
    this.selectedSlots = [];
    this.applyAcademicYear('-1');
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
            this._msgService.showErrorMessage("error", 'Batch not Selected', "Please select a valid batch for the selected course");
            return false;
          }
        }
        else {
          return true;
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
        this._msgService.showErrorMessage("info", '', "Future date cannot be selected");
        this.courseFetchForm.from_date = moment(new Date()).format('DD-MMM-YYYY');
      }
    }
    else if (id == 'to') {
      let selected = moment(this.courseFetchForm.to_date);
      let v = today.diff(selected, 'days');
      if (v < 0) {
        this._msgService.showErrorMessage("info", '', "Future date cannot be selected");
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


  exportToExcel() {
    let arr = []
    if (this.isProfessional) {
      this.feeDataSource1.map(
        (ele: any) => {
          let json = {
            "Student Id": ele.student_disp_id,
            "Student Name": ele.student_name,
            "Total Fee": ele.student_total_fees,
            "Amount Paid": ele.student_toal_fees_paid,
            "Past Dues": ele.total_balance_amt,
            "Next Due Date": ele.student_latest_fee_due_date,
            "Next Amount Date": ele.student_latest_fee_due_amount,
            "PDC Date": ele.student_latest_pdc,
            "Balance Amount": ele.amount_still_payable,
            "Master Course": ele.standard_name,
            "Batch": ele.batch_name,
            "Date of report generation": moment().format('YYYY-MM-DD')
          }
          arr.push(json);
        }
      )
    }

    else {
      this.feeDataSource1.map(
        (ele: any) => {
          let json = {
            "Student Id": ele.student_disp_id,
            "Student Name": ele.student_name,
            "Total Fee": ele.student_total_fees,
            "Amount Paid": ele.student_toal_fees_paid,
            "Past Dues": ele.total_balance_amt,
            "Next Due Date": ele.student_latest_fee_due_date,
            "Next Amount Date": ele.student_latest_fee_due_amount,
            "PDC Date": ele.student_latest_pdc,
            "Balance Amount": ele.amount_still_payable,
            "Standard Name": ele.standard_name,
            "Course": ele.course_name,
            "Date of report generation": moment().format('YYYY-MM-DD')
          }
          arr.push(json);
        }
      )
    }
    this.excelService.exportAsExcelFile(
      arr,
      'students'
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
          this._msgService.showErrorMessage("success", '', "SMS Sent Successfully");
        },
        err => {
          this._msgService.showErrorMessage("error", '', "An Error Occured");
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
          this._msgService.showErrorMessage("success", '', "SMS Sent Successfully");
        },
        err => {
          this._msgService.showErrorMessage("error", '', "An Error Occured");
        }
      );
    }
  }

  exportToPdf() {
    let arr = [];
    if (this.isProfessional) {
      this.feeDataSource1.map(
        (ele: any) => {
          let json = [
            ele.student_disp_id,
            ele.student_name,
            ele.student_total_fees,
            ele.student_toal_fees_paid,
            ele.total_balance_amt,
            ele.student_latest_fee_due_date,
            ele.student_latest_fee_due_amount,
            ele.student_latest_pdc,
            ele.amount_still_payable,
            ele.standard_name,
            ele.batch_name
          ]
          arr.push(json);
        })
    }

    else {
      this.feeDataSource1.map(
        (ele: any) => {
          let json = [
            ele.student_disp_id,
            ele.student_name,
            ele.student_total_fees,
            ele.student_toal_fees_paid,
            ele.total_balance_amt,
            ele.student_latest_fee_due_date,
            ele.student_latest_fee_due_amount,
            ele.student_latest_pdc,
            ele.amount_still_payable,
            ele.master_course_name,
            ele.course_name
          ]
          arr.push(json);
        })
    }

    let rows = [['ID', 'Name', 'Total Fee', 'Amount Paid', 'Past Dues', 'Next Due Date', 'Next Due Amount', 'PDC Date', 'Balance Amount', 'Master Course Name', 'Course Name']]
    let columns = arr;
    this.pdf.exportToPdf(rows, columns, 'Course_wise_Report');
  }


}
