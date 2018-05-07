import { Component, OnInit } from '@angular/core';
import { ColumnData } from '../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { LoginService } from '../../../services/login-services/login.service';
import { AppComponent } from '../../../app.component';

import { GetFeeService } from '../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../services/report-services/fee-services/postFee.service';

@Component({
  selector: 'app-fee-report',
  templateUrl: './fee-report.component.html',
  styleUrls: ['./fee-report.component.scss']
})
export class FeeReportComponent implements OnInit {

  isProfessional: boolean = false;

  feeSettings: ColumnData[] = [
    { primaryKey: 'id', header: 'ID' },
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'total_fee', header: 'Total Fee' },
    { primaryKey: 'amt_paid', header: 'Amount Paid' },
    { primaryKey: 'past_due', header: 'Past Dues' },
    { primaryKey: 'future_duedate', header: 'Next Future Due Date' },
    { primaryKey: 'future_dueamt', header: 'Next Future Amount' },
    { primaryKey: 'pdcdate', header: 'PDC Date' },
    { primaryKey: 'balance', header: 'Amount Still Payable' },
  ];

  feeDataSource: any[] = [];

  courseFetchForm:any = {
    standard_id: -1,
    subject_id: -1,
    batch_id: -1
  }

  constructor(
    private login: LoginService,
    private appC: AppComponent, 
    private getter: GetFeeService,
    private putter: PostFeeService
  ) {
    this.switchActiveView('fee');
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('inst_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    this.fetchPrefillDetails();

    this.fetchFeeReportData();

  }


  fetchPrefillDetails() {
    this.getBatchCourseDetails();
  }

  fetchFeeReportData() {

  }

  getBatchCourseDetails() {
    if (this.isProfessional) {
      this.updateMasterCourseBatch();
    }
    else {

    }
  }


  updateMasterCourseBatch() {
    this.getter.getBatchDetails(this.courseFetchForm).subscribe(
      res => {},
      err => {}
    )
  }









  switchActiveView(id) {
    document.getElementById('home').classList.remove('active');
    document.getElementById('attendance').classList.remove('active');
    document.getElementById('sms').classList.remove('active');
    document.getElementById('fee').classList.remove('active');
    document.getElementById('exam').classList.remove('active');
    document.getElementById('report').classList.remove('active');
    document.getElementById('time').classList.remove('active');
    document.getElementById('email').classList.remove('active');
    document.getElementById('profit').classList.remove('active');
    switch (id) {
      case 'home': { document.getElementById('home').classList.add('active'); break; }
      case 'attendance': { document.getElementById('attendance').classList.add('active'); break; }
      case 'sms': { document.getElementById('sms').classList.add('active'); break; }
      case 'fee': { document.getElementById('fee').classList.add('active'); break; }
      case 'exam': { document.getElementById('exam').classList.add('active'); break; }
      case 'report': { document.getElementById('report').classList.add('active'); break; }
      case 'time': { document.getElementById('time').classList.add('active'); break; }
      case 'email': { document.getElementById('email').classList.add('active'); break; }
      case 'profit': { document.getElementById('profit').classList.add('active'); break; }
    }
  }

}
