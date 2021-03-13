import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { NgForm } from '@angular/forms';
//import { UserService } from '../../../services/user-management/user.service';
import { HttpService } from '../../../services/http.service';
import * as moment from 'moment';
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
  sizeArr: any[] = [2, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 2;
  staticPageData: any = [{ id: 1, name: 'manisha', address: 'asas' }, { id: 2, name: 'nmanisha', address: 'asas', action: 'edit' }, { id: 3, name: 'amanisha', address: 'asas' }, { id: 1, name: 'manisha', address: 'asas' }];
  staticPageDataSouece: any = [];
  isedit: any;
  purchaseAllData: any = [];
  searchParams: any;
  purchaseby: any;
  bill_image_url: any;
  assetcategoryData: any = [];
  assetAllData: any = [];
  locationAllData: any = [];
  vendorAllData: any = [];
  tempLocationList: any;
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private temp: HttpService
  ) { }

  model = {
    asset_id: '',
    supplier_id: '',
    location_id: '',
    expiry_date: '',
    institute_id: sessionStorage.getItem('institute_id'),
    purchase_amount: '',
    purchase_date: '',
    purchased_by_user_id: '',
    quantity: '',
    service_date: '',
    unit: '',
    user_type: '',
    category_id: ''
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
        primary_key: 'supplier_name',
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
        primary_key: 'purchased_by_user_name',
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
    this.getPurchaseDetails();
  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }
  //save asset purchase details
  @ViewChild('assePurchaseForm', { static: false }) assePurchaseForm: NgForm;

  //get asset details

  getPurchaseDetails() {
    this.httpService.getMethod('api/v2/asset/purchase/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.purchaseAllData = res.result.response;
        this.staticPageData = res.result.response;
        this.totalRecords = res.result.total_elements;
        this.tempLocationList = res.result.response;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = true;
    this.bill_image_url = object.data.bill_image_url;
    console.log(this.bill_image_url)
    this.model.asset_id = object.data.asset_id;
    this.model.supplier_id = object.data.supplier_id;
    this.model.location_id = object.data.location_id;
    this.model.expiry_date = object.data.expiry_date;
    this.model.institute_id = object.data.institute_id;
    this.model.purchase_amount = object.data.purchase_amount;
    this.model.purchase_date = object.data.purchase_date;
    this.model.purchased_by_user_id = object.data.purchased_by_user_id;
    this.model.quantity = object.data.quantity;
    this.model.service_date = object.data.service_date;
    this.model.unit = object.data.unit;
    this.model.user_type = object.data.user_type;
    this.model.category_id = object.data.category_id;
    $('#modelforpurchase').modal('show');
    console.log(object);
    //sessionStorage.setItem('faqData', JSON.stringify(object.data));
    // this.router.navigate(['view/website-configuration/faq/category/edit/' + object.data.id])
  }
  deleteRow(obj) {
    this.auth.showLoader();
    this.httpService.deleteMethod('/api/v2/asset/purchase/delete/' + obj.data.id + '?instituteId=' + this.model.institute_id).then(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Purchase Deleted Successfully');
        this.getPurchaseDetails();
      },
      err => {
        this.msgService.showErrorMessage('error', '', "err.response");
        // this.msgService.showErrorMessage('error', '', err.response);
        this.auth.hideLoader();
      }
    );
  }

  searchDatabase() {
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
        // console.log(this.purchaseby)
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //selected
  getUserData(obj) {
    console.log(obj)
    this.purchaseby.map((data) => {
      if (obj === this.model.purchased_by_user_id) {
        this.model.user_type = data.user_type;
      }
    })
  }


  saveAssetPurchaseData() {
    let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
    const formData = new FormData();
    let assetPurchaseStringDto = this.model;
    assetPurchaseStringDto.expiry_date = moment(assetPurchaseStringDto.expiry_date).format("YYYY-MM-DD")
    assetPurchaseStringDto.purchase_date = moment(assetPurchaseStringDto.purchase_date).format("YYYY-MM-DD")
    assetPurchaseStringDto.service_date = moment(assetPurchaseStringDto.service_date).format("YYYY-MM-DD")
    formData.append('assetPurchaseStringDto', JSON.stringify(assetPurchaseStringDto));
    if (file) {
      formData.append('billImageFile', file);
    }
    if (this.isedit) {

      // assetPurchaseStringDto.bill_image_url = this.bill_image_url;
    }
    let base = this.auth.productBaseUrl;
    // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
    let urlPostXlsDocument = this.isedit ? base + "/prod/api/v2/asset/purchase/update" : base + "/prod/api/v2/asset/purchase/create";
    let newxhr = new XMLHttpRequest();
    let auths: any = {
      userid: sessionStorage.getItem('userid'),
      userType: sessionStorage.getItem('userType'),
      password: sessionStorage.getItem('password'),
      institution_id: sessionStorage.getItem('institute_id'),
    }
    let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

    this.isedit ? newxhr.open("PUT", urlPostXlsDocument, true) : newxhr.open("POST", urlPostXlsDocument, true);

    newxhr.setRequestHeader("Authorization", Authorization);
    newxhr.setRequestHeader("x-proc-authorization", Authorization);
    newxhr.setRequestHeader("x-prod-inst-id", sessionStorage.getItem('institute_id'));
    newxhr.setRequestHeader("x-prod-user-id", sessionStorage.getItem('userid'));
    newxhr.setRequestHeader("enctype", "multipart/form-data;");
    newxhr.setRequestHeader("Accept", "application/json, text/javascript");
    newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    if (!this.auth.isRippleLoad.getValue()) {
      this.auth.showLoader();
      newxhr.onreadystatechange = () => {
        this.auth.hideLoader();
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            let msg = this.isedit ? 'Purchase Updated Successfully' : 'Purchase Added successfully';
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
            $('#modelforpurchase').modal('hide');
            this.getPurchaseDetails();

          } else {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);

            // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
          }
        }
      }
      newxhr.send(formData);
    }
  }

  clearFile() {
    this.bill_image_url = '';
  }
  cancel(param) {
    this.isedit = param;
    this.model = {
      asset_id: '',
      supplier_id: '',
      location_id: '',
      expiry_date: '',
      institute_id: sessionStorage.getItem('institute_id'),
      purchase_amount: '',
      purchase_date: '',
      purchased_by_user_id: '',
      quantity: '',
      service_date: '',
      unit: '',
      user_type: '',
      category_id: '',

    }
  }
}
