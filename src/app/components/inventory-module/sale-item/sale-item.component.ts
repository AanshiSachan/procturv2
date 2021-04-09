import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
declare var $;

@Component({
  selector: 'app-sale-item',
  templateUrl: './sale-item.component.html',
  styleUrls: ['./sale-item.component.scss']
})
export class SaleItemComponent implements OnInit {
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  institution_id;
  saleAllData = [];
  @ViewChild('addform', { static: false }) addform: NgForm;
  isedit: any;
  model = {
    purchase_id: 0,
    supplier_id: '',
    purchase_date: '',
    purchase_description: '',
    institution_id: sessionStorage.getItem('institute_id'),
    total_amount: 100,
    total_paid_amount: 0,
    is_refunded: false,
    purchased_item_list: [],
  }
  paymentModel = {
    sale_id: '',
    purchased_by_user_id: 18000,
    paid_amount: '',
    payment_date: '',
    reference_no: '',
    payment_method: '',
    institute_id: sessionStorage.getItem('institute_id')
  }
  constructor(private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) {
    this.institution_id = sessionStorage.getItem('institution_id')
  }

  ngOnInit(): void {
    this.getSaleDetails();
    
  }
  getSaleDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/sale/all?instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        let saleData = res.result.response;
        for (let keys of saleData) {
          console.log(keys);
          console.log(keys)
          // console.log(this.purchaseAllData[keys]);
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
            obj.sale_id =keys.sale_id;
            console.log(obj);
            this.saleAllData.push(obj)
          }
          console.log(saleData)
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
  sale_id;
  showAddPaymentModel(data){
    this.sale_id=data.sale_id;
    console.log(this.sale_id)
    $('#addpayModal').modal('show');
  }
  addPayment() {
    //this.router.navigate(['/view/inventory-management/purchase-item']);
    if (this.addform.valid) {
      let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
      this.paymentModel.institute_id = sessionStorage.getItem('institute_id');
      const formData = new FormData();
      let salePaymentDto: any = {};
      salePaymentDto.institute_id = sessionStorage.getItem('institute_id');
      salePaymentDto.sale_id = this.sale_id;
      salePaymentDto.purchased_by_user_id = this.paymentModel.purchased_by_user_id;
      salePaymentDto.paid_amount = this.paymentModel.paid_amount;
      salePaymentDto.payment_date = moment(this.paymentModel.payment_date).format("YYYY-MM-DD");
      salePaymentDto.reference_no = this.paymentModel.reference_no;
      salePaymentDto.paid_amount = this.paymentModel.paid_amount;
      salePaymentDto.payment_method = this.paymentModel.payment_method;
      formData.append('salePaymentDto', JSON.stringify(salePaymentDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
      // let base = this.auth.productBaseUrl;
      let base = "https://test999.proctur.com/StdMgmtWebAPI"
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      let urlPostXlsDocument = base + "/api/v1/inventory/sale/payment/create";
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
              let msg = 'Payment details is Saved Successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              $('#addpayModal').modal('hide');
              this.getSaleDetails();
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
  validateFutureDate() {
    let today = moment(new Date());
    let selected = moment(this.paymentModel.payment_date);
    let differ = today.diff(selected, 'days');
    if (differ <= 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment date is greter than today's date ");
      this.paymentModel.payment_date = moment(new Date()).format('YYYY-MM-DD');
    }
    return true;
  }
  validatePayment(data) {
    let balanced_amount = 2344;
    let amount = Number(this.paymentModel.paid_amount);
    if (amount < 1) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment Amount is LESS than one")
    }
    if (balanced_amount <= amount) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment Amount is GREATER than Balanced Amount")
    }
  }
  paymentHistoryData = [];
  getPaymentHistory(id) {
    this.auth.showLoader();
    ///api/v1/inventory/sale/payment/all?instituteId=100058&saleId=3
    $('#viewpayModal').modal('show');
    this.httpService.getData('/api/v1/inventory/sale/payment/all?&instituteId=' + this.paymentModel.institute_id +'&saleId='+id).subscribe((res: any) => {
      this.paymentHistoryData = res.result;
      this.auth.hideLoader();
    },
    err =>{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '',err.error.message);
       }   )
   
    
  }
  
  showConfirm(obj) {
    alert("hi")
    console.log(obj.sale_id)
     this.sale_id =obj.sale_id;
    $('#deletesModal').modal('show');
  }

  deleteRow() {
///api/v1/inventory/sale/delete/5?instituteId=100058
    this.auth.showLoader();
    this.httpService.deleteData('/api/v1/inventory/sale/delete/' +   this.sale_id + '?instituteId=' + this.model.institution_id, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Sale Item Deleted Successfully');
        this.getSaleDetails();
        $('#deletesModal').modal('hide');
      },
      err => {
        this.msgService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
      }
    );

  }
}
