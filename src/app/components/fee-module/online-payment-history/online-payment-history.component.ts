import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ExcelService } from '../../../services/excel.service';
import { OnlinePaymentServiceService } from '../../../services/online-payment/online-payment-service.service';
import { ColumnData } from '../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';


@Component({
  selector: 'app-online-payment-history',
  templateUrl: './online-payment-history.component.html',
  styleUrls: ['./online-payment-history.component.scss']
})
export class OnlinePaymentHistoryComponent implements OnInit {

  feeSettings1: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'display_invoice_no', header: 'Receipt No' },
    { primaryKey: 'fee_type_name', header: 'Fee Type' },
    { primaryKey: 'installment_nos', header: 'Inst No' },
    { primaryKey: 'razor_payment_id', header: 'Gateway Payment Id' },
    { primaryKey: 'payment_status', header: 'Payment Status' },
    { primaryKey: 'transerable_amount', header: 'Transferrable Amt(in Rs)' },
    { primaryKey: 'razor_payment_gateway_fees', header: 'Payment Gateway Commission(in Rs)' },
    { primaryKey: 'razor_GST_fees', header: 'GST(in Rs)' },
    { primaryKey: 'paid_date', header: 'Paid Date' },
    { primaryKey: 'amount_paid', header: 'Amount Paid' },
    { primaryKey: 'student_category', header: 'Student Category' },
    { primaryKey: 'enquiry_counsellor_name', header: 'Counsellor' },
 
  ];
  sendPayload: any = {
    institute_id: this.paymentService.institute_id,
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    payment_history_student_category_option: 2,
    student_name: "",
    contact_no: ""
  }
  dataStatus: number = 0;
  searchByNameVisible: boolean = false;
  dataGetPayload: any[] = [];
  paymentJson: any[] = [];
  removeSearchByName: boolean = true;
  searchflag: boolean = false;
  searchName:string = "";
  searchText:string = "";
  tempRecords:any[]=[];
  downloadFeeReportAccess:boolean = false;
  helpMsg: string = "Total fee collected from Inactive/Archived students or students whose fee structure is changed."
  helpMsg3: string = " Fee(s) collected from active students";
  helpMsg4: string = " Fee(s) collected from inactive students";
  helpMsg1: string = "Fee(s)collected from students whose fee structure has been revised.It basically contains the records as per the old fee structure.";
  helpMsg2: string = " Fee(s)collected from archived students";

  constructor(
    private paymentService: OnlinePaymentServiceService,
    private appc: AppComponent,
    private auth: AuthenticatorService,
    private excelService:ExcelService) { }

  ngOnInit() {
    window.scroll(0,0);
    this.getAllPaymentRecords();
    this.checkDownloadRoleAccess();
  }

  checkDownloadRoleAccess() {
    if(sessionStorage.getItem('downloadFeeReportAccess')=='true'){
        this.downloadFeeReportAccess = true;
    }
}
// ============================================================================
// ============================================================================
// for fetching data
  getAllPaymentRecords() {
    this.auth.showLoader();
    this.dataStatus = 1;
    this.dataGetPayload = this.tempRecords;
    if (this.searchName != "" || this.searchName != null) {
      if (this.isName(this.searchName)) {
        this.sendPayload.contact_no = "";
        this.sendPayload.student_name = this.searchName;
      }
      else {
        this.sendPayload.student_name = "";
        this.sendPayload.contact_no = this.searchName;
      }
    }

    if (this.searchflag) {
      this.auth.hideLoader();
      if (this.dataGetPayload.length == 0) {
        this.dataStatus = 2;
      }
      else {
        this.dataStatus = 0;
      }
      this.searchflag = false;
      return;
    }
    else {
      this.paymentService.getAllPaymentRecords(this.sendPayload).subscribe(
        
        (data: any) => {
          this.dataGetPayload = data;
          this.tempRecords = data;
          if (this.dataGetPayload.length == 0) {
            this.dataStatus = 2;
          }
          else {
            this.dataStatus = 0;
          }
          this.dataGetPayload.map(
            (ele:any)=>{
              ele.razor_payment_id = ele.onlinePaymentJson.razor_payment_id,
              ele.payment_status = ele.onlinePaymentJson.payment_status,
              ele.transerable_amount = ele.onlinePaymentJson.transerable_amount,
              ele.razor_payment_gateway_fees = ele.onlinePaymentJson.razor_payment_gateway_fees,
              ele.razor_GST_fees = ele.onlinePaymentJson.razor_GST_fees
            }
          )
          console.log(this.dataGetPayload);
          this.auth.hideLoader();
        },
        (error: any) => {
          this.auth.hideLoader();
          this.dataStatus = 2;
          let msg = {
            type: "error",
            body: error.error.message
          }
          this.appc.popToast(msg);
        }
      )
    }
  }
// ============================================================================
// ============================================================================
// for searching the history by name
  searchByName() {
    this.sendPayload.from_date = "";
    this.sendPayload.to_date = "";
    this.searchByNameVisible = true;
    this.removeSearchByName = false;
  }
// ============================================================================
// ============================================================================
// for searching by date
  searchByDate() {
    this.searchName = "";
    this.removeSearchByName = true;
    this.searchByNameVisible = false;
  }
// ============================================================================
// ============================================================================
// for finding the number from a regex
  isName(str) {
    let hasNumber = /\d/;
    if (hasNumber.test(str)) {
      return false;
    }
    else {
      return true;
    }
  }

// ============================================================================
// ============================================================================
// for searching data
  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      // let searchData: any;
      this.dataGetPayload = this.dataGetPayload.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      // this.searchData = searchData;
      this.searchflag = true;
    }
    else {
      this.dataGetPayload = this.tempRecords;
      this.searchflag = false;
    }
  }
// ============================================================================
// ============================================================================
// exporting to excel of json file
  exportToExcel(event) {
    let exportedArray: any[] = [];
    this.dataGetPayload.map((data:any)=>{
      
      let obj={
        "Id" : data.student_disp_id,
        "Name" : data.student_name,
        "Reciept No" : data.display_invoice_no,
        "Fee Type" : data.fee_type_name,
        "Inst No" : data.installment_nos,
        "Gateway Payment Id" : data.onlinePaymentJson.razor_payment_id,
        "Payment Method" : data.onlinePaymentJson.payment_method,
        "Transferrable Amt(in Rs)" : data.onlinePaymentJson.transerable_amount,
        "Payment Gateway Commission(in Rs)" :  data.onlinePaymentJson.razor_payment_gateway_fees,
        "GST(in Rs)" : data.onlinePaymentJson.razor_GST_fees,
        "Payment Status" : data.onlinePaymentJson.payment_status,
        "Paid Date" : data.paid_date,
        "Amount Paid" : data.amount_paid_inRs,
        "Student Category" : data.student_category,
        "Counsellor" : data.enquiry_counsellor_name
      } 
      console.log(obj);
      exportedArray.push(obj);
    })
    this.excelService.exportAsExcelFile(
      exportedArray,
      'Students'
    )
  }
// ============================================================================
// ============================================================================
// for furure date validation
  futureDateValid(selectDate) {
    if (moment(selectDate).diff(moment()) > 0) {
      let msg = {
        type: "info",
        body: "You cannot select future date"
      }
      this.appc.popToast(msg);
      this.auth.hideLoader();
      this.sendPayload.from_date = moment().format('YYYY-MM-DD');
      this.sendPayload.to_date = moment().format('YYYY-MM-DD');
    }
  }
}
