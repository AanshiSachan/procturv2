import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { DataDisplayTableComponent } from '../../shared/data-display-table/data-display-table.component';
import { ColumnData2 } from '../../shared/data-display-table/data-display-table.model';
import { getCheque } from '../../../services/cheque-manage/get-cheque.service';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { MessageShowService } from '../../../services/message-show.service';
import { CommonServiceFactory } from '../../../services/common-service';


@Component({
  selector: 'app-cheque-manage',
  templateUrl: './cheque-manage.component.html',
  styleUrls: ['./cheque-manage.component.scss']
})
export class ChequeManageComponent implements OnInit {

  @ViewChild('child') private child: DataDisplayTableComponent;
  dataStatus: number = 1;
  searchValue: any = '';
  dishonouredReason:any='';
  isPendingUpdate: boolean;
  chequeUpdateStatus: any;
  selectedRecord: any;
  dateRange: any[] = [];
  studentUnpaid: any[] = [];
  chequeDataSource: any[] = [];
  tempRecords: any[] = [];
  displayKeys: any = [];
  downloadFeeReportAccess:boolean = false;
  
  chequeFetchForm: any = {
    from_date: moment().date(1).format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    cheque_status_id: 3,
    student_name: '',
    contact_no: '',
  }

  studentFeeDues: any = {};
  flagJson: any = {
    showPreference: false,
    isRippleLoad: false,
    isUpdatePopup: false,
    searchText: ''
  };

  activitySettings: ColumnData2[] = [ //feeSettings1
    { primaryKey: 'student_display_id', header: 'ID', priority: 1, allowSortingFlag: true },
    { primaryKey: 'student_name', header: 'Student Name', priority: 2, allowSortingFlag: true },
    { primaryKey: 'parent_name', header: 'Parent Name', priority: 3, allowSortingFlag: true },
    { primaryKey: 'display_invoice_no', header: 'Receipt No', priority: 4, allowSortingFlag: true },
    { primaryKey: 'cheque_no', header: 'Cheque No', priority: 5, allowSortingFlag: true },
    { primaryKey: 'bank_name', header: 'Bank Name', priority: 6, allowSortingFlag: true },
    { primaryKey: 'contact_no', header: 'Contact No', priority: 7, allowSortingFlag: true },
    { primaryKey: 'cheque_date', header: 'Cheque Date', priority: 8, allowSortingFlag: true },
    { primaryKey: 'cheque_amount', header: 'Amount', priority: 9, allowSortingFlag: true },
    { primaryKey: 'cheque_status', header: 'Status', priority: 10, allowSortingFlag: true },
    { primaryKey: 'remarks', header: 'Remarks', priority: 11, allowSortingFlag: true },
    { primaryKey: 'reference_no', header: 'Reference No', priority: 12, allowSortingFlag: true },
    { primaryKey: 'dishonoured_reason', header: 'Reason', priority: 13, allowSortingFlag: true }
  ];
  chequePaymentModel: any = {
    paymentDate: moment(new Date()).format("DD-MMM-YYYY"),
    paymentMode: 'Cheque/PDC/DD No.',
    remarks: "",
    refNum: "",
    bankName: "",
    chequeNum: "",
    chequeDate: "",
    chequeAmount: "",
    isGenAck: false,
    isSendEmail: false
  }

  //payment history table settings
  tableSetting: any = {
    tableDetails: { title: 'Manage Cheques', key: 'activity.manageCheques', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.activitySettings,
    selectAll: { showSelectAll: false, option:'single',title: '', checked: true, key: '' },
    actionSetting: {
      showActionButton: true,
      editOption: 'link',//or popup
      condition: [{ key: 'cheque_status', condition: "==", checkValue: "cleared", nextOperation: undefined }],
      options: [{ title: "update cheque status ", type: "update cheque", class: 'fa fa-check updateCss' }]
    },
    displayMessage: "Enter Detail to Search"
  };

  constructor(
    private getter: getCheque,
    private excelService: ExcelService,
    private ref: ChangeDetectorRef,
    private pdf: ExportToPdfService,
    private _tablePreferencesService: TablePreferencesService,
    private _msgService: MessageShowService ,
    private _commService:CommonServiceFactory) {
    this.dateRange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.dateRange[1] = new Date();
  }

  ngOnInit() {
    this.fetchChequeType(this.chequeFetchForm, false);
    this.tableSetting.keys = this.activitySettings;
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
    this.checkDownloadRoleAccess();
  }

  checkDownloadRoleAccess() {
    if(sessionStorage.getItem('downloadFeeReportAccess')=='true'){
        this.downloadFeeReportAccess = true;
    }
}

  searchDatabase() {
    console.log(this.flagJson.searchText);
    if (this.flagJson.searchText != "" && this.flagJson.searchText != null) {
      this.chequeDataSource = this.tempRecords.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.flagJson.searchText.toLowerCase()))
      );
      this.flagJson.searchflag = true;
    }
    else {
      this.chequeDataSource = this.tempRecords;
      this.flagJson.searchflag = false;
    }
    if (this.chequeDataSource.length == 0) {
      this.tableSetting.displayMessage = "Data not found";
    }
    // console.log(this.chequeDataSource);
  }

  exportToPdf() {
    let arr = [];

    this.chequeDataSource.map(
      (ele: any) => {
        let json = [
          ele.student_display_id,
          ele.student_name,
          ele.parent_name,
          ele.display_invoice_no,
          ele.cheque_no,
          ele.bank_name,
          ele.contact_no,
          ele.cheque_date,
          ele.cheque_amount,
          ele.cheque_status,
          ele.remarks,
          ele.reference_no
        ]
        arr.push(json);
      })

    let rows = [];
    rows = [['ID', 'Student Name', "Parent Name", "Receipt No", 'Cheque No', 'Bank Name', 'Contact No', 'Cheque Date', 'Amount', 'Status', 'Remarks', 'Reference No']]


    let columns = arr;
    this.pdf.exportToPdf(rows, columns, 'manage_cheque_report');
  }

  // set default preferences to payment history table
  setDefaultValues() {
    this.tableSetting.keys = [
      { primaryKey: 'student_display_id', header: 'ID', priority: 1, allowSortingFlag: true },
      { primaryKey: 'student_name', header: 'Student Name', priority: 2, allowSortingFlag: true },
      { primaryKey: 'parent_name', header: 'Parent Name', priority: 3, allowSortingFlag: true },
      { primaryKey: 'display_invoice_no', header: 'Receipt No', priority: 4, allowSortingFlag: true },
      { primaryKey: 'cheque_no', header: 'Cheque No', priority: 5, allowSortingFlag: true },
      { primaryKey: 'bank_name', header: 'Bank Name', priority: 6, allowSortingFlag: true },
      { primaryKey: 'contact_no', header: 'Contact No', priority: 7, allowSortingFlag: true },
      { primaryKey: 'cheque_date', header: 'Cheque Date', priority: 8, allowSortingFlag: true },
      { primaryKey: 'cheque_amount', header: 'Amount', priority: 9, allowSortingFlag: true },
      { primaryKey: 'cheque_status', header: 'Status', priority: 10, allowSortingFlag: true },
      { primaryKey: 'dishonoured_reason', header: 'Reason', priority: 11, allowSortingFlag: true }
      
    ];
    this.displayKeys = this.tableSetting.keys;
    this._tablePreferencesService.setTablePreferences(this.tableSetting.tableDetails.key, this.displayKeys);
  }
  //open preference popup
  openPreferences() {
    this.flagJson.showPreference = true;
  }

  //close preference popup
  closePopup(e) {
    let array = ['showPreference'];
    for (let key in array) {
      this.flagJson[array[key]] = false;
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

  fetchChequeType(obj, flag) {
    this.flagJson.isRippleLoad = true;
    this.chequeDataSource = [];
    this.tempRecords = [];
    this.getter.getChequeTypes(obj).subscribe(
      res => {
        this.flagJson.isRippleLoad = false;
        this.chequeDataSource = res;
        this.tempRecords = res;

        this.tableSetting.displayMessage = flag ? "Data not found" : 'Enter Detail to Search';
        if (res == null || res.length == 0) {
          this.dataStatus = 2;
        }
        else {
          this.dataStatus = 0;
        }
      },
      err => {
        this.flagJson.isRippleLoad = false;
      }
    );
  }

  filterCheques() {
    this.dataStatus = 1;
    let f = this.dateRange.length != 0 ? moment(this.dateRange[0]).format("YYYY-MM-DD") : '';
    let t = this.dateRange.length != 0 ? moment(this.dateRange[1]).format("YYYY-MM-DD") : '';

    let obj = {
      from_date: f,
      to_date: t,
      cheque_status_id: this.chequeFetchForm.cheque_status_id,
      student_name: '',
      contact_no: '',
    }

    if (isNaN(this.searchValue)) {
      obj.student_name = this.searchValue;
    }
    else {
      obj.contact_no = this.searchValue;
    }

    switch (this.chequeFetchForm.cheque_status_id) {
      case '1': {
        this.tableSetting.actionSetting.condition = [{ key: 'cheque_status', condition: "==", checkValue: "Pending", nextOperation: undefined }];
        this.tableSetting.actionSetting.options = [{ title: "Update Payment ", type: "update payemnt", class: 'fa fa-check updateCss' }];
        break;
      }

      case '2': {
        this.tableSetting.actionSetting.condition = [{ key: 'cheque_status', condition: "==", checkValue: "cleared", nextOperation: undefined }];
        this.tableSetting.actionSetting.options = [{ title: "Update Payment ", type: "update payemnt", class: 'fa fa-check updateCss' }]
        break;
      }
      case '3': {
        this.tableSetting.actionSetting.condition = [{ key: 'cheque_status', condition: "==", checkValue: "cleared", nextOperation: undefined }];
        this.tableSetting.actionSetting.options = [{ title: "Update Payment ", type: "update cheque status", class: 'fa fa-check updateCss' }]
        break;
      }
    }

    this.fetchChequeType(obj, true);
  }

  optionSelected(e) {
    this.selectedRecord = e.data;
    this.selectedRecord.symbol =this.fetchDataForCountryDetails(this.selectedRecord.country_code);
    this.decidePopup(e.data);
    console.log(e.data);
  }

  fetchDataForCountryDetails(country_code) {
    let encryptedData = sessionStorage.getItem('country_data');
    let countryDetails = JSON.parse(encryptedData);
    if (countryDetails.length > 0) {
       let defacult_Country = countryDetails.filter((country) => {
        return country.country_code == country_code;
      });
     return defacult_Country[0].symbol;
    }else{
      return 'Rs';
    }
  }



  cancelUpdate() {
    this.flagJson.isUpdatePopup = false;
    this.isPendingUpdate = false;
    this.selectedRecord = null;
    this.studentFeeDues = {};
    this.studentUnpaid = [];
    this.chequePaymentModel = {
      paymentDate: moment(new Date()).format("DD-MMM-YYYY"),
      paymentMode: 'Cheque/PDC/DD No.',
      remarks: "",
      refNum: "",
      bankName: "",
      chequeNum: "",
      chequeDate: "",
      chequeAmount: "",
      isGenAck: false,
      isSendEmail: false
    }
  }

  decidePopup(d) {
    if (d.cheque_status_id == 3) {
      this.chequeUpdateStatus = "3";
      this.dishonouredReason='';
      this.flagJson.isUpdatePopup = true;
    }
    else if (d.cheque_status_id == 1) {
      this.fetchChequePaymentData();
    }
  }

  fetchChequePaymentData() {
    this.getStudentFeeDetails();
    this.getAllChequeStudent();
    this.getPdcDetails();
  }

  getStudentFeeDetails() {
    this.getter.fetchStudentFeeDetails(this.selectedRecord.student_id).subscribe(
      res => {
        if (res.studentFeeReportJsonList != null) {
          if (res.studentFeeReportJsonList.length) {
            for (let k in res.studentFeeReportJsonList) {
              res.studentFeeReportJsonList[k].toPay = res.studentFeeReportJsonList[k].total_balance_amt;
              res.studentFeeReportJsonList[k].balanceDueOn = res.studentFeeReportJsonList[k].due_date;
              res.studentFeeReportJsonList[k].selected = false;
            }
            this.studentUnpaid = res.studentFeeReportJsonList;
            this.studentFeeDues = res;
            this.isPendingUpdate = true;
          }
          else {
            this._msgService.showErrorMessage('error', '',"No Installment Toward Which Payment Can Be Made");
          }
        }
        else {
          this._msgService.showErrorMessage('info', '',"No Installment To Make Payment Towards");
        }
      },
      err => { }
    )
  }

  getPdcDetails() {
    this.getter.fetchPdcChequeDetails(this.selectedRecord.pdc_cheque_id).subscribe(
      res => {
        // this.pdcDetails = res;
        this.chequePaymentModel.bankName = res.bank_name;
        this.chequePaymentModel.chequeNum = res.cheque_no;
        this.chequePaymentModel.chequeDate = res.cheque_date;
        this.chequePaymentModel.chequeAmount = res.cheque_amount;
      },
      err => { }
    )
  }

  getAllChequeStudent() {
    this.getter.fetchAllChequeStudent(this.selectedRecord.student_id).subscribe(
      res => {
        this.studentFeeDues = res;
        console.log(this.selectedRecord);
      },
      err => { }
    )
  }

  updateRecord() {

    let obj = {
      student_id: this.selectedRecord.student_id,
      payment_reference_id: this.selectedRecord.payment_reference_id,
      cheque_status_id: this.chequeUpdateStatus,
      cheque_id: this.selectedRecord.cheque_id,
      financial_year: this.selectedRecord.financial_year,
      dishonoured_reason:this.dishonouredReason
    }

    this.flagJson.isRippleLoad = true;
    this.getter.updateChequeStatus(obj).subscribe(
      res => {
        this.updateRecordOnClient();
        this._msgService.showErrorMessage('success', '',"Cheque Status Updated");
        this.flagJson.isUpdatePopup = false;
        this.flagJson.isRippleLoad = false;
        this.filterCheques();
      },
      err => {
        this._msgService.showErrorMessage('error', '',"Please contact support@proctur.com");
        this.flagJson.isRippleLoad = false;
      }
    )

  }

  updateRecordOnClient() {
    let temp: any[] = this.chequeDataSource.map((e,index) => {
      if (e.cheque_id == this.selectedRecord.cheque_id) {
        e.cheque_status_id = this.chequeUpdateStatus;
        this.chequeDataSource.splice(index, 1);
        if (e.cheque_status_id == 2) {
          e.cheque_status = "dishonoured"
        }
        else if (e.cheque_status_id == 3) {
          e.cheque_status = "cleared";
        }

        return e;
      }
      else {
        return e;
      }
    });

    this.selectedRecord = null;
    this.chequeUpdateStatus = "3";
    this.chequeDataSource = temp;
  }


  payUsingCheque() {

    let toPay: number = 0;
    let temp: any[] = [];
    if(this.chequePaymentModel.remarks.length>20){
      this._msgService.showErrorMessage('error', '',"remarks should not be greater than 20 characters");
      return;
    }
    for (let k in this.studentUnpaid) {
      if (this.studentUnpaid[k].selected && this.studentUnpaid[k].toPay != '') {
        if (!isNaN(this.studentUnpaid[k].toPay)) {
          temp.push(this.studentUnpaid[k]);
          toPay += parseInt(this.studentUnpaid[k].toPay);
        }
        else {
          this._msgService.showErrorMessage('error', '',"Please enter a valid amount for payment");
        }
      }
    }

    if (toPay > parseInt(this.chequePaymentModel.chequeAmount)) {
      this._msgService.showErrorMessage('error', "PDC cheque amount is not matching with the selected installments",
        "Please change to be paid amount in selected installments to make partial payment");
    }
    else if (toPay <= parseInt(this.chequePaymentModel.chequeAmount) && toPay != 0) {
      let obj = {
        chequeDetailsJson: {
          bank_name: this.chequePaymentModel.bankName,
          cheque_amount: this.chequePaymentModel.chequeAmount,
          cheque_date: this.chequePaymentModel.chequeDate,
          cheque_no: this.chequePaymentModel.chequeNum,
          pdc_cheque_id: this.selectedRecord.pdc_cheque_id,
        },
        paid_date: moment(this.chequePaymentModel.paymentDate).format("YYYY-MM-DD"),
        paymentMode: this.chequePaymentModel.paymentMode,
        reference_no: this.chequePaymentModel.refNum,
        remarks: this.chequePaymentModel.remarks,
        studentFeeReportJsonList: this.getStudentList(temp),
        student_id: this.selectedRecord.student_id,
      }

      this.getter.updatePDCPayment(obj).subscribe(
        res => {
          this._msgService.showErrorMessage('success', "Payment Updated", "paymnet via cheque has been updated");

          if (this.chequePaymentModel.isGenAck || this.chequePaymentModel.isSendEmail) {

            let obj = {
              student_id: this.selectedRecord.student_id,
              receipt_id: res.other,
              fin: res.otherDetails.financial_year,
              email: "Y"
            }

            if (this.chequePaymentModel.isGenAck && this.chequePaymentModel.isSendEmail) {
              this.getter.downloadResource(obj).subscribe(
                res => {
                  this.downloadReceipt(res);
                },
                err => {
                  let msg = JSON.parse(err._body).message;
                  //this.isRippleLoad = false;
                  this._msgService.showErrorMessage('error', msg, "");
                }
              )
            }

            else if (this.chequePaymentModel.isSendEmail) {
              this.getter.downloadResource(obj).subscribe(
                res => {
                  this._msgService.showErrorMessage('success', "Receipt Shared Over Email", "");
                },
                err => {
                  let msg = JSON.parse(err._body).message;
                  //this.isRippleLoad = false;
                  this._msgService.showErrorMessage('error', msg, "");
                }
              )
            }

            else if (this.chequePaymentModel.isGenAck) {
              this.getter.downloadResource(obj).subscribe(
                res => {
                  this.downloadReceipt(res);
                },
                err => {
                  let msg = JSON.parse(err._body).message;
                  //this.isRippleLoad = false;
                  this._msgService.showErrorMessage('error', msg, "");
                }
              )
            }
          }
          this.cancelUpdate();       
          this.filterCheques();
        },
        err => {
          this._msgService.showErrorMessage('error', "An Error Occured", err.error.message);
        }
      )

    }
    else if (toPay <= parseInt(this.chequePaymentModel.chequeAmount) && toPay == 0) {
      this.cancelUpdate();
    }

  }


  clearDateRange() {
    this.dateRange[0] = '';
    this.dateRange[1] = '';
    this.dateRange = [];
  }

  getPaidStatus(a, p): string {
    let amt = parseInt(a);
    let paid = parseInt(p);

    if (paid == amt) {
      return "Y";
    }
    else if (paid < amt) {
      return "N";
    }
  }

  getStudentList(el: any[]): any[] {
    let temp: any[] = [];
    el.forEach(e => {
      let obj = {
        due_date:  moment(e.due_date).format("YYYY-MM-DD"),
        fee_schedule_id: e.fee_schedule_id,
        paid_full: this.getPaidStatus(e.total_balance_amt, e.toPay),
        previous_balance_amt: e.total_balance_amt,
        total_amt_paid: e.toPay,
      }

      temp.push(obj);
    })
    return temp;
  }

  validatePaymentAmount(i) {
    if (parseInt(this.studentUnpaid[i].toPay) > parseInt(this.studentUnpaid[i].total_balance_amt)) {
      this._msgService.showErrorMessage('info', "", "Amount cannot be greater than the total balance amount");
      this.studentUnpaid[i].toPay = this.studentUnpaid[i].total_balance_amt;
    }
    else if (parseInt(this.studentUnpaid[i].toPay) == parseInt(this.studentUnpaid[i].total_balance_amt)) {
      this.studentUnpaid[i].balanceDueOn = this.studentUnpaid[i].due_date;
    }
  }

  exportToExcel(event) {

    let temp: any[] = [];

    temp = this.chequeDataSource.map(e => {
      let obj: any = {
        id: e.student_display_id,
        student_name: e.student_name,
        parent_name: e.parent_name,
        receipt_no: e.display_invoice_no,
        cheque_number: e.cheque_no,
        bank_name: e.bank_name,
        contact_nnumber: e.contact_no,
        cheque_date: e.cheque_date,
        amount: e.cheque_amount,
        cheque_status: e.cheque_status,
      }
      return obj;
    });

    this.excelService.exportAsExcelFile(
      temp,
      'cheque_report'
    )
  }

  downloadReceipt(r) {
    let link = document.getElementById("invoiceDownloader");
    let body = r;
    let byteArr = this._commService.convertBase64ToArray(body.document);
    let format = body.format;
    let fileName = body.docTitle;
    let file = new Blob([byteArr], { type: 'application/pdf' });
    let url = URL.createObjectURL(file);
    if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.click();
    }
  }

  

}
