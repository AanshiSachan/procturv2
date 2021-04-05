import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { element } from 'protractor';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
})
export class PurchaseAddComponent implements OnInit,DoCheck {
  categoryAllData: any = [];
  supplierAllData: any = [];
  pageIndex: number = 1;
  displayBatchSize: number = 25;
  itemArray = [];
  itemData = [];
  total: number = 0;
  isedit: any;
  @ViewChild('purchaseForm', { static: false }) purchaseForm: NgForm;
  url = `/api/v1/inventory/`;
  model = {
    purchase_id: '',
    supplier_id: '',
    purchase_date: '',
    purchase_description: '',
    institute_id: sessionStorage.getItem('institute_id'),
    total_amount: 0,
    total_paid_amount: '',
    is_refunded: false,
    purchased_item_list:[{ "item_id":40, "quantity":5, "unit_price":500 }, { "item_id":43, "quantity":10, "unit_price":100 } ],
  }

  constructor(
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) {
    this.model.institute_id = sessionStorage.getItem('institution_id');

  }


  ngOnInit(): void {
    this.getVendorDetails();
  }
  ngDoCheck(){
    //this.totals(obj);
  }
  getCategoryItem(obj) {
    // this.auth.showLoader();
    console.log(obj)
    this.httpService.getData(this.url + 'purchase/getCategoryAndItem?supplierId=' + obj + '&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData = res.result;
        console.log(this.categoryAllData);
        let items: any = [];
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  getVendorDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/supplier/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&sortBy=supplierName&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.supplierAllData = res.result.response;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  getItemAgainscat(e) {
    let id = e.target.value;
    id = +id;
    console.log(e.target.value)
    this.categoryAllData.forEach(element => {

      if (element && element.categoryId === id) {
        this.itemArray = element.items;
      }
    });
  }
  getItemData(e) {
    this.itemData;
    let id = e;
    id = +id;
    this.isChange = true;
    this.itemArray.forEach(element => {
      if (element && element.item_id === id) {
        let data = element;
        data.subtotal = Number(data.unit_cost) * Number(data.available_units);
        console.log( data.subtotal)
        data.Prevsubtotal = data.subtotal;
        console.log( data.Prevsubtotal)
        // this.total = this.total - data.Prevsubtotal;
        this.total = this.total + data.subtotal;
        console.log(this.total)
        this.itemData.push(data);
      }
    })
    console.log(this.itemData)
  }


  status: boolean = true;
  editdata(param) {
    this.status = param;
  }

  unit_cost: number;
  available_units: number
  isChange: boolean = false;
  totals(obj) {
    console.log(obj)
    this.isChange = true;
    obj.subtotal = obj.unit_cost * obj.available_units;
    console.log(obj.subtotal)
    obj.Prevsubtotal = obj.unit_cost * obj.available_units;
    console.log(obj.Prevsubtotal)
   
    console.log(obj.Prevsubtotal)
    this.total = this.total - obj.Prevsubtotal;
    this.total = this.total + obj.subtotal;
    obj.Prevsubtotal = obj.subtotal;
    console.log( this.total);
    let newdata = this.itemArray.map(data =>{
      return { "subtotal":data.subtotal,"Prevsubtotal":data.Prevsubtotal, "total":data}
    })
    console.log(newdata)
  }
  saveAssetPurchaseData() {
    if (this.purchaseForm.valid) {
     let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
     this.model.institute_id=sessionStorage.getItem('institute_id');
      const formData = new FormData();
      let assetPurchaseStringDto:any={};
      if(this.isedit){
        assetPurchaseStringDto.id = this.model.id;
       }  
       assetPurchaseStringDto.institute_id =sessionStorage.getItem('institute_id');
       assetPurchaseStringDto.purchase_amount =this.model.purchase_amount;   
       assetPurchaseStringDto.quantity=this.model.quantity;
       assetPurchaseStringDto.asset_id=this.model.asset_id;
       assetPurchaseStringDto.purchased_by_user_id =this.model.purchased_by_user_id;
       assetPurchaseStringDto.unit=this.model.unit;
       assetPurchaseStringDto.user_type=this.model.user_type;
       assetPurchaseStringDto.supplier_id=this.model.supplier_id;
      assetPurchaseStringDto.service_date = this.model.service_date ? moment(this.model.service_date).format("YYYY-MM-DD"): null;
      assetPurchaseStringDto.expiry_date = this.model.expiry_date ? moment(this.model.expiry_date).format("YYYY-MM-DD"): null;
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
              let msg = this.isedit ? 'Asset Purchased details is Updated Successfully' : 'Asset Purchased details is Saved Successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              $('#modelforpurchase').modal('hide');
              this.getPurchaseDetails();
              this.cancel(false)
            } else {
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "File format is not suported");

              // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
            }
          }
        }
        newxhr.send(formData);
      }
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Fields Required");

    }
  }

}
