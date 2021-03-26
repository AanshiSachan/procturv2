import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService } from '../../../../services/http.service';
declare var $;

@Component({
  selector: 'app-mark-distribution',
  templateUrl: './mark-distribution.component.html',
  styleUrls: ['./mark-distribution.component.scss']
})
export class MarkDistributionComponent implements OnInit {
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  isDistributionUpdate: any = false;
  addDistributionModel : any = {
    "institution_id": sessionStorage.getItem('institute_id'),
    "marks_distribution_name": "",
    "marks_value_percent": '',
    "description": "",
    "is_active": "Y"
  }


  constructor(
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService
  ) { }

  ngOnInit(): void {
    this.setTableData();
    this.getStaticPageData();
  }

  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'marks_distribution_id',
        value: "#",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'marks_distribution_name',
        value: "Mark Distribution Type",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'marks_value_percent',
        value: "Mark Value",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        edit: true,
        delete: true,
        // editCondition: 'converted == 0',
        // deleteCondition: 'converted == 0'
      },
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "40%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
    ]
  }

  getStaticPageData() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/courseExamSchedule/fetch-marks-distribution/' + sessionStorage.getItem('institute_id') + '?is_used=true').subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.staticPageDataSouece = res.result;
        this.totalRecords = this.staticPageDataSouece.length;
        this.staticPageData = this.getDataFromDataSource(0);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.staticPageData = this.getDataFromDataSource(startindex);
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
    let t = this.staticPageDataSouece.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }

  editRow(object) {
    console.log(object);
    if(!object.data.is_used) {
    this.isDistributionUpdate = true;
    this.addDistributionModel.marks_distribution_name = object.data.marks_distribution_name;
    this.addDistributionModel.marks_value_percent = object.data.marks_value_percent;
    this.addDistributionModel.description = object.data.description;
    this.addDistributionModel.is_active = object.data.is_active;
    this.addDistributionModel.marks_distribution_id = object.data.marks_distribution_id;
    $('#addExamType').modal('show');
    } else {
      this.msgService.showErrorMessage('error','','Mark Distribution is already used. So we cannot Edit it');
    }
  }

  inputValidationCheck() {
    if (this.addDistributionModel.marks_distribution_name == '') {
      this.msgService.showErrorMessage('error', '', "Please enter Mark Distribution Type");
      return false;
    } else if (this.addDistributionModel.marks_value_percent == '' || this.addDistributionModel.marks_value_percent == '0') {
      this.msgService.showErrorMessage('error', '', 'Please enter valid Mark Value');
      return false;
    } else {
      return true;
    }
  }

  addUpdateDistribution() {
    if (this.inputValidationCheck()) {
      this.isDistributionUpdate ? this.updateDistributionCall() : this.CreateDistributionCall();
    }
  }

  CreateDistributionCall() {
    this.auth.showLoader();
    this.httpService.postData('/api/v1/courseExamSchedule/create-marks-distribution', this.addDistributionModel).subscribe(
      (res) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Mark Distribution Created Successfully');
        $('#addExamType').modal('hide');
        this.clearModalData();
        this.getStaticPageData();
      },
      (err: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  updateDistributionCall() {
    this.auth.showLoader();
    let url = '/api/v1/courseExamSchedule/update-marks-distribution/' + this.addDistributionModel.marks_distribution_id;
    delete(this.addDistributionModel.marks_distribution_id);
    this.httpService.putData(url, this.addDistributionModel).subscribe(
      (res) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Mark Distribution Updated Successfully');
        $('#addExamType').modal('hide');
        this.clearModalData();
        this.getStaticPageData();
      },
      (err: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  clearModalData() {
    this.addDistributionModel = {
      "marks_distribution_name": "",
      "marks_value_percent": '',
      "description": "",
      "is_active": "Y",
      "institution_id": sessionStorage.getItem('institute_id')
    }
    
  }

  deleteRow(obj) {
    if(!obj.data.is_used) {
    if (confirm('Are you Sure, you want to Delete Mark Distribution?')) {
      this.auth.showLoader();
      this.httpService.deleteDataById('/api/v1/courseExamSchedule/delete-marks-distribution/' + obj.data.marks_distribution_id).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Mark Distribution Deleted Successfully');
          this.getStaticPageData();
        },
        err => {
          this.auth.hideLoader();
        }
      );
    }
  } else {
    this.msgService.showErrorMessage('error','','Mark Distribution is already used. So we cannot delete it');
  }
  }
}
