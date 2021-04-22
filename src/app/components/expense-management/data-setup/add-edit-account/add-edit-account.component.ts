import { Component, OnInit, Output, Input, ElementRef, HostListener, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
declare var $;

@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.scss']
})
export class AddEditAccountComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: ''
  };

  accountDetails = {
    displayPayeeName: '',
    displayPayeerName: '',
    accountName: '',
    accountType: '2',
    accountDescription: '',
    accountNumber: '',
    IFSC_Code: '',
    valuType: ''

  }

  editAccountDetails: any;
  account: any[] = [];
  payeeAccount: any[] = [];
  payeerAccount: any[] = [];


  @Output() closePopup = new EventEmitter<boolean>();
  @Input() isEditAccount: boolean;
  @Input() editAccountId: any;

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    $('#addAccountModal').modal('show');
    this.getAccountTypes();
    if (this.isEditAccount) {
      this.setEditValues();
    }
    this.getPayeeAccount()
    this.getPayeerAccount()
  }

  getAccountTypes() {
    this.auth.showLoader();
    const url = `/api/v1/masterData/type/ACCOUNT_TYPE`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.account = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }



  getPayeeAccount() {
    this.auth.showLoader()
    const url = '/api/v1/payment/party/expense/all/' + this.jsonFlag.institute_id
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.payeeAccount = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getPayeerAccount() {
    this.auth.showLoader()
    const url = '/api/v1/payment/party/income/all/' + this.jsonFlag.institute_id
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.payeerAccount = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  setEditValues() {
    this.auth.showLoader();
    const url = `/api/v1/account/${this.editAccountId}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.editAccountDetails = res;
        this.setValue();
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  setValue() {
    this.accountDetails.accountName = this.editAccountDetails.display_name;
    this.accountDetails.accountType = this.editAccountDetails.type;
    this.accountDetails.accountDescription = this.editAccountDetails.notes;
    this.accountDetails.accountNumber = this.editAccountDetails.account_number;
    this.accountDetails.IFSC_Code = this.editAccountDetails.ifsc_code;
    this.accountDetails.displayPayeeName = this.editAccountDetails.party_id;
    // this.accountDetails.displayPayeerName = this.editAccountDetails.party_id;
     this.accountDetails.valuType = this.editAccountDetails.party_type;

  }

  saveAccountDetails() {


    if (this.validateAccountDetailsInput()) {
      let obj = {
        display_name: this.accountDetails.accountName,
        notes: this.accountDetails.accountDescription,
        institution_id: this.jsonFlag.institute_id,
        type: this.accountDetails.accountType,
        ifsc_code: this.accountDetails.IFSC_Code,
        account_number: this.accountDetails.accountNumber,
        party_id: this.accountDetails.displayPayeeName,
        //party_id: this.accountDetails.displayPayeerName,

        // party_type: this.accountDetails.valuType,
        account_id: ''
      };
      const url = `/api/v1/account`;
      if (this.isEditAccount) {
        obj.account_id = this.editAccountId;
        this.auth.showLoader();
        this.httpService.putData(url, obj).subscribe(
          (res: any) => {
            this.auth.hideLoader();
            console.log("post data",obj)
            if (res.statusCode == 200) {
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Account updated successfully');
              this.closePopups(false);
            }

          },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          }
        )
      }
      else {
        delete obj.account_id;
        this.auth.showLoader();
        this.httpService.postData(url, obj).subscribe(
          (res: any) => {
            this.auth.hideLoader();
            if (res.statusCode == 200) {
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Account created successfully');
              this.closePopups(false);
            }
          },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          }
        )
      }
    }
  }

  validateAccountDetailsInput() {
    if (this.accountDetails.accountName.trim() == '') {

      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Account Name!');
      return;
    }

    // if (this.accountDetails.accountNumber == '' && this.accountDetails.valuType == '0') {
    //   this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Account Number!');
    //   return
    // }

    // if (this.accountDetails.valuType == '0' && this.accountDetails.IFSC_Code == '' && this.accountDetails.accountType == '0') {

    //   this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify IFSC Code!');
    //   return

    // }

    // if (this.accountDetails.accountDescription.trim() == '') {

    //   this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Account Description!');
    //   return
    // }


    if (this.accountDetails.valuType != '0' && this.accountDetails.valuType != '1') {

      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Payee/Payer!');
      return
    }

    if (this.accountDetails.displayPayeeName == '') {

      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Payee/Payer!');
      return
    }

    return true;
  }
  closePopups($event) {
    $('#addAccountModal').modal('hide');
    this.closePopup.emit(false);
  }

}
