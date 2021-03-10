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
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private temp: HttpService,
    private apiService: RoleService,) { }

  model = {
    asset_id: '',
    location_id: '',
    check_out_date: '',
    due_date: '',
    institute_id: sessionStorage.getItem('institute_id'),
    note: '',
    quantity: 0,
    status: 'IN_STORAGE',
    check_in_date: '',
    user_type: '',
    check_out_user_id: ''

  }
  ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.getAssetDetails();
    this.getLocationDetails();
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
        primary_key: 'asset_id',
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
        primary_key: 'check_out_user_id',
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
        primary_key: 'check_in_date',
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
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        view: true,
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
    let t = this.assignedAssetAllData.slice(startindex, startindex + this.displayBatchSize);
    return t;
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
      this.model.quantity = Number(this.model.quantity);
      // this.model.user_type = Number(this.model.user_type);
      this.model.due_date = moment(this.model.due_date).format("DD-MM-YYYY");
      this.model.check_out_date = moment(this.model.check_out_date).format("DD-MM-YYYY")
      this.model.check_in_date = moment(this.model.check_in_date).format("DD-MM-YYYY")
      this.httpService.postMethod('api/v2/asset/assignment/create', this.model).then((res) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Assign Successfully");
        $('#modelforassetAssign').modal('hide');
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Asset not Available");
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
    this.httpService.getMethod('api/v2/asset/assignment/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.assignedAssetAllData = res.result.response;
        //console.log(this.purchaseAllData)
        this.totalRecords = this.assignedAssetAllData.length;
        this.staticPageData = this.getDataFromDataSource(0);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = !this.isedit;
    console.log(object);
    this.model = object.data;

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
    this.httpService.putMethod('api/v2/asset/assignment/update', this.model).then(() => {
      this.getAssignDetails();
    },
      err => {
        this.auth.hideLoader();
      })
    this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "updated successfully")
    $('#modelforassetAssign').modal('hide');

  }
  cancel(param) {
    this.isedit = param;
    this.model = {
      asset_id: '',
      location_id: '',
      check_out_user_id: '',
      check_in_date: '',
      check_out_date: '',
      due_date: '',
      institute_id: sessionStorage.getItem('institute_id'),
      note: '',
      quantity: 0,
      status: 'IN_STORAGE',
      user_type: ''
    }
  }
  searchDatabase() {
    //alert("hi")
    console.log(this.searchParams);
    // this.staticPageDataSouece = this.tempIncomelist;
    if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";

    }
    else {
      let searchData = this.assignedAssetAllData.filter(item =>
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
    this.httpService.getMethod('api/v2/asset/category/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
    },
      err => {
        this.auth.hideLoader();
      })

  }

  getAssetDetails() {
    this.httpService.getMethod('api/v2/asset/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.assetAllData = res.result.response;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  getLocationDetails() {
    this.httpService.getMethod('api/v2/asset/location/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.locationAllData = res.result.response;
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
        console.log(this.purchaseby)
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
}
