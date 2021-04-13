import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { element } from 'protractor';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
})
export class PurchaseAddComponent implements OnInit, DoCheck {
  categoryAllData: any = [];
  supplierAllData: any = [];
  pageIndex: number = 1;
  displayBatchSize: number = 25;
  itemArray = [];
  itemData = [];
  total: number = 0;
  isedit=false;
  editId;
  bill_image_url: any;
  isDisable = false;
  isadd:any;
  @ViewChild('purchaseForm', { static: false }) purchaseForm: NgForm;
  url = `/api/v1/inventory/`;
  model = {
    purchase_id: 0,
    supplier_id: '',
    purchase_description: '',
    institute_id: sessionStorage.getItem('institute_id'),
    total_amount: 0,
    total_paid_amount: 0,
    is_refunded: false,
    purchased_item_list: [],
    supplier_company_name: '',
    bill_image_url: '',
    purchase_date: ''
  }

  constructor(
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private router: Router,
    private _Activatedroute: ActivatedRoute) {
    this.model.institute_id = sessionStorage.getItem('institution_id');

  }


  ngOnInit(): void {
    this.getVendorDetails();
    this.editId = this._Activatedroute.snapshot.paramMap.get("id");
    this._Activatedroute.snapshot.queryParamMap.get('isedit');
    if (this.editId != undefined) {
     // this.isadd=false;
      this.editRow(this.editId);
      this.isDisable = true;
     this.isedit=true;
    }

  }
  ngDoCheck() {
    //this.totals(obj);

  }
  private _title: string;

  getCategoryItem(obj) {
    this.isChange=false;
    //this.itemData = [];
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
        console.log(this.supplierAllData)
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
        console.log(this.itemArray);

      }
    });
  }

  getItemData(id) {
    this.isChange=true;
    this.itemArray.forEach(elements => {
      if (elements && elements.item_id == id) {
        this.itemData.push(elements);
        let data = elements;
        console.log(this.itemData);
        //use to remove duplicates from array
        this.removeDuplicates(this.itemData)
        //for initial total and unit
        this.purchaselistItem();
       console.log(this.itemData)
      }
    })
    
   

  }
  removeDuplicates(data){
    let unique =[];
    data.forEach(element => {
      if(!unique.includes(element)){
        unique.push(element);
        this.itemData =unique;
      }
      else{
        this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', 'Selected Item Exist in the table');
             }
    });
    return this.itemData;
  }
  subtotal;
  totalUnits
  purchaselistItem() {
    let subTotal = 0;
    let units = 0;
    for (let data of this.itemData) {
      subTotal += (data.available_units * data.unit_cost);
      units +=  Number(data.available_units);
    }
    this.total = subTotal;
    this.totalUnits = units
  }
  //delete item row
  deleteItemData(id) {
     console.log(this.itemData)
    alert(id)
    //delete item one by one
    this.itemData.forEach((element, index) => {
     this.itemData.splice(id, 1);

    });
    console.log(this.itemData);
    //call for total and totalunit after delete
    this.purchaselistItem();
    //when delete all data hide total row
    let length= this.itemData.length
    if(this.itemData.length==0){
    this.isChange=false;
    }
  }
  status: boolean = true;
  editdata(param) {
    //for editrow
    this.status = param;
   
  }

  
  isChange: boolean = false;
  savePurchaseData() {
    for(let i=0; i<this.itemData.length;i++){
     let obj={ item_id:this.itemData[i].item_id, "quantity":this.itemData[i].available_units, "unit_price":this.itemData[i].unit_cost}
    this.model.purchased_item_list.push(obj)
    }
    console.log(this.itemData);
    //this.router.navigate(['/view/inventory-management/purchase-item']);
    if (this.purchaseForm.valid) {
      let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
      this.model.institute_id = sessionStorage.getItem('institute_id');
      const formData = new FormData();
      let purchaseDto: any = {};
      if (this.isedit) {
        purchaseDto.purchase_id = this.model.purchase_id;
      }
      purchaseDto.institute_id = sessionStorage.getItem('institute_id');
      purchaseDto.supplier_id = this.model.supplier_id;
      purchaseDto.purchase_id = this.model.purchase_id;
      purchaseDto.purchase_description = this.model.purchase_description;
      purchaseDto.purchase_date = moment(this.model.purchase_date).format("YYYY-MM-DD");
      purchaseDto.total_amount = this.total;
      purchaseDto.total_paid_amount = this.model.total_paid_amount;
      purchaseDto.is_refunded = this.model.is_refunded;

      purchaseDto.purchased_item_list = this.model.purchased_item_list;
      formData.append('purchaseDto', JSON.stringify(purchaseDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
      // let base = this.auth.productBaseUrl;
      let base = "https://test999.proctur.com/StdMgmtWebAPI"
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
     // let urlPostXlsDocument = this.isedit ? base + "/api/v1/inventory/purchase/update" : base + "/api/v1/inventory/purchase/create";
     let urlPostXlsDocument =base + "/api/v1/inventory/purchase/create";
      let newxhr = new XMLHttpRequest();
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

      //this.isedit ? newxhr.open("PUT", urlPostXlsDocument, true) : newxhr.open("POST", urlPostXlsDocument, true);
      newxhr.open("POST", urlPostXlsDocument, true);
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
              let msg = this.isedit ? 'Purchased details is Updated Successfully' : 'Purchased details is Saved Successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              //$('#modelforpurchase').modal('hide');
              this.router.navigate(['/view/inventory-management/purchase-item']);
              // this.getPurchaseDetails();
              //this.cancel(false)
            } else {
              // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "File format is not suported");

              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).error[0].errorMessage);
            }
          }
        }
        newxhr.send(formData);
      }
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Fields Required");

    }
  }
  dataForEdit: any = [];
  editRow(editId) {
    this.itemData=[];
    this.isChange =true;
    // this.isedit = true;
    console.log(editId);
    this.isDisable = true;
    this.httpService.getData('/api/v1/inventory/purchase/' + editId + '?instituteId=' + this.model.institute_id).subscribe((res: any) => {
      this.dataForEdit = res.result;
      this.model = this.dataForEdit;
      this.auth.hideLoader();
      //console.log(this.editdata)
      this.model.purchase_id = this.dataForEdit.purchase_id;
      this.model.supplier_id = this.dataForEdit.supplier_id;
      this.model.purchase_date=this.dataForEdit.purchase_date;
      this.model.purchase_description = this.dataForEdit.purchase_description;
      this.model.total_amount = this.dataForEdit.total_amount;
      this.model.bill_image_url = this.dataForEdit.bill_image_url;
      this.itemData =this.dataForEdit.purchased_item_list;
      console.log(this.itemData);
      let newData=[];
      for(let i=0; i<this.itemData.length;i++){
        let obj={ item_id:this.itemData[i].item_id,item_name:this.itemData[i].item_name, "available_units":this.itemData[i].quantity, "unit_cost":this.itemData[i].unit_price}
       newData.push(obj);
       }
       this.itemData =newData;
       console.log(this.itemData);
       //function for total and subtotal
       this.purchaselistItem();
    },
      err => {
        this.auth.hideLoader();
      })

  }
  validateFutureDate() {
    let today = moment(new Date());
    let selected = moment(this.model.purchase_date);
    let differ = today.diff(selected, 'days');
    if (differ <= 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Purchase date is greter than today's date ");
      this.model.purchase_date = moment(new Date()).format('YYYY-MM-DD');
    }
  return true;
  }
  updatePurchaseData(){
    this.model.purchased_item_list=[];
    for(let i=0; i<this.itemData.length;i++){
      let obj={ "item_id":this.itemData[i].item_id, "quantity":this.itemData[i].available_units, "unit_price":this.itemData[i].unit_cost}
     this.model.purchased_item_list.push(obj)
     }
     console.log(this.itemData);
     //this.router.navigate(['/view/inventory-management/purchase-item']);
     if (this.purchaseForm.valid) {
       let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
       this.model.institute_id = sessionStorage.getItem('institute_id');
       const formData = new FormData();
       let purchaseDto: any = {};
       purchaseDto.institute_id = sessionStorage.getItem('institute_id');
       purchaseDto.supplier_id = this.model.supplier_id;
       purchaseDto.purchase_id = this.editId;
       purchaseDto.purchase_description = this.model.purchase_description;
       purchaseDto.purchase_date = moment(this.model.purchase_date).format("YYYY-MM-DD");
       purchaseDto.total_amount = this.total;
       purchaseDto.total_paid_amount = this.model.total_paid_amount;
       purchaseDto.is_refunded = this.model.is_refunded;
 
       purchaseDto.purchased_item_list = this.model.purchased_item_list;
       formData.append('purchaseDto', JSON.stringify(purchaseDto));
       if (file) {
         formData.append('billImageFile', file);
       }
       if (this.isedit) {
 
       }
       //this.isedit?this.model.id:delete(this.model.id);
       // let base = this.auth.productBaseUrl;
       let base = "https://test999.proctur.com/StdMgmtWebAPI"
       // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      // let urlPostXlsDocument = this.isedit ? base + "/api/v1/inventory/purchase/update" : base + "/api/v1/inventory/purchase/create";
      let urlPostXlsDocument =base + "/api/v1/inventory/purchase/update";
       let newxhr = new XMLHttpRequest();
       let auths: any = {
         userid: sessionStorage.getItem('userid'),
         userType: sessionStorage.getItem('userType'),
         password: sessionStorage.getItem('password'),
         institution_id: sessionStorage.getItem('institute_id'),
       }
       let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
 
       //this.isedit ? newxhr.open("PUT", urlPostXlsDocument, true) : newxhr.open("POST", urlPostXlsDocument, true);
       newxhr.open("POST", urlPostXlsDocument, true);
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
               let msg = 'Purchased details is Updated Successfully' ;
               this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
               //$('#modelforpurchase').modal('hide');
               this.router.navigate(['/view/inventory-management/purchase-item']);
               // this.getPurchaseDetails();
               //this.cancel(false)
             } else {
               // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "File format is not suported");
 
               this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
             }
           }
         }
         newxhr.send(formData);
       }
     }
     else {
       this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Fields Required");
 
     }
  }
  clearFile() {
   this.model.bill_image_url = '';
    // this.isedit=false;
    console.log(this.model.bill_image_url)
  }
}
