import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService  } from '../../../services/http.service';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-manage-income',
  templateUrl: './manage-income.component.html',
  styleUrls: ['./manage-income.component.scss']
})
export class ManageIncomeComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    toggle: false
  };

  incomeSearchInput: any;

  incomeFilter = {
    dateFilter: "month"
  };
  dateFilterRange: any;
  startDate: any;
  endDate: any;
  incomeRecordList: any[] = [];
  tempIncomelist: any[] = [];

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth:AuthenticatorService,
    private excelService: ExcelService,
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
   }

  ngOnInit() {
    this.getIncomeRecords();
  }

  getIncomeRecords(){
    let obj = {
      type: "0",
      institute_id: this.jsonFlag.institute_id
    }
    if(this.incomeFilter.dateFilter == "date"){
      obj.type = "1",
      obj["startdate"] = "";
      obj["enddate"] = "";
    }
    if(this.incomeFilter.dateFilter != "range"){
      this.getIncomeList(obj)
    }
    else{
      this.dateFilterRange = "";
    }
  }

  getIncomeList(obj){
    const url = `/api/v1/income/all/${this.jsonFlag.institute_id}`
    this.auth.showLoader();
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.incomeRecordList = res;
        this.tempIncomelist = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  searchDatabase(){
    this.incomeRecordList = this.tempIncomelist;
    if (this.incomeSearchInput == undefined || this.incomeSearchInput == null) {
      this.incomeSearchInput = "";
    }
    else {
      let searchData = this.tempIncomelist.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.incomeSearchInput.toLowerCase()))
      );
      this.incomeRecordList = searchData;
    }
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
    this.getIncomeList(obj)
  }

  editIncome(id){
    this.router.navigate(['/view/expense/edit-income/'+id]);
  }

  exportToExcel(event) {
    let temp: any[] = [];
    temp = this.tempIncomelist.map(e => {
      let obj: any = {
        Payment_Date: e.payment_date,
        Reference_No: e.reference_no,
        Payee: e.party_name,
        Category: e.category,
        Total: e.amount,
      }
      return obj;
    });

    this.excelService.exportAsExcelFile(
      temp,
      'Income_report'
    )
  }


}
