import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from "../../../../services/authenticator.service";
import * as moment from 'moment';
import { LoginService } from '../../../../services/login-services/login.service';
import { CounsellorServiceService } from '../../../../services/counsellor-service/counsellor-service.service';
import { AppComponent } from '../../../../app.component';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';

@Component({
  selector: 'app-counsellor-report',
  templateUrl: './counsellor-report.component.html',
  styleUrls: ['./counsellor-report.component.scss']
})
export class CounsellorReportComponent implements OnInit {

  counsellorInfo = {
    user_Type: 0
  }

  counsellorInfoDetails = {
    institution_id: this.counsellor.institute_id,
    reportType: "assigned",
    assigned_to: -1,
    updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
    updateDateTo: moment().format('YYYY-MM-DD')
  }

  getCounsellorDetails: any = {};
  getCounsellorData: any = [];
  mappedCounsellor: any = [];
  dataStatus: number = 0;
  searchText: string = "";
  searchflag: boolean;
  searchMyRecords: any[];

  feeSettings1: ColumnData[] = [
    { primaryKey: 'uniqueCatName', header: 'Counsellor' },
    { primaryKey: 'newEnqcount', header: 'New Enquiries' },
    { primaryKey: 'open', header: 'Open' },
    { primaryKey: 'inProgress', header: 'InProgress' },
    { primaryKey: 'Converted', header: 'Converted' },
    { primaryKey: 'studentAdmitted', header: 'Student Admitted' },
    { primaryKey: 'Closed', header: 'Closed' },
    { primaryKey: 'totalcount', header: 'Total Assigned' },

  ];

  constructor(private counsellor: CounsellorServiceService,
    private appc: AppComponent,
    private auth: AuthenticatorService,
    private login: LoginService) { }

  ngOnInit() {
    this.fetchAllCounsellorData();
    this.fetchAllCounsellorDataDetails();
  }


  fetchAllCounsellorData() {
    this.dataStatus = 1;
    this.counsellor.counsellorInformation(this.counsellorInfo).subscribe(
      (data: any) => {
        if (data.length) {
          this.dataStatus = 2;
        }
        else {
          this.dataStatus = 0;
        }
        this.getCounsellorData = data;

      },
      (error: any) => {
        this.dataStatus = 2;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
      }
    )
  }

  fetchAllCounsellorDataDetails() {
    this.getCounsellorDetails = [];
    this.mappedCounsellor = [];
    this.dataStatus = 1;
    this.counsellor.counsellorDetails(this.counsellorInfoDetails).subscribe(
      (data: any) => {

        // this.getCounsellorDetails = arr;
        // console.log(this.getCounsellorDetails);
        // console.log(data);
        for (let i in data) {
          this.mappedCounsellor.push(data[i]);

        }

        this.getCounsellorDetails = this.mappedCounsellor;
        this.getCounsellorDetails.map(
          (ele: any) => {
            ele.Closed = ele.statusMap.Closed;
            ele.open = ele.statusMap.Open;
            ele.inProgress = ele.statusMap["In Progress"];
            ele.Converted = ele.statusMap.Converted;
            ele.studentAdmitted = ele.statusMap["Student Admitted"];
          }
        )
        console.log(this.getCounsellorDetails);
        if(this.getCounsellorDetails.length == 0){
          this.dataStatus = 2;
        }
        else{
          this.dataStatus = 0;
        }
        this.searchMyRecords = this.getCounsellorDetails;
      },
      (error: any) => {
        this.dataStatus = 2;
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
      // let searchData: any;
      this.getCounsellorDetails = this.getCounsellorDetails.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      // this.searchData = searchData;
      this.searchflag = true;
    }
    else {
      this.getCounsellorDetails = this.searchMyRecords
      this.searchflag = false;
    }
  }

}
