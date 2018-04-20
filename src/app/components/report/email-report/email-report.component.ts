import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../services/login-services/login.service';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { getEmailService } from '../../../services/report-services/get-email.service';
import * as moment from 'moment';

@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.scss']
})

export class EmailReportComponent {
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 10;
  emailSource: any[] = [];
  emailDataSource: any = [];

  projectSettings: ColumnSetting[] = [
    { primaryKey: 'sentDateTime', header: 'Sent Date' },
    { primaryKey: 'emailId', header: 'Email' },
    { primaryKey: 'message', header: 'Subject' },
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'role', header: 'Role' },
    { primaryKey: 'func_type', header: 'Type' }
  ];


  emailFetchForm: any = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    from_date: moment().format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
  }

  constructor(
    private apiService: getEmailService,
    private login: LoginService,
    private appC: AppComponent,
  ) {
    this.switchActiveView('email');
  }

  ngOnInit() {
    this.pageIndex = 1;
    this.emailSource = [];
    this.apiService.getEmailMessages(this.emailFetchForm).subscribe(
      res => {
        this.emailDataSource = res;
        this.totalRecords = res.length;
        this.fetchTableDataByPage(this.pageIndex);
        console.log(res);

      },
      err => {
        console.log(err);
        let obj = {
          type: "error",
          title: "Unable to Fetch Report",
          body: ""
        }
        this.appC.popToast(obj);
      }
    )
    // this.getAllEmailMessages();
  }

  isTimeValid(): boolean {
    let v = moment(this.emailFetchForm.from_date).diff(moment(this.emailFetchForm.to_date))
    if (v <= 0) {
      return true;
    }
    else {
      return false;
    }
  }

  /* fetching email info by date */
  fetchemailByDate() {
    if (this.isTimeValid()) {
      //this.getAllEmailMessages();
      this.ngOnInit();
    }
    else {
      let obj = {
        type: "error",
        title: "Invalid Date Range Selected",
        Body: "From date cannot be greater than To date"
      }
      this.appC.popToast(obj);

    }
  }



  // pagination functions 

  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.emailSource = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }

  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.emailDataSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }


  switchActiveView(id) {
    document.getElementById('email').classList.remove('active');
  }

}
