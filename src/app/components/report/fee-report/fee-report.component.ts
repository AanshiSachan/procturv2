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
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'total_fee', header: 'Total Fee' },
    { primaryKey: 'amt_paid', header: 'Amount Paid' },
    { primaryKey: 'past_due', header: 'Past Dues' },
    { primaryKey: 'future_duedate', header: 'Next Future Due Date' },
    { primaryKey: 'future_dueamt', header: 'Next Future Amount' },
    { primaryKey: 'pdcdate', header: 'PDC Date' },
    { primaryKey: 'balance', header: 'Amount Still Payable' },
  ];

  feeDataSource: any[] = [];

  courseFetchForm: any = {
    standard_id: -1,
    subject_id: -1,
    batch_id: -1,
    student_name: '',
    from_date: '',
    to_date: '',
    master_course_name: -1,
    course_id: -1,
    contact_no: '',
    type: 0
  }

  due_type: any = '-1';

  search_value: any = '';

  standardList: any[] = [];

  subjectList: any[] = [];

  batchList: any[] = [];

  constructor(
    private login: LoginService,
    private appC: AppComponent,
    private getter: GetFeeService,
    private putter: PostFeeService
  ) {
    this.switchActiveView('fee');
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
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
      this.updateMasterCourse();
    }
  }


  updateMasterCourseBatch() {
    this.getter.getBatchDetails(this.courseFetchForm).subscribe(
      res => {
        this.batchList = res.batchLi;
        this.standardList = res.standardLi;
        this.subjectList = [];
      },
      err => {
        console.log(err);
      }
    )
  }


  updateMasterCourse() {
    this.getter.getMasterCourses().subscribe(
      res => {
        this.standardList = res;
      },
      err => {
        console.log(err);
      }
    )
  }


  fetchFeeDetails() {

    if (this.due_type == 'all_dues') {
      let obj: any = {
        from_date: '',
        to_date: '',
      }
      /* Name Detected */
      if (isNaN(this.search_value)) {
        obj.student_name = this.search_value;
        obj.contact_no = '';
      }
      /* Contact Number Detected */
      else {
        obj.contact_no = this.search_value;
        obj.student_name = '';
      }

      this.generateReport(obj);

    }
    else if (this.due_type == 'next_month_dues') {
      let obj: any = {
        from_date: '',
        to_date: '',
      }

      /* Name Detected */
      if (isNaN(this.search_value)) {
        obj.student_name = this.search_value;
        obj.contact_no = '';
      }
      /* Contact Number Detected */
      else {
        obj.contact_no = this.search_value;
        obj.student_name = '';
      }



    }
    else if (this.due_type == 'this_month_dues') {
      let obj: any = {
        from_date: '',
        to_date: '',
      }


      /* Name Detected */
      if (isNaN(this.search_value)) {
        obj.student_name = this.search_value;
        obj.contact_no = '';
      }
      /* Contact Number Detected */
      else {
        obj.contact_no = this.search_value;
        obj.student_name = '';
      }



    }
    else if (this.due_type == 'current_dues') {
      let obj: any = {
        from_date: '',
        to_date: '',
      }


      /* Name Detected */
      if (isNaN(this.search_value)) {
        obj.student_name = this.search_value;
        obj.contact_no = '';
      }
      /* Contact Number Detected */
      else {
        obj.contact_no = this.search_value;
        obj.student_name = '';
      }



    }
  }


  generateReport(obj) {
    this.getter.getFeeReportData(obj).subscribe(
      res => {
        this.feeDataSource = res;
      },
      err => {
        console.log(err);
      }
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
