import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService  } from '../../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.scss']
})
export class ManageExpenseComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    toggle: false
  };

  expenseSearchInput: any;

  expenseFilter = {
    dateFilter: "month"
  };
  dateFilterRange: any;
  startDate: any;
  endDate: any;
  expenseRecordList: any[] = [];
  tempExpenselist: any[] = [];

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
   }

  ngOnInit() {
    this.getExpenseRecords();
  }

  getExpenseRecords(){
    let obj = {
      type: "0",
      institute_id: this.jsonFlag.institute_id
    }
    if(this.expenseFilter.dateFilter == "date"){
      obj.type = "1",
      obj["startdate"] = "";
      obj["enddate"] = "";
    }
    if(this.expenseFilter.dateFilter != "range"){
      this.getExpenseList(obj)
    }
    else{
      this.dateFilterRange = "";
    }
  }

  getExpenseList(obj){
    const url = `/api/v1/expense/all/${this.jsonFlag.institute_id}`
    this.jsonFlag.isRippleLoad = true;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.jsonFlag.isRippleLoad = false;
        this.expenseRecordList = res;
        this.tempExpenselist = res;
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  searchDatabase(){
    this.expenseRecordList = this.tempExpenselist;
    if (this.expenseSearchInput == undefined || this.expenseSearchInput == null) {
      this.expenseSearchInput = "";
    }
    else {
      let searchData = this.tempExpenselist.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.expenseSearchInput.toLowerCase()))
      );
      this.expenseRecordList = searchData;
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
    this.getExpenseList(obj)
  }

  editExpense(id){
    this.router.navigate(['/view/expense/edit-expense/'+id]);
  }



}
