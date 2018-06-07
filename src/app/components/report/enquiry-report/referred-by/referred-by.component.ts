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
  getreferredByData :any=[];
  getreferredByDetails:any = {};
  mappedreferredBy:any = [];
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
        if(data.length == 0){
          this.dataStatus = 2;
        }
        else{
          this.dataStatus = 0;
        }
        this.getreferredByData = data;
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
    this.mappedreferredBy = [];
    this.dataStatus = 1;
    this.service.counsellorDetails(this.referredByInfoDetails).subscribe(
      (data: any) => {
        for (let i in data) {
          this.mappedreferredBy.push(data[i]);

        }
        this.getreferredByDetails = this.mappedreferredBy;
        this.getreferredByDetails.map(
          (ele: any) => {
            ele.Closed = ele.statusMap.Closed;
            ele.open = ele.statusMap.Open;
            ele.inProgress = ele.statusMap["In Progress"];
            ele.Converted = ele.statusMap.Converted;
            ele.studentAdmitted = ele.statusMap["Student Admitted"];
          }
        )
        if(this.getreferredByDetails.length == 0){
          this.dataStatus = 2;
        }
        else{
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
}



