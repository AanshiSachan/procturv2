import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { getCheque } from '../../../../services/cheque-manage/get-cheque.service';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { DropData } from '../../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import { copyConfig } from '@angular/router/src/config';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-cheque-manage',
  templateUrl: './cheque-manage.component.html',
  styleUrls: ['./cheque-manage.component.scss']
})
export class ChequeManageComponent implements OnInit {

  pdcDetails: any;
  studentFeeDues: any = {
  };

  studentFeelist: any[] = []

  isPendingUpdate: boolean;
  isUpdatePopup: boolean;
  actionSelected: any;
  selectedRecord: any;
  dateRange: any[] = [];

  chequeFetchForm: any = {
    from_date: moment().date(1).format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    cheque_status_id: -1,
    student_name: '',
    contact_no: '',
  }

  studentUnpaid: any[] = [];

  dropType: number = 1;

  searchValue: any = ''

  chequeDataSource: any[] = [];
  dataStatus: number = 1;
  chequeSetting: ColumnData[] = [
    { primaryKey: 'display_invoice_no', header: 'Receipt No' },
    { primaryKey: 'cheque_no', header: 'Cheque No' },
    { primaryKey: 'bank_name', header: 'Bank Name' },
    { primaryKey: 'student_name', header: 'Student Name' },
    { primaryKey: 'contact_no', header: 'Contact No' },
    { primaryKey: 'cheque_date', header: 'Cheque Date' },
    { primaryKey: 'cheque_amount', header: 'Amount' },
    { primaryKey: 'cheque_status', header: 'Status' }
  ];

  menuList: DropData[] = [
    { key: 'update', header: 'Update' }
    /* { key: 'pending', header: 'Update Payment' } */
  ];

  chequeUpdateStatus: any;

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

  constructor(private login: LoginService, private appC: AppComponent, private getter: getCheque, private excelService: ExcelService) {
    this.dateRange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.dateRange[1] = new Date();
  }

  ngOnInit() {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.fetchChequeType(this.chequeFetchForm);
  }

  fetchChequeType(obj) {
    this.getter.getChequeTypes(obj).subscribe(
      res => {
        this.chequeDataSource = res;
        if (res == null || res.length == 0) {
          this.dataStatus = 0;
        }
      },
      err => {
        this.dataStatus = 0;
      }
    );
  }

  filterCheques() {

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

    this.fetchChequeType(obj);

  }

  optionSelected(e) {
    this.selectedRecord = e.data;
    this.actionSelected = e.action._value;
    this.decidePopup(e.data);
  }

  cancelUpdate() {
    this.isUpdatePopup = false;
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
      this.chequeUpdateStatus = "3"
      this.isUpdatePopup = true;
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
            let msg = {
              type: 'error',
              title: "No Installment Toward Which Payment Can Be Made",
              body: ""
            }
            this.appC.popToast(msg);
          }
        }
        else{
          let obj = {
            type: 'info',
            title: "No Installment To Make Payment Towards",
            body: ""
          }
          this.appC.popToast(obj);
        }
      },
      err => { }
    )
  }

  getPdcDetails() {
    this.getter.fetchPdcChequeDetails(this.selectedRecord.pdc_cheque_id).subscribe(
      res => {
        this.pdcDetails = res;
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
      financial_year: this.selectedRecord.financial_year
    }

    this.getter.updateChequeStatus(obj).subscribe(
      res => {
        this.updateRecordOnClient();
        let msg = {
          type: "success",
          title: "Cheque Status Updated",
          body: ""
        }
        this.appC.popToast(msg);
        this.isUpdatePopup = false;
      },
      err => {
        let msg = {
          type: "error",
          title: "An Error Occured",
          body: "Please contact support@proctur.com"
        }
        this.appC.popToast(msg);
      }
    )

  }

  updateRecordOnClient() {
    let temp: any[] = this.chequeDataSource.map(e => {
      if (e.cheque_id == this.selectedRecord.cheque_id) {
        e.cheque_status_id = this.chequeUpdateStatus;
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
    for (let k in this.studentUnpaid) {
      if (this.studentUnpaid[k].selected && this.studentUnpaid[k].toPay != '') {
        if (!isNaN(this.studentUnpaid[k].toPay)) {
          temp.push(this.studentUnpaid[k]);
          toPay += parseInt(this.studentUnpaid[k].toPay);
        }
        else {
          let msg = {
            type: 'error',
            title: "Invalid Amount Entered",
            body: "Please enter a valid amount for payment"
          }
          this.appC.popToast(msg);
        }
      }
    }

    if (toPay > parseInt(this.chequePaymentModel.chequeAmount)) {
      let msg = {
        type: 'error',
        title: "PDC cheque amount is not matching with the selected installments.",
        body: "Please change to be paid amount in selected installments to make partial payment"
      }
      this.appC.popToast(msg);
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
        paid_date: this.chequePaymentModel.paymentDate,
        paymentMode: this.chequePaymentModel.paymentMode,
        reference_no: this.chequePaymentModel.refNum,
        remarks: this.chequePaymentModel.remarks,
        studentFeeReportJsonList: this.getStudentList(temp),
        student_id: this.selectedRecord.student_id,
      }

      this.getter.updatePDCPayment(obj).subscribe(
        res => {
          let obj = {
            type: 'success',
            title: "Payment Updated",
            body: "paymnet via cheque has been updated"
          }
          this.appC.popToast(obj);

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
                  let obj = {
                    type: 'error',
                    title: msg,
                    body: ""
                  }
                  this.appC.popToast(obj);
                }
              )
            }
            
            else if (this.chequePaymentModel.isSendEmail) {
              this.getter.downloadResource(obj).subscribe(
                res => {
                  let ob ={
                    type: 'success',
                    title: "Receipt Shared Over Email",
                    body: ""
                  }
                  this.appC.popToast(ob);
                },
                err => {
                  let msg = JSON.parse(err._body).message;
                  //this.isRippleLoad = false;
                  let obj = {
                    type: 'error',
                    title: msg,
                    body: ""
                  }
                  this.appC.popToast(obj);
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
                  let obj = {
                    type: 'error',
                    title: msg,
                    body: ""
                  }
                  this.appC.popToast(obj);
                }
              )
            }
          }

          this.cancelUpdate();
          this.filterCheques();

        },
        err => {
          let obj = {
            type: 'error',
            title: "An Error Occured",
            body: err.error.message
          }
          this.appC.popToast(obj);
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
        due_date: e.due_date,
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
      let info = {
        type: 'info',
        title: "Invalid Payment Amount",
        body: "Amount cannot be greater than the total balance amount"
      }
      this.appC.popToast(info);
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
        receipt_no: e.display_invoice_no,
        cheque_number: e.cheque_no,
        bank_name: e.bank_name,
        student_name: e.student_name,
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

  downloadReceipt(r){
    let link = document.getElementById("invoiceDownloader");
    let body = r;
    let byteArr = this.convertBase64ToArray(body.document);
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

}
