import { Component, OnInit } from '@angular/core';
import { EnquiryReportService } from '../../services/counsellor-service.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { role } from '../../../../model/role_features';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  userId: any = sessionStorage.getItem("userid");
  sourceInfoDetails = {
    institution_id: this.service.institute_id,
    reportType: "source",
    source_id: -1,
    assigned_to: this.userId,
    updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
    updateDateTo: moment().format('YYYY-MM-DD'),
    is_admin_role_access: false
  }

  getSourceData: any = [];
  getSourceDetails: any = {};
  mappedSource: any = [];
  dataStatus: number;
  searchMyRecords: any = [];
  searchText: string = "";
  searchflag: boolean;
  source: {};

  feeSettings1: ColumnData[] = [
    { primaryKey: 'source', header: 'Source' },
    { primaryKey: 'newEnqCount', header: 'New Enquiries' },
    { primaryKey: 'open', header: 'Open' },
    { primaryKey: 'inProgress', header: 'In Progress' },
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

  showPopup: boolean = false;
  popupDataEnquiries: any[];
  newObject: any = {
    key: "",
    data: ""
  }

  newArray: any[] = [];
  role_feature = role.features;

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
        if (data.length == 0) {
          this.dataStatus = 2;
        }
        else {
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
    this.newArray = [];
    this.dataStatus = 1;

    if (this.sourceInfoDetails.updateDateFrom > this.sourceInfoDetails.updateDateTo) {
      this.appc.popToast({ type: "error", title: "", body: "From date cannot be greater than to date" });
      this.dataStatus = 2;
    }

    else {
      this.sourceInfoDetails.updateDateFrom = moment(this.sourceInfoDetails.updateDateFrom).format("YYYY-MM-DD");
      this.sourceInfoDetails.updateDateTo = moment(this.sourceInfoDetails.updateDateTo).format("YYYY-MM-DD");
      if(this.role_feature.LEAD_ENQUIRY_FULL_ACCESS) {
        this.sourceInfoDetails.is_admin_role_access = true;
      }
      this.service.counsellorDetails(this.sourceInfoDetails).subscribe(
        (data: any) => {

          for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
              let innerObj = {};
              innerObj[prop] = data[prop];
              this.getSourceDetails.push(innerObj)
            }
          }

          for (let a of this.getSourceDetails) {
            for (let prop in a) {
              this.newObject = {
                key: prop,
                data: a[prop]
              }
            }
            this.newArray.push(this.newObject);
          }
          this.sourceInfoDetails.updateDateFrom = moment(this.sourceInfoDetails.updateDateFrom).format("YYYY-MM-DD");
          this.sourceInfoDetails.updateDateTo = moment(this.sourceInfoDetails.updateDateTo).format("YYYY-MM-DD");
          this.getSourceDetails = this.newArray;
          this.getSourceDetails.map(
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
          if (this.getSourceDetails.length == 0) {
            this.dataStatus = 2;
          }
          else {
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
    if (dataObj.key == "newEnqCount") {
      let payload = {
        source_id: dataObj.source,
        institution_id: this.service.institute_id,
        isRport: "Y",
        status: this.statusKeys[dataObj.key],
        enquireDateFrom: moment(this.sourceInfoDetails.updateDateFrom).format("YYYY-MM-DD"),
        enquireDateTo: moment(this.sourceInfoDetails.updateDateTo).format("YYYY-MM-DD")
      }
      console.log(payload);
      this.popupDataEnquiries = [];
      this.service.enquiryCategorySearch(payload).subscribe(
        (data: any) => {
          this.popupDataEnquiries = data;
        },
        (error: any) => {

        }
      )
    }
    else {
      let payload = {
        source_id: dataObj.source,
        institution_id: this.service.institute_id,
        isRport: "Y",
        status: this.statusKeys[dataObj.key],
        updateDateFrom: moment(this.sourceInfoDetails.updateDateFrom).format("YYYY-MM-DD"),
        updateDateTo: moment(this.sourceInfoDetails.updateDateTo).format("YYYY-MM-DD")
      }
      this.popupDataEnquiries = [];
      this.service.enquiryCategorySearch(payload).subscribe(
        (data: any) => {
          this.popupDataEnquiries = data;
        },
        (error: any) => {

        }
      )

      console.log(payload);
    }
    this.showPopup = true;
  }



  popupToggler() {
    this.showPopup = false;
  }

  userRowClicked($event, ev, row, key) {
    console.log(row);
  }

}
