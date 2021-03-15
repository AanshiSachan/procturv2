import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { AuthenticatorService } from '../../../services/authenticator.service'
import { AssetModel } from '../asset-model';
import { ObjectUnsubscribedError } from 'rxjs';
declare var $;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  institute_id = sessionStorage.getItem('institute_id');
  tempLocationList: any;

  constructor(
    private httpService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
  ) { }

  ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.setTableDataForAsset();
    this.getLocationDetails();
    this.getAssetDetails();

  }
  show: boolean = true;
  is_asset_cat: boolean = true;
  is_asset: boolean = false;
  activeclass: string;
  isadd: boolean;
  isUpdate: boolean;
  active: boolean = false;
  activeb: boolean = true;
  //function for toggle view 
  toggle(param) {
    this.active = param;
    this.activeb = !param;
    this.is_asset_cat = !param;
    this.is_asset = param;

  }
  //TABLE CODING FOR ASSET
  headerSettingForAsset: any;
  tableSettingForAsset: any;
  rowColumnForAsset: any;
  assetAllData: any = [];
  staticPageDataForAsset: any = [];
  setTableDataForAsset() {
    this.headerSettingForAsset = [
      {
        primary_key: 'id',
        value: "#",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'asset_code',
        value: " Asset ID",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'asset_name',
        value: " Asset Name ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'category_name',
        value: " Category Name ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'quantity',
        value: " Total Assets ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'available',
        value: " Available Assets ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'location_names_string',
        value: " Locations ",
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
    ],
      this.tableSettingForAsset = [
        {
          width: "100%",
          height: "58vh"
        }

      ],
      this.rowColumnForAsset = [
        {
          width: "5%",
          textAlign: "left"
        },
        {
          width: "15%",
          textAlign: "left"
        },
        {
          width: "15%",
          textAlign: "left"
        },
        {
          width: "15%",
          textAlign: "left"
        },
        {
          width: "10%",
          textAlign: "left"
        },
        {
          width: "15%",
          textAlign: "left"
        },
        {
          width: "13%",
          textAlign: "left"
        },
        {
          width: "7%",
          textAlign: "left"
        }
      ]

  }
  //basic-table for category
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [2, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  assetcategoryData: any = [];
  staticPageData: any = [];
  //multiselect

  moderatorSettingsforasset: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'location_name',
    enableCheckAll: false,
    itemsShowLimit: 2
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
        primary_key: 'category_code',
        value: " Category ID",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'category_name',
        value: " Category Name ",
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
        width: "20%",
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
        width: "10%",
        textAlign: "left"
      },


    ]
  }
  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    console.log(startindex)
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
    this.getAssetDetails();


  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }

  //crud for category
  @ViewChild('assetcat', { static: false }) assetcat: NgForm;
  isedit;
  submitted = false;
  category_model = {
    id: '',
    active: true,
    category_code: '',
    category_name: '',
    institute_id: sessionStorage.getItem('institute_id')
  }
  errordata: any = [];
  saveCategoryDetails() {
    if (this.assetcat.valid) {
      this.httpService.postMethod('api/v2/asset/category/create', this.category_model).then((res) => {
        console.log(res);
        this.submitted = true;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Category is Created Successfully ");
        $('#myModalforcat').modal('hide');
        this.getCategoryDetails();
      },
        err => {
          this.errordata = err.error;
          console.log(this.errordata)
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "A Category already exists with the same Name / ID");
        }
      )
      $('#myModalforcat').modal('hide');
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please fill all manadatory fields");
    }
  }
  //get category details
  getCategoryDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/category/all?all=1&instituteId=' + this.category_model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
      this.staticPageData = res.result.response;
      this.totalRecords = res.result.total_elements;
      this.staticPageData = this.getDataFromDataSource(0);
      this.auth.hideLoader();
    },
      err => {
        this.auth.hideLoader();
      })

  }
  editRow(object) {
    this.isedit = true;
    this.category_model.id = object.data.id;
    this.category_model.active = object.data.category_model;
    this.category_model.category_code = object.data.category_code;
    this.category_model.category_name = object.data.category_name;
    this.category_model.institute_id = object.data.institute_id;
    $('#myModalforcat').modal('show');
  }
  //update category
  updateAssetCategory() {
    if (this.assetcat.valid) {
      this.httpService.putMethod('api/v2/asset/category/update', this.category_model).then(() => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Category is Updated Successfully")
        $('#myModalforcat').modal('hide');
        this.getCategoryDetails();
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "A Category already exists with the same Name / ID");
        }

      )
    }
    else {
      this.msgService.showErrorMessage('error', '', 'All Field Required');
    }
  }
  //delete category
  deleteRow(object) {
    let deleteconfirm = confirm("Are you really want to delete?");
    if (deleteconfirm == true) {
      this.httpService.deleteMethod('api/v2/asset/category/delete/' + object.data.id + '?instituteId=' + this.category_model.institute_id).then((res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Category Deleted Successfully');
        this.getCategoryDetails();
      },
        err => {
          this.msgService.showErrorMessage('error', '', "Asset is Available inside this Category we can not Delete")
        });
    }
  }
  //code for add asset table 
  @ViewChild('assetaddForm', { static: false }) assetaddForm: NgForm
  model = {
    active: true,
    category_id: '',
    asset_code: '',
    asset_condition: '',
    location_ids: [],
    asset_name: '',
    institute_id: sessionStorage.getItem('institute_id'),
    quantity: '',
    id: ''

  }
  // model: AssetModel = new AssetModel();
  locationData: any = [];
  //get location data
  getLocationDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/location/all?all=1&instituteId=' + this.institute_id, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.locationData = res.result.response;
        //console.log(this.locationData)

      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  //save asset details
  saveAssetDetails() {
    if (this.assetaddForm.valid) {

      let newasset: any = []
      let location_ids: any = this.model.location_ids;
      console.log(location_ids)
      for (let data in location_ids) {
        console.log(location_ids[data].id)
        newasset.push(location_ids[data].id);
      }
      this.model.location_ids = newasset
      //var location_id = JSON.parse("[" + this.model.location_ids + "]");
      //this.model.location_ids = location_id;
      this.httpService.postMethod('api/v2/asset/create', this.model).then((res) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Added Successfully");
        this.cancel()
        this.getAssetDetails();
        $('#myModalforasset').modal('hide');
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Asset Id/ Name Duplicate");
          $('#myModalforasset').modal('hide');
        })
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Field Required");
      $('#myModalforasset').modal('hide');
    }
    this.getAssetDetails();
    $('#myModalforasset').modal('hide');
  }

  //get location
  getAssetDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.assetAllData = res.result.response;
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        console.log(this.assetAllData)
        this.totalRecords = res.result.total_elements;
        $('#myModalforasset').modal('hide');
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //edit asset data
  editAssetRow(object) {
    this.isedit = true;
    this.model.id = object.data.id;
    this.model.active = object.data.active;
    this.model.asset_code = object.data.asset_code;
    this.model.asset_condition = object.data.asset_condition;
    this.model.location_ids = object.data.location_ids;
    this.model.asset_name = object.data.asset_name;
    this.model.institute_id = object.data.institute_id;
    this.model.quantity = object.data.quantity;
    this.model.category_id = object.data.category_id;
    $('#myModalforasset').modal('show');
    let temp = object.data.location_ids;
    let location_names = object.data.location_names_string.split(',');
    console.log(location_names);
    console.log(temp);
    this.model.location_ids = [];
    for (let i = 0; i < temp.length; i++) {
      let obj: any = {
        id: '',
        location_name: ''
      }
      obj.id = temp[i];
      obj.location_name = location_names[i];
      this.model.location_ids.push(obj);

    }
  }

  //update asset details
  updateAssetDetails() {
    if (this.assetaddForm.valid) {
      // var location_ids = JSON.parse("[" + this.model.location_ids + "]");
      // this.model.location_ids = location_ids;

      let newasset: any = []
      let location_ids: any = this.model.location_ids;
      console.log(location_ids)
      for (let data in location_ids) {
        console.log(location_ids[data].id)
        newasset.push(location_ids[data].id);
      }
      this.model.location_ids = newasset;
      this.httpService.putMethod('api/v2/asset/update', this.model).then(() => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset  is Updated Successfully")
        $('#myModalforasset').modal('hide');
        this.getCategoryDetails();
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Asset Name/Id Duplicate")
        }

      )
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All fields Required")
    }
  }
  //delete asset Category
  deleteAssetRow(object) {
    let deleteconfirm = confirm("Are you sure you want to delete this asset ?");
    if (deleteconfirm == true) {
      this.httpService.deleteMethod('api/v2/asset/delete/' + object.data.id + '?instituteId=' + this.model.institute_id).then((res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Asset Deleted Successfully');
        this.getAssetDetails();

      },
        err => {
          this.msgService.showErrorMessage('warning', '', 'Asset is being assigned to an user');
        })
    }
  }

  //search asset
  searchParams: any;
  searchDatabase() {
    //alert("hi")
    console.log(this.searchParams);
    console.log(this.assetAllData)
    // this.staticPageDataSouece = this.tempIncomelist;
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


  //cancel 
  cancel() {
    this.isedit = false;
    this.category_model = {
      active: true,
      category_code: '',
      category_name: '',
      institute_id: sessionStorage.getItem('institute_id'),
      id: ''
    }
    this.model = {
      active: true,
      category_id: '',
      asset_code: '',
      asset_condition: '',
      location_ids: [],
      asset_name: '',
      institute_id: sessionStorage.getItem('institute_id'),
      quantity: '',
      id: ''
    }

  }
}
