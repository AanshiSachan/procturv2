import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
declare var $;
@Component({
  selector: 'app-purchase-item',
  templateUrl: './purchase-item.component.html',
  styleUrls: ['./purchase-item.component.scss']
})
export class PurchaseItemComponent implements OnInit {
  isedit: any;
  purchaseAllData: any = [];
  paid: number = 1;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  institution_id;
  model = {
    purchase_id: 0,
    supplier_id: '',
    purchase_date: '',
    purchase_description: '',
    institute_id: sessionStorage.getItem('institute_id'),
    total_amount: 100,
    total_paid_amount: 0,
    is_refunded: false,
    purchased_item_list: [],
  }
  editChange(){
    this.isedit=false;
  }
  paymentModel = {
    purchase_id: 1,
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
    private excelService: ExcelService,
    private router:Router) {
    this.institution_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit(): void {
    this.getPurchaseDetails();
    this.viewdatas=sessionStorage.getItem('viewData');
  console.log(this.viewdatas)}
  @ViewChild('addform', { static: false }) addform: NgForm;
  getPurchaseDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/purchase/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&&instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        let purchaseData = res.result.response;
        for (let keys of purchaseData) {
          console.log(keys);
          console.log(keys)
          // console.log(this.purchaseAllData[keys]);
          for (let data of keys.purchased_item_list) {
            let obj:any={};
            //obj.category=keys.category_name;
            obj.item_name=data.item_name;
            obj.category_name=data.category_name;
            obj.quantity=data.quantity;
            obj.supplier_company_name=keys.supplier_company_name;
            obj.purchase_date=keys.purchase_date;
            obj.total_amount=keys.total_amount;
            obj.total_paid_amount=keys.total_paid_amount;
            obj.purchase_date=keys.purchase_date;
            obj.balanced_amount=keys.balanced_amount;
            obj.bill_image_url=keys.bill_image_url;
            obj.paid_amount =keys.paid_amount;
            obj.purchase_id=keys.purchase_id;
            console.log(obj);
            this.purchaseAllData.push(obj)
          }
          console.log(purchaseData)
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
  getAllPurchaseDetails(){
    this.httpService.getData('/api/v1/inventory/purchase/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&&instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        let purchaseData = res.result.response;
      })

  }
  isDelete = true;
  total = 100;
  paids = 200;
  purchase_id;
  showConfirm(obj) {
  this.purchase_id=obj.purchase_id; 
     $('#deletesModal').modal('show');
  }

  deleteRow() {
 this.auth.showLoader();
    this.httpService.deleteData('/api/v1/inventory/purchase/delete/' + this.purchase_id + '?instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Purchase Item Deleted Successfully');
        this.getPurchaseDetails();
        $('#deletesModal').modal('hide');
      },
      err => {
        this.msgService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
      }
    );

  }
  payment_purchase_id;
  showAddPayment(purchase_id){ 
this.payment_purchase_id=purchase_id;
$('#addpayModal').modal('show');
  }
  //create payment
  addPaymentPurchase(payment_purchase_id) {
   if (this.addform.valid) {
      let file = (<HTMLFormElement>document.getElementById('billImageFile')).files[0];
      this.model.institute_id = sessionStorage.getItem('institute_id');
      const formData = new FormData();
      let paymentDto: any = {};
      paymentDto.institute_id = sessionStorage.getItem('institute_id');
      paymentDto.purchase_id = payment_purchase_id;
      paymentDto.purchased_by_user_id = this.paymentModel.purchased_by_user_id;
      paymentDto.paid_amount = this.paymentModel.paid_amount;
      paymentDto.payment_date = moment(this.paymentModel.payment_date).format("YYYY-MM-DD");
      paymentDto.reference_no = this.paymentModel.reference_no;
      paymentDto.paid_amount = this.paymentModel.paid_amount;
      paymentDto.payment_method = this.paymentModel.payment_method;
      formData.append('paymentDto', JSON.stringify(paymentDto));
      if (file) {
        formData.append('billImageFile', file);
      }
      if (this.isedit) {

      }
      //this.isedit?this.model.id:delete(this.model.id);
      // let base = this.auth.productBaseUrl;
      let base = "https://test999.proctur.com/StdMgmtWebAPI"
      // let urlPostXlsDocument = base + "/prod/api/v2/asset/purchase/create";
      let urlPostXlsDocument = base + "/api/v1/inventory/payment/create";
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
              this.getPurchaseDetails();
              //this.cancel(false)
              this.addform.resetForm(this.paymentModel)
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory fields");

    }
  }
  //validate date
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
    $('#viewpayModal').modal('show');
    this.httpService.getData('/api/v1/inventory/payment/all?purchaseId=' + id + '&instituteId=' + this.paymentModel.institute_id).subscribe((res: any) => {
      this.paymentHistoryData = res.result;
      this.auth.hideLoader();
    },
    err =>{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '',err.error.message);
       }   )
   
    
  }
  viewNavigate(obj){
    //../purchase-view
    console.log(obj)
    sessionStorage.setItem('viewData', obj);
this.router.navigate(['/view/inventory-management/purchase-view'])
  }
  viewdatas:any=[];
  cancelData(purchase_id){
    ///api/v1/inventory/purchase/cancelPurchase?purchaseId=3&instituteId=100058
   this.httpService.getData('/api/v1/inventory/purchase/cancelPurchase?purchaseId=' + purchase_id + '&instituteId=' + this.paymentModel.institute_id).subscribe((res: any) => {
    if (res.statusCode == 200) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.result);
       this.getAllPurchaseDetails();
      }
      else{
      
      }
    },
    err =>{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '',err.error.message);
       }   )
   

  }
}
