/**  other libraray imports */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { MessageShowService } from '../../../services/message-show.service';
import { GetFeeService } from '../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../services/report-services/fee-services/postFee.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { DataDisplayTableComponent } from '../../shared/data-display-table/data-display-table.component';
import { ColumnData2 } from '../../shared/data-display-table/data-display-table.model';
import { DropData } from '../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
/**  models imports*/


@Component({
  selector: 'app-all-data-report',
  templateUrl: './all-data-report.component.html',
  styleUrls: ['./all-data-report.component.scss']
})
export class AllDataReportComponent implements OnInit {

  @ViewChild('child') private child: DataDisplayTableComponent;
  @ViewChild('form') form: any;
  selectedRowCount: any = 0;
  selectedRecordsList: any[] = [];
  totalRecords: any = 0;
  reportSource: any[] = [];
  filterShow: boolean = false;
  feeDataSource1: any[] = [];
  feeDataSource2: any[] = [];
  standardList: any[] = [];
  getAllAcademic: any[] = [];
  subjectList: any[] = [];
  batchList: any[] = [];
  feeDataSource: any[] = []
  chked: number = 0;
  displayKeys: any = [];//need for selected keys
  private slotIdArr: any[] = [];
  private selectedSlots: any[] = [];
  private selectedSlotsString: string = '';
  private selectedSlotsID: string = '';
  selectedFeeRecord: any;
  installmentList: any;
  due_type: any = '-1';
  search_value: any = '';
  userInput: string = '';
  /** boolean flag json */
  showPopupKeys: any = {
    isFeeReceipt: false,
    isNextDueDetail: false,
    showPreference: false,
    isViewDetailReport: false,
    isFeepaymentHistory: false,
    isCustomDate: false,
    isFilterReversed: true,
    isProfessional: false,
    downloadFeeReportAccess: false
  };

  searchBy: string = 'check';
  dataStatus: number = 3;
  feeSettings1: ColumnData2[] = [
    { primaryKey: 'student_disp_id', header: 'ID', priority: 1, allowSortingFlag: true },
    { primaryKey: 'student_name', header: 'Name', priority: 2, allowSortingFlag: true },
    { primaryKey: 'student_phone', header: 'Contact No.', priority: 3, allowSortingFlag: true },
    { primaryKey: 'student_total_fees', header: 'Total Fee', priority: 4, allowSortingFlag: true },
    { primaryKey: 'student_toal_fees_paid', header: 'Amount Paid', priority: 5, amountValue: true, allowSortingFlag: true },
    { primaryKey: 'total_balance_amt', header: 'Past Dues', priority: 6, amountValue: true, allowSortingFlag: true },
    { primaryKey: 'student_latest_fee_due_date', header: 'Next Due Date', priority: 7, allowSortingFlag: true },
    { primaryKey: 'student_latest_fee_due_amount', header: 'Next Due Amount', priority: 8, allowSortingFlag: true, amountValue: true },
    { primaryKey: 'student_latest_pdc', header: 'PDC Date', priority: 9, allowSortingFlag: true },
    { primaryKey: 'amount_still_payable', header: 'Balance Amount', priority: 10, amountValue: true, allowSortingFlag: true }
  ];

  menuOptions: DropData[] = [
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
    academic_year_id: "-1",
    is_AssignedCourseBatchFees: true,
    is_unAssignedCourseBatchFees: false,
    is_archivedCourseBatchFees: false
  }

  helpMsg: string = "Active Student Due Report ";//fee details are shown based on dues and academic year filter applied.
  //table setting
  tableSetting: any = {//inventory.item
    tableDetails: { title: 'All Dues Report', key: 'reports.fee.allDuesReport', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: {
      showSelectAll: true, option: 'multiple', //option_details: [{ title: 'Send Due SMS', type: 'SMS' },
      //{ title: 'Send Due E-Mail', type: 'Mail' }], 
      checked: true, key: 'student_disp_id'
    },
    actionSetting:
    {
      showActionButton: true,
      editOption: 'popup',//or button
      options: this.menuOptions
    },
    displayMessage: "Enter Detail to Search"
    // {
    //     editOption: 'button',//or button
    //     options: [{ title: "update", class: 'fa fa-check updateCss' }
    //         , { title: "delete", class: 'fa fa-remove deleteCss' }]
    // }
  };

  constructor(
    private _getter: GetFeeService,
    private _putter: PostFeeService,
    private excelService: ExcelService,
    private auth: AuthenticatorService,
    private _tablePreferencesService: TablePreferencesService,
    private ref: ChangeDetectorRef,
    private pdf: ExportToPdfService,
    private _msgService: MessageShowService,
    private _commService: CommonServiceFactory
  ) {
    this.excelService = excelService;
    // this.switchActiveView('fee');
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.due_type = "seven_days_dues";
    this.dateRangeChanges(event);
    this.getAcademicYear();
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.showPopupKeys.isProfessional = true;
        } else {
          this.showPopupKeys.isProfessional = false;
        }
      }
    )
    this.form.valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(data => {
        this.searchDB();
      });

    this.tableSetting.keys = this.feeSettings1;
    if (this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key) != null) {
      this.displayKeys = this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key);

      this.tableSetting.keys = this.displayKeys;
      if (this.displayKeys.length == 0) {
        this.setDefaultValues();
      }
    }
    else {
      this.setDefaultValues();
    }
    console.log(this.tableSetting);
    this.checkDownloadRoleAccess();
  }

  checkDownloadRoleAccess() {
    if (sessionStorage.getItem('downloadFeeReportAccess') == 'true') {
      this.showPopupKeys.downloadFeeReportAccess = true;
    }
  }

  setDefaultValues() {
    this.tableSetting.keys = [
      { primaryKey: 'student_disp_id', header: 'ID', priority: 1, allowSortingFlag: true },
      { primaryKey: 'student_name', header: 'Name', priority: 2, allowSortingFlag: true },
      { primaryKey: 'student_total_fees', header: 'Total Fee', priority: 3, allowSortingFlag: true, amountValue: true, },
      { primaryKey: 'student_toal_fees_paid', header: 'Amount Paid', priority: 4, allowSortingFlag: true, amountValue: true, }
    ];
    this.displayKeys = this.tableSetting.keys;
    this._tablePreferencesService.setTablePreferences(this.tableSetting.tableDetails.key, this.displayKeys);
  }

  ngDoCheck() {
    this.ref.detectChanges();
    // console.log(this.displayKeys);
  }
  rowCheckboxChange(record) {
    console.log(record);
    (record.data.checked) ? (this.selectedRowCount++) : (this.selectedRowCount--);
    this.chked = this.selectedRowCount;
  }
  searchByValue(value) {
    console.log(value);
    this.searchBy = value;
    this.slotIdArr = [];
    // this.selectedSlotsString ='';
    // this.selectedSlotsID='';
    // this.getAllAcademic.forEach(element => {
    //   element.status =false;
    // });
    // this.sendPayload.payment_history_student_category_option = this.varJson.searchBy == 'name' ? 0 : 2;
  }

  getAcademicYear() {
    this._getter.getAcademicYear().subscribe(
      (res: any) => {
        this.getAllAcademic = res;
        this.getAllAcademic.forEach((obj) => {
          obj.status = false;
        })

      },
      (error: any) => {

      }
    )
  }

  fetchInstallmentData() {
    this._getter.getinstallmentData().subscribe(
      res => {
        this.installmentList = res;
      },
      err => {
      }
    )
  }

  getRows() {
    let obj = {}
    let arr = [];
    this.tableSetting.keys.map((ele, index) => {
      obj[ele.primaryKey] = index
    })
    this.feeDataSource1.map(
      (ele) => {
        let json2 = []
        for (let i in obj) {
          json2.push(ele[i])
        }
        arr.push(json2);
      }
    )
    return arr;
  }
  toggleFilter() {  // show hide filter
    if (this.filterShow) {
      this.filterShow = false;
    }
    else {
      this.filterShow = true;
    }
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


  getColumns() {
    let arr2 = [];
    let arr3 = [];
    this.tableSetting.keys.map((ele) => {
      arr2.push(ele.header);
    })
    arr3.push(arr2);
    return arr3;
  }

  exportToPdf() {
    let rows = this.getColumns();
    let columns = this.getRows();
    this.pdf.exportToPdf(rows, columns, 'All_dues_Report');
  }

  fetchFeeDetails() {
    this.filterShow = false;
    let arr = [];
    if (this.searchBy == 'check') {
      arr = this.slotIdArr;
    }
    // arr.push(this.courseFetchForm.academic_year_id);
    let date1 = moment(this.courseFetchForm.from_date).format('YYYY-MM-DD');
    let date2 = moment(this.courseFetchForm.to_date).format('YYYY-MM-DD');
    if (this.searchBy == 'check') {
      date1 = "";
      date2 = "";
    }
    let obj = {
      standard_id: null,
      subject_id: null,
      master_course_name: null,
      course_id: null,
      batch_id: this.courseFetchForm.batch_id,
      type: this.courseFetchForm.type,
      from_date: date1,
      to_date: date2,
      installment_id: this.courseFetchForm.installment_id,
      student_name: this.courseFetchForm.student_name,
      contact_no: this.courseFetchForm.contact_no,
      is_fee_report_view: this.courseFetchForm.is_fee_report_view,
      academic_year_id: arr,
      is_AssignedCourseBatchFees: 'N',
      is_unAssignedCourseBatchFees: 'N',
      is_archivedCourseBatchFees: 'N'
    }

    obj.is_AssignedCourseBatchFees = this.courseFetchForm.is_AssignedCourseBatchFees == true ? 'Y' : 'N';
    obj.is_unAssignedCourseBatchFees = this.courseFetchForm.is_unAssignedCourseBatchFees == true ? 'Y' : 'N';
    obj.is_archivedCourseBatchFees = this.courseFetchForm.is_archivedCourseBatchFees == true ? 'Y' : 'N';


    if (obj.is_AssignedCourseBatchFees == 'N' &&
      obj.is_unAssignedCourseBatchFees == 'N' &&
      obj.is_archivedCourseBatchFees == 'N') {
      this._msgService.showErrorMessage(this._msgService.toastTypes.error, '', "Please select at least one option");
      return false;
    }

    /* Fetch By Master Course and Other Details */
    if (this.showPopupKeys.isProfessional) {
      obj["standard_id"] = this.courseFetchForm.standard_id;
      obj["subject_id"] = this.courseFetchForm.subject_id;
      obj["master_course_name"] = this.courseFetchForm.master_course_name;
      obj["course_id"] = this.courseFetchForm.course_id;
    }
    else {
      obj["standard_id"] = this.courseFetchForm.master_course_name;
      obj["subject_id"] = this.courseFetchForm.course_id;
      obj["master_course_name"] = this.courseFetchForm.standard_id;
      obj["course_id"] = this.courseFetchForm.subject_id;
    }
    if (this.due_type == '-1') {
      this._msgService.showErrorMessage(this._msgService.toastTypes.error, '', "Please select dues");
      this.tableSetting.displayMessage = "Data not found";
      this.feeDataSource1 = [];
      return false;
    }
    this.generateReport(obj);
  }


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
        this._msgService.showErrorMessage(this._msgService.toastTypes.error, 'From date cannot be more than to date', "")
        return false;
      }
    }
  }

  generateReport(obj) {
    //console.log(obj);
    this.feeDataSource1 = [];
    this.feeDataSource2 = [];
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
    this.auth.showLoader();
    this.dataStatus = 1;
    this._getter.getFeeReportData(obj).subscribe(
      res => {
        if (res.length == 0) {
          this.dataStatus = 2;
          this.tableSetting.displayMessage = "Data not found";
        }
        this.reportSource = res;
        this.auth.hideLoader();
        if (this.showPopupKeys.isFilterReversed) {
          this.feeDataSource1 = res;
          this.totalRecords = this.feeDataSource1.length;
          console.log(this.totalRecords);
        }
        else {
          this.feeDataSource2 = res;
        }
      },
      err => {
        this.auth.hideLoader();
        //console.log(err);
      }
    )
  }


  openAdFilter() {
    this.auth.showLoader();
    this.showPopupKeys.isFilterReversed = !this.showPopupKeys.isFilterReversed;
    this.auth.hideLoader();
  }

  switchActiveView(id) {
    let classArray = ['home', 'attendance', 'sms', 'fee', 'exam', 'report', 'time', 'email', 'profit'];

    classArray.forEach((classname) => {
      if (document.getElementById(classname)) { document.getElementById(classname).classList.remove('active'); }
    });
    if (document.getElementById(id)) {
      document.getElementById(id).classList.add('active');
    }
  }

  validateFutureDate(id: string) {
    let today = moment(new Date());
    if (id == 'from') {
      let selected = moment(this.courseFetchForm.from_date);
      let v = today.diff(selected, 'days');
      if (v < 0) {
        this._msgService.showErrorMessage(this._msgService.toastTypes.info, 'Future date cannot be selected', "")
        this.courseFetchForm.from_date = moment(new Date()).format('DD-MMM-YYYY');
      }
    }
    else if (id == 'to') {
      let selected = moment(this.courseFetchForm.to_date);
      let v = today.diff(selected, 'days');
      if (v < 0) {
        this._msgService.showErrorMessage(this._msgService.toastTypes.info, 'Future date cannot be selected', "")
        this.courseFetchForm.to_date = moment(new Date()).format('DD-MMM-YYYY');
      }
    }
  }

  optionSelected(e) {
    let action = e.action._value;
    this.selectedFeeRecord = e.data;
    this.performAction(action);
  }


  performAction(action) {
    if (action == 'View Detailed Report') {
      this.showPopupKeys.isViewDetailReport = true;
    }
    else if (action == 'Dues Info') {
      this.showPopupKeys.isFeepaymentHistory = true;
    }
    else if (action == 'Fee Receipts') {
      this.showPopupKeys.isFeeReceipt = true;
    }

  }

  closePopup(e) {
    let array = ['isFeeReceipt', 'isFeepaymentHistory', 'isNextDueDetail', 'isViewDetailReport', 'showPreference'];
    for (let key in array) {
      this.showPopupKeys[array[key]] = false;
    }

    if (e) {
      if (this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key) != null) {
        this.displayKeys = this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key);
        this.tableSetting.keys = this.displayKeys;
        if (e.callNotify) {
          this.child.notifyMe(this.tableSetting);
        }
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
    }
    console.log(this.displayKeys);
  }

  dateRangeChanges(e) {
    // console.log(this.due_type);
    this.showPopupKeys.isCustomDate = false;
    this.courseFetchForm.standard_id = '-1';
    this.courseFetchForm.subject_id = '-1';
    this.courseFetchForm.batch_id = '-1';
    if (this.due_type == 'all_dues') {
      // this.getBatchCourseDetails();
      this.courseFetchForm.from_date = '';
      this.courseFetchForm.to_date = '';
      this.courseFetchForm.type = "1";
    }

    else if (this.due_type == 'next_month_dues') {
      let begin = moment().add(1, 'M').format("YYYY-MM-01");
      let end = moment().add(1, 'M').format("YYYY-MM-") + moment().add(1, 'M').daysInMonth();

      this.courseFetchForm.from_date = begin;
      this.courseFetchForm.to_date = end;
      this.courseFetchForm.type = "1";
    }

    else if (this.due_type == 'seven_days_dues') {
      let begin = moment().format('YYYY-MM-DD');
      let end = moment().subtract('days', 7).format('YYYY-MM-DD');

      this.courseFetchForm.from_date = end;
      this.courseFetchForm.to_date = begin;
      this.courseFetchForm.type = "1";

      console.log(this.courseFetchForm);
    }

    else if (this.due_type == 'thirty_days_dues') {
      let begin = moment().format('YYYY-MM-DD');
      let end = moment().subtract('months', 1).format('YYYY-MM-DD');

      this.courseFetchForm.from_date = end;
      this.courseFetchForm.to_date = begin;
      this.courseFetchForm.type = "1";
    }

    else if (this.due_type == 'ninty_days_dues') {
      let begin = moment().format('YYYY-MM-DD');
      let end = moment().subtract('months', 3).format('YYYY-MM-DD');

      this.courseFetchForm.from_date = end;
      this.courseFetchForm.to_date = begin;
      this.courseFetchForm.type = "1";
    }

    else if (this.due_type == 'this_month_dues') {
      let begin = moment().format("YYYY-MM-01");
      let end = moment().format("YYYY-MM-") + moment().daysInMonth();
      this.courseFetchForm.from_date = begin;
      this.courseFetchForm.to_date = end;
      this.courseFetchForm.type = "1";
    }

    else if (this.due_type == 'current_dues') {
      this.courseFetchForm.from_date = moment(new Date()).format("YYYY-MM-DD");
      this.courseFetchForm.to_date = moment(new Date()).format("YYYY-MM-DD");
      this.courseFetchForm.type = "1";
    }
    else if (this.due_type == 'custom') {
      this.courseFetchForm.from_date = moment().format('YYYY-MM-DD');
      this.courseFetchForm.to_date = moment().format('YYYY-MM-DD');

      this.courseFetchForm.type = "1";
      this.showPopupKeys.isCustomDate = true;
    }
    else if (this.due_type == '-1') {
      this._msgService.showErrorMessage(this._msgService.toastTypes.error, "", "Please select dues");
    }

  }

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

  selectedRecords(rec) {
    this.selectedRecordsList = rec;
  }

  /** send sms to student about dues
   * created by laxmi
  */
  checkOption(event) {
    console.log(event);
    const data: any = {};
    switch (event) {
      case 'Mail': {
        data.type = 'email';
        data.delivery_mode = 1;
        break;
      }
      case 'SMS': {
        data.type = 'sms';
        data.delivery_mode = 0;
        break;
      }
    }

    this.sendBulkDetails(data);
  }

  sendBulkDetails(event) {
    if (event.length == 0) {
      this._msgService.showErrorMessage(this._msgService.toastTypes.error, '', "Select record to send due " + event.type);
      return;
    }
    if (confirm("Due " + event.type + " shall be sent to those students/parents whose amount is due. Do you want to continue ? ")) {
      let student_ids = [];
      let arr: any[] = this.selectedRecordsList.filter(e => {
        if (e.total_balance_amt != 0) {
          student_ids.push(e.student_id);
          return e.student_id;
        }
      });
      let obj = {
        delivery_mode: event.delivery_mode,
        institution_id: '',
        student_ids: student_ids.join()
      }
      this.auth.showLoader();
      this._putter.sendBulkSMS(obj).subscribe(
        res => {
          // console.log(res);
          this.auth.hideLoader();
          this._msgService.showErrorMessage(this._msgService.toastTypes.success, '', res.message);
        },
        err => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage(this._msgService.toastTypes.error, '', err.error.message);
        }
      );
    }
  }


  /**
   * send bulk sms to student about thier fine
   */
  sendBulkFineSms() {
    if (confirm("Are you sure you want to send Fine SMS to the selected students?")) {
      let arr: any[] = this.selectedRecordsList.map(e => {
        return e.student_id;
      });

      let obj = {
        delivery_mode: 0,
        institution_id: '',
        student_ids: arr.join(',')
      }

      this._putter.sendBulkFineSMS(obj).subscribe(
        res => {
          this._msgService.showErrorMessage(this._msgService.toastTypes.success, '', res.message);
        },
        err => {
          this._msgService.showErrorMessage(this._msgService.toastTypes.error, '', err.error.message);
        }
      );
    }
  }

  /**
   * export as excel
   */
  exportToExcel() {
    let arr = []
    this.feeDataSource1.map(
      (ele: any) => {
        let json = {}
        this.tableSetting.keys.map((keys) => {
          json[keys.header] = ele[keys.primaryKey]
        })
        arr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      arr,
      'students'
    )
  }

  getDetials(obj) {
    console.log(obj);
  }

  openPreferences() {
    this.showPopupKeys.showPreference = true;
  }

}