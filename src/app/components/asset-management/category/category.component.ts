import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { AuthenticatorService } from '../../../services/authenticator.service'
import { AssetModel } from '../asset-model';
declare var $;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  institute_id = sessionStorage.getItem('institute_id');

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
    this.cancel(false);
  }
  show: boolean = true;
  is_asset_cat: boolean = true;
  is_asset: boolean = false;
  activeclass: string;
  isadd: boolean;
  isUpdate: boolean;

  //function for toggle view 
  toggle(param) {
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
        primary_key: 'category_id',
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
        primary_key: 'location_ids',
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
        view: true,
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
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  assetcategoryData: any = [];
  staticPageData: any = [];

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
    //let t = this.assetcategoryData.slice(startindex, startindex + this.displayBatchSize);
    let t = this.assetAllData.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }

  //crud for category
  @ViewChild('assetcat', { static: false }) assetcat: NgForm;
  isedit = false;
  submitted = false;
  category_model = {
    active: true,
    category_code: '',
    category_name: '',
    institute_id: sessionStorage.getItem('institute_id')
  }
  saveCategoryDetails() {
    if (this.assetcat.valid) {

      this.httpService.postMethod('api/v2/asset/category/create', this.category_model).then((res) => {
        console.log(res);
        this.submitted = true;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Category is Created Successfully ")
        this.getCategoryDetails();
      },
        err => {

          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "A Category already exists with the same Code");
        }
      )
      $('#myModalforcat').modal('hide');

    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please fill all fields");
    }


  }
  //get category details
  getCategoryDetails() {
    this.httpService.getMethod('api/v2/asset/category/all?pageOffset=1&pageSize=10&instituteId=' + this.category_model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
      this.staticPageData = this.getDataFromDataSource(0);

    },
      err => {
        this.auth.hideLoader();
      })

  }
  editRow(object) {
    this.isedit = !this.isedit;
    console.log(object);
    this.category_model = object.data;

    $('#myModalforcat').modal('show');
    //this.router.navigate(['view/website-configuration/faq/category/edit/' + object.data.id])
  }
  //update category
  updateAssetCategory() {
    this.httpService.putMethod('api/v2/asset/category/update', this.category_model).then(() => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Category is Updated Successfully")
      $('#myModalforcat').modal('hide');
      this.getCategoryDetails();
    },
      err => {
        console.log("erro")
      }

    )
  }
  //delete category
  deleteRow(object) {
    this.httpService.deleteMethod('api/v2/asset/category/delete/' + object.data.id + '?instituteId=' + this.category_model.institute_id).then((res: any) => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage('success', '', 'Category Deleted Successfully');
      this.getCategoryDetails();
    },
      err => {
        this.msgService.showErrorMessage('error', '', "Asset is Available inside this Category we can not Delete")
      })
  }
  //code for add asset table 
  @ViewChild('assetaddForm', { static: false }) assetaddForm: NgForm
  model = {
    active: true,
    category_id: '',
    asset_code: '',
    asset_condition: '',
    location_ids: '',
    asset_name: '',
    institute_id: sessionStorage.getItem('institute_id'),
    quantity: ''
  }
  // model: AssetModel = new AssetModel();
  locationData: any = [];
  //get location data
  getLocationDetails() {
    this.httpService.getMethod('api/v2/asset/location/all?pageOffset=1&pageSize=10&instituteId=' + this.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.locationData = res.result.response;
        console.log(this.locationData)

      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //save asset details
  saveAssetDetails() {
    if (this.assetaddForm.valid) {
      var location_id = JSON.parse("[" + this.model.location_ids + "]");
      this.model.location_ids = location_id;
      this.httpService.postMethod('api/v2/asset/create', this.model).then((res) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Added Successfully");
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Asset Id or Asset Name Duplicate");
          $('#myModalforasset').model('hide');
        })
      $('#myModalforasset').model('hide');
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Field Required");
      $('#myModalforasset').model('hide');
    }
    this.getAssetDetails();
  }

  //get location
  getAssetDetails() {
    this.httpService.getMethod('api/v2/asset/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.assetAllData = res.result.response;
        console.log(this.assetAllData)
        this.totalRecords = this.assetAllData.length;
        this.staticPageDataForAsset = this.getDataFromDataSource(0);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //edit asset data
  editAssetRow(object) {
    this.isedit = !this.isedit;
    this.model = object.data;
    $('#myModalforasset').modal('show');
  }

  //update asset details
  updateAssetDetails() {
    var location_ids = JSON.parse("[" + this.model.location_ids + "]");
    this.model.location_ids = location_ids;
    this.httpService.putMethod('api/v2/asset/update', this.model).then(() => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset  is Updated Successfully")
      $('#myModalforasset').modal('hide');
      this.getCategoryDetails();
    },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Asset  is Updated Successfully")
      }

    )
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

    }
    else {
      let searchData = this.assetAllData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageDataForAsset = searchData;
    }
  }
  //cancel 
  cancel(param) {

    this.isedit = param;
    this.category_model = {
      active: true,
      category_code: '',
      category_name: '',
      institute_id: sessionStorage.getItem('institute_id')
    }
    this.model = {
      active: true,
      category_id: '',
      asset_code: '',
      asset_condition: '',
      location_ids: '',
      asset_name: '',
      institute_id: sessionStorage.getItem('institute_id'),
      quantity: ''
    }
  }
}
