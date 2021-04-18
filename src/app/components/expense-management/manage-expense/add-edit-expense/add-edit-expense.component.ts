import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService } from '../../../../services/http.service';
// // import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { Console } from 'console';
declare var $;

@Component({
  selector: 'app-add-edit-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrls: ['./add-edit-expense.component.scss']
})
export class AddEditExpenseComponent implements OnInit, OnDestroy {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    toggle: false,
    isAuthoriseUser: false,
    created_by: ''
  };
  sectionName = '';
  editExpenseId: string;

  addedItemList: any[] = [];
  accountDetails = {
    itemName: -1,
    description: '',
    quantity: 1,
    amount: 0,
    remarks: '',
    accountNumber: '',
    ifscCode: ''
  };

  paymentDetails = {
    payeeName: '-1',
    accountName: '-1',
    paymentDate: moment(new Date()).format('YYYY-MM-DD'),
    paymentmode: '-1',
    accountNumber: '',
    IfscCode: '',
    dataKey: '',
    transacId: '',
    ChequeNumber: '',
    paymentValue:''

  }

  payeeList: any[] = [];
  accountNamelist: any[] = [];
  paymentModelist: any[] = [];
  docsList: any[] = [];
  docDescription: '';
  totalAmount: number = 0;
  fileName: any = null;
  fileUrl: any;
  editExpenseDetails: any;

  payeeVisibilty: boolean = false;
  accountVisibilty: boolean = false;
  categoryVisibility: boolean = false;
  categoryList: any[] = [];
  categoryName: any = '';
  accountNumber2: any
  addCategory = {
    Name: '',
    Description: ''
  }
  account_type_value:any='';

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private auth: AuthenticatorService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    this.getPayeeDetails();
    this.getAccountDetails();
    this.getPaymentMode();
    this.getCategoryDetails();
    let currentURL = window.location.href;
    if (currentURL.includes('add-expense')) {
      this.sectionName = 'Add';
      this.jsonFlag.isAuthoriseUser = true;
    }
    else {
      this.sectionName = 'Edit';
      let splitURL = currentURL.split("/");
      this.editExpenseId = splitURL[splitURL.length - 1];
      this.getEditExpenseDetails();
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('expense_category_type');
  }

  // changes done by Nalini - To fetch category details
  getCategoryDetails() {
    this.auth.showLoader();
    const url1 = `/api/v1/expense/category/all/${this.jsonFlag.institute_id}?expense_category_type=2&is_active=Y`
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getPayeeDetails() {
    this.auth.showLoader();
    const url1 = `/api/v1/payment/party/expense/all/${this.jsonFlag.institute_id}`
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.payeeList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getAccountDetails() {
    this.auth.showLoader();
    const url2 = `/api/v1/account/all/${this.jsonFlag.institute_id}`
    this.httpService.getData(url2).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.accountNamelist = res;
        console.log("AAAAAAAAA",this.accountNamelist)
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getPaymentMode() {
    this.auth.showLoader();
    const url3 = `/api/v1/masterData/type/PAYMENT_MODE`
    this.httpService.getData(url3).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.paymentModelist = res;
        console.log("sdffffff", this.paymentModelist)
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }


  checkpermissinForEditExpense() {
    let userType = sessionStorage.getItem('userType');
    let username = sessionStorage.getItem('username');
    if (sessionStorage.getItem('userType') == '0' && username == 'admin') {
      this.jsonFlag.isAuthoriseUser = true;
    } else if ((sessionStorage.getItem('userid') == this.jsonFlag.created_by)) {
      this.jsonFlag.isAuthoriseUser = true;
    }
  }


  getEditExpenseDetails() {
    this.auth.showLoader();
    const url = `/api/v1/expense/${this.jsonFlag.institute_id}/${this.editExpenseId}`
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.editExpenseDetails = res;
        this.jsonFlag.created_by = res.created_by;
        this.checkpermissinForEditExpense()
        this.paymentDetails.payeeName = this.editExpenseDetails.party_id;
        this.paymentDetails.accountName = this.editExpenseDetails.account_id;
        this.paymentDetails.paymentDate = this.editExpenseDetails.payment_date;
        this.paymentDetails.paymentmode = this.editExpenseDetails.payment_mode;

        this.totalAmount = this.editExpenseDetails.amount;

        for (let index = 0; index < this.editExpenseDetails.itemList.length; index++) {
          let obj = {
            itemName: this.editExpenseDetails.itemList[index].item_account,
            description: this.editExpenseDetails.itemList[index].item_desc,
            quantity: this.editExpenseDetails.itemList[index].item_quantity,
            amount: this.editExpenseDetails.itemList[index].item_amount,
            id: this.editExpenseDetails.itemList[index].item_id,
            category_id: this.editExpenseDetails.itemList[index].category_id,
            item_id: this.editExpenseDetails.itemList[index].item_id,
            remarks: this.editExpenseDetails.itemList[index].remarks,
            cheque_number: this.editExpenseDetails.itemList[index].cheque_number,
            transaction_id: this.editExpenseDetails.itemList[index].transaction_id,
            payment_mode: this.editExpenseDetails.itemList[index].payment_mode



          }
          this.addedItemList.push(obj)
        }

        if (!!this.editExpenseDetails.attachmentList) {
          for (let index = 0; index < this.editExpenseDetails.attachmentList.length; index++) {
            let obj = {
              fileName: this.editExpenseDetails.attachmentList[index].file_name,
              file_desc: this.editExpenseDetails.attachmentList[index].file_desc,
              file_id: this.editExpenseDetails.attachmentList[index].file_id,
              file: this.editExpenseDetails.attachmentList[index].file,
              file_path: this.editExpenseDetails.attachmentList[index].file_path,
              file_extn: this.editExpenseDetails.attachmentList[index].file_extn
            }
            this.docsList.push(obj)
          }
        }


      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', '', err);
      }
    )
  }

  checkPaymentModeVal() {
    if (this.paymentDetails.paymentmode == '0') {
      return true;
    } 
    else if (this.paymentDetails.paymentmode == '2') {
      return true;
    } 
    // else if (this.paymentDetails.paymentmode == '3' && this.paymentDetails.transacId.trim() != '') {
    //   return true;
    // } 
    // else if (this.paymentDetails.paymentmode == '1' && this.paymentDetails.ChequeNumber.trim() != '') {
    //   return true;
    // }
  }

  addItem() {
    if (this.accountDetails.itemName != -1) {
      if (this.accountDetails.amount != 0) {
        if (this.paymentDetails.accountName != '-1') {

        // if (this.paymentDetails.paymentmode != "-1") {

          // if (this.checkPaymentModeVal()) {

            let obj = {
              itemName: this.categoryName,
              description: this.accountDetails.description,
              quantity: this.accountDetails.quantity,
              amount: this.accountDetails.amount,
              item_id: 0,
              category_id: this.accountDetails.itemName,
              remarks: this.accountDetails.remarks,
              payment_mode: this.paymentDetails.paymentmode,
              transaction_id: this.paymentDetails.transacId,
              cheque_number: this.paymentDetails.ChequeNumber

            };
            this.totalAmount = this.totalAmount + Number(obj.amount)
            this.addedItemList.push(obj);
            this.accountDetails.itemName = -1;
            this.accountDetails.description = '';
            this.accountDetails.quantity = 1;
            this.accountDetails.amount = 0;
            this.accountDetails.remarks = '';
            this.paymentDetails.transacId = '';
            this.paymentDetails.ChequeNumber = '';
            this.paymentDetails.paymentmode = '-1'
          }

        //   else {
        //     let msg = (this.paymentDetails.paymentmode == '1') ? 'Enter Cheque Number' : 'Enter Transaction Id';
        //     this.msgService.showErrorMessage('error', '', msg);
        //   }
        // }


      //   else {
      //     this.msgService.showErrorMessage('error', '', 'Please select Payment Mode');
      //   }
      // }
      
      else {
        this.msgService.showErrorMessage('error', '', 'Please select Account Name');
      }
    }
      else {
        this.msgService.showErrorMessage('error', '', "Enter Item Amount");
      }
    }
    else {
      this.msgService.showErrorMessage('error', '', "Select Item Name");
    }

    console.log(this.addedItemList);
  }

  uploadHandler() {

    var fileTypes = ['jpg', 'jpeg', 'png', 'docs', 'pdf', 'doc', 'svg', 'txt'];  //acceptable file types
    const preview = (<HTMLInputElement>document.getElementById('uploadFileControl')).files[0];
    if (preview != null || preview != undefined) {
      let extension = preview.name.split('.').pop().toLowerCase(),  //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
      if (isSuccess) {
        var myReader: FileReader = new FileReader();
        let temp: any = {};
        myReader.readAsDataURL(preview);
        myReader.onloadend = () => {
          temp = {
            // "title": this.category_id,
            "fileName": preview.name,
            "file_desc": this.docDescription,
            "file": (<string>myReader.result).split(',')[1],
            "file_extn": extension,
            "file_id": 0
          }
          this.docsList.push(temp);
          this.docDescription = "";
          this.msgService.showErrorMessage('success', '', "File uploaded successfully");
          (<HTMLInputElement>document.getElementById('uploadFileControl')).value = null;
        }
      }
      else {
        this.msgService.showErrorMessage('error', '', "Please check file type.");
      }
    }
    else {
      this.msgService.showErrorMessage('error', '', "No file selected");
    }
  }

  addExpense() {
    if (this.paymentDetails.payeeName != '-1') {
      // if (this.paymentDetails.accountName != '-1') {
        // if (this.paymentDetails.paymentmode != "-1") {
          
        if (this.addedItemList.length > 0) {



          let itemlist = [];
          for (let index = 0; index < this.addedItemList.length; index++) {
            let item = {
              "category_id": this.addedItemList[index].category_id,
              "item_quantity": this.addedItemList[index].quantity,
              "item_amount": this.addedItemList[index].amount,
              "item_id": this.addedItemList[index].item_id,
              "remarks": this.addedItemList[index].remarks,
              "payment_mode": this.addedItemList[index].payment_mode,
              "transaction_id": this.addedItemList[index].transaction_id,
              "cheque_number": this.addedItemList[index].cheque_number
            }
            itemlist.push(item)
          }

          let attachList = [];
          for (let index = 0; index < this.docsList.length; index++) {
            let file = {
              file_id: this.docsList[index].file_id,
              file: this.docsList[index].file,
              file_extn: this.docsList[index].file_extn,
              file_desc: this.docsList[index].file_desc,
              file_name: this.docsList[index].fileName
            }
            attachList.push(file);
          }

          let obj = {
            party_id: this.paymentDetails.payeeName,
            account_id: this.paymentDetails.accountName,
            payment_date: moment(this.paymentDetails.paymentDate).format('YYYY-MM-DD'),
            paying_mode: this.paymentDetails.paymentmode,

            itemList: itemlist,
            attachmentList: attachList,
            amount: this.totalAmount,
            //data_key: this.paymentDetails.dataKey
          }
          console.log(obj);

          if (this.sectionName == 'Edit') {
            this.updateExpense(obj);
          }
          else {
            this.addNewExpense(obj);
          }


        }
        else {
          this.msgService.showErrorMessage('error', '', 'Please specify at least one item of expense!');
        }
      }
      // else {
      //   this.msgService.showErrorMessage('error', '', 'Please select Payment Mode');
      // }

      // else {
      //   this.msgService.showErrorMessage('error', '', 'Please select Account Name');
      // }
    // }
    else {
      this.msgService.showErrorMessage('error', '', 'Please select Payee Name');
    }
  }

  setDescription(obj) {
    if (this.categoryList && this.categoryList.length) {
      let categoryObj = this.categoryList.filter(category => {
        if ((category.category_id == this.accountDetails.itemName)) {
          this.categoryName = category.category_name;
          this.accountDetails.description = category.category_desc;
        }
      })
    }
  }

  setAccountIfscCode(obj) {
    if (this.accountNamelist && this.accountNamelist.length) {
      let accuntIfscObj = this.accountNamelist.filter(nameSet => {
        if ((nameSet.account_id == obj)) {
          console.log(nameSet);
          // this.account_type_value = nameSet.type_value;
          this.paymentDetails.paymentmode = nameSet.payment_mode;
          this.paymentDetails.paymentValue =nameSet.type_value
          this.paymentDetails.accountNumber = nameSet.account_number
          this.paymentDetails.IfscCode = nameSet.ifsc_code

          
          // if( this.addedItemList.length < 1 ){

          //   this.msgService.showErrorMessage('error', '', 'Please delete existing entries for changing account');

          // }
        }
      })


    }
  }
 



  addNewExpense(obj) {
    this.auth.showLoader();
    const url = `/api/v1/expense/${this.jsonFlag.institute_id}`
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', "Expense added successfully");
        this.router.navigate(['/view/expense/manage-expense']);
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }

  updateExpense(obj) {
    this.auth.showLoader();
    const url = `/api/v1/expense/${this.jsonFlag.institute_id}/${this.editExpenseId}`
    this.httpService.putData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', "Expense updated successfully");
        this.router.navigate(['/view/expense/manage-expense']);
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }

  removeItem(itemName) {
    if (this.jsonFlag.isAuthoriseUser) {

      for (let index = 0; index < this.addedItemList.length; index++) {
        if (this.addedItemList[index].itemName == itemName) {
          this.totalAmount = this.totalAmount - Number(this.addedItemList[index].amount);
          this.addedItemList.splice(index, 1);
          break;
        }
      }
    }
  }

  removeDoc(fileName) {
    for (let index = 0; index < this.docsList.length; index++) {
      if (this.docsList[index].fileName == fileName) {
        this.docsList.splice(index, 1);
        break;
      }
    }
  }

  downloadattachemnt(file_id, file_type, fileName) {
    this.auth.showLoader();
    const url = "/api/v1/expense/download/" + this.jsonFlag.institute_id + "/" + file_id;
    this.httpService.downloadItem(url, file_type).subscribe(
      (response: any) => {
        this.auth.hideLoader();
        if (response) {
          const blob = new Blob([response.document], { type: file_type });
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
          if (this.fileUrl != null) {
            this.fileName = fileName
            setTimeout(() => {
              var hiddenDownload = <HTMLAnchorElement>document.getElementById('downloadFileClick');
              hiddenDownload.href = this.fileUrl.changingThisBreaksApplicationSecurity;
              hiddenDownload.download = fileName;
              hiddenDownload.click();
            }, 500);
          }
        }
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  checkFututreDate() {
    let today = moment(new Date);
    let selectedDate = moment(this.paymentDetails.paymentDate)
    let diff = moment(selectedDate.diff(today))['_i'];
    if (diff > 0) {
      this.msgService.showErrorMessage('info', '', "Future date is not allowed");
      this.paymentDetails.paymentDate = moment(new Date).format('YYYY-MM-DD');
    }
  }
  changeAccount(obj){
    // this.accountNamelist= this.accountNamelist.find(e => e.type_value == obj)
let array = this.accountNamelist.filter(x =>x.type == this.accountNamelist)[0].type_value
    console.log("list",array)
  }

  togglePayee() {
    if (this.payeeVisibilty) {
      this.payeeVisibilty = false;
      this.getPayeeDetails();
    }
    else {
      this.payeeVisibilty = true;
    }
  }
  toggleAccount() {
    if (this.accountVisibilty) {
      this.accountVisibilty = false;
      this.getAccountDetails();
    }
    else {
      this.accountVisibilty = true;
    }
  }

  toggleCategory() {
    if (this.categoryVisibility) {
      this.categoryVisibility = false;
      this.getCategoryDetails();
    }
    else {
      sessionStorage.setItem('expense_category_type', '2');
      this.categoryVisibility = true;
    }
  }

}
