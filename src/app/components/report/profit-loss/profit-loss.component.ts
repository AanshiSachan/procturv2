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

  getExpenses ={
    enddate:moment().format('YYYY-MM-DD'),
    startdate:moment().format('YYYY-MM-DD'),
    institute_id:this.profitLoss.institute_id,
    type:0
  }
  isRippleLoad: boolean = false;

  constructor(private profitLoss: ProfitLossServiceService,
    private appc: AppComponent,
    private institute_id: AuthenticatorService) {
  }


  ngOnInit() {
    this.fetchAllData();
  }


  fetchAllData() {
    this.fetchexpenseData();
    this.fetchIncomeFees();
    this.fetchProfitLoss();
    this.fetchIncome();
  }



  fetchexpenseData() {

    this.isRippleLoad = true;
    this.profitLoss.fetchExpenseDetails(this.getExpenses).subscribe(
      (data: any) => {
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



  fetchIncomeFees() {
    
    this.profitLoss.fetchIncomeFeesCollection(this.getExpenses).subscribe(
      (data: any) => {
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



  fetchProfitLoss() {
    
    this.profitLoss.fetchProfitLossReport(this.getExpenses).subscribe(
      (data: any) => {
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


  fetchIncome() {
    
    this.profitLoss.fetchIncomeDetails(this.getExpenses).subscribe(
      (data: any) => {
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

}
