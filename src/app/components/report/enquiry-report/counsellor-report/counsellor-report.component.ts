import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from "../../../../services/authenticator.service";
import * as moment from 'moment';
import { LoginService } from '../../../../services/login-services/login.service';

import { AppComponent } from '../../../../app.component';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { EnquiryReportService } from '../../../../services/counsellor-service/counsellor-service.service';

@Component({
  selector: 'app-counsellor-report',
  templateUrl: './counsellor-report.component.html',
  styleUrls: ['./counsellor-report.component.scss']
})
export class CounsellorReportComponent implements OnInit{

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
  popupDataEnquiries:any[];

  feeSettings1: ColumnData[] = [
    { primaryKey: 'source', header: 'Counsellor' },
    { primaryKey: 'newEnqCount', header: 'New Enquiries' },
    { primaryKey: 'open', header: 'Open' },
    { primaryKey: 'inProgress', header: 'InProgress' },
    { primaryKey: 'Converted', header: 'Converted' },
    { primaryKey: 'studentAdmitted', header: 'Student Admitted' },
    { primaryKey: 'Closed', header: 'Closed' },
    { primaryKey: 'totalcount', header: 'Total Assigned' },

  ];
  showPopup:boolean = false;

  statusKeys = {
    'newEnqcount': '-1',
    'open': '0',
    'inProgress': '3',
    'Converted': '2',
    'studentAdmitted': '12',
    'Closed': '1',
    'totalcount': '-1'
  }      

  newObject={
    key:"",
    data:""
  }
  newArray:any[] = []

  constructor(private counsellor: EnquiryReportService,
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
    this.newArray = [];
    this.dataStatus = 1;
    this.counsellor.counsellorDetails(this.counsellorInfoDetails).subscribe(
      (data: any) => {

        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            let innerObj = {};
            innerObj[prop] = data[prop];
            this.getCounsellorDetails.push(innerObj)
          }
        }

        for (let a of this.getCounsellorDetails) {
          for (let prop in a) {
            this.newObject = {
              key: prop,
              data: a[prop]
            }
          }
          this.newArray.push(this.newObject);
        }

        this.getCounsellorDetails = this.newArray;
        this.getCounsellorDetails.map(
          (ele: any) => {
            ele.newEnqCount = ele.data.newEnqcount;
            ele.totalcount = ele.data.totalcount;
            ele.source_id = ele.key
            ele.source = ele.data.uniqueCatName
            ele.Closed = ele.data.statusMap.Closed;
            ele.open = ele.data.statusMap.Open;
            ele.inProgress = ele.data.statusMap["In Progress"];
            ele.Converted = ele.data.statusMap.Converted;
            ele.studentAdmitted = ele.data.statusMap["Student Admitted"];
          }
        )
        if (this.getCounsellorDetails.length == 0) {
          this.dataStatus = 2;
        }
        else {
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

  reportHandler(dataObj) {
    console.log(dataObj);
    if (dataObj.data > 0) {
      if (dataObj.key == "newEnqCount") {
        let payload = {
          assigned_to: dataObj.source,
          institution_id: "",
          isRport: "Y",
          status: this.statusKeys[dataObj.key],
          enquireDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
          enquireDateTo: moment().format('YYYY-MM-DD')
        }
       
        this.popupDataEnquiries = [];
        this.counsellor.enquiryCategorySearch(payload).subscribe(
          (data:any)=>{
              this.popupDataEnquiries = data;
          },
          (error:any)=>{

          }
        ) 
      }
      else {
        let payload = {
          assigned_to: dataObj.source,
          institution_id: "",
          isRport: "Y",
          status: this.statusKeys[dataObj.key],
          updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
          updateDateTo: moment().format('YYYY-MM-DD')
        }
        this.popupDataEnquiries = [];
        this.counsellor.enquiryCategorySearch(payload).subscribe(
          (data:any)=>{
            this.popupDataEnquiries = data;
          },
          (error:any)=>{

          }
        )
       
      }
      this.showPopup = true;
    }

  }

  
  popupToggler()
  {
    this.showPopup = false;
  }

}
