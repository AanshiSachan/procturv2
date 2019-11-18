import { Component, OnInit } from '@angular/core';
import { ProfitLossServiceService } from '../../../services/profit-loss-service/profit-loss-service.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss']
})
export class ProfitLossComponent implements OnInit {

  getExpenses = {
    enddate: "",
    startdate: "",
    institute_id: this.profitLoss.institute_id,
    type: 0
  }
  isRippleLoad: boolean = false;
  expenseData: any[] = [];
  incomeData: any[] = [];
  collectionData: any[] = [];
  profitLossData: any[] = [];
  mappedData: any[] = [];
  totalIncome: number;
  totalCollectedData: any[] = [];
  sum:number = 0;
  netIncome:number;
  totalExpenseCollected:any[] = [];
  sumExpense:number = 0;
  helpMsg4: string = "Total fee collected from Inactive/Archived students or students whose fee structure is changed."
  helpMsg3: string = "Sum of all collection excluding expenses";
  helpMsg: string = "Sum of total fee collection ,Total fee collection(others) and income";
  helpMsg2: string = "Sum of all collection excluding expenses";

  constructor(private profitLoss: ProfitLossServiceService,
    private appc: AppComponent,
    private institute_id: AuthenticatorService) {
  }


  ngOnInit() {
    this.getExpenses.type == 0;
    this.fetchAllData(event);
  }


  fetchAllData(event) {
    if (event == "2") {
      this.getExpenses.startdate = moment().format('YYYY-MM-DD');
      this.getExpenses.enddate = moment().format('YYYY-MM-DD');
      this.fetchIncome(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchIncomeFees(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchProfitLoss(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchexpenseData(this.getExpenses.startdate, this.getExpenses.enddate);
    }
    else {
      this.getExpenses.startdate = "";
      this.getExpenses.enddate = "";
      this.fetchIncome(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchIncomeFees(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchProfitLoss(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchexpenseData(this.getExpenses.startdate, this.getExpenses.enddate);
    }
  }



  fetchexpenseData(startdate, enddate) {

    this.isRippleLoad = true;
    this.sumExpense = 0;
    this.profitLoss.fetchExpenseDetails(this.getExpenses).subscribe(
      (data: any) => {
        this.expenseData = data;
        this.totalExpenseCollected = data.map(ele => ele.amount);
        for (let i in this.totalExpenseCollected) {
          this.sumExpense = this.sumExpense + this.totalExpenseCollected[i];
        }
        this.isRippleLoad = false;
      },
      (error: any) => {
        this.isRippleLoad = false;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
        return error;
      }
    )
  }



  fetchIncomeFees(startdate, enddate) {
    this.collectionData = [];
    this.profitLoss.fetchIncomeFeesCollection(this.getExpenses).subscribe(
      (data: any) => {
        this.collectionData.push(data);
        this.isRippleLoad = false;
      },
      (error: any) => {
        this.isRippleLoad = false;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
        return error;
      }
    )
  }



  fetchProfitLoss(startdate, enddate) {
    this.profitLossData = [];
    this.profitLoss.fetchProfitLossReport(this.getExpenses).subscribe(
      (data: any) => {
        this.profitLossData.push(data);
      },
      (error: any) => {
        this.isRippleLoad = false;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
        return error;
      }
    )
  }


  fetchIncome(startdate, enddate) {
    this.sum = 0;
    this.profitLoss.fetchIncomeDetails(this.getExpenses).subscribe(
      (data: any) => {
        this.incomeData = data;
        this.isRippleLoad = false;
        this.totalCollectedData = data.map(ele => ele.amount);
        for (let i in this.totalCollectedData) {
          this.sum = this.sum + this.totalCollectedData[i];
        }
      },
      (error: any) => {
        this.isRippleLoad = false;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
      }
    )
  }

  
  fetchByRange(event) {
    if (event == "2") {
      this.getExpenses.startdate = moment().format('YYYY-MM-DD');
      this.getExpenses.enddate = moment().format('YYYY-MM-DD');
      this.fetchIncome(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchIncomeFees(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchProfitLoss(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchexpenseData(this.getExpenses.startdate, this.getExpenses.enddate);
    }
    else {
      this.getExpenses.startdate = "";
      this.getExpenses.enddate = "";
      this.fetchIncome(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchIncomeFees(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchProfitLoss(this.getExpenses.startdate, this.getExpenses.enddate);
      this.fetchexpenseData(this.getExpenses.startdate, this.getExpenses.enddate);
    }

  }

}
