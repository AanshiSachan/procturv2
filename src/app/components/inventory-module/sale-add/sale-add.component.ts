import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { RoleService } from '../../../services/user-management/role.service';

import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { ElementSchemaRegistry } from '@angular/compiler';
import { ActivatedRoute, Router } from '@angular/router';
declare var $;
@Component({
  selector: 'app-sale-add',
  templateUrl: './sale-add.component.html',
  styleUrls: ['./sale-add.component.scss']
})
export class SaleAddComponent implements OnInit {
  institution_id = sessionStorage.getItem('institution_id');
  roleAllData = [];
  sale_type;
  editId;
  isedit = false;
  isChange: boolean = false;
  isDisable = false;
  dataForEdit;
  saleAllData = [];
  constructor(private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService,
    private apiService: RoleService,
    private router: Router,
    private _Activatedroute: ActivatedRoute) {
    this.institution_id = sessionStorage.getItem('institution_id')
  }

  ngOnInit(): void {
    this.getAllRoles();
    this.getSaleDetails();
    this.getCategoryDetails();
    this.editId = this._Activatedroute.snapshot.paramMap.get("id");
    if (this.editId != undefined) {
      // this.isadd=false;
      this.editRow(this.editId);
      this.isDisable = true;
      this.isedit = true;
    }

  }

  @ViewChild('myForm', { static: false }) myForm: NgForm;

  model: any = {
    sale_id: 0,
    sale_type: '',
    user_id: '',
    user_role: '',
    reference_number: '',
    bill_image_url: '',
    sale_date: '',
    payment_status: '',
    description: '',
    institute_id: sessionStorage.getItem('institution_id'),
    sale_item_list: []

  }
  getAllRoles() {
    //this.auth.showLoader();
    this.httpService.getData('/api/v1/roleApi/allRoles/' + this.institution_id).subscribe((res: any) => {
      this.roleAllData = res;
      this.auth.hideLoader();
    },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      })

  }
  userALLdata = [];
  getUserAgainstRole(role_id) {
    this.httpService.getData('/api/v1/inventory/sale/' + this.institution_id + '/getUserByRole?roleIds=' + role_id).subscribe(
      (res: any) => {
        this.userALLdata = res.result;

      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  validateFutureDate() {
   let today = moment(new Date);
    let selectedDate = moment(this.model.sale_date)
    let diff = moment(selectedDate.diff(today))['_i'];
    if (diff > 0) {
      this.msgService.showErrorMessage('info', '', "Future date is not allowed");
      this.model.sale_date = moment(new Date).format('YYYY-MM-DD');
    }
  }
  categoryAllData = [];
  getCategoryDetails() {

    //this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/category/all/' + this.institution_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData = res;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  itemArray: any = [];
  itemAllData: any = [];
  itemData: any = [];
  getItemAgainstCat(category_id) {
    //this.isChange = false;
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/item/getItemsByCategory/' + this.model.institute_id + '?categoryIdList=' + category_id).subscribe((res: any) => {
      this.itemAllData = res.result;

      this.auth.hideLoader();
      this.itemArray = this.itemAllData[0].items;

    })

  }
  getItemData(id) {
    this.isChange = true;
    this.itemArray.forEach(elements => {
      if (elements && elements.item_id == id) {
        //available units replace with one
        elements.available_units =1;
        this.itemData.push(elements);
        elements.sale_type = "Paid";
        elements.isedit = false;
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
  totalUnits;
  total;
  purchaselistItem() {
    let subTotal = 0;
    let units = 0;
    for (let data of this.itemData) {
      data.subtotal = 0;
      units += Number(data.available_units);
      if (data.sale_type == "Paid") {
        data.subtotal = (data.available_units * data.unit_cost) + (data.available_units * data.unit_cost) * (data.tax_percent) / 100;
        //for total calculate
        subTotal += data.subtotal;


      }    //subtotal for each row
      else {
        data.unit_cost = 0;
      }

    }
    this.total = subTotal;
    this.totalUnits = units
  }
  status: boolean = true;
  editdata(param) {

    param.isedit = true
    //for editrow
    // if (id != undefined) {
    //   this.status = param;
    // }


  }
  deleteItemData(id) {
    this.itemData.forEach((element, index) => {
      this.itemData.splice(id, 1);

    });
    this.purchaselistItem();
if(this.itemData.length ==0){
  this.isChange =!this.isChange;
}
  }
  saveSaleDetails() {
    if (this.myForm.valid) {
      this.model.sale_item_list = [];
      //sale_type":"paid", "item_id":43, "quantity":1, "unit_price":100, "tax":0.0
      for (let i = 0; i < this.itemData.length; i++) {
        let obj = {
          sale_type: this.itemData[i].sale_type,
          item_id: this.itemData[i].item_id,
          "quantity": this.itemData[i].available_units,
          "unit_price": this.itemData[i].unit_cost,
          "tax": this.itemData[i].tax_percent
        }
        this.model.sale_item_list.push(obj)
      }
      let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
      this.model.institute_id = sessionStorage.getItem('institute_id');
      const formData = new FormData();
      let saleDto: any = {};
      if (this.isedit) {
        saleDto.sale_id = this.model.sale_id;
      }

      saleDto.institute_id = sessionStorage.getItem('institute_id');
      saleDto.user_id = this.model.user_id;
      saleDto.user_role = this.model.user_role;
      saleDto.reference_number = this.model.reference_number;
      saleDto.sale_date = moment(this.model.sale_date).format("YYYY-MM-DD");
      saleDto.sale_item_list = this.model.sale_item_list;
      saleDto.payment_status = this.model.payment_status;
      // saleDto.sale_type =this.model.sale_type;
      formData.append('saleDto', JSON.stringify(saleDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
       let base = this.auth.baseUrl;
      //let base = "https://test999.proctur.com/StdMgmtWebAPI"
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      let urlPostXlsDocument = this.isedit ? base + "/api/v1/inventory/sale/update" : base + "/api/v1/inventory/sale/create";
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
              let msg = this.isedit ? 'Sale Added Successfully' : 'Sale Added Successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              this.router.navigate(['/view/inventory-management/sale-item']);
              //this.getPurchaseDetails();
              //this.cancel(false)
            } else {
              // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "File format is not suported");
              this.model.sale_item_list = [];
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).error[0].errorMessage);
            }
          }
        }
        newxhr.send(formData);
      }
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please Fill All  Required Fields");

    }
  }


  getSaleDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/sale/all?instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        let saleData = res.result.response;
        for (let keys of saleData) {


          for (let data of keys.sale_item_list) {
            let obj: any = {};
            obj.item_name = data.item_name;
            obj.item_name = data.item_name;
            obj.reference_number = keys.reference_number;
            obj.user_name = keys.user_name;
            obj.user_role = keys.user_role;
            obj.supplier_company_name = keys.supplier_company_name;
            obj.sale_date = keys.sale_date;
            obj.sale_type = data.sale_type;
            obj.total_paid_amount = keys.total_paid_amount;
            obj.total_amount = keys.total_amount;
            obj.balanced_amount = keys.balanced_amount;
            obj.bill_image_url = keys.bill_image_url;
            obj.sale_id = keys.sale_id;

            this.saleAllData.push(obj)
          }

        }
        // this.staticPageData = res.result.response;
        // this.tempLocationList = res.result.response;
        // this.totalRecords = res.result.total_elements;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(editId) {
    this.itemData = [];
    this.isChange = true;
    this.isDisable = true;
    this.httpService.getData('/api/v1/inventory/sale/' + editId + '?instituteId=' + this.model.institute_id).subscribe((res: any) => {
      this.dataForEdit = res.result;
      this.auth.hideLoader();
      this.model.user_role = this.dataForEdit.user_role;
      this.model.role_id=this.dataForEdit.user_id;
      this.getUserAgainstRole( this.model.user_role);
      this.model.user_id = this.dataForEdit.user_id;
      this.model.sale_type = this.dataForEdit.sale_type;
      this.model.reference_number = this.dataForEdit.reference_number;
      this.model.bill_image_url = this.dataForEdit.bill_image_url;
      this.model.sale_date = this.dataForEdit.sale_date;
      this.model.payment_status = this.dataForEdit.payment_status;
      this.model.user_name = this.dataForEdit.user_name;
      this.model.description = this.dataForEdit.description;
      this.itemData = this.dataForEdit.sale_item_list;
      let newData = [];
      for (let i = 0; i < this.itemData.length; i++) {
        let obj = {
          sale_type: this.itemData[i].sale_type,
          item_id: this.itemData[i].item_id,
          item_name: this.itemData[i].item_name,
          "available_units": this.itemData[i].quantity, "unit_cost": this.itemData[i].unit_price,
          "tax_percent": this.itemData[i].tax,
          "isedit": false
        }
        newData.push(obj);
      }
      this.itemData = newData;

      //function for total and subtotal
      this.purchaselistItem();
    },
      err => {
        this.auth.hideLoader();
      })

  }
  updateSaleData() {
    if (this.myForm.valid) {
      this.model.sale_item_list = [];
      //sale_type":"paid", "item_id":43, "quantity":1, "unit_price":100, "tax":0.0
      for (let i = 0; i < this.itemData.length; i++) {
        let obj = {
          sale_type: this.itemData[i].sale_type,
          item_id: this.itemData[i].item_id,
          "quantity": this.itemData[i].available_units,
          "unit_price": this.itemData[i].unit_cost,
          "tax": this.itemData[i].tax_percent
        }
        this.model.sale_item_list.push(obj)
      }

      let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
      this.model.institute_id = sessionStorage.getItem('institute_id');
      const formData = new FormData();
      let saleDto: any = {};
      // if (this.isedit) {
      //   saleDto.sale_id = this.model.sale_id;
      // }

      saleDto.institute_id = sessionStorage.getItem('institute_id');
      saleDto.user_id = this.model.user_id;
      saleDto.sale_id = this.editId;
      saleDto.user_role = this.model.user_role;
      saleDto.reference_number = this.model.reference_number;
      saleDto.sale_date = moment(this.model.sale_date).format("YYYY-MM-DD");
      saleDto.sale_item_list = this.model.sale_item_list;
      saleDto.payment_status = this.model.payment_status;
      saleDto.bill_image_url =this.model.bill_image_url;
      // saleDto.sale_type =this.model.sale_type;
      formData.append('saleDto', JSON.stringify(saleDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
       let base = this.auth.baseUrl;
      //let base = "https://test999.proctur.com/StdMgmtWebAPI"
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      let urlPostXlsDocument = base + "/api/v1/inventory/sale/update";
      let newxhr = new XMLHttpRequest();
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

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
              let msg = this.isedit ? 'Sale Updated Successfully' : 'Sale Updated Successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              this.router.navigate(['/view/inventory-management/sale-item']);
              //this.getPurchaseDetails();
              //this.cancel(false)
            } else {
              // this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "File format is not suported");
              this.model.sale_item_list = [];
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).error[0].errorMessage);
            }
          }
        }
        newxhr.send(formData);
      }
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Fill All  Required Fields");

    }
  }
  clearFile() {
    this.model.bill_image_url = '';
    // this.isedit=false;
  }

}