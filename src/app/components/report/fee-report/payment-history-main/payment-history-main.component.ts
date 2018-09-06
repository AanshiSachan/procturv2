import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PaymentHistoryMainService } from '../../../../services/payment-history/payment-history-main.service';
import * as moment from 'moment';
import { DropData } from '../../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import { ExcelService } from '../../../../services/excel.service';
import { ExportToPdfService } from '../../../../services/export-to-pdf.service';
import { DataDisplayTableComponent } from '../../../shared/data-display-table/data-display-table.component';
import { ColumnData2 } from '../../../shared/data-display-table/data-display-table.model';
import { TablePreferencesService } from '../../../../services/table-preference/table-preferences.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { error } from 'util';

@Component({
  selector: 'app-payment-history-main',
  templateUrl: './payment-history-main.component.html',
  styleUrls: ['./payment-history-main.component.scss']
})
export class PaymentHistoryMainComponent implements OnInit {

  @ViewChild('child') private child: DataDisplayTableComponent;
  allPaymentRecords: any[] = [];
  tempRecords: any[] = [];
  newData: any[] = [];
  displayKeys: any = [];
  perPersonData: any[] = [];
  feeSettings1: ColumnData2[] = [
    { primaryKey: 'student_disp_id', header: 'ID', priority: 1, allowSortingFlag: true },
    { primaryKey: 'student_name', header: 'Name', priority: 2, allowSortingFlag: true },
    { primaryKey: 'parent_name', header: "Parent Name", priority: 3, allowSortingFlag: true },
    { primaryKey: 'display_invoice_no', header: 'Receipt No', priority: 4, allowSortingFlag: true },
    { primaryKey: 'paymentMode', header: 'Payment Mode', priority: 5, allowSortingFlag: true },
    { primaryKey: 'fee_type_name', header: 'Fee Type', priority: 6, allowSortingFlag: true },
    { primaryKey: 'installment_nos', header: 'Inst No', priority: 7, allowSortingFlag: true },
    { primaryKey: 'paid_date', header: 'Paid Date', priority: 8, allowSortingFlag: true },
    { primaryKey: 'remarks', header: 'Remarks', priority: 9, allowSortingFlag: true },
    { primaryKey: 'reference_no', header: 'Ref No', priority: 9, allowSortingFlag: true },
    { primaryKey: 'amount_paid', header: 'Amount Paid', priority: 10, allowSortingFlag: true },
    { primaryKey: 'enquiry_counsellor_name', header: 'Counsellor', priority: 11, allowSortingFlag: true }
  ];
  paymentMode = ["Cash", "Cheque/PDC/DD No.", "Credit/Debit Card", "Caution Deposit(Refundable)", "Other"];
  chequeStatus: any = [{ value: 1, title: '' }, { value: 2, title: 'Dishonoured' }, { value: 3, title: 'Cleared' }];
  flagJson: any = {
    searchflag: false,
    isRippleLoad: false,
    isChequePayment: false,
    addReportPopUp: false,
    showPreference: false
  };
  varJson: any = {
    searchText: "",
    sortedBy: "",
    searchBy: 'date',
    searchName: "",
    tempData: {},
    total_amt_paid: 0,
  };
  personData: any = {
    paid_date: "",
    paymentMode: "",
    remarks: "",
    reference_no: "",
    invoice_no: "",
  };
  //payment history table settings 
  tableSetting: any = {
    tableDetails: { title: 'Payment History', key: 'reports.fee.paymentHistory', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: { showSelectAll: false, title: 'Purchase Item', checked: true, key: 'student_disp_id' },
    actionSetting:
    {
      showActionButton: true,
      editOption: 'button',//or popup 
      options: [{ title: "Edit", class: 'fa fa-check updateCss' }]
    },
    displayMessage: "Enter Detail to Search"
  };
  sendPayload = {
    institute_id: this.payment.institute_id,
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    payment_history_student_category_option: 2,
    student_name: "",
    contact_no: ""
  }
  collectionData: any = {
    pdcNo: 0,
    refundValue: 0,
    cash: 0,
    cardValue: 0,
    fees_amount: 0
  }
  updatedResult: any = {
    feeSchedule_TxLst: {
      schedule_id: "",
      amount_paid: "",
      balance_amount: "",
      payment_tx_id: ""
    },
    fee_receipt_update_reason: "",
    financial_year: "",
    invoice_no: "",
    old_invoice_no: "",
    paid_date: moment(new Date()).format("DD-MMM-YYYY"),
    paymentMode: "",
    reference_no: "",
    remarks: "",
    student_id: ""
  }
  chequeDetailsJson: any = {
    bank_name: "",
    cheque_date: "",
    cheque_no: "",
    cheque_status_id: "1"
  }


  constructor(
    private payment: PaymentHistoryMainService,
    private excelService: ExcelService,
    private msgService: MessageShowService,
    private pdf: ExportToPdfService,
    private ref: ChangeDetectorRef,
    private _tablePreferencesService: TablePreferencesService,
  ) { }


  ngOnInit() {
    this.getAllPaymentHistory();
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
    // console.log(this.tableSetting)

  }
  // set default preferences to payment history table
  setDefaultValues() {
    this.tableSetting.keys = [
      { primaryKey: 'student_disp_id', header: 'ID', priority: 1, allowSortingFlag: true },
      { primaryKey: 'student_name', header: 'Name', priority: 2, allowSortingFlag: true },
      { primaryKey: 'parent_name', header: "Parent Name", priority: 3, allowSortingFlag: true },
      { primaryKey: 'display_invoice_no', header: 'Receipt No', priority: 4, allowSortingFlag: true },
    ];
    this.displayKeys = this.tableSetting.keys;
    this._tablePreferencesService.setTablePreferences(this.tableSetting.tableDetails.key, this.displayKeys);
  }

  getAllPaymentHistory() {
    this.flagJson.isRippleLoad = true;
    this.allPaymentRecords = this.tempRecords;
    if (this.varJson.searchName != "" || this.varJson.searchName != null) {
      if (this.isName(this.varJson.searchName)) {
        this.sendPayload.contact_no = "";
        this.sendPayload.student_name = this.varJson.searchName;
      }
      else {
        this.sendPayload.student_name = "";
        this.sendPayload.contact_no = this.varJson.searchName;
      }
    }
    if (this.flagJson.searchflag) {
      this.flagJson.isRippleLoad = false;
      if (this.allPaymentRecords.length == 0) {
        this.tableSetting.displayMessage = "Data not found";
      }
      this.flagJson.searchflag = false;
      return;
    }
    else {
      this.payment.getPaymentData(this.sendPayload).subscribe(
        (data: any) => {
          if (data.length == 0) {
            this.tableSetting.displayMessage = "Data not found";
          }
          this.allPaymentRecords = data;
          this.tempRecords = data;
          this.newData = data.map((ele: any) => ele.paymentModeAmountMap
          );

          if (this.newData.length) {
            this.flagJson.isRippleLoad = false;
            /* update CollectionObject Data for display */
          }
          else {
            this.flagJson.isRippleLoad = false;
          }

        },
        (error: any) => {
          this.flagJson.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', error.error.message)
        })
    }
  }

  isName(str) {
    let hasNumber = /\d/;
    if (hasNumber.test(str)) {
      return false;
    }
    else {
      return true;
    }
  }

  closeReportPopup() {
    this.flagJson.addReportPopUp = false;
  }

  searchByValue(value) {
    this.varJson.searchName = "";
    this.varJson.searchBy = value;
    this.sendPayload.payment_history_student_category_option = this.varJson.searchBy == 'name' ? 0 : 2;
  }

  searchDatabase() {
    if (this.varJson.searchText != "" && this.varJson.searchText != null) {
      this.allPaymentRecords = this.tempRecords.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.varJson.searchText.toLowerCase()))
      );
      this.flagJson.searchflag = true;
    }
    else {
      this.allPaymentRecords = this.tempRecords;
      this.flagJson.searchflag = false;
    }
    // console.log(this.allPaymentRecords);
  }

  futureDateValid(selectDate) {
    if (moment(selectDate).diff(moment()) > 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', 'You cannot select future date');
      this.flagJson.isRippleLoad = false;
      this.sendPayload.from_date = moment().format('YYYY-MM-DD');
      this.sendPayload.to_date = moment().format('YYYY-MM-DD');
    }
  }

  updateAmount(index, totalAmount) {
    if (totalAmount.toString().indexOf(".") == -1) {
      let bal = this.perPersonData[index].temp_balance_amount;
      if (totalAmount == 0) {
        this.perPersonData[index].balance_amount = this.perPersonData[index].temp_balance_amount;
        this.perPersonData[index].amount_paid = this.perPersonData[index].temp_amount_paid;

      }
     if (this.perPersonData[index].balance_amount >= totalAmount) {
        this.perPersonData[index].balance_amount = this.perPersonData[index].balance_amount - totalAmount;
        this.perPersonData[index].amount_paid = totalAmount;
  
      }

      if (totalAmount <= this.perPersonData[index].temp_amount_paid || (totalAmount <= bal && isNaN(totalAmount))) {
        this.perPersonData[index].balance_amount = this.perPersonData[index].balance_amount - totalAmount;
        this.perPersonData[index].amount_paid = totalAmount;
      }
      else if (totalAmount > bal) {
        if (confirm("Invalid value for Amount Paid")) {
          this.perPersonData[index].amount_paid = this.perPersonData[index].temp_amount_paid;
          this.perPersonData[index].balance_amount = this.perPersonData[index].temp_balance_amount;
          (<HTMLInputElement>document.getElementById("inputAmount-" + index)).value = this.perPersonData[index].amount_paid;
          (<HTMLInputElement>document.getElementById("balanceAmount-" + index)).value = this.perPersonData[index].balance_amount;
        }
      }

    }
    else {
      this.msgService.showErrorMessage('error', "", 'Please Enter Number Only ');
    }
    console.log(this.perPersonData);
    
    //installment total amount 
    let total = 0;
    this.perPersonData.forEach((element, index) => {
      total += element.amount_paid;
    });
    this.varJson.total_amt_paid = total;
  }

  
  optionSelected(e) {
    console.log(e);
    this.personData = e.data;
    this.chequeDetailsJson = [];
    this.varJson.tempData = {};
    this.payment.getPerPersonData(e.data.financial_year, e.data.invoice_no).subscribe(
      (data: any) => {
        this.varJson.tempData = this.keepCloning(data);
        if (data.chequeDetailsJson != null || data.chequeDetailsJson == "") {
          this.chequeDetailsJson = data.chequeDetailsJson;
        }
        if (data.feeSchedule_TxLst.length > 0) {
          this.perPersonData = data.feeSchedule_TxLst;
          this.updatedResult.paymentMode = this.perPersonData[0].paymentMode;
          let totalAmount = 0;
          this.perPersonData.forEach((element, index) => {
            totalAmount += element.amount_paid;
            element.temp_amount_paid = element.amount_paid;
            element.temp_balance_amount = element.balance_amount;
          });
          this.varJson.total_amt_paid = totalAmount;
          if (this.updatedResult.paymentMode == "Cheque/PDC/DD No.") {
            this.flagJson.isChequePayment = true;
          }
          else {
            this.flagJson.isChequePayment = false;
          }
          this.flagJson.addReportPopUp = true;
        }
      },
      (error: any) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', error.error.message);
      }
    )
  }

  updationOfPerPersonData() {
    if (this.personData.invoice_no != null && this.personData.invoice_no != '' && this.personData.invoice_no != undefined && this.personData.invoice_no != 0) {

      if (this.updatedResult.fee_receipt_update_reason.trim() != "" && this.updatedResult.fee_receipt_update_reason != null) {

        if (this.flagJson.isChequePayment) {

          if (this.chequeDetailsJson.bank_name == "" || this.chequeDetailsJson.cheque_no == "" ||
            this.chequeDetailsJson.cheque_date == "" || this.chequeDetailsJson.cheque_status_id == "") {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'All bank details are required');
          }
          else {
            let feeSchedule_TxLst = this.fetchhStudentPaymentJson(this.perPersonData);
            if (feeSchedule_TxLst == false) {
              return
            }
            let obj = {
              chequeDetailsJson: this.chequeDetailsJson,
              feeSchedule_TxLst: feeSchedule_TxLst,
              fee_receipt_update_reason: this.updatedResult.fee_receipt_update_reason,
              financial_year: this.personData.financial_year,
              invoice_no: this.personData.invoice_no,
              old_invoice_no: this.personData.invoice_no,
              paid_date: moment(this.updatedResult.paid_date).format("YYYY-MM-DD"),
              paymentMode: this.updatedResult.paymentMode,
              reference_no: this.updatedResult.reference_no,
              remarks: this.updatedResult.remarks,
              student_id: this.perPersonData[0].student_id
            }
            this.payment.updatePerPersonData(obj).subscribe(
              (data: any) => {
                this.msgService.showErrorMessage(this.msgService.toastTypes.success, "Fee reciept updated successfully", '');
                this.chequeDetailsJson = {
                  bank_name: "",
                  cheque_date: "",
                  cheque_no: "",
                  cheque_status_id: ""
                }
                this.getAllPaymentHistory();
                this.updatedResult.fee_receipt_update_reason = "";
                this.flagJson.addReportPopUp = false;
              },
              err => {
                this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
              }
            );
          }
        }

        else {
          let feeSchedule_TxLst = this.fetchhStudentPaymentJson(this.perPersonData);
          if (feeSchedule_TxLst == false) {
            return
          }
          let obj = {
            feeSchedule_TxLst: feeSchedule_TxLst,
            fee_receipt_update_reason: this.updatedResult.fee_receipt_update_reason,
            financial_year: this.personData.financial_year,
            invoice_no: this.personData.invoice_no,
            old_invoice_no: this.personData.invoice_no,
            paid_date: moment(this.updatedResult.paid_date).format("YYYY-MM-DD"),
            paymentMode: this.updatedResult.paymentMode,
            reference_no: this.updatedResult.reference_no,
            remarks: this.updatedResult.remarks,
            student_id: this.perPersonData[0].student_id,
          }
          this.payment.updatePerPersonData(obj).subscribe(
            (data: any) => {
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Fee receipt updated successfully');
              this.getAllPaymentHistory();
              this.updatedResult.fee_receipt_update_reason = "";
              this.flagJson.addReportPopUp = false;
            },
            (error: any) => {
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', error.error.message);
            }
          );
        }
      }
      else {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Update Reason Cannot Be Empty', '');
      }
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Receipt Number Cannot Be Empty', '');
    }
  }


  fetchhStudentPaymentJson(data: any[]) {
    let temp: any[] = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < this.varJson.tempData.feeSchedule_TxLst.length; j++) {
        if (data[i].schedule_id == this.varJson.tempData.feeSchedule_TxLst[j].schedule_id) {
          if (data[i].amount_paid != this.varJson.tempData.feeSchedule_TxLst[j].amount_paid) {
            if (data[i].amount_paid > this.varJson.tempData.feeSchedule_TxLst[j].amount_paid) {
              // You can not increase amount
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, "You can't increase the amount paid", '');
              return false
            }
            else if (data[i].amount_paid < this.varJson.tempData.feeSchedule_TxLst[j].amount_paid) {
              // If Amount decreased
              let diff = this.varJson.tempData.feeSchedule_TxLst[j].amount_paid - data[i].amount_paid;
              let obj: any = {
                schedule_id: data[i].schedule_id,
                payment_tx_id: data[i].payment_tx_id,
                amount_paid: data[i].amount_paid,
                balance_amount: this.varJson.tempData.feeSchedule_TxLst[j].balance_amount + diff
              }
              temp.push(obj);
            } else {
              // If Amount is equal
              let obj = {
                schedule_id: data[i].schedule_id,
                payment_tx_id: data[i].payment_tx_id,
                amount_paid: data[i].amount_paid,
                balance_amount: data[i].balance_amount
              }
              temp.push(obj);
            }
          }
        }
      }
    }
    return temp;
  }

  exportToExcel() {
    let exportedArray: any[] = [];

    this.allPaymentRecords.map((data: any) => {
      let obj = {
        "Id": data.student_disp_id,
        "Name": data.student_name,
        "Parent Name": data.parent_name,
        "Reciept No": data.display_invoice_no,
        "Payment Mode": data.paymentMode,
        "Fee Type": data.fee_type_name,
        "Inst No": data.installment_nos,
        "Paid Date": data.paid_date,
        "Reference No": data.reference_no,
        "Remarks": data.remarks,
        "Amount Paid": data.amount_paid,
        "Student_Category": data.student_category,
        "Counsellor": data.enquiry_counsellor_name
      }

      exportedArray.push(obj);
    })
    this.excelService.exportAsExcelFile(
      exportedArray,
      'Students'
    )
  }

  updateStudentFee(event, index) {
    let e = event.target.value;
    if (e != "") {
      if (parseInt(e) <= parseInt(this.perPersonData[index].fees_amount)) {
        this.perPersonData[index].balance_amount = parseInt(this.perPersonData[index].fees_amount) - parseInt(e);
      }
      else {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Invalid value for Amount Paid', '');
        this.perPersonData[index].amount_paid = this.perPersonData[index].fees_amount;
        this.perPersonData[index].balance_amount = parseInt(this.perPersonData[index].fees_amount) - parseInt(e);
      }
    }
  }

  // give option add payment details add 
  payModeUpdated(e) {
    this.flagJson.isChequePayment = e == "Cheque/PDC/DD No." ? true : false;
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
  isChequeFormValid(): boolean {

    if (this.chequeDetailsJson.bank_name.trim() != "") {
      if (this.chequeDetailsJson.cheque_no != 0 && this.chequeDetailsJson.cheque_no != null) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false;
    }


  }


  keepCloning(objectpassed) {
    if (objectpassed === null || typeof objectpassed !== 'object') {
      return objectpassed;
    }
    let temporaryStorage = objectpassed.constructor();
    for (var key in objectpassed) {
      temporaryStorage[key] = this.keepCloning(objectpassed[key]);
    }
    return temporaryStorage;
  }

  exportToPdf() {
    let arr = [];
    this.allPaymentRecords.map(
      (ele: any) => {
        let json = [
          ele.student_disp_id,
          ele.student_name,
          ele.parent_name,
          ele.display_invoice_no,
          ele.paymentMode,
          ele.fee_type_name,
          ele.installment_nos,
          ele.paid_date,
          ele.remarks,
          ele.reference_no,
          ele.amount_paid,
          ele.enquiry_counsellor_name
        ]
        arr.push(json);
      })

    let rows = [['ID', 'Name', 'Parent Name', 'Reciept No', 'Payment Mode', 'Fee Type', 'Installment No', 'Paid Date', 'Remarks', 'Reference No', 'Amount Paid', 'Counsellor']]
    let columns = arr;
    this.pdf.exportToPdf(rows, columns);
  }
}

