import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { Location } from './location';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
//import { $ } from 'protractor';
declare var $;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @ViewChild('locationaddForm', { static: false }) locationaddForm: NgForm;
  model: Location = new Location();
  isedit = false;
  submitted = false;
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  locationDataforDownload:[];
  searchParams: any;
  tempLocationList = []; 
  locationData = {
    institute_id: sessionStorage.getItem('institute_id'),
    location_code: '',
    location_description: '',
    location_name: '',
    active: true,
  }
  constructor(
    private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private currentRout: ActivatedRoute,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { }

  ngOnInit(): void {
    this.getLocationDetails();
    this.setTableData();
    this.cancel(false);
  }
  //table setting
 setTableData() {
    this.headerSetting = [
      // {
      //   primary_key: 'id',
      //   value: "Id",
      //   charactLimit: 25,
      //   sorting: true,
      //   visibility: false
      // },
      {
        primary_key: 'location_code',
        value: "Code",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },

      {
        primary_key: 'location_name',
        value: "Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'location_description',
        value: "  Description",
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
        view: false,
        edit: true,
        delete: true,
      },
    ]
    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      // {
      //   width: "15%",
      //   textAlign: "left"
      // },
      {
        width: "30%",
        textAlign: "left"
      },
      {
        width: "35%",
        textAlign: "left"
      },
      {
        width: "35%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },

    ]
  }
  //pagination setting
  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.getDataFromDataSource(startindex);
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
    this.getLocationDetails();
}
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }
  //method use to post form data
  saveLocationDetails() {
    if (this.locationaddForm.valid) {
      let obj: any = this.model;
      obj.institute_id = sessionStorage.getItem('institute_id');
      obj.active = true;
      this.httpService.postMethod('api/v2/asset/location/create', obj).then(
        (res: any) => {
           this.submitted = true;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.body.result);
          $('#modelforlocation').modal('hide');
          this.getLocationDetails();
        },
        err => {
              // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error[0].error_message);
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "An Asset Location already exists with the same Name/Code ");
        }
      )
    }
    else {

      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all fields");
    }
  }

  getLocationDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/location/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.total_elements;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = true;
    this.model.id = object.data.id;
    this.model.institute_id = object.data.institute_id;
    this.model.location_code = object.data.location_code;
    this.model.location_description = object.data.location_description;
    this.model.location_name = object.data.location_name;
  $('#modelforlocation').modal('show');
  }

  updateLocationDetails() {
    if (this.locationaddForm.valid) {
     this.httpService.putMethod('api/v2/asset/location/update', this.model).then(() => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Location is Updated Successfully")
      $('#modelforlocation').modal('hide');
        this.getLocationDetails();
      },
        err => {
          
                 // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error[0].error_message);
      
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "An Asset Location already exists with the same Name/Code ");
         this.auth.hideLoader();
        })
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All fields Required")
    }
  }
 cancel(param) {
   this.locationaddForm.resetForm();
    this.isedit = param;
    this.model.location_code = '';
    this.model.location_description = '';
    this.model.location_name = '';

  }
  deleteRow(obj) {
    let deleteconfirm = confirm("Are you really want to delete?");
    if (deleteconfirm == true) {
      this.auth.showLoader();
      this.httpService.deleteMethod('api/v2/asset/location/delete/' + obj.data.id + '?instituteId=' + this.model.institute_id).then(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Location Deleted Successfully');
          this.getLocationDetails();
        },
        err => {
                  // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error[0].error_message);
           this.msgService.showErrorMessage('error', '', 'Location can not be  deleted asset linked to this location');
          this.auth.hideLoader();
        }
      );
    }
  }
  
 searchDatabase() {
 if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";
      this.staticPageData = this.tempLocationList;
         
    }
    else {
      let searchData = this.tempLocationList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
     
        this.staticPageData = searchData;
      this.totalRecords = this.staticPageData.length;
      
      
    }
  }

  //download pdf
  downloadPdf() {
    this.httpService.getMethod('api/v2/asset/location/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.locationDataforDownload = res.result.response;
    },
      err => {
        this.auth.hideLoader();
      }
      
    );
    let arr = [];
   
    this.locationDataforDownload.map(
      (ele: any) => {
        let json = [
          ele.location_code,
          ele.location_name,
          ele.location_description,
       ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Code', ' Name', ' Description']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'Location List');
    this.auth.hideLoader();
  }

  
//download in excel format
excelheaderseting:any =[];
exportToExcel(){
  this.httpService.getMethod('api/v2/asset/location/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
    (res: any) => {
      this.excelheaderseting=[
      {
        primary_key: 'location_code',
        value: "Code", 
      },
      {
        primary_key: 'location_name',
        value: "Name", 
      },
      {
        primary_key: 'location_description',
        value: "Description", 
      },
    ]

      
      this.auth.showLoader();
      this.locationDataforDownload = res.result.response;
      let Excelarr = [];
      this.locationDataforDownload.map(
      (ele: any) => {
        let json = {}
        this.excelheaderseting.map((keys) => {
        json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'asset_location'
    );
     this.auth.hideLoader();
  },
    err => {
      this.auth.hideLoader();
    }
    
  );
  this.auth.hideLoader();
}
}
