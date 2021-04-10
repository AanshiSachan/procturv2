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
  isedit: any;
  editId;
  isDisable=false;
  
  @ViewChild('purchaseForm', { static: false }) purchaseForm: NgForm;
  url = `/api/v1/inventory/`;
  model = {
    purchase_id: '',
    supplier_id: '',
    purchase_description: '',
    institute_id: sessionStorage.getItem('institute_id'),
    total_amount: 0,
    total_paid_amount: 0,
    is_refunded: false,
    purchased_item_list: [],
    supplier_company_name:'',
    bill_image_url:'',
    purchase_date:''
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
    if(this.editId ===undefined){
       }
       else{
        this.editRow(this.editId);
        this.isDisable =true;
       }
    
  }
  ngDoCheck() {
    //this.totals(obj);
    
  }
  private _title: string;

  getCategoryItem(obj) {
    this.itemData = [];
    this.model.purchased_item_list = [];
    this.isChange = false;
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
    this.itemArray.forEach(elements => {
      if (elements && elements.item_id == id) {
        this.itemData.push(elements);
        let data = elements;
        console.log(this.itemData);

        // let purchaselist = { "item_id": data.item_id, "quantity": data.available_units, "unit_price": data.unit_cost };
        // this.model.purchased_item_list.push(purchaselist);
        // console.log(purchaselist)
      }
    })



    // // this.itemData
    // let id = e;
    // id = +id;
    this.isChange = true;
    // this.itemArray.forEach(element => {
    //   if (element && element.item_id == id) {
    //     let data = element;
    //     this.itemData.push(data);

    //     let purchaselist = { "item_id": data.item_id, "quantity": data.available_units, "unit_price": data.unit_cost };
    //     this.model.purchased_item_list.push(purchaselist);
    //   }
    //   console.log(this.model.purchased_item_list)
    // })
    // console.log(this.itemData)
  }
  subtotal;
  purchaselistItem(data, b, c) {
    console.log(data);
    console.log(b);
    console.log(c);
    this.subtotal = c * b;
    console.log(this.subtotal);
    this.total = this.total + this.subtotal;
    let purchaselist = { "item_id": data.item_id, "quantity": b, "unit_price": c };
    this.model.purchased_item_list.push(purchaselist);
    console.log(purchaselist);
  }
  //delete item row
  deleteItemData(id) {
    this.model.purchased_item_list.forEach((element, index) => {
      if (element.item_id == id) this.model.purchased_item_list.splice(index, 1);

    });
    console.log(this.model.purchased_item_list);
  }
  status: boolean = true;
  editdata(param) {
    this.status = param;
  }

  unit_cost: number;
  available_units: number
  isChange: boolean = false;
  totals(obj) {
    // console.log(obj)
    // this.isChange = true;
    // obj.subtotal = obj.unit_cost * obj.available_units;
    // console.log(obj.subtotal)
    // obj.Prevsubtotal = obj.unit_cost * obj.available_units;
    // console.log(obj.Prevsubtotal)
    // console.log(obj.Prevsubtotal)
    // this.total = this.total - obj.Prevsubtotal;
    // this.total = this.total + obj.subtotal;
    // obj.Prevsubtotal = obj.subtotal;
    // console.log(this.total);
    // let newdata = this.itemArray.map(data => {
    //   return { "subtotal": data.subtotal, "Prevsubtotal": data.Prevsubtotal, "total": data }
    // })
    // console.log(newdata)
  }
  savePurchaseData() {
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
      purchaseDto.total_amount = this.model.total_amount;
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
      let urlPostXlsDocument = this.isedit ? base + "/api/v1/inventory/purchase/update" : base + "/api/v1/inventory/purchase/create";
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
  dataForEdit:any=[];
  editRow(editId) {
    this.isChange=true;
    this.isedit = false;
    console.log(editId);
    this.isDisable =true;
    this.httpService.getData('/api/v1/inventory/purchase/'+editId +'?instituteId='+this.model.institute_id).subscribe( (res: any) => {
      this.dataForEdit = res.result;
      this.model =this.dataForEdit;
     console.log(this.dataForEdit)
      this.auth.hideLoader();
      //console.log(this.editdata)
    this.model.purchase_id=this.dataForEdit.purchase_id;
    this.model.supplier_id=this.dataForEdit.supplier_company_name;
    //this.model.purchase_date=this.dataForEdit.purchase_date;
    this.model.purchase_description=this.dataForEdit.purchase_description;
   // this.model.purchased_item_list=this.dataForEdit.purchased_item_list;
    this.model.total_amount =this.dataForEdit.total_amount;
    this.model.bill_image_url =this.dataForEdit.bill_image_url;
    this.itemData =this.dataForEdit.purchased_item_list;
    this.model.purchased_item_list=[{item_id: 40, item_name: "Bags2", purchase_id: 1, quantity: 5}];
   
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

}
