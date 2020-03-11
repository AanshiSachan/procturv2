import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService  } from '../../../services/http.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    toggle: false
  };

  recordFilter = {
    dateFilter: "month"
  };
  dateFilterRange: any;
  startDate: any;
  endDate: any;
  expenseRecordList: any[] = [];
  incomeRecordList: any[] = [];
  profitLostList: any[] = [];
  feeCollectionList: any[] = [];

  expenseTotal: any;
  incomeTotal:any;
  expenseInventoryTotal: any;

  totalFeeCollection: any;
  totalOtherFeeCollection: any;
  totalSalesRevenue: any;
  netIncome: any;


  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
   }

  ngOnInit() {
    this.getAllRecords();
  }

  getAllRecords(){
    let obj = {
      type: "0",
      institute_id: this.jsonFlag.institute_id
    }
    if(this.recordFilter.dateFilter == "date"){
      obj.type = "1",
      obj["startdate"] = "";
      obj["enddate"] = "";
    }
    if(this.recordFilter.dateFilter != "range"){
      this.getExpenseList(obj);
    }
    else{
      this.dateFilterRange = "";
    }
  }



  getExpenseList(obj){
    this.expenseTotal = 0;
    const url = `/api/v1/expense/all/${this.jsonFlag.institute_id}`
    this.jsonFlag.isRippleLoad = true;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.jsonFlag.isRippleLoad = false;
        this.expenseRecordList = res;
        if(this.expenseRecordList.length > 0){
          for (let index = 0; index < this.expenseRecordList.length; index++) {
            this.expenseTotal = Number(this.expenseTotal) + Number(this.expenseRecordList[index].amount);
          }
        }
        this.getIncomeList(obj);
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getIncomeList(obj){
    this.incomeTotal = 0;
    const url = `/api/v1/income/all/${this.jsonFlag.institute_id}`
    this.jsonFlag.isRippleLoad = true;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.jsonFlag.isRippleLoad = false;
        this.incomeRecordList = res;
        if(this.incomeRecordList.length > 0){
          for (let index = 0; index < this.incomeRecordList.length; index++) {
            this.incomeTotal = Number(this.incomeTotal) + Number(this.incomeRecordList[index].amount);
          }
        }
        this.getProfitLossList(obj);
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getProfitLossList(obj){
    const url = `/api/v1/inventory/item/getProfit_Lost/${this.jsonFlag.institute_id}`
    this.jsonFlag.isRippleLoad = true;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.jsonFlag.isRippleLoad = false;
        this.profitLostList = res;
        this.expenseInventoryTotal = res.expense_inventory;
        this.getFeeCollection(obj);
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getFeeCollection(obj){
    const url = `/api/v1/income/feesCollection/${this.jsonFlag.institute_id}`
    this.jsonFlag.isRippleLoad = true;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.jsonFlag.isRippleLoad = false;
        this.feeCollectionList = res;
        this.totalFeeCollection = res.total_fees_collected;
        this.totalOtherFeeCollection = res.total_fees_collected_other;
        this.totalSalesRevenue = Number(this.incomeTotal) + Number(this.totalFeeCollection) + Number(this.totalOtherFeeCollection);
        let tempSalesRevenue = this.totalSalesRevenue.toFixed(2);
        this.totalSalesRevenue = Number(tempSalesRevenue);
        this.netIncome = Number(this.totalSalesRevenue) - Number(this.expenseTotal);
        let tempNetWorth = this.netIncome.toFixed(2);
        this.netIncome = Number(tempNetWorth);
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }


  dateRangeChange(e) {
    this.startDate = moment(e[0]).format("YYYY-MM-DD");
    this.endDate = moment(e[1]).format("YYYY-MM-DD");
    let obj = {
      type: "2",
      institute_id: this.jsonFlag.institute_id,
      startdate: this.startDate,
      enddate: this.endDate
    }
    this.getExpenseList(obj);
  }


}
