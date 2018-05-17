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
  constructor(private payment: PaymentHistoryMainService, private appc: AppComponent, ) { }

  ngOnInit() {
    this.getAllPaymentHistory();
  }

  getAllPaymentHistory() {
    this.showPaymentBox = true;
    this.isRippleLoad = true;

    this.payment.getPaymentData(this.sendPayload).subscribe(
      (data: any) => {
        this.allPaymentRecords = data;
        this.isRippleLoad = false;
        this.totalRow = data.length;
        this.PageIndex = 1;
        this.fetchTableDataByPage(this.PageIndex);
      },
      (error: any) => {
        this.isRippleLoad = false;
        return error;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
      }
    )

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
