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
  total: any;
  isedit = false;
  editId;
  bill_image_url: any;
  isDisable = false;
  isadd: any;
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
    purchase_date: '',
    reference_number: ''
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
    this.getCategoryItem();
    this.editId = this._Activatedroute.snapshot.paramMap.get("id");
    this._Activatedroute.snapshot.queryParamMap.get('isedit');
    if (this.editId != undefined) {
      // this.isadd=false;
      this.editRow(this.editId);
      this.isDisable = true;
      this.isedit = true;
    }

  }
  ngDoCheck() {
    //this.totals(obj);

  }
  private _title: string;

  getCategoryItem() {
    this.isChange = false;
    this.itemData = [];
    // this.auth.showLoader();
///api/v1/inventory/category/all/' + this.institution_id
    this.httpService.getData('/api/v1/inventory/category/all/' + this.model.institute_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData = res;
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

    // this.categoryAllData.forEach(element => {
    //   if (element && element.categoryId === id) {
    //     this.itemArray = element.items;


    //   }
    // });
     //this.isChange = false;
     if(id != '' && id != 0) {
     this.auth.showLoader();
     this.httpService.getData('/api/v1/inventory/item/getItemsByCategory/' + this.model.institute_id + '?categoryIdList=' + id).subscribe((res: any) => {
       this.itemArray = res.result;
 
       this.auth.hideLoader();
       this.itemArray = this.itemArray[0].items;
 
     },
     (err:any)=>{
       this.auth.hideLoader();
     }
     )
    }
 
  }

  getItemData(id) {
    this.isChange = true;
    this.itemArray.forEach(elements => {
      if (elements && elements.item_id == id) {
        elements.available_units=1;
        this.itemData.push(elements);
        let data = elements;
      //use to remove duplicates from array
        this.removeDuplicates(this.itemData)
        //for initial total and unit
        this.purchaselistItem();

      }
    })



  }
  removeDuplicates(data) {
    let unique = [];
    data.forEach(element => {
      if (!unique.includes(element)) {
        unique.push(element);
        this.itemData = unique;
      }
      else {
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
      units += Number(data.available_units);
    }
    this.total = subTotal.toFixed(2);
    //num.toFixed(2);
    this.totalUnits = units
  }
  //delete item row
  deleteItemData(id) {
    //delete item one by one
    this.itemData.forEach((element, index) => {
      this.itemData.splice(id, 1);

    });
    //call for total and totalunit after delete
    this.purchaselistItem();
    //when delete all data hide total row
    let length = this.itemData.length
    if (this.itemData.length == 0) {
      this.isChange = false;
    }
  }
  status: boolean = true;
  editdata(param) {
    //for editrow
    this.status = param;

  }


  isChange: boolean = false;
  savePurchaseData() {
    this.model.purchased_item_list = [];
    for (let i = 0; i < this.itemData.length; i++) {
      let obj = { item_id: this.itemData[i].item_id, "quantity": this.itemData[i].available_units, "unit_price": this.itemData[i].unit_cost }
      this.model.purchased_item_list.push(obj)
    }

    if (this.purchaseForm.valid) {
      if(this.itemData.length) {
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
      purchaseDto.reference_number = this.model.reference_number;
      purchaseDto.purchased_item_list = this.model.purchased_item_list;
      formData.append('purchaseDto', JSON.stringify(purchaseDto));

      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
      let base = this.auth.baseUrl;
    
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      // let urlPostXlsDocument = this.isedit ? base + "/api/v1/inventory/purchase/update" : base + "/api/v1/inventory/purchase/create";
      let urlPostXlsDocument = base + "/api/v1/inventory/purchase/create";
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
              let msg = this.isedit ? 'Purchased Saved Successfully' : 'Purchased Saved Successfully';
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
    } else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please select category and Item for purchase");
    }
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory fields");

    }
  }
  dataForEdit;
  editRow(editId) {
    //this.itemData=[];
     this.isChange = true;
     this.isDisable = true;
     this.httpService.getData('/api/v1/inventory/purchase/' + editId + '?instituteId=' + this.model.institute_id).subscribe((res: any) => {
      this.dataForEdit = res.result;
      this.model = this.dataForEdit;
      this.auth.hideLoader();
      this.model.purchase_id = this.dataForEdit.purchase_id;
      this.model.supplier_id = this.dataForEdit.supplier_id;
      this.model.purchase_date = this.dataForEdit.purchase_date;
      this.model.purchase_description = this.dataForEdit.purchase_description;
      this.model.total_amount = this.dataForEdit.total_amount;
      this.model.bill_image_url = this.dataForEdit.bill_image_url;
      this.itemData = this.dataForEdit.purchased_item_list;
      if(this.dataForEdit.total_paid_amount>0){
        this.isedit=true;
      }
      let newData = [];
      let newdataforcat = [];
      for (let i = 0; i < this.itemData.length; i++) {
        let objforcat = { category_id: this.itemData[i].category_id, category_name: this.itemData[i].category_name }
        let obj = { item_id: this.itemData[i].item_id, item_name: this.itemData[i].item_name, "available_units": this.itemData[i].quantity, "unit_cost": this.itemData[i].unit_price }
        newData.push(obj);
        newdataforcat.push(objforcat);
      }
      this.itemData = newData;
      this.categoryAllData = newdataforcat;

      this.purchaselistItem();
    },
      err => {
        this.auth.hideLoader();
      })

  }
  validateFutureDate() {
    let today = moment(new Date);
    let selectedDate = moment(this.model.purchase_date)
    let diff = moment(selectedDate.diff(today))['_i'];
    if (diff > 0) {
      this.msgService.showErrorMessage('info', '', "Future date is not allowed");
      this.model.purchase_date = moment(new Date).format('YYYY-MM-DD');
    }
    
  }
  updatePurchaseData() {
    this.model.purchased_item_list = [];
    for (let i = 0; i < this.itemData.length; i++) {
      let obj = { "item_id": this.itemData[i].item_id, "quantity": this.itemData[i].available_units, "unit_price": this.itemData[i].unit_cost }
      this.model.purchased_item_list.push(obj)
    }
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
      purchaseDto.reference_number = this.model.reference_number;
      purchaseDto.total_paid_amount = this.model.total_paid_amount;
      purchaseDto.is_refunded = this.model.is_refunded;
      purchaseDto.bill_image_url = this.model.bill_image_url;
      purchaseDto.purchased_item_list = this.model.purchased_item_list;
      formData.append('purchaseDto', JSON.stringify(purchaseDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
      let base = this.auth.baseUrl;
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      // let urlPostXlsDocument = this.isedit ? base + "/api/v1/inventory/purchase/update" : base + "/api/v1/inventory/purchase/create";
      let urlPostXlsDocument = base + "/api/v1/inventory/purchase/update";
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
              let msg = 'Purchase Updated Successfully';
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please Fill all required field");

    }
  }
  clearFile() {
    this.model.bill_image_url = '';
    // this.isedit=false;
  }

  maxlenth(data,limit){
    if(data.length>limit){
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Please Enter upto"+  " " + limit + " "+ "characters only");
    }
    }
    filesize;
    filetype;
    readFile(fileEvent: any,id) {
      const file = fileEvent.target.files[0];
     this.filesize= file.size;
     const fileSizeInKB = Math.round(this.filesize / 1024);
     if(fileSizeInKB > 5242880){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please upload file upto 5MB");
     }
    this.filetype = file.type;
   var image =(<HTMLInputElement>document.getElementById(id)).value;
   if(image!='')
    {
          var checkimg = image.toLowerCase();
         if (!checkimg.match(/(\.jpg|\.png|\.JPG|\.PNG|\.jpeg|\.JPEG|\.PDF|\.pdf|\.svg |\.SVG)$/)){ // validation of file extension using regular expression before file upload
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "File format is not allowed");
      return false;
          }
           var img = (<HTMLInputElement>document.getElementById(id)); 
           //alert(img.files[0].size);
          //  if(img.files[0].size > 5,242,880)  // validation according to file size
          //  {
          //   this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please upload file upto 5MB");
    
          //  //document.getElementById("errorName5").innerHTML="Image size too short";
          //  return false;
          //   }
            return true;
     }

   }
}
