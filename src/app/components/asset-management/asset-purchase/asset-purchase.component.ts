import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { NgForm } from '@angular/forms';
//import { UserService } from '../../../services/user-management/user.service';
import { HttpService } from '../../../services/http.service';
import * as moment from 'moment';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
declare var $;
@Component({
  selector: 'app-asset-purchase',
  templateUrl: './asset-purchase.component.html',
  styleUrls: ['./asset-purchase.component.scss']
})
export class AssetPurchaseComponent implements OnInit {
  assetAllData = [];
  assetcategoryData: any = [];
  bill_image_url: any;
  displayBatchSize: number = 25;
  headerSetting: any;
  isedit: any;
  locationAllData: any = [];
  pageIndex: number = 1;
  purchaseAllData: any = [];
  purchaseby: any;
  purchaseDataforDownload=[];
  rowColumns: any;
  searchParams: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  tableSetting: any;
  tempLocationList: any;
  totalRecords: number = 0;
  vendorAllData: any = [];
  model = {
    id: '',
    asset_id: '',
    supplier_id: '',
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
    bill_image_url:''
  }
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private temp: HttpService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService
  ) { }


  ngOnInit(): void {
    this.setTableData();
    this.getPurchaseDetails();
    this.getVendorDetails();
    this.get_purchase_by();
  }
  setTableData() {
    this.headerSetting = [
      // {
      //   primary_key: 'id',
      //   value: "Id",
      //   charactLimit: 25,
      //   sorting: true,
      //   visibility: true
      // },
      {
        primary_key: 'asset_name',
        value: "Asset",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'supplier_name',
        value: "Supplier",
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
        sorting: false,
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
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'service_date',
        value: "Service Date",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },

      {
        primary_key: 'expiry_date',
        value: "Expiry Date",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'purchased_by_user_display_name',
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
      //   width: "5%",
      //   textAlign: "left"
      // },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "8%",
        textAlign: "left"
      },
      {
        width: "10%",
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
        width: "15%",
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
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/purchase/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.purchaseAllData = res.result.response;
        this.staticPageData = res.result.response;
        this.totalRecords = res.result.total_elements;
        this.tempLocationList = res.result.response;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.getCategoryData(object.data.supplier_id);
    this.model.id = object.data.id;
    this.isedit = true;
    this.bill_image_url = object.data.bill_image_url;
    this.model.id = object.data.id;
    this.model.supplier_id = object.data.supplier_id;
    this.model.expiry_date = object.data.expiry_date;
    this.model.institute_id = object.data.institute_id;
    this.model.purchase_amount = object.data.purchase_amount;
    this.model.purchase_date = object.data.purchase_date;
    //this.model.purchased_by_user_id = object.data.purchased_by_user_id;
    this.model.quantity = object.data.quantity;
    this.model.service_date = object.data.service_date;
    this.model.unit = object.data.unit;
    this.model.user_type = object.data.user_type;
    this.model.category_id = object.data.category_id;
    $('#modelforpurchase').modal('show');
    this.getUserData(object.data.user_id);
    this.model.purchased_by_user_id=object.data.purchased_by_user_id;
    //this.getassets(object.data.category_id);
    this.model.asset_id = object.data.asset_id;
  }
  tempObj
  deleteRowConfirm(object) {
    this.tempObj = object.data.id;
    $('#deletesModal').modal('show');
  }
  deleteRow(obj) {
    this.auth.showLoader();
    this.httpService.deleteMethod('/api/v2/asset/purchase/delete/' + obj + '?instituteId=' + this.model.institute_id).then(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Deleted Successfully');
        this.getPurchaseDetails();
        $('#deletesModal').modal('hide');
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
        //  this.msgService.showErrorMessage('error', '', "err.response");
        this.auth.hideLoader();
      }
    );
  }

  searchDatabase() {
    if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";
      this.staticPageData = this.tempLocationList;
    }
    else {
      this.auth.showLoader();
      this.httpService.getMethod('api/v2/asset/purchase/search?searchString='+this.searchParams + '&instituteId='+this.model.institute_id, null).subscribe(
        (res: any) => {
          this.staticPageData = res.result.response;
          this.tempLocationList = res.result.response;
          this.totalRecords = res.result.total_elements;
          this.auth.hideLoader();
          if(this.staticPageData.length==0){
            this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "No Data Found");
          }
        },
        err => {
          this.auth.hideLoader();
        }
      );
      let searchData = this.tempLocationList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
      this.totalRecords = this.staticPageData;
    }
  }

  getVendorDetails() {
    this.httpService.getMethod('api/v2/asset/supplier/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.vendorAllData = res.result.response;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  categorydata: any = [];
  assetalldata: any = []
  getCategoryData(obj) {
    this.categorydata = [];
    this.httpService.getMethod('api/v2/asset/supplier/assetsBySupplier/' + this.model.institute_id + '/' + obj, null).subscribe(
      (res: any) => {
        let result = res.result;
        let keys = Object.keys(result);
        let temp: any = [];
        for (let i = 0; i < keys.length; i++) {
          let a = result[keys[i]];
          this.categorydata.push(a)
        }
        if(this.model.asset_id!='') {
          this.getassets(this.model.category_id);
        }
      },
      err => {
        this.auth.hideLoader();
      }
    );

  }
  assetData = [];
  getassets(object) {
    var filteredArray: any = [];
    this.categorydata.forEach(function (element) {
      if (element.category_id == object) {
        for (let i = 0; i < element.asset_id_and_name_list.length; i++) {
          filteredArray.push(element.asset_id_and_name_list[i])
        }
      }

    });
    this.assetData = filteredArray;
  }

  //
  get_purchase_by() {
    this.temp.getData('/api/v1/profiles/' + this.model.institute_id + '/user-by-type?type=3,0,9').subscribe(
      (res: any) => {
        this.purchaseby = res.active_users;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //selected
  getUserData(obj) {
    this.purchaseby.map((data) => {
      if (obj === this.model.purchased_by_user_id) {
        this.model.user_type = data.user_type;
      }
    })
  }
  saveAssetPurchaseData() {
    if (this.assePurchaseForm.valid) {
      let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
      this.model.institute_id = sessionStorage.getItem('institute_id');
      const formData = new FormData();
      let assetPurchaseStringDto: any = {};
      if (this.isedit) {
        assetPurchaseStringDto.id = this.model.id;
      }
      assetPurchaseStringDto.institute_id = sessionStorage.getItem('institute_id');
      assetPurchaseStringDto.purchase_amount = this.model.purchase_amount;
      assetPurchaseStringDto.quantity = this.model.quantity;
      assetPurchaseStringDto.asset_id = this.model.asset_id;
      assetPurchaseStringDto.purchased_by_user_id = this.model.purchased_by_user_id;
      assetPurchaseStringDto.unit = this.model.unit;
      assetPurchaseStringDto.user_type = this.model.user_type;
      assetPurchaseStringDto.supplier_id = this.model.supplier_id;
      assetPurchaseStringDto.service_date = this.model.service_date ? moment(this.model.service_date).format("YYYY-MM-DD") : null;
      assetPurchaseStringDto.expiry_date = this.model.expiry_date ? moment(this.model.expiry_date).format("YYYY-MM-DD") : null;
      assetPurchaseStringDto.purchase_date = moment(this.model.purchase_date).format("YYYY-MM-DD");

      formData.append('assetPurchaseStringDto', JSON.stringify(assetPurchaseStringDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
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
      //newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      if (!this.auth.isRippleLoad.getValue()) {
        this.auth.showLoader();
        newxhr.onreadystatechange = () => {
          this.auth.hideLoader();
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              let msg = this.isedit ? 'Updated Successfully' : 'Purchase added successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              $('#modelforpurchase').modal('hide');
              this.getPurchaseDetails();
              this.cancel(false)
            } else {
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "File format is not suported");


              //this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
            }
          }
        }
        newxhr.send(formData);
      }
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field");

    }
  }

  clearFile() {
    this.bill_image_url = '';
  }
  cancel(param) {
    this.isedit = false;
    this.model = {
      id: '',
      asset_id: '',
      supplier_id: '',
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
      bill_image_url:''
    }
    this.assePurchaseForm.resetForm(this.model);

  }

  downloadPdf() {
    this.httpService.getMethod('api/v2/asset/purchase/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.purchaseDataforDownload = res.result.response;
        //this.auth.showLoader();
        for(let i=0;i<this.purchaseDataforDownload.length;i++){
          this.purchaseDataforDownload[i].id =i +1;
        }
        let arr = [];

        this.purchaseDataforDownload.map(
          (ele: any) => {
            let json = [
              // ele.id,
              ele.asset_name,
              ele.quantity,
              ele.supplier_name,
              ele.unit,
              ele.purchase_amount,
              ele.purchase_date,
              ele.service_date,
              ele.expiry_date,
              ele.purchased_by_user_display_name,
            ]
            arr.push(json);
          })
    
        let rows = [];
        rows = [['Asset Name', ' Quantity', ' Company Name', 'Unit', ' Purchase Price', 'Purchase Date ', 'Service Date', 'Expiry Date', 'Purchase By']]
        let columns = arr;
        this._pdfService.exportToPdf(rows, columns, 'Asset_Purchase_List');
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }

    );
   
  }
  //download in excel format
  headersettingforexcel: any = [{
    primary_key: 'asset_name',
    value: "Asset",
    charactLimit: 25,

  },
  {
    primary_key: 'supplier_name',
    value: "Supplier",
    charactLimit: 25,

  },
  {
    primary_key: 'quantity',
    value: "Quantity",
    charactLimit: 25,

  },
  {
    primary_key: 'unit',
    value: "Unit",
    charactLimit: 25,

  },
  {
    primary_key: 'purchase_amount',
    value: "Purchase Price",
    charactLimit: 25,

  },
  {
    primary_key: 'purchase_date',
    value: "Purchase Date",
    charactLimit: 25,

  },
  {
    primary_key: 'service_date',
    value: "Service Date",
    charactLimit: 25,

  },

  {
    primary_key: 'expiry_date',
    value: "Expiry Date",
    charactLimit: 25,

  },
  {
    primary_key: 'purchased_by_user_display_name',
    value: "Purchase By",
    charactLimit: 25,

  }]
  exportToExcel() {
    this.httpService.getMethod('api/v2/asset/purchase/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.auth.showLoader();
        this.purchaseDataforDownload = res.result.response;
        let Excelarr = [];
        this.purchaseDataforDownload.map(
          (ele: any) => {
            let json = {}
            this.headersettingforexcel.map((keys) => {
              json[keys.value] = ele[keys.primary_key]
            })
            Excelarr.push(json);
          }
        )
        this.excelService.exportAsExcelFile(
          Excelarr,
          'asset_Purchase'
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
