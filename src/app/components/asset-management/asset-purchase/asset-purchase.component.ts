import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { NgForm } from '@angular/forms';
//import { UserService } from '../../../services/user-management/user.service';
import { HttpService } from '../../../services/http.service';
declare var $;
@Component({
  selector: 'app-asset-purchase',
  templateUrl: './asset-purchase.component.html',
  styleUrls: ['./asset-purchase.component.scss']
})
export class AssetPurchaseComponent implements OnInit {
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
  purchaseAllData: any = [];
  searchParams: any;
  purchaseby: any;
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private temp: HttpService
  ) { }

  model = {
    asset_id: '',
    supplier_id: '',
    Location_id: '',
    expiry_date: '',
    institute_id: sessionStorage.getItem('institute_id'),
    purchase_amount: '',
    purchase_date: '',
    purchased_by_user_id: '',
    quantity: '',
    service_date: '',
    unit: '',
    user_type: ''

  }
  ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.getPurchaseDetails();
    this.getAssetDetails();
    this.getVendorDetails();
    this.getLocationDetails();
    this.get_purchase_by();
  }
  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'id',
        value: "Id",
        charactLimit: 25,
        sorting: false,
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
        primary_key: 'supplier_id',
        value: "Vendor",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'quantity',
        value: "Quantity",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'unit',
        value: "Unit",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'purchase_amount',
        value: "Purchase Price",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'purchase_date',
        value: "Purchase Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'service_date',
        value: "Service Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },

      {
        primary_key: 'expiry_date',
        value: "Expiry Date",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'purchased_by_user_id',
        value: "Purchase By",
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
        width: "5%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "8%",
        textAlign: "left"
      },
      {
        width: "7%",
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
        width: "13%",
        textAlign: "left"
      },
      {
        width: "7%",
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
    let t = this.purchaseAllData.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }
  //save asset purchase details
  @ViewChild('assePurchaseForm', { static: false }) assePurchaseForm: NgForm;
  saveAssetPurchaseDetails() {
    if (this.assePurchaseForm.valid) {

      this.httpService.postMethod('api/v2/asset/purchase/create', this.model).then((res) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Purchased Successfully");
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Asset not Purchased");
          $('#modelforpurchase').model('hide');
        })
      // $('#modelforpurchase').model('hide');
      this.getPurchaseDetails();
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Field Required");
      $('#modelforpurchase').model('hide');
    }

  }
  //get asset details

  getPurchaseDetails() {
    this.httpService.getMethod('api/v2/asset/purchase/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.purchaseAllData = res.result.response;
        //console.log(this.purchaseAllData)
        this.totalRecords = this.purchaseAllData.length;
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

    $('#modelforpurchase').modal('show');
    console.log(object);
    //sessionStorage.setItem('faqData', JSON.stringify(object.data));
    // this.router.navigate(['view/website-configuration/faq/category/edit/' + object.data.id])
  }

  deleteRow(obj) {
    this.auth.showLoader();
    this.httpService.deleteFile('/api/v2/asset/purchase/delete/' + obj.data.id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Purchase Deleted Successfully');
        this.getPurchaseDetails();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  updatePurchaseDetails() {
    this.httpService.putMethod('api/v2/asset/purchase/update    ', this.model).then(() => {
      this.getPurchaseDetails();
    },
      err => {
        this.auth.hideLoader();
      })
    this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "updated successfully")
    $('#modelforpurchase').modal('hide');

  }
  cancel(param) {
    this.isedit = param;
    this.model = {
      asset_id: '',
      supplier_id: '',
      Location_id: '',
      expiry_date: '',
      institute_id: sessionStorage.getItem('institute_id'),
      purchase_amount: '',
      purchase_date: '',
      purchased_by_user_id: '',
      quantity: '',
      service_date: '',
      unit: '',
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
      let searchData = this.purchaseAllData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
    }
  }

  //data for dropdown
  assetcategoryData: any = [];
  assetAllData: any = [];
  locationAllData: any = [];
  vendorAllData: any = [];
  getCategoryDetails() {
    this.httpService.getMethod('api/v2/asset/category/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
      this.staticPageData = this.getDataFromDataSource(0);

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
  getVendorDetails() {
    this.httpService.getMethod('api/v2/asset/supplier/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.vendorAllData = res.result.response;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //
  get_purchase_by() {

    this.temp.getData('/api/v1/profiles/' + this.model.institute_id + '/user-by-type?type=3,5').subscribe(
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
  //selected
  selecteduser;
  getUserType(obj) {

    this.model.user_type = obj.user_type;
    console.log(this.model.user_type)
  }

}
