import { Component, OnInit } from '@angular/core';
import { EnquiryReportService } from '../../../../services/counsellor-service/counsellor-service.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {


  sourceInfoDetails = {
    institution_id: this.service.institute_id,
    reportType: "source",
    source_id: -1,
    updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
    updateDateTo: moment().format('YYYY-MM-DD')
  }
  getSourceData :any=[];
  getSourceDetails:any = {};
  mappedSource:any = [];
  dataStatus:number;
  searchMyRecords:any = [];
  searchText:string = "";
  searchflag:boolean;

  feeSettings1: ColumnData[] = [
    { primaryKey: 'uniqueCatName', header: 'Source' },
    { primaryKey: 'newEnqcount', header: 'New Enquiries' },
    { primaryKey: 'open', header: 'Open' },
    { primaryKey: 'inProgress', header: 'InProgress' },
    { primaryKey: 'Converted', header: 'Converted' },
    { primaryKey: 'studentAdmitted', header: 'Student Admitted' },
    { primaryKey: 'Closed', header: 'Closed' },
    { primaryKey: 'totalcount', header: 'Total Assigned' },

  ];

  statusKeys = {
    'newEnqcount': '-1',
    'open': '0',
    'inProgress': '3',
    'Converted': '2',
    'studentAdmitted': '12',
    'Closed': '1',
    'totalcount': '-1'
  }      
  
  showPopup:boolean = false;
  popupDataEnquiries:any[];

  constructor(private service: EnquiryReportService,
    private appc: AppComponent) { }

  ngOnInit() {
    this.sourceData();
    this.sourceDataDetails();
  }

  sourceData() {
    this.dataStatus = 1;
    this.service.sourceData().subscribe(
      (data: any) => {
        if(data.length == 0){
          this.dataStatus = 2;
        }
        else{
          this.dataStatus = 0;
        }
        this.getSourceData = data;
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

  sourceDataDetails() {
    this.getSourceDetails = [];
    this.mappedSource = [];
    this.dataStatus = 1;
    this.service.counsellorDetails(this.sourceInfoDetails).subscribe(
      (data: any) => {
      
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            let innerObj = {};
            innerObj[prop] = data[prop];
            this.getSourceDetails.push(innerObj)
          }
        }
        console.log(this.getSourceDetails);
  
        for (let i in data) {
          this.mappedSource.push(data[i]);
        }
        this.getSourceDetails = this.mappedSource;
        this.getSourceDetails.map(
          (ele: any) => {
            ele.Closed = ele.statusMap.Closed;
            ele.open = ele.statusMap.Open;
            ele.inProgress = ele.statusMap["In Progress"];
            ele.Converted = ele.statusMap.Converted;
            ele.studentAdmitted = ele.statusMap["Student Admitted"];
          }
        )
        if(this.getSourceDetails.length == 0){
          this.dataStatus = 2;
        }
        else{
          this.dataStatus = 0;
        }
        this.searchMyRecords = this.getSourceDetails;
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
      this.getSourceDetails = this.getSourceDetails.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      // this.searchData = searchData;
      this.searchflag = true;
    }
    else {
      this.getSourceDetails = this.searchMyRecords
      this.searchflag = false;
    }
  }

  reportHandler(dataObj) {
    console.log(dataObj);
    if (dataObj.data > 0) {
      if (dataObj.key == "newEnqcount") {
        let payload = {
          assigned_to: "",
          institution_id: "",
          isRport: "Y",
          status: this.statusKeys[dataObj.key],
          enquireDateFrom: "",
          enquireDateTo: ""
        }
        console.log(payload);
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
          assigned_to: "",
          institution_id: "",
          isRport: "Y",
          status: this.statusKeys[dataObj.key],
          updateDateFrom: "",
          updateDateTo: ""
        }
        this.service.enquiryCategorySearch(payload).subscribe(
          (data:any)=>{
              this.popupDataEnquiries = data;
          },
          (error:any)=>{

          }
        ) 
       
        console.log(payload);
      }
      this.showPopup = true;
    }

  }


  popupToggler()
  {
    this.showPopup = false;
  }
}
