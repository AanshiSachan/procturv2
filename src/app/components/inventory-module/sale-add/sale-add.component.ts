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
  editId;
  isChange: boolean = false;
  isDisable = false;
  dataForEdit = [];

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
    this.getCategoryDetails();
    this.editId = this._Activatedroute.snapshot.paramMap.get("id");
    if (this.editId === undefined) {
    }
    else {
      this.editRow(this.editId);
      this.isDisable = true;
    }

  }
  isedit: any;
  @ViewChild('myForm', { static: false }) myForm: NgForm;

  model = {
    sale_id: '',
    sale_type: '',
    user_id: '',
    user_role: '',
    reference_number: '',
    bill_image_url: '',
    sale_date: '',
    payment_status: '',
    description: '',
    institute_id: sessionStorage.getItem('institution_id'),
    sale_item_list: [{ "sale_type": "paid", "item_id": 43, "quantity": 1, "unit_price": 100, "tax": 0.0 }]

  }
  getAllRoles() {
    //this.auth.showLoader();
    this.httpService.getData('/api/v1/roleApi/allRoles/100058').subscribe((res: any) => {
      this.roleAllData = res;
      this.auth.hideLoader();
    },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      })

  }
  userALLdata = [];
  getUserAgainstRole(role_id) {
    //'/api/v1/inventory/sale/'+ this.institution_id + '/getUserByRole?roleIds='+ role_id

    console.log(role_id)
    this.httpService.getData('/api/v1/inventory/sale/' + this.institution_id + '/getUserByRole?roleIds=' + role_id).subscribe(
      (res: any) => {
        this.userALLdata = res.result;
        console.log(this.userALLdata)
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  validateFutureDate() {
    let today = moment(new Date());
    let selected = moment(this.model.sale_date);
    let differ = today.diff(selected, 'days');
    if (differ <= 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Purchase date is greter than today's date ");
      this.model.sale_date = moment(new Date()).format('YYYY-MM-DD');
    }

    return true;
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
  itemAllData = [];
  itemsForIterate = [];
  itemArray = [];
  getItemAgainstCat(category_id) {
    this.httpService.getData('/api/v1/inventory/item/getItemsByCategory/' + this.institution_id + '?category_id_list=' + category_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.itemAllData = res.result;
        for (var index1 of this.itemAllData) {
          console.log(index1); // prints indexes: 0, 1, 2, 3
        }
      },
 err => {
        this.auth.hideLoader();
      }
    );

  }
  getItemARrray() {
    alert("hi")
    this.isChange = !this.isChange;
  }
  saveSaleDetails() {
    if (this.myForm.valid) {
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
      //saleDto.sale_type =this.model.sale_type;
      formData.append('saleDto', JSON.stringify(saleDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
      // let base = this.auth.productBaseUrl;
      let base = "https://test999.proctur.com/StdMgmtWebAPI"
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      let urlPostXlsDocument = this.isedit ? base + "/api/v1/inventory/purchase/update" : base + "/api/v1/inventory/sale/create";
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
              let msg = this.isedit ? 'Item Sale details is Updated successfully' : 'Item Sale details is Saved successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              this.router.navigate(['/view/inventory-management/sale-item']);
              //this.getPurchaseDetails();
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Fill All  Required Fields");

    }
  }
  editRow(editId) {
    this.isChange = true;
    this.isedit = false;
    console.log(editId);
    this.isDisable = true;
    this.httpService.getData('/api/v1/inventory/purchase/' + editId + '?instituteId=' + this.model.institute_id).subscribe((res: any) => {
      this.dataForEdit = res.result;

    },
      err => {
        this.auth.hideLoader();
      })

  }


}
