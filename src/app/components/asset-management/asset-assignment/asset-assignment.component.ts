import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { HttpService } from '../../../services/http.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetAssignment } from './asset-assignment';
declare var $;
import * as moment from 'moment';
import { RoleService } from '../../../services/user-management/role.service';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
@Component({
  selector: 'app-asset-assignment',
  templateUrl: './asset-assignment.component.html',
  styleUrls: ['./asset-assignment.component.scss']
})
export class AssetAssignmentComponent implements OnInit {

  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [{ id: 1, name: 'manisha', address: 'asas' }, { id: 2, name: 'nmanisha', address: 'asas', action: 'edit' }, { id: 3, name: 'amanisha', address: 'asas' }, { id: 1, name: 'manisha', address: 'asas' }];
  staticPageDataSouece: any = [];
  isedit: any;
  assignedAssetAllData: any = [];
  searchParams: any;
  startDate: string;
  endDate: string;

  //data for dropdown
  assetcategoryData: any = [];
  assetAllData: any = [];
  locationAllData: any = [];
  totalRow: any;
  tempLocationList: any;
  assignDataforDownload: [];
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private temp: HttpService,
    private apiService: RoleService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { }

  model = {
    id: '',
    asset_id: '',
    location_id: '',
    check_out_date: '',
    due_date: '',
    institute_id: sessionStorage.getItem('institute_id'),
    note: '',
    quantity: '',
    status: 'IN_STORAGE',
    check_in_date: '',
    user_type: '',
    check_out_user_id: '',
    category_id: ''

  }
  ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.getAssetDetails();
    this.getCheckOutBy();
    this.getRolesList();
    this.cancel(false);
    this.getAssignDetails();
  }
  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'id',
        value: "Id",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'asset_name',
        value: "Asset",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
     
      
      {
        primary_key: 'quantity',
        value: "Assign Quantity",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'user_type',
        value: "Role",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'check_out_user_display_name',
        value: "Check out By",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'check_in_date',
        value: "Check In Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'check_out_date',
        value: "Check Out Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'due_date',
        value: "Due Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'status',
        value: "Status",
        charactLimit: 25,
        sorting: true,
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
        width: "10%",
        textAlign: "left"
      },
      
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },


    ]
  }

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
    this.getAssignDetails();
  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }
  //save asset purchase details
  @ViewChild('assetAssignmentForm', { static: false }) assetAssignmentForm: NgForm;
  saveAssetAssignDetails() {
    if (this.assetAssignmentForm.valid) {
      // let tmp = parseInt(this.model.quantity);
      // this.model.user_type = Number(this.model.user_type);
      this.model.due_date = moment(this.model.due_date).format("YYYY-MM-DD");
      this.model.check_out_date = moment(this.model.check_out_date).format("YYYY-MM-DD")
      this.model.check_in_date = moment(this.model.check_in_date).format("YYYY-MM-DD");
      this.httpService.postMethod('api/v2/asset/assignment/create', this.model).then((res) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Assign Successfully");
        $('#modelforassetAssign').modal('hide');
        this.getAssignDetails();
        this.cancel(false);
      },
        err => {
          let data:any =[];
        let errors;
          data =err.error.error;
                    console.log(data)
                   for(let i=0;i <data.length;i++){
                     let errs =data[i].error_message;
                     console.log(errs);
                  }
                  console.log(errors)
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "asset not available to assign" );
          $('#modelforassetAssign').modal('hide');
        })
      // $('#modelforassetAssign').model('hide');
      this.getAssignDetails();
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Field Required");
      $('#modelforassetAssign').modal('hide');
    }

  }
  //get asset details

  getAssignDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/assignment/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.assignedAssetAllData = res.result.response;
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.total_elements;
        this.auth.hideLoader()
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = true;
    console.log(object);
    this.model.id = object.data.id;
    this.model = object.data;
    this.model.asset_id = object.data.asset_id;
    this.model.location_id = object.data.location_id;
    this.model.check_out_date = object.data.check_out_date;
    this.model.check_in_date = object.data.check_in_date;
    this.model.due_date = object.data.due_date;
    this.model.institute_id = object.data.institute_id;
    this.model.quantity = object.data.quantity;
    this.model.status = object.data.status;
    this.model.user_type = object.data.user_type;
    this.model.note = object.data.note;
    this.model.category_id = object.data.category_id;
    this.model.check_out_user_id = object.data.check_out_user_id;
    $('#modelforassetAssign').modal('show');
    console.log(object);
  }

  deleteRow(obj) {
    this.auth.showLoader();
    this.httpService.deleteMethod('/api/v2/asset/assignment/delete/' + obj.data.id + '?instituteId=' + this.model.institute_id).then(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', ' Deleted Successfully');
        this.getAssignDetails();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  updateAssetAssignDetails() {
    if(this.assetAssignmentForm.valid){
    this.model.due_date = moment(this.model.due_date).format("YYYY-MM-DD");
    this.model.check_out_date = moment(this.model.check_out_date).format("YYYY-MM-DD")
    this.model.check_in_date = moment(this.model.check_in_date).format("YYYY-MM-DD")

    this.httpService.putMethod('api/v2/asset/assignment/update', this.model).then(() => {
      this.getAssignDetails();
    },
      err => {
        this.auth.hideLoader();
      })
    this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "updated successfully")
    $('#modelforassetAssign').modal('hide');
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All  fields Required")
    }
  }
  cancel(param) {
    this.isedit = false;
    this.model = {
      id: '',
      asset_id: '',
      location_id: '',
      check_out_user_id: '',
      check_in_date: '',
      check_out_date: '',
      due_date: '',
      institute_id: sessionStorage.getItem('institute_id'),
      note: '',
      quantity: '',
      status: 'IN_STORAGE',
      user_type: '',
      category_id: ''
    }
 //  this.assetAssignmentForm.reset();
  }
  searchDatabase() {
    //alert("hi")
    console.log(this.searchParams);
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
    }
  }

  //date range
  dateRangeChange(e) {
    this.startDate = moment(e[0]).format("YYYY-MM-DD");
    this.endDate = moment(e[1]).format("YYYY-MM-DD");
    console.log(this.startDate)
    /* let obj = {
       institute_id: this.jsonFlag.institute_id,
       category_id: "255",
       course_id: -1,
       batch_id: -1,
       subject_id: -1,
       from_date: this.startDate,
       to_date: this.endDate,
       assignment_status: null
     }
     this.getAllAssignment(obj)
     */
  }

  getCategoryDetails() {
    this.httpService.getMethod('api/v2/asset/category/all?all=1&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
    },
      err => {
        this.auth.hideLoader();
      })

  }
  //get asset and cat
  getassetsAndLocation(category_id) {
    let key = this.assetcategoryData.filter(id => (id.id == category_id));
    console.log(key);
    let key_name = key[0].category_name;
    this.httpService.getMethod('api/v2/asset/getAssetsWithCategoryName?categoryIdList=' + category_id + '&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
      this.assetAllData = res.result[key_name];
      // var location_ids = JSON.parse("[" + this.model.location_ids + "]");
      console.log('lo', this.locationAllData);

      console.log(this.assetAllData);
    },
      err => {
        this.auth.hideLoader();
      })


  }

  getLocationData(obj) {
    // alert(obj);
    let key = this.assetAllData.filter(id => (id.id == obj));
    //console.log(key);

    //location_ids,location_names_string
    let location_name = key[0].location_names_string.split(',');
    //console.log(location_name)
    for (let i = 0; i < key[0].location_ids.length; i++) {
      this.locationAllData.push({ 'location_id': key[0].location_ids[i], 'location_name': location_name[i] });
    }

    console.log('lo', this.locationAllData);
  }
  //

  getAssetDetails() {
    this.httpService.getMethod('api/v2/asset/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        // this.assetAllData = res.result.response;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //purchaseby
  purchaseby: any = [];
  getCheckOutBy() {
    this.temp.getData('/api/v1/profiles/' + this.model.institute_id + '/user-by-type?type=3').subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        console.log(res)
        this.purchaseby = res.active_users;
        // console.log(this.purchaseby)
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  //getroles
  rolesListDataSource: any = [];
  getRolesList() {
    this.apiService.getRoles().subscribe(
      (res: any) => {
        this.rolesListDataSource = res;
        this.totalRow = res.length;
        //this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        console.log(err);
      }
    )
  }

  downloadPdf() {
    this.httpService.getMethod('api/v2/asset/assignment/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.assignDataforDownload = res.result.response;
        //this.auth.showLoader();
    },
      err => {
        this.auth.hideLoader();
      }
      
    );
    let arr = [];
   
    this.assignDataforDownload.map(
      (ele: any) => {
        let json = [
         ele.asset_name,
          ele.quantity,
          ele.user_type,
          ele.check_out_user_display_name,
          ele.check_in_date,
          ele.check_out_date,
          ele.due_date,
          ele.status,
          ele.note,
   ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Asset Name', ' Quantity', ' Role','Check Out By','Check in Date ','Check Out Date ','Due Date','status','Note']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'Asset_Assign_List');
    this.auth.hideLoader();
  }
//download in excel format
exportToExcel(){
  this.httpService.getMethod('api/v2/asset/assignment/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
    (res: any) => {
      this.auth.showLoader();
      this.assignDataforDownload= res.result.response;
      console.log( this.assignDataforDownload = res.result.response)
      let Excelarr = [];
      this.assignDataforDownload.map(
      (ele: any) => {
        let json = {}
        this.headerSetting.map((keys) => {
          json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'asset_assign'
    );
     // console.log(this.locationDataforDownload)
      this.auth.hideLoader();
  },
    err => {
      this.auth.hideLoader();
    }
    
  );
  this.auth.hideLoader();
}
}
