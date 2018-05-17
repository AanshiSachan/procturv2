import { Component, OnInit } from '@angular/core';
import { PaymentHistoryMainService } from '../../../../services/payment-history/payment-history-main.service';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';
@Component({
  selector: 'app-payment-history-main',
  templateUrl: './payment-history-main.component.html',
  styleUrls: ['./payment-history-main.component.scss']
})
export class PaymentHistoryMainComponent implements OnInit {

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
  searchByNameVisible: boolean = false;
  searchByDateVisible: boolean = true;
  newData: any[] = [];
  paymentMode: any[] = [];
  searchName:any ;
  addReportPopUp:boolean = false;
  perPersonData:any[]=[];
  helpMsg: string = "Total fee collected from Inactive/Archived students or students whose fee structure is changed."
  
  constructor(private payment: PaymentHistoryMainService, private appc: AppComponent, ) { }

  ngOnInit() {
    this.getAllPaymentHistory();
  }

  getAllPaymentHistory() {
    this.showPaymentBox = true;
    this.isRippleLoad = true;
    this.newData = [];
    this.allPaymentRecords = [];
   if(this.searchName!="" || this.searchName != null){
     if(this.isName(this.searchName)){
       this.sendPayload.contact_no = "";
       this.sendPayload.student_name= this.searchName;
     }
     else{
       if(this.searchName.length == 10){
        this.sendPayload.student_name = "";
        this.sendPayload.contact_no= this.searchName;
       }
       else{
        this.allPaymentRecords= this.allPaymentRecords.filter((ele:any)=>{return ele.display_invoice_no.toLowerCase().match(this.searchName.toLowerCase()
        )})
        
        this.totalRow = this.allPaymentRecords.length;
        this.PageIndex = 1;
        this.fetchTableDataByPage(this.PageIndex);     
       }
     }
   }
    this.payment.getPaymentData(this.sendPayload).subscribe(
      (data: any) => {

        this.allPaymentRecords = data;
        this.newData = data.map((ele: any) => ele.paymentModeAmountMap
        );
        console.log(this.newData[0]);
        this.isRippleLoad = false;
        this.totalRow = data.length;
        this.PageIndex = 1;
        this.fetchTableDataByPage(this.PageIndex);        
        
      },
      (error: any) => {
        this.isRippleLoad = false;
        return error;
      }
    )

  }

  isName(str){
    let hasNumber = /\d/;
    if(hasNumber.test(str)){
      return false;
    }
    else{
      return true;
    }
  }
  editPerPersonData(i){
   let queryParameters={
      financial_year:i.financial_year
    }
    this.addReportPopUp = true;
    this.payment.getPerPersonData(queryParameters , i).subscribe(
      (data:any)=>{
          this.perPersonData = data.feeSchedule_TxLst;
      },
      (error:any)=>{
        return error;
      }
    )
    console.log(this.perPersonData);
  }
  closeReportPopup(){
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
      this.PageIndex = 1;
      let searchData: any;
      searchData = this.allPaymentRecords.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchData = searchData;
      this.totalRow = searchData.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.PageIndex);

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

}
