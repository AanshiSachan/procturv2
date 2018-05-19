import { Component, OnInit } from '@angular/core';
import { PaymentHistoryMainService } from '../../../../services/payment-history/payment-history-main.service';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { DropData } from '../../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-payment-history-main',
  templateUrl: './payment-history-main.component.html',
  styleUrls: ['./payment-history-main.component.scss']
})
export class PaymentHistoryMainComponent implements OnInit {

  isChequePayment: boolean = false;
  isRippleLoad: boolean = false;
  sendPayload = {
    institute_id: this.payment.institute_id,
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    payment_history_student_category_option: "",
    student_name: "",
    contact_no: ""
  }
  allPaymentRecords: any[] = [];
  tempRecords: any[] = [];
  PageIndex: number = 1;
  pagedisplaysize: number = 10;
  totalRow: number;
  paginatedPayment: any[] = [];
  showPaymentBox: boolean = false;
  searchText = "";
  searchData = [];
  searchflag: boolean = false;
  sortedenabled: boolean = true;
  sortedBy: string = "";
  direction = 0;
  personData: any = {
    paid_date: "",
    paymentMode: "",
    remarks: "",
    reference_no: "",
    invoice_no: "",
  }
  updationArray: any[] = [];
  searchByNameVisible: boolean = false;
  searchByDateVisible: boolean = true;
  newData: any[] = [];
  paymentMode: any[] = [];
  searchName: any;
  addReportPopUp: boolean = false;
  perPersonData: any[] = [];
  helpMsg: string = "Total fee collected from Inactive/Archived students or students whose fee structure is changed."
  helpMsg3: string = " Fee(s) collected from active students";
  helpMsg4: string = " Fee(s) collected from inactive students";
  helpMsg1: string = "Fee(s)collected from students whose fee structure has been revised.It basically contains the records as per the old fee structure.";
  helpMsg2: string = " Fee(s)collected from archived students";

  feeSettings1: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'display_invoice_no', header: 'Receipt No' },
    { primaryKey: 'paymentMode', header: 'Payment Mode' },
    { primaryKey: 'fee_type_name', header: 'Fee Type' },
    { primaryKey: 'installment_nos', header: 'Inst No' },
    { primaryKey: 'paid_date', header: 'Paid Date' },
    { primaryKey: 'reference_no', header: 'Ref No' },
    { primaryKey: 'amount_paid', header: 'Amount Paid' },
    { primaryKey: 'student_category', header: 'Student Category' },
    { primaryKey: 'enquiry_councellor_name', header: 'Counsellor' }
  ];

  menuOptions: DropData[] = [
    {
      key: 'edit',
      header: 'edit',
    }
  ];
  dataStatus: number = 0;

  collectionData: any = {
    pdcNo: 0,
    refundValue: 0,
    cash: 0,
    cardValue: 0,
    fees_amount: 0
  }
  specifyCheckbox: boolean = false;
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
    paymentMode: "Cash",
    reference_no: "",
    remarks: "",
    student_id: ""
  }


  chequeDetailsJson: any = {
    bank_name: "",
    cheque_date: "",
    cheque_no: "",
    cheque_status_id: ""
  }
  constructor(private payment: PaymentHistoryMainService, private excelService: ExcelService, private appc: AppComponent) { }


  ngOnInit() {
    this.getAllPaymentHistory();
  }


  getAllPaymentHistory() {
    this.showPaymentBox = true;
    this.isRippleLoad = true;
    // this.newData = [];
    this.allPaymentRecords = this.tempRecords;
    this.dataStatus = 1;
    if (this.searchName != "" || this.searchName != null) {
      if (this.isName(this.searchName)) {
        this.sendPayload.contact_no = "";
        this.sendPayload.student_name = this.searchName;
      }
      else {
        if (this.searchName.length == 10) {
          this.sendPayload.student_name = "";
          this.sendPayload.contact_no = this.searchName;
        }
        else {
          this.allPaymentRecords = this.allPaymentRecords.filter((ele: any) => {
            this.searchflag = true;
            return ele.display_invoice_no.toLowerCase().match(this.searchName.toLowerCase()
            )
          })
        }
      }
    }
    if (this.searchflag) {
      this.isRippleLoad = false;
      if (this.allPaymentRecords.length == 0) {
        this.dataStatus = 2;
      }
      else {
        this.dataStatus = 0;
      }
      this.searchflag = false;
      return;
    }
    else {
      this.payment.getPaymentData(this.sendPayload).subscribe(
        (data: any) => {
          if (data.length == 0) {
            this.dataStatus = 2;
          }
          else {
            this.dataStatus = 0;
          }
          this.allPaymentRecords = data;
          this.tempRecords = data;
          this.newData = data.map((ele: any) => ele.paymentModeAmountMap
          );

          if (this.newData.length) {
            this.isRippleLoad = false;
            /* update CollectionObject Data for display */
          }
          else {
            this.isRippleLoad = false;
            this.dataStatus = 2;
          }

        },
        (error: any) => {
          this.dataStatus = 2;
          // this.dataStatus = 0;
          this.isRippleLoad = false;
          let msg = {
            type: "error",
            body: error.error.message
          }
          this.appc.popToast(msg);
        }
      )

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



  editPerPersonData(ev, i) {
    let queryParameters = {
      financial_year: i.financial_year
    }
    this.addReportPopUp = true;
    this.payment.getPerPersonData(queryParameters, i).subscribe(
      (data: any) => {
        this.perPersonData = data.feeSchedule_TxLst;
      },
      (error: any) => {
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
        return error;
      }

    )
    console.log(this.perPersonData);
  }



  closeReportPopup() {
    this.addReportPopUp = false;
  }



  searchByName() {
    this.searchByNameVisible = true;
    this.searchByDateVisible = false;
  }



  searchByDate() {
    this.searchByDateVisible = true;
    this.searchByNameVisible = false;
  }



  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      // let searchData: any;
      this.allPaymentRecords = this.allPaymentRecords.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      // this.searchData = searchData;
      this.searchflag = true;
    }
    else {
      this.allPaymentRecords = this.tempRecords;
      this.searchflag = false;
    }
  }



  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.pagedisplaysize * (index - 1);
    this.paginatedPayment = this.getDataFromDataSource(startindex);
  }




  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }




  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }




  getDataFromDataSource(startindex) {
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
    else {
      let d = this.allPaymentRecords.slice(startindex, startindex + this.pagedisplaysize);
      return d;
    }
  }




  futureDateValid(selectDate) {
    if (moment(selectDate).diff(moment()) > 0) {
      let msg = {
        type: "info",
        body: "You cannot select future date"
      }
      this.appc.popToast(msg);
      this.isRippleLoad = false;
      this.sendPayload.from_date = moment().format('YYYY-MM-DD');
      this.sendPayload.to_date = moment().format('YYYY-MM-DD');
    }
  }




  sortedData(ev) {
    this.sortedenabled = true;
    if (this.sortedenabled) {
      (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1);
      this.sortedBy = ev;
      this.allPaymentRecords = this.allPaymentRecords.sort((a: any, b: any) => {
        if (a[ev] < b[ev]) {
          return -1 * this.direction;
        }
        else if (a[ev] > b[ev]) {
          return this.direction;
        }
        else {
          return 0;
        }
      });
      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }




  getCaretVisiblity(e): boolean {

    if (this.sortedenabled && this.sortedBy == e) {
      return true;
    }

    else {
      return false;
    }
  }


  optionSelected(e) {
    this.personData = e.data;
    this.payment.getPerPersonData(e.data.financial_year, e.data.invoice_no).subscribe(
      (data: any) => {
        if(data.feeSchedule_TxLst.length){

          this.perPersonData = data.feeSchedule_TxLst.map(e => {
            e.amountToBePaid = e.amount_paid;
            e.receipt_old_id = e.invoice_no;
            return e; 
          });
          console.log(this.perPersonData);
          this.addReportPopUp = true;
        }
        else{
          let msg = {
            type: "info",
            title: "",
            body: ""
          }
          this.appc.popToast(msg);          
          this.addReportPopUp = false;
        }
      
      },
      (error: any) => {
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
      }
    )

  }


  updationOfPerPersonData() {

    if (this.personData.invoice_no != null && this.personData.invoice_no != '' && this.personData.invoice_no != undefined && this.personData.invoice_no != 0) {

      if (this.updatedResult.fee_receipt_update_reason.trim() != "" && this.updatedResult.fee_receipt_update_reason != null) {

        if (this.isChequePayment) {

          if (this.isChequeFormValid()) {
            let obj = {
              chequeDetailsJson:{
                schedule_id:this.chequeDetailsJson.schedule_id,
                amount_paid:this.chequeDetailsJson.amount_paid,
                balance_amount: this.chequeDetailsJson.balance_amount,
                payment_tx_id:this.chequeDetailsJson.payment_tx_id
              },
              feeSchedule_TxLst: this.fetchhStudentPaymentJson(this.perPersonData),
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
                console.log(data);
                let msg={
                  type:"success",
                  body:"Fee reciept updated successfully"
                }
                this.appc.popToast(msg);
                this.getAllPaymentHistory();
              },
              (error: any) => {
                let msg = {
                  type: "error",
                  body: error.error.message
                }
                this.appc.popToast(msg);
              }
            );
          }

        }
        else {

          let obj = {

            feeSchedule_TxLst: this.fetchhStudentPaymentJson(this.perPersonData),
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
              this.perPersonData = data;
              this.updationArray = data;
              let msg={
                type:"success",
                body:"Fee reciept updated successfully"
              }
              this.appc.popToast(msg);
              this.getAllPaymentHistory();
            },
            (error: any) => {
              let msg = {
                type: "error",
                body: error.error.message
              }
              this.appc.popToast(msg);
            }
          );

        }

      }
      else {
        let msg = {
          type: "error",
          title: "Update Reason Cannot Be Empty",
          body: ""
        }
        this.appc.popToast(msg);
      }
    }
    else {
      let msg = {
        type: "error",
        title: "Receipt Number Cannot Be Empty",
        body: ""
      }
      this.appc.popToast(msg);
    }
  }


  fetchhStudentPaymentJson(data: any[]): any[] {

    let temp: any[] = [];

    data.forEach(e => {
      let obj = {
        schedule_id: e.schedule_id,
        payment_tx_id: e.payment_tx_id,
        amount_paid: e.amount_paid,
        balance_amount: e.balance_amount
      }
      temp.push(obj);
    });
    return temp;
  }

  exportToExcel(event) {
    this.excelService.exportAsExcelFile(
      this.allPaymentRecords,
      'Students'
    )
  }


  updateStudentFee(e, index) {
    if (e <= this.perPersonData[index].fees_amount) {
      this.perPersonData[index].amount_paid = e;
      this.perPersonData[index].balance_amount = parseInt(this.perPersonData[index].fees_amount) - parseInt(e);
    }
    else {
      let obj = {
        type: 'error',
        title: 'Invalid value for Amount Paid',
        body: ''
      }
      this.appc.popToast(obj);
      return this.perPersonData[index].amount_paid;
    }

  }


  payModeUpdated(e) {
    console.log(e);
    if (e == "Cheque/PDC/DD No.") {
      this.isChequePayment = true;
    }
    else {
      this.isChequePayment = false;
    }
  }


  isChequeFormValid(): boolean {



    return false;
  }


}

