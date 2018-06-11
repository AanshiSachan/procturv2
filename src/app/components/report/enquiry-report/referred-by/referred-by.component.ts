import { Component, OnInit } from '@angular/core';
import { EnquiryReportService } from '../../../../services/counsellor-service/counsellor-service.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';

@Component({
  selector: 'app-referred-by',
  templateUrl: './referred-by.component.html',
  styleUrls: ['./referred-by.component.scss']
})
export class ReferredByComponent implements OnInit {


  referredByInfoDetails = {
    institution_id: this.service.institute_id,
    reportType: "Referred",
    referred_by: -1,
    updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
    updateDateTo: moment().format('YYYY-MM-DD')
  }

  getreferredByData: any = [];
  getreferredByDetails: any = {};
  mappedreferredBy: any = [];
  dataStatus: number;
  searchMyRecords: any = [];
  searchText: string = "";
  searchflag: boolean;

  feeSettings1: ColumnData[] = [
    { primaryKey: 'source', header: 'Source' },
    { primaryKey: 'newEnqCount', header: 'New Enquiries' },
    { primaryKey: 'open', header: 'Open' },
    { primaryKey: 'inProgress', header: 'InProgress' },
    { primaryKey: 'Converted', header: 'Converted' },
    { primaryKey: 'studentAdmitted', header: 'Student Admitted' },
    { primaryKey: 'Closed', header: 'Closed' },
    { primaryKey: 'totalcount', header: 'Total Assigned' },

  ];

  showPopup: boolean = false;

  newObject = {
    key: "",
    data: ""
  }
  newArray:any[] = [];

  statusKeys = {
    'newEnqcount': '-1',
    'open': '0',
    'inProgress': '3',
    'Converted': '2',
    'studentAdmitted': '12',
    'Closed': '1',
    'totalcount': '-1'
  }

  popupDataEnquiries:any[] = [];



  constructor(private service: EnquiryReportService,
    private appc: AppComponent) { }

  ngOnInit() {
    this.referredByData();
    this.referredByDetails();
  }

  referredByData() {
    this.dataStatus = 1;
    this.service.referredByDetails().subscribe(
      (data: any) => {

        if (data.length == 0) {
          this.dataStatus = 2;
        }
        else {
        if(data.length == 0){
          this.dataStatus = 2;
        }
        else{
          this.dataStatus = 0;
        }
        this.getreferredByData = data;
      }
    },
      (error: any) => {
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
      }
    )
  }

  referredByDetails() {
    this.getreferredByDetails = [];
    this.newArray = [];
    this.dataStatus = 1;
    this.service.counsellorDetails(this.referredByInfoDetails).subscribe(
      (data: any) => {

        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            let innerObj = {};
            innerObj[prop] = data[prop];
            this.getreferredByDetails.push(innerObj)
          }
        }

        for (let a of this.getreferredByDetails) {
          for (let prop in a) {
            this.newObject = {
              key: prop,
              data: a[prop]
            }
          }
          this.newArray.push(this.newObject);
        }

        this.getreferredByDetails = this.newArray;
        this.getreferredByDetails.map(
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
        if (this.getreferredByDetails.length == 0) {
          this.dataStatus = 2;
        }
        else {
          this.dataStatus = 0;
        }
        this.searchMyRecords = this.getreferredByDetails;
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
      this.getreferredByDetails = this.getreferredByDetails.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      // this.searchData = searchData;
      this.searchflag = true;
    }
    else {
      this.getreferredByDetails = this.searchMyRecords
      this.searchflag = false;
    }
  }

  reportHandler(dataObj) {
   
    if (dataObj.data > 0) {
      if (dataObj.key == "newEnqcount") {
        let payload = {
          referred_by: -1,
          institution_id: "",
          isRport: "Y",
          status: this.statusKeys[dataObj.key],
          enquireDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
          enquireDateTo: moment().format('YYYY-MM-DD')
        }
        this.popupDataEnquiries = [];
        this.service.enquiryCategorySearch(payload).subscribe(
          (data:any)=>{
              this.popupDataEnquiries = data;
          },
          (error:any)=>{

          }
        ) 
      }
      else {
        let payload = {
          referred_by: -1,
          institution_id: "",
          isRport: "Y",
          status: this.statusKeys[dataObj.key],
          updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
          updateDateTo: moment().format('YYYY-MM-DD')
        }
        this.popupDataEnquiries = [];
        this.service.enquiryCategorySearch(payload).subscribe(
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


  popupToggler() {
    this.showPopup = false;
  }

}



