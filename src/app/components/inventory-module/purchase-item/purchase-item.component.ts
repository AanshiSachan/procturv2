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
  searchParams: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  institution_id;
  tempLocationList: any=[];
  assignDataforDownload=[];
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
    purchase_id: 0,
    purchased_by_user_id: 0,
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
  }
  @ViewChild('addform', { static: false }) addform: NgForm;
  getPurchaseDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/purchase/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&&instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        let purchaseData = res.result.response;
        this.purchaseAllData =purchaseData;
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.totalElements;
       // for (let keys of purchaseData) {
        //   console.log(keys);
        //   console.log(keys)
        //   // console.log(this.purchaseAllData[keys]);
        //   // for (let data of keys.purchased_item_list) {
        //   //   let obj:any={};
        //   //   //obj.category=keys.category_name;
        //   //   obj.item_name=data.item_name;
        //   //   obj.category_name=data.category_name;
        //   //   obj.quantity=data.quantity;
        //   //   obj.supplier_company_name=keys.supplier_company_name;
        //   //   obj.purchase_date=keys.purchase_date;
        //   //   obj.total_amount=keys.total_amount;
        //   //   obj.total_paid_amount=keys.total_paid_amount;
        //   //   obj.purchase_date=keys.purchase_date;
        //   //   obj.balanced_amount=keys.balanced_amount;
        //   //   obj.bill_image_url=keys.bill_image_url;
        //   //   obj.paid_amount =keys.paid_amount;
        //   //   obj.purchase_id=keys.purchase_id;
        //   //   console.log(obj);
        //   //   this.purchaseAllData.push(obj)
        //   // }
        //   console.log(purchaseData)
        // }
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
  document.getElementById('action_btn').style.display="none"
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
    document.getElementById('action_btn').style.display="none"
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
       let base = this.auth.baseUrl;
      //let base = "https://test999.proctur.com/StdMgmtWebAPI"
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
              this.cancel();
              this.getPurchaseDetails();
              //this.cancel(false)
              this.addform.resetForm(this.paymentModel)
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field");

    }
  }
  //validate date
  validateFutureDate() {
     let today = moment(new Date);
    let selectedDate = moment(this.paymentModel.payment_date)
    let diff = moment(selectedDate.diff(today))['_i'];
    if (diff > 0) {
      this.msgService.showErrorMessage('info', '', "Future date is not allowed");
      this.paymentModel.payment_date = moment(new Date).format('YYYY-MM-DD');
    }
  }
  validatePayment(data) {
    let balanced_amount = 2344;
    let amount = Number(this.paymentModel.paid_amount);
    if (amount < 1) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment amount is less than one");
    }
    if (balanced_amount <= amount) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment amount is greater than balanced amount")
    }
  }
  paymentHistoryData = [];
  getPaymentHistory(data) {
    document.getElementById('action_btn').style.display="none";
    if(data.paid_amount!=0){
   this.auth.showLoader();
    
    this.httpService.getData('/api/v1/inventory/payment/all?purchaseId=' + data.purchase_id + '&instituteId=' + this.paymentModel.institute_id).subscribe((res: any) => {
      this.paymentHistoryData = res.result;
      if(this.paymentHistoryData.length==0){
        this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment history not available under this record")
   }
      else{
        $('#viewpayModal').modal('show');
      }
     
      this.auth.hideLoader();
    },
    err =>{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '',err.error.message);
       }   )
   
      }
  }
  viewNavigate(obj){
    //../purchase-view
    document.getElementById('action_btn').style.display="none"
    sessionStorage.setItem('viewData', obj);
this.router.navigate(['/view/inventory-management/purchase-view'])
  }
  viewdatas:any=[];
  cancelData(purchase_id){
    ///api/v1/inventory/purchase/cancelPurchase?purchaseId=3&instituteId=100058
   this.httpService.getData('/api/v1/inventory/purchase/cancelPurchase?purchaseId=' + purchase_id + '&instituteId=' + this.paymentModel.institute_id).subscribe((res: any) => {
    if (res.statusCode == 200) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '','Purchase cancelled & initiated refund');
       this.getAllPurchaseDetails();
      }
      else{
      
      }
    },
    err =>{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '',err.error.message);
       }   )
   

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
  
  searchDatabase() {
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
       this.totalRecords=this.staticPageData.length;
     }
   }
   downloadPdf() {
    ///api/v1/inventory/purchase/all?all=1 + '&&instituteId=' + this.institution_id
    this.httpService.getData('/api/v1/inventory/purchase/all?all=1&&instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        this.assignDataforDownload = res.result.response;
        for(let i=0;i<this.assignDataforDownload.length;i++){
          this.assignDataforDownload[i].id =i +1;
        }
        let arr = [];
   
        this.assignDataforDownload.map(
          (ele: any) => {
            let json = [
              ele.id,
             ele.reference_number,
              ele.supplier_company_name,
              ele.purchase_date,
             // ele.bill_image_url,
              ele.total_amount,
              ele.total_paid_amount,
              ele.balanced_amount,
             
       ]
            arr.push(json);
          })
    
        let rows = [];
        rows = [['#','Reference No.', ' Supplier', ' Date',
        'Grand Total ','Paid ','Balance']]
        let columns = arr;
        this._pdfService.exportToPdf(rows, columns, 'Asset_Assign_List');
        this.auth.hideLoader();
    },
      err => {
        this.auth.hideLoader();
      }
      
    );
   
  }
//download in excel format
headerSetting =[{
  primary_key: 'reference_number',
  value: "Reference No.",
  
},
{
  primary_key: 'supplier_company_name',
  value: "Supplier",
  
},
{
  primary_key: 'purchase_date',
  value: "Date",
  
},
// {
//   primary_key: 'bill_image_url',
//   value: "File",
  
// },
{
  primary_key: 'total_amount',
  value: "Grand Total",
  
},
{
  primary_key: 'total_paid_amount',
  value: "Paid",
  
},
{
  primary_key: 'balanced_amount',
  value: "Balance",
  
}]

exportToExcel(){
  this.httpService.getData('/api/v1/inventory/purchase/all?all=1&&instituteId=' + this.institution_id).subscribe(
    (res: any) => {
      this.auth.showLoader();
      this.assignDataforDownload= res.result.response;
      let Excelarr = [];
      this.assignDataforDownload.map(
      (ele: any) => {
        let json = {}
        this.headerSetting.map((keys) => {
          json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'asset_assign'
    );
      this.auth.hideLoader();
  },
    err => {
      this.auth.hideLoader();
    }
    
  );
  this.auth.hideLoader();
}
cancel(){
  
  this.paymentModel={
    purchase_id: 0,
    purchased_by_user_id: 0,
    paid_amount: '',
    payment_date: '',
    reference_no: '',
    payment_method: '',
    institute_id: sessionStorage.getItem('institute_id')
  } 
  this.addform.resetForm( this.paymentModel)
}
open(){
   (<HTMLInputElement>document.getElementById('action_btn')).style.display ='block'; 
}
}
