import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService  } from '../../../../services/http.service';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-add-edit-income',
  templateUrl: './add-edit-income.component.html',
  styleUrls: ['./add-edit-income.component.scss']
})
export class AddEditIncomeComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    toggle: false
  };

  sectionName = '';
  editIncomeId: string;

  addedItemList: any[] = [];
  accountDetails = {
    itemName: '',
    description: '',
    quantity: 1,
    amount: 0
  };

  paymentDetails = {
    payerName: '-1',
    accountName: '-1',
    receivedDate: moment(new Date()).format('YYYY-MM-DD'),
    paymentmode: '-1'
  }

  payerList: any[] = [];
  accountNamelist: any[] = [];
  paymentModelist: any[] = [];
  docsList: any[] = [];
  docDescription: '';
  totalAmount: number = 0;
  editIncomeDetails: any;

  payerVisibilty: boolean = false;
  accountVisibilty: boolean = false;

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth:AuthenticatorService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
   }

  ngOnInit() {
    this.getPayerList();
    this.getAccountDetails();
    this.getPaymentMode();
    let currentURL = window.location.href;
    if(currentURL.includes('add-income')){
      this.sectionName = 'Add';
    }
    else{
      this.sectionName = 'Edit';
      let splitURL = currentURL.split("/");
      this.editIncomeId = splitURL[splitURL.length - 1];
      this.getEditIncomeDetails();
    }
  }

  getPayerList(){
    this.auth.showLoader();
    const url1 = `/api/v1/payment/party/income/all/${this.jsonFlag.institute_id}`
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.payerList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getAccountDetails(){
    this.auth.showLoader();
    const url2 = `/api/v1/account/all/${this.jsonFlag.institute_id}`
    this.httpService.getData(url2).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.accountNamelist = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getPaymentMode(){
    this.auth.showLoader();
    const url3 = `/api/v1/masterData/type/PAYMENT_MODE`
    this.httpService.getData(url3).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.paymentModelist = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getEditIncomeDetails(){
    this.auth.showLoader();
    const url = `/api/v1/income/${this.jsonFlag.institute_id}/${this.editIncomeId}`
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.editIncomeDetails = res;
        this.paymentDetails.payerName = this.editIncomeDetails.party_id;
        this.paymentDetails.accountName = this.editIncomeDetails.account_id;
        this.paymentDetails.receivedDate = this.editIncomeDetails.payment_date;
        this.paymentDetails.paymentmode = this.editIncomeDetails.paying_mode;
        this.totalAmount = this.editIncomeDetails.amount;

        for (let index = 0; index < this.editIncomeDetails.itemList.length; index++) {
          let obj = {
            itemName: this.editIncomeDetails.itemList[index].item_account,
            description: this.editIncomeDetails.itemList[index].item_desc,
            quantity: this.editIncomeDetails.itemList[index].item_quantity,
            amount: this.editIncomeDetails.itemList[index].item_amount,
            id: this.editIncomeDetails.itemList[index].item_id
          }
          this.addedItemList.push(obj)
        }

        if(!!this.editIncomeDetails.attachmentList){
          for (let index = 0; index < this.editIncomeDetails.attachmentList.length; index++) {
            let obj = {
              fileName: this.editIncomeDetails.attachmentList[index].file_name+"."+this.editIncomeDetails.attachmentList[index].file_extn,
              file_desc: this.editIncomeDetails.attachmentList[index].file_desc,
              file_id: this.editIncomeDetails.attachmentList[index].file_id,
              file: this.editIncomeDetails.attachmentList[index].file,
              file_path: this.editIncomeDetails.attachmentList[index].file_path
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

  addItem(){
    if(this.accountDetails.itemName.trim().length > 0){
      if(this.accountDetails.amount != 0){
        let obj = {
          itemName: this.accountDetails.itemName,
          description: this.accountDetails.description,
          quantity: this.accountDetails.quantity,
          amount: this.accountDetails.amount,
          item_id: 0
        };
        this.totalAmount = this.totalAmount + Number(obj.amount)
        this.addedItemList.push(obj);
        this.accountDetails.itemName = '';
        this.accountDetails.description = '';
        this.accountDetails.quantity = 1;
        this.accountDetails.amount = 0;
      }
      else{
        this.msgService.showErrorMessage('error', '', "Enter Item Amount");
      }
    }
    else{
        this.msgService.showErrorMessage('error', '', "Enter Item Name");
    }

    console.log(this.addedItemList);
  }

  uploadHandler() {

      var fileTypes = ['jpg', 'jpeg', 'png', 'docs', 'pdf', 'doc', 'svg', 'txt'];  //acceptable file types
      const preview = (<HTMLInputElement>document.getElementById('uploadFileControl')).files[0];
      if (preview != null || preview != undefined) {
        let extension = preview.name.split('.').pop().toLowerCase(),  //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

        if(isSuccess){
          var myReader: FileReader = new FileReader();
          let temp: any = {};
          myReader.readAsDataURL(preview);
          myReader.onloadend = () => {
            temp = {
              // "title": this.category_id,
              "fileName": preview.name,
              "file_desc": this.docDescription,
              "encodedFile": (<string>myReader.result).split(',')[1],
              "file_extn": extension,
              "file_id": 0
            }
            this.docsList.push(temp);
            this.docDescription = "";
            this.msgService.showErrorMessage('success', '', "File uploaded successfully");
            (<HTMLInputElement>document.getElementById('uploadFileControl')).value = null;
          }
        }
        else{
          this.msgService.showErrorMessage('error', '', "Please check file type.");
        }
      }
      else {
        this.msgService.showErrorMessage('error', '', "No file selected");
      }
  }

  addIncome(){
    if(this.paymentDetails.payerName != '-1'){
      if (this.paymentDetails.accountName != '-1') {
        if(this.paymentDetails.paymentmode != "-1"){
          if(this.addedItemList.length > 0){
            let itemlist = [];
            for (let index = 0; index < this.addedItemList.length; index++) {
              let item = {
                 "item_account": this.addedItemList[index].itemName,
                 "item_desc": this.addedItemList[index].description,
                 "item_quantity": this.addedItemList[index].quantity,
                 "item_amount": this.addedItemList[index].amount,
                 "item_id": this.addedItemList[index].item_id
              }
              itemlist.push(item)
           }

           let attachList = [];
           for (let index = 0; index < this.docsList.length; index++) {
            let file = {
              file_id: this.docsList[index].file_id,
              file: this.docsList[index].encodedFile,
              file_extn: this.docsList[index].file_extn,
              file_desc: this.docsList[index].file_desc,
              file_name: this.docsList[index].fileName
            }
            attachList.push(file);
           }

            let obj = {
              party_id: this.paymentDetails.payerName,
              account_id: this.paymentDetails.accountName,
              payment_date: moment(this.paymentDetails.receivedDate).format('YYYY-MM-DD'),
              paying_mode: this.paymentDetails.paymentmode,
              itemList: itemlist,
              attachmentList: attachList,
              amount: this.totalAmount
            }
            console.log(obj);

            if(this.sectionName == 'Edit'){
              this.updateIncome(obj);
            }
            else{
              this.addNewIncome(obj);
            }
          }
          else{
            this.msgService.showErrorMessage('error', '', 'Please specify at least one item of income!');
          }
        }
        else{
          this.msgService.showErrorMessage('error', '', 'Please select Payment Mode');
        }
      }
      else{
        this.msgService.showErrorMessage('error', '', 'Please select Account Name');
      }
    }
    else{
      this.msgService.showErrorMessage('error', '', 'Please select Payer Name');
    }
  }

  addNewIncome(obj){
    this.auth.showLoader();
    const url = `/api/v1/income/${this.jsonFlag.institute_id}`
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', "Income added successfully");
        this.router.navigate(['/view/expense/manage-income']);
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }

  updateIncome(obj){
    this.auth.showLoader();
    const url = `/api/v1/income/${this.jsonFlag.institute_id}/${this.editIncomeId}`
    this.httpService.putData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', "Income updated successfully");
        this.router.navigate(['/view/expense/manage-income']);
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }

  removeItem(itemName){
    for (let index = 0; index < this.addedItemList.length; index++) {
      if(this.addedItemList[index].itemName == itemName){
        this.totalAmount = this.totalAmount - Number(this.addedItemList[index].amount);
        this.addedItemList.splice(index, 1);
        break;
      }
    }
  }

  removeDoc(fileName){
    for (let index = 0; index < this.docsList.length; index++) {
      if(this.docsList[index].fileName == fileName){
        this.docsList.splice(index, 1);
        break;
      }
    }
  }

  checkFututreDate(){
    let today = moment(new Date);
    let selectedDate = moment(this.paymentDetails.receivedDate)
    let diff = moment(selectedDate.diff(today))['_i'];
    if(diff > 0){
      this.msgService.showErrorMessage('info', '', "Future date is not allowed");
      this.paymentDetails.receivedDate = moment(new Date).format('YYYY-MM-DD');
    }
  }

  togglePayer(){
    if(this.payerVisibilty){
      this.payerVisibilty = false;
      this.getPayerList();
    }
    else{
      this.payerVisibilty = true;
    }
  }
  toggleAccount(){
    if(this.accountVisibilty){
      this.accountVisibilty = false;
      this.getAccountDetails();
    }
    else{
      this.accountVisibilty = true;
    }
  }
}
