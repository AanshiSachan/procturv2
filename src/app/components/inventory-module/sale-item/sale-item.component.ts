import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
declare var $;

@Component({
  selector: 'app-sale-item',
  templateUrl: './sale-item.component.html',
  styleUrls: ['./sale-item.component.scss']
})
export class SaleItemComponent implements OnInit {
  rowColumns: any;
  searchParams: any;
  tempLocationList: any=[];
  assignDataforDownload=[];
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  sortingDir: string = "asc";
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
    this.institution_id = sessionStorage.getItem('institution_id')
  }

  ngOnInit(): void {
    this.getSaleDetails();
    
  }
  getSaleDetails() {
    this.auth.showLoader();
    //pageOffset=2&pageSize=10
    this.httpService.getData('/api/v1/inventory/sale/all?pageOffset='+this.pageIndex +'&pageSize='+ this.displayBatchSize+'&instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.saleAllData = res.result.response;
       // this.saleAllData =saleData;
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.totalElements;
         // for (let keys of saleData) {
        //   console.log(keys);
        //   console.log(keys)
        //   // console.log(this.purchaseAllData[keys]);
        //   for (let data of keys.sale_item_list) {
        //     let obj: any = {};
        //     obj.item_name = data.item_name;
        //     obj.item_name = data.item_name;
        //     obj.reference_number = keys.reference_number;
        //     obj.user_name = keys.user_name;
        //     obj.user_role = keys.user_role;
        //     obj.supplier_company_name = keys.supplier_company_name;
        //     obj.sale_date = keys.sale_date;
        //     obj.sale_type = data.sale_type;
        //     obj.total_paid_amount = keys.total_paid_amount;
        //     obj.total_amount = keys.total_amount;
        //     obj.balanced_amount = keys.balanced_amount;
        //     obj.bill_image_url = keys.bill_image_url;
        //     obj.sale_id =keys.sale_id;
        //     console.log(obj);
        //     this.saleAllData.push(obj)
        //   }
        //   console.log(saleData)
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
  sale_id;
  showAddPaymentModel(data){
    //document.getElementById('action_btn').style.display="none";
    this.sale_id=data.sale_id;
    $('#addpayModal').modal('show');
  }
  addPayment() {
   // document.getElementById('action_btn').style.display="none";
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
      let base = this.auth.baseUrl;
      //let base = "https://test999.proctur.com/StdMgmtWebAPI"
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
              let msg = 'Payment updated successfully';
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              $('#addpayModal').modal('hide');
              this.getSaleDetails();
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
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field ");

    }
  }
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
   let amount = Number(data.paid_amount);
   let balance=Number(data.balanced_amount)
    if (amount < 1) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment Amount is LESS than one")
    }
    if (amount <= amount) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Payment amount is greater than remaining amount")
    }
  }
  paymentHistoryData = [];
  getPaymentHistory(id) {
   // document.getElementById('action_btn').style.display="none";
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
  
   this.sale_id =obj.sale_id;
    $('#deletesModal').modal('show');
    document.getElementById('action_btn').style.display="none";
  }

  deleteRow() {
    //document.getElementById('action_btn').style.display="none";
///api/v1/inventory/sale/delete/5?instituteId=100058
    this.auth.showLoader();
    this.httpService.deleteData('/api/v1/inventory/sale/delete/' +   this.sale_id + '?instituteId=' + this.model.institution_id, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Sale Deleted Successfully');
        this.getSaleDetails();
        $('#deletesModal').modal('hide');
      },
      err => {
        this.msgService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
      }
    );

  }
  viewNavigate(obj){
    //../purchase-view
     sessionStorage.setItem('viewData', obj);
this.router.navigate(['/view/inventory-management/sale-view'])
  }
  viewdatas:any=[];


  cancelData(purchase_id){
    document.getElementById('action_btn').style.display="none";
    this.httpService.getData('/api/v1/inventory/sale/cancelSale?saleId='+ purchase_id +'&instituteId=' + this.institution_id).subscribe((res: any) => {
     if (res.statusCode == 200) {
         this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Sale cancelled successfully');
        this.getSaleDetails();
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
    this.getSaleDetails();
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
    this.httpService.getData('/api/v1/inventory/sale/all?all=1&&instituteId=' + this.institution_id).subscribe(
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
             ele.user_role,
              ele.user_name,
              ele.sale_date,
             // ele.bill_image_url,
              ele.total_amount,
              ele.total_paid_amount,
              ele.balanced_amount,
             
       ]
            arr.push(json);
          })
    
        let rows = [];
        rows = [['#','Reference No.', ' Role', ' User',
        'Date ','Grand Total','Paid ','Balance(To be Paid)']]
        // let columns = arr;
        console.log('122',arr)
        this._pdfService.exportToPdf(rows, arr, 'Inventory_sale_list');
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
  primary_key: 'user_role',
  value: "Role",
  
},
{
  primary_key: 'user_name',
  value: "User",
  
},
{
  primary_key: 'sale_date',
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
  value: "Balance  (To be Paid)",
  
}]

exportToExcel(){
  ///api/v1/inventory/sale/all?instituteId=' + this.institution_id
  this.httpService.getData('/api/v1/inventory/sale/all?all=1&&instituteId=' + this.institution_id).subscribe(
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
// sortTable(str) {
//   if (str == "reference_number") {
//     this.staticPageData.sort(function (a, b) {
//       var nameA = a[str].toUpperCase(); // ignore upper and lowercase
//       var nameB = b[str].toUpperCase(); // ignore upper and lowercase
//       if (nameA < nameB) {
//         return -1;
//       }
//       if (nameA > nameB) {
//         return 1;
//       }
//       // names must be equal
//       return 0;

//     })
//   }
//   else if (str == "total_amount" ||str == "total_paid_amount" ||str == "balanced_amount") {
//     this.staticPageData.sort(function (a, b) {
//       return a[str] - b[str];
//     })
//   }
//   else if (str == "sale_date") {
//     this.staticPageData.sort(function (a, b) {
//       return moment(a[str]).unix() - moment(b[str]).unix();
//     })
//   }
//   if (this.sortingDir == "asc") {
//     this.sortingDir = "dec";
//   } else {
//     this.sortingDir = "asc";
//     this.staticPageData = this.staticPageData.reverse();
//   }
//   this.fetchTableDataByPage(this.pageIndex);
// }
}
